/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Authenticated user profile and file upload operations
 *
 * paths:
 *   /api/user/me:
 *     get:
 *       tags: [User]
 *       summary: Get current user profile
 *       description: Retrieve the authenticated user's profile information
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Profile retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserProfileResponse'
 *               example:
 *                 message: Profile fetched successfully
 *                 user:
 *                   _id: 65a1234bcf9e2a001234abcd
 *                   name: Jane Doe
 *                   email: jane@example.com
 *                   phone: "01012345678"
 *                   role: user
 *                   avatar: https://res.cloudinary.com/demo/avatar.png
 *                   cv: https://res.cloudinary.com/demo/cv.pdf
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /api/user/avatar:
 *     patch:
 *       tags: [User]
 *       summary: Upload or update avatar image
 *       description: Upload a new avatar image for the authenticated user. Accepts PNG, JPG, JPEG formats.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               required: [image]
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: Image file (PNG, JPG, JPEG)
 *       responses:
 *         '200':
 *           description: Avatar updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserAvatarResponse'
 *               example:
 *                 message: Avatar updated successfully
 *                 avatar: https://res.cloudinary.com/demo/avatar.png
 *         '400':
 *           description: Invalid file format or missing file
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /api/user/cv:
 *     patch:
 *       tags: [User]
 *       summary: Upload or update CV/resume
 *       description: Upload or replace the CV file for the authenticated user. Accepts PDF format only.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               required: [cv]
 *               properties:
 *                 cv:
 *                   type: string
 *                   format: binary
 *                   description: CV file in PDF format
 *       responses:
 *         '200':
 *           description: CV uploaded successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserCvResponse'
 *               example:
 *                 message: CV uploaded successfully
 *                 cv: https://res.cloudinary.com/demo/cv_65a1234bcf9e2a001234abcd.pdf
 *                 public_id: cvs/cv_65a1234bcf9e2a001234abcd
 *         '400':
 *           description: Invalid file format or missing file
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 */
