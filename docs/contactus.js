/**
 * @openapi
 * tags:
 *   - name: ContactUs
 *     description: Contact submissions.
 * paths:
 *   /api/contactus:
 *     get:
 *       tags: [ContactUs]
 *       summary: List contact submissions
 *       responses:
 *         '200':
 *           description: Array of submissions
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ContactUsListResponse'
 *               example:
 *                 message: Contact requests fetched
 *                 total: 1
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234c01
 *                     name: Jane Doe
 *                     email: jane@example.com
 *                     message: I need help with my account.
 *                     createdAt: 2024-01-01T00:00:00.000Z
 *     post:
 *       tags: [ContactUs]
 *       summary: Create contact submission
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactUsCreateRequest'
 *             example:
 *               name: Jane Doe
 *               email: jane@example.com
 *               message: I need help with my account.
 *       responses:
 *         '201':
 *           description: Submission stored
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ContactUsResponse'
 *               example:
 *                 message: Contact created
 *                 data:
 *                   _id: 65a1234bcf9e2a001234c01
 *                   name: Jane Doe
 *                   email: jane@example.com
 *                   message: I need help with my account.
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *   /api/contactus/{id}:
 *     get:
 *       tags: [ContactUs]
 *       summary: Get submission by id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Submission details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ContactUsResponse'
 *               example:
 *                 message: Contact fetched
 *                 data:
 *                   _id: 65a1234bcf9e2a001234c01
 *                   name: Jane Doe
 *                   email: jane@example.com
 *                   message: I need help with my account.
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
