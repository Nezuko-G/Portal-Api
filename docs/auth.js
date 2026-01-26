/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication, authorization, and password recovery operations
 *
 * paths:
 *   /api/auth/signup:
 *     post:
 *       tags: [Auth]
 *       summary: Register a new user account
 *       description: Creates a new user account with local authentication. Returns a JWT token in both response body and httpOnly cookie.
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
 *               password: SecureP@ss123
 *       responses:
 *         '201':
 *           description: User account created successfully
 *           headers:
 *             Set-Cookie:
 *               schema:
 *                 type: string
 *               description: JWT token as httpOnly cookie
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthSuccessResponse'
 *               example:
 *                 message: User registered successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234abcd
 *                   name: Jane Doe
 *                   email: jane@example.com
 *                   phone: "01012345678"
 *                   role: user
 *                   provider: local
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *
 *   /api/auth/login:
 *     post:
 *       tags: [Auth]
 *       summary: Authenticate with email and password
 *       description: Authenticates user credentials and returns a JWT token in both response body and httpOnly cookie.
 *       security: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginRequest'
 *             example:
 *               email: jane@example.com
 *               password: SecureP@ss123
 *       responses:
 *         '200':
 *           description: Login successful
 *           headers:
 *             Set-Cookie:
 *               schema:
 *                 type: string
 *               description: JWT token as httpOnly cookie
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
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /api/auth/logout:
 *     get:
 *       tags: [Auth]
 *       summary: Log out current user
 *       description: Clears the JWT cookie and invalidates the current session.
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
 *
 *   /api/auth/refresh-token:
 *     post:
 *       tags: [Auth]
 *       summary: Refresh JWT access token
 *       description: Issues a new JWT token using the existing cookie token. Returns the new token in both response body and cookie.
 *       security: []
 *       responses:
 *         '200':
 *           description: Token refreshed successfully
 *           headers:
 *             Set-Cookie:
 *               schema:
 *                 type: string
 *               description: New JWT token as httpOnly cookie
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
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /api/auth/forgot-password:
 *     post:
 *       tags: [Auth]
 *       summary: Request password reset code
 *       description: Sends a 6-digit verification code to the user's email address for password reset.
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
 *           description: Reset code sent successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthMessageResponse'
 *               example:
 *                 status: success
 *                 message: Reset code sent to your email
 *         '404':
 *           description: No user found with provided email
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthMessageResponse'
 *               example:
 *                 status: error
 *                 message: User not found
 *
 *   /api/auth/verify-reset-code:
 *     post:
 *       tags: [Auth]
 *       summary: Verify password reset code
 *       description: Validates the 6-digit reset code before allowing password reset.
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
 *           description: Code verified successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthMessageResponse'
 *               example:
 *                 status: success
 *                 message: Code verified successfully
 *         '400':
 *           description: Invalid or expired code
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthMessageResponse'
 *               example:
 *                 status: error
 *                 message: Invalid or expired code
 *         '404':
 *           description: No user found with provided email
 *
 *   /api/auth/reset-password:
 *     post:
 *       tags: [Auth]
 *       summary: Reset user password
 *       description: Resets the user's password after verifying the reset code. Clears reset code state after successful reset.
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
 *               password: NewSecureP@ss123
 *               confirmPassword: NewSecureP@ss123
 *       responses:
 *         '200':
 *           description: Password reset successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthMessageResponse'
 *               example:
 *                 status: success
 *                 message: Password reset successful
 *         '400':
 *           description: Invalid code or passwords do not match
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthMessageResponse'
 *               example:
 *                 status: error
 *                 message: Invalid code or passwords do not match
 *         '404':
 *           description: No user found with provided email
 *
 *   /api/auth/github:
 *     get:
 *       tags: [Auth]
 *       summary: Initiate GitHub OAuth flow
 *       description: Redirects the user to GitHub for OAuth authorization.
 *       security: []
 *       responses:
 *         '302':
 *           description: Redirect to GitHub OAuth authorization page
 *           headers:
 *             Location:
 *               schema:
 *                 type: string
 *               example: https://github.com/login/oauth/authorize?client_id=...
 *
 *   /api/auth/github/callback:
 *     get:
 *       tags: [Auth]
 *       summary: GitHub OAuth callback
 *       description: Handles the OAuth callback from GitHub. Creates or authenticates user, sets authentication cookies, and redirects to frontend.
 *       security: []
 *       parameters:
 *         - in: query
 *           name: code
 *           required: true
 *           schema:
 *             type: string
 *           description: OAuth authorization code from GitHub
 *         - in: query
 *           name: state
 *           schema:
 *             type: string
 *           description: CSRF protection state parameter
 *       responses:
 *         '302':
 *           description: Redirect to frontend application after successful authentication
 *           headers:
 *             Location:
 *               schema:
 *                 type: string
 *               example: http://localhost:5173/
 *             Set-Cookie:
 *               schema:
 *                 type: string
 *               description: Authentication tokens as httpOnly cookies
 *
 *   /api/auth/github/revoke:
 *     post:
 *       tags: [Auth]
 *       summary: Revoke GitHub OAuth authorization
 *       description: Revokes the stored GitHub access token and clears related cookies.
 *       security: []
 *       responses:
 *         '200':
 *           description: GitHub authorization revoked successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: GitHub authorization revoked and cookies cleared
 *
 *   /api/auth/google:
 *     get:
 *       tags: [Auth]
 *       summary: Initiate Google OAuth flow
 *       description: Redirects the user to Google for OAuth authorization.
 *       security: []
 *       responses:
 *         '302':
 *           description: Redirect to Google OAuth authorization page
 *           headers:
 *             Location:
 *               schema:
 *                 type: string
 *               example: https://accounts.google.com/o/oauth2/v2/auth?client_id=...
 *
 *   /api/auth/google/callback:
 *     get:
 *       tags: [Auth]
 *       summary: Google OAuth callback
 *       description: Handles the OAuth callback from Google. Creates or authenticates user, sets authentication cookies, and redirects to frontend.
 *       security: []
 *       parameters:
 *         - in: query
 *           name: code
 *           required: true
 *           schema:
 *             type: string
 *           description: OAuth authorization code from Google
 *       responses:
 *         '302':
 *           description: Redirect to frontend application after successful authentication
 *           headers:
 *             Location:
 *               schema:
 *                 type: string
 *               example: http://localhost:5173/
 *             Set-Cookie:
 *               schema:
 *                 type: string
 *               description: Authentication tokens as httpOnly cookies
 */
