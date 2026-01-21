/**
 * @openapi
 * tags:
 *   - name: User
 *     description: Authenticated user profile and uploads.
 * paths:
 *   /api/user/avatar:
 *     patch:
 *       tags: [User]
 *       summary: Update avatar image
 *       description: Uploads a new avatar image for the authenticated user. Expects multipart/form-data with field `image`.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *             example:
 *               image: (binary image/png)
 *       responses:
 *         '200':
 *           description: Avatar updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserAvatarResponse'
 *               example:
 *                 message: Avatar updated
 *                 avatar: https://res.cloudinary.com/demo/avatar.png
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *   /api/user/cv:
 *     patch:
 *       tags: [User]
 *       summary: Upload CV
 *       description: Uploads or replaces the CV file for the authenticated user. Expects multipart/form-data with field `cv`.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 cv:
 *                   type: string
 *                   format: binary
 *             example:
 *               cv: (binary application/pdf)
 *       responses:
 *         '200':
 *           description: CV uploaded
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserCvResponse'
 *               example:
 *                 message: CV uploaded
 *                 cv: https://res.cloudinary.com/demo/cv_65a1234bcf9e2a001234abcd.pdf
 *                 public_id: cvs/cv_65a1234bcf9e2a001234abcd
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *   /api/user/me:
 *     get:
 *       tags: [User]
 *       summary: Get my profile
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Current user profile
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserProfileResponse'
 *               example:
 *                 message: Profile fetched
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
 */
