---
name: api-environment-config
description: Use this skill when configuring, accessing, adding, or managing environment variables, switching between development and production environments, or handling environment-specific secrets in Portal-Api.
---

# API Environment Configuration & Management Runbook

This skill outlines conventions, architecture, commands, and security practices for managing environment variables across **Development** and **Production** environments in **Portal-Api**.

---

## 1. Architecture & Loading Hierarchy

Environment variables are managed centrally through `src/config/env.ts` using `dotenv`.

### Priority and Loading Order:
1. **Target Environment File (`.env.${NODE_ENV}`)**:
   - In development: `.env.development` is loaded first.
   - In production: `.env.production` is loaded first.
2. **Base Fallback (`.env`)**:
   - Any variables present in `.env` fill in missing keys without overwriting already defined variables.
3. **System Environment Variables**:
   - Variables injected directly by the OS, Docker container, or cloud host (Render, AWS, Railway, Vercel) take the highest precedence.

```
       [ System Environment / Cloud Platform ] (Highest Priority)
                          │
                          ▼
            [ .env.development / .env.production ]
                          │
                          ▼
                  [ Base .env ] (Fallback)
```

### Module Initialization (`src/config/env.ts`)
In any entrypoint, background worker, or standalone script, import `env.js` as early as possible:

```typescript
// Standard ES Module import in entrypoint or config
import "./config/env.js";
```

Because ES Modules cache imported modules, `env.js` executes only once per process lifecycle.

---

## 2. Environment Files Reference

| File | Purpose | Committed to Git? | Description |
|:---|:---|:---:|:---|
| **`.env.development`** | Local Development | ❌ No | Local ports (`3000`), local MongoDB URI, test email credentials, and localhost OAuth callbacks. |
| **`.env.production`** | Production Deployment | ❌ No | Production port (`8080`), MongoDB Atlas cluster URI, strict 64-char random secrets, and live domain callbacks. |
| **`.env.example`** | Public Template | ✅ Yes | Safe blueprint and checklist documenting all required variables with placeholder values. |
| **`.env`** | Local Shared Fallback | ❌ No | Optional base file for shared local overrides. |

---

## 3. How to Run Different Environments

### Development Mode
Runs with hot-reload via `nodemon` and `tsx`. Automatically defaults `NODE_ENV` to `"development"` and loads `.env.development`.

```bash
npm run dev
```

### Production Build & Execution
Builds TypeScript to `dist/` and runs the compiled output:

```bash
# 1. Compile TypeScript to production JavaScript
npm run build

# 2. Start compiled server
npm run start:prod
```

### Explicitly Overriding `NODE_ENV`
To simulate or force a specific environment from the terminal:

- **PowerShell (Windows)**:
  ```powershell
  $env:NODE_ENV="production"; npm run dev
  ```
- **Bash / Linux / macOS**:
  ```bash
  NODE_ENV=production npm run dev
  ```

---

## 4. Key Environment Variables Directory

| Variable Name | Required? | Example (Dev) | Example (Prod) | Description |
|:---|:---:|:---|:---|:---|
| `NODE_ENV` | Yes | `development` | `production` | App mode. In production, triggers `secure: true` on cookies and disables verbose logs. |
| `PORT` | Yes | `3000` | `8080` | Port on which Express listens. |
| `MONGODB_URL` | Yes | `mongodb://localhost:27017/portal` | `mongodb+srv://...` | Connection URI for MongoDB database. |
| `SESSION_SECRET` | Yes | `dev_session_secret` | `64-char-random-string` | Used by `express-session` for cookie signing. |
| `JWT_SECRET` | Yes | `dev_jwt_secret` | `64-char-random-string` | Symmetric key used to sign and verify JWT tokens. |
| `JWT_COOKIE_EXPIRES_IN` | No | `3` | `3` | Cookie lifetime in days. |
| `JWT_EXPIRES_IN` | No | `7d` | `7d` | JWT payload expiration string. |
| `CLOUDINARY_*` | Yes | Dev credentials | Prod credentials | `CLOUD_NAME`, `API_KEY`, `API_SECRET` for file storage. |
| `EMAIL_*` | Yes | `smtp.gmail.com` | Prod SMTP service | SMTP credentials (`HOST`, `PORT`, `USERNAME`, `PASSWORD`, `FROM`). |
| `GITHUB_*` | Optional | `http://localhost:3000/...` | `https://api.domain.com/...` | OAuth client ID, secret, and callback URL. |
| `GOOGLE_*` | Optional | `http://localhost:3000/...` | `https://api.domain.com/...` | OAuth client ID, secret, and callback URL. |
| `SWAGGER_SERVER_URL` | No | `http://localhost:3000` | `https://api.domain.com` | Host URL displayed in Swagger UI documentation. |

---

## 5. Workflow: Adding a New Environment Variable

When introducing a new feature that requires configuration (e.g. Redis, Payment Gateway, 3rd party API):

### Step 1: Update `.env.example`
Add the key with documentation and a placeholder value:
```env
# Stripe Payment Gateway
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

### Step 2: Update `.env.development`
Add the sandbox/testing key:
```env
STRIPE_SECRET_KEY=sk_test_51Mz...
STRIPE_WEBHOOK_SECRET=whsec_test...
```

### Step 3: Update `.env.production`
Add production placeholder instructions:
```env
STRIPE_SECRET_KEY=replace_with_live_stripe_secret_key
STRIPE_WEBHOOK_SECRET=replace_with_live_stripe_webhook_secret
```

### Step 4: Safely Access in TypeScript Code
Always validate or provide fallback defaults:
```typescript
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  throw new Error("STRIPE_SECRET_KEY is missing from environment variables");
}
```

---

## 6. Security & Git Hygiene Rules

1. **Never Commit Secrets**: `.gitignore` is configured with `.env*` and `!.env.example`. Double check with `git status` before committing.
2. **Production Cookie Security**: When `NODE_ENV === "production"`, auth cookies automatically enforce `secure: true` and `sameSite: "none"` or `"lax"`. Note that HTTP testing locally with `NODE_ENV=production` will cause browsers to reject non-HTTPS cookies.
3. **Database URI Sanitization**: Never hardcode database credentials in source code. Always verify `MONGODB_URL` presence inside `src/config/dbConnect.ts`.
