/**
 * @swagger
 * tags:
 *   - name: ContactUs
 *     description: Contact form submission operations
 *
 * paths:
 *   /api/contactus:
 *     get:
 *       tags: [ContactUs]
 *       summary: List all contact submissions
 *       description: Retrieve all contact form submissions. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Submissions retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ContactUsListResponse'
 *               example:
 *                 message: Contact requests fetched successfully
 *                 total: 2
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234c01
 *                     name: Jane Doe
 *                     email: jane@example.com
 *                     message: I need help with my account.
 *                     createdAt: 2026-01-20T00:00:00.000Z
 *                   - _id: 65a1234bcf9e2a001234c02
 *                     name: John Smith
 *                     email: john@example.com
 *                     message: Question about job application process.
 *                     createdAt: 2026-01-22T00:00:00.000Z
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *     post:
 *       tags: [ContactUs]
 *       summary: Submit a contact form
 *       description: Submit a new contact form message
 *       security: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactUsCreateRequest'
 *             example:
 *               name: Jane Doe
 *               email: jane@example.com
 *               message: I need help with my account and would like to reset my password.
 *       responses:
 *         '201':
 *           description: Submission created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ContactUsResponse'
 *               example:
 *                 message: Contact request created successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234c01
 *                   name: Jane Doe
 *                   email: jane@example.com
 *                   message: I need help with my account and would like to reset my password.
 *                   createdAt: 2026-01-26T00:00:00.000Z
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *
 *   /api/contactus/{id}:
 *     get:
 *       tags: [ContactUs]
 *       summary: Get contact submission by ID
 *       description: Retrieve detailed information about a specific contact submission. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Contact submission ID
 *       responses:
 *         '200':
 *           description: Submission retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ContactUsResponse'
 *               example:
 *                 message: Contact request fetched successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234c01
 *                   name: Jane Doe
 *                   email: jane@example.com
 *                   message: I need help with my account and would like to reset my password.
 *                   createdAt: 2026-01-26T00:00:00.000Z
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
