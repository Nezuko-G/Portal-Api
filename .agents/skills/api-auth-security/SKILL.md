---
name: api-auth-security
description: Use this skill when dealing with authentication (JWT, cookies, OAuth), authorization (RBAC), password hashing, rate limiting, file upload security, or ObjectId sanitization in Portal-Api.
---

# API Authentication & Security Runbook

This skill outlines security guidelines, authentication mechanisms, authorization rules, and defensive practices across **Portal-Api**.

---

## 1. Authentication & Session Management

Portal-Api implements a dual authentication architecture:
- **Local Credentials**: Handled via email and password with JWT issued in signed HTTP cookies.
- **OAuth 2.0 Providers**: Google and GitHub OAuth via Passport strategies (`src/config/passport.config.ts`).
- **Session Security**: Express session with `rolling: true`, `httpOnly: true`, and custom session identifier `repodoctor.sid` to obscure underlying stack.

### Route Protection with `authenticateToken`
To protect an endpoint requiring a logged-in user, apply `authenticateToken`:

```typescript
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";

// Applied to route
router.get("/me", authenticateToken, getCurrentUserController);
```

When authenticated, the current user identity is populated in `(req as any).user` with payload `{ id, email, role, ... }`.

### Password Hashing
Always use `src/services/password.service.ts` for credential hashing:

```typescript
import { hashPassword, comparePassword } from "../../services/password.service.js";

// Hashing before saving
const hashedPassword = await hashPassword(plainTextPassword);

// Comparing on login
const isMatch = await comparePassword(candidatePassword, user.password);
if (!isMatch) {
  throw new UnauthorizedError((res as any)._t("auth.invalid_credentials"));
}
```

### JWT Management & Cookies
Tokens are generated using `src/services/jwt.service.ts` and set as secure cookies using `setCookieToken` in `src/utils/helpers.ts`:

```typescript
import { generateAccessToken, generateRefreshToken } from "../../services/jwt.service.js";
import { setCookieToken } from "../../utils/helpers.js";

const token = generateAccessToken({ id: user._id, role: user.role });
setCookieToken(res, token, req);
```

---

## 2. Role-Based Access Control (RBAC)

Use `checkRoles` middleware (`src/middlewares/check_roles.middleware.ts`) following `authenticateToken`:

```typescript
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import { checkRoles } from "../../middlewares/check_roles.middleware.js";

// Accessible only by ADMIN
router.post(
  "/job",
  authenticateToken,
  checkRoles(["ADMIN"]),
  validate(createJobSchema),
  createJobController
);

// Accessible by multiple roles
router.get(
  "/applications",
  authenticateToken,
  checkRoles(["ADMIN", "CLIENT"]),
  listApplicationsController
);
```

Supported system roles:
- `ADMIN`: Full administrative privileges across all entities.
- `CLIENT`: Organization or hiring client managing job postings and applicant pipelines.
- `CANDIDATE`: Job seeker submitting applications, managing personal profile, and uploading resumes.

---

## 3. Input Sanitization & ObjectId Validation

> [!WARNING]
> Directly passing unvalidated request parameters (e.g., `req.params.id`) into Mongoose queries can trigger CastErrors or expose the service to NoSQL query tampering.

Always validate MongoDB ObjectIds using `validateObjectId`:

```typescript
import { validateObjectId } from "../../utils/validateObjectId.js";
import { BadRequestError } from "../../utils/error.js";

export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      throw new BadRequestError("Invalid entity ID provided");
    }

    const item = await Category.findById(id);
    if (!item || item.is_deleted) {
      throw new NotFoundError("Resource not found");
    }

    res.status(200).json({ status: "success", data: item });
  } catch (error) {
    next(error);
  }
};
```

---

## 4. Secure File Upload Pipeline (Cloudinary Direct Stream)

To preserve container statelessness and prevent local disk exhaustion, file uploads (avatars, CVs) use **Multer memory storage** coupled with buffer streaming via `streamifier` to Cloudinary.

### Upload Middleware Configuration
`src/middlewares/upload.middleware.ts` handles multi-part payloads into memory:
- Size limits: 5MB maximum.
- Allowed MIME types: PDF, DOC, DOCX, PNG, JPG, JPEG.

```typescript
import upload from "../../middlewares/upload.middleware.js";

// Single file upload on field "file"
router.post("/cv", authenticateToken, upload.single("file"), uploadCvController);
```

### Buffer Streaming Pattern in Controllers
Never write uploaded files to disk (`fs.writeFile`). Pipe memory buffers directly:

```typescript
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadCvController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "portal/cvs", resource_type: "raw" },
      async (error, result) => {
        if (error || !result) {
          return next(error || new Error("Cloudinary upload failed"));
        }

        // Save result.secure_url to user document
        await User.findByIdAndUpdate(req.user.id, { cv_url: result.secure_url });

        res.status(200).json({
          message: "CV uploaded successfully",
          url: result.secure_url,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    next(error);
  }
};
```

---

## 5. Rate Limiting Protection

Rate limiters protect authentication and sensitive endpoints from brute-force attacks:
- `authLimiter`: Applied to `/api/auth/login`, `/api/auth/signup`, `/api/auth/forgot-password`.
- Global limiter: Applied at the Express app boundary for overall DDOS mitigation.
