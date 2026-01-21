/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: User authentication, session, and password recovery flows.
 * paths:
 *   /api/auth/signup:
 *     post:
 *       tags: [Auth]
 *       summary: Register a new user
 *       description: Creates a user, stores an http-only JWT cookie `jwt`, and returns the user profile.
 *       security: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSignUpRequest'
 *             example:
 *               name: Jane Doe
 *               email: jane@example.com
 *               phone: "01012345678"
 *               password: P@ssw0rd!
 *               role: user
 *       responses:
 *         '201':
 *           description: User created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthSuccessResponse'
 *               example:
 *                 message: User registered
 *                 data:
 *                   _id: 65a1234bcf9e2a001234abcd
 *                   name: Jane Doe
 *                   email: jane@example.com
 *                   phone: "01012345678"
 *                   role: user
 *                   provider: local
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *         '400':
 *           description: Validation error or user already exists
 *   /api/auth/login:
 *     post:
 *       tags: [Auth]
 *       summary: Log in with email and password
 *       description: Issues an http-only JWT cookie `jwt` plus the token in the response body.
 *       security: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginRequest'
 *             example:
 *               email: jane@example.com
 *               password: P@ssw0rd!
 *       responses:
 *         '200':
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthLoginResponse'
 *               example:
 *                 message: Login successful
 *                 data:
 *                   _id: 65a1234bcf9e2a001234abcd
 *                   name: Jane Doe
 *                   email: jane@example.com
 *                   phone: "01012345678"
 *                   role: user
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *   /api/auth/logout:
 *     get:
 *       tags: [Auth]
 *       summary: Log out
 *       description: Overwrites the `jwt` cookie to log the user out.
 *       security: []
 *       responses:
 *         '200':
 *           description: Logout successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthLogoutResponse'
 *               example:
 *                 status: success
 *                 message: Logged out successfully
 *   /api/auth/refresh-token:
 *     post:
 *       tags: [Auth]
 *       summary: Refresh JWT token
 *       description: Reads the existing `jwt` cookie, reissues a new one, and returns it in the body.
 *       security: []
 *       responses:
 *         '200':
 *           description: Token refreshed
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: success
 *                   message:
 *                     type: string
 *                     example: Token refreshed
 *                   token:
 *                     type: string
 *               example:
 *                 status: success
 *                 message: Token refreshed
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *   /api/auth/forgot-password:
 *     post:
 *       tags: [Auth]
 *       summary: Request password reset code
 *       description: Sends a 6-digit reset code to the user's email if the account exists and is active.
 *       security: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthForgotPasswordRequest'
 *             example:
 *               email: jane@example.com
 *       responses:
 *         '200':
 *           description: Reset code dispatched
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthMessageResponse'
 *               example:
 *                 status: success
 *                 message: Reset code sent
 *         '404':
 *           description: No user found for the provided email
 *   /api/auth/verify-reset-code:
 *     post:
 *       tags: [Auth]
 *       summary: Verify password reset code
 *       description: Confirms the reset code sent to the user before allowing password reset.
 *       security: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthVerifyResetCodeRequest'
 *             example:
 *               email: jane@example.com
 *               code: "123456"
 *       responses:
 *         '200':
 *           description: Code verified
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthMessageResponse'
 *               example:
 *                 status: success
 *                 message: Code verified
 *         '400':
 *           description: Invalid or expired code
 *         '404':
 *           description: No user found for the provided email
 *   /api/auth/reset-password:
 *     post:
 *       tags: [Auth]
 *       summary: Reset password using verification code
 *       description: Validates the code, updates the password, and clears reset state.
 *       security: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResetPasswordRequest'
 *             example:
 *               email: jane@example.com
 *               code: "123456"
 *               password: NewP@ssw0rd!
 *               confirmPassword: NewP@ssw0rd!
 *       responses:
 *         '200':
 *           description: Password reset
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthMessageResponse'
 *               example:
 *                 status: success
 *                 message: Password reset successful
 *         '400':
 *           description: Invalid code or password
 *         '404':
 *           description: No user found for the provided email
 *   /api/auth/github:
 *     get:
 *       tags: [Auth]
 *       summary: Start GitHub OAuth
 *       description: Redirects the user agent to GitHub for OAuth authorization.
 *       security: []
 *       responses:
 *         '302':
 *           description: Redirect to GitHub OAuth
 *           headers:
 *             Location:
 *               schema:
 *                 type: string
 *               example: https://github.com/login/oauth/authorize?client_id=...
 *   /api/auth/github/callback:
 *     get:
 *       tags: [Auth]
 *       summary: GitHub OAuth callback
 *       description: Handles GitHub OAuth response, sets refreshToken/githubAccessToken cookies, and redirects to the frontend.
 *       security: []
 *       responses:
 *         '302':
 *           description: Redirect to frontend after GitHub login
 *           headers:
 *             Location:
 *               schema:
 *                 type: string
 *               example: http://localhost:5173/
 *   /api/auth/github/revoke:
 *     post:
 *       tags: [Auth]
 *       summary: Revoke GitHub authorization
 *       description: Revokes stored GitHub access token and clears cookies.
 *       security: []
 *       responses:
 *         '200':
 *           description: GitHub authorization revoked
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: GitHub authorization revoked and cookies cleared
 *   /api/auth/google:
 *     get:
 *       tags: [Auth]
 *       summary: Start Google OAuth
 *       description: Redirects the user agent to Google for OAuth authorization.
 *       security: []
 *       responses:
 *         '302':
 *           description: Redirect to Google OAuth
 *           headers:
 *             Location:
 *               schema:
 *                 type: string
 *               example: https://accounts.google.com/o/oauth2/v2/auth?client_id=...
 *   /api/auth/google/callback:
 *     get:
 *       tags: [Auth]
 *       summary: Google OAuth callback
 *       description: Handles Google OAuth response, sets refreshToken cookie, and redirects to the frontend.
 *       security: []
 *       responses:
 *         '302':
 *           description: Redirect to frontend after Google login
 *           headers:
 *             Location:
 *               schema:
 *                 type: string
 *               example: http://localhost:5173/
 */
