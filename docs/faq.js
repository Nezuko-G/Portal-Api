/**
 * @swagger
 * tags:
 *   - name: FAQ
 *     description: Frequently asked questions management operations
 *
 * paths:
 *   /api/faq:
 *     get:
 *       tags: [FAQ]
 *       summary: List all FAQs
 *       description: Retrieve all frequently asked questions
 *       security: []
 *       responses:
 *         '200':
 *           description: FAQs retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FAQListResponse'
 *               example:
 *                 message: FAQs fetched successfully
 *                 total: 2
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234f01
 *                     question: How do I apply for a job?
 *                     answer: Create an account, upload your CV, and click apply on any job posting.
 *                     slug: how-to-apply
 *                   - _id: 65a1234bcf9e2a001234f02
 *                     question: Can I withdraw my application?
 *                     answer: Yes, you can withdraw your application while it's in pending status.
 *                     slug: withdraw-application
 *
 *     post:
 *       tags: [FAQ]
 *       summary: Create a new FAQ
 *       description: Create a new FAQ entry. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FAQCreateRequest'
 *             example:
 *               question: How do I apply for a job?
 *               answer: Create an account, upload your CV, and click apply on any job posting.
 *       responses:
 *         '201':
 *           description: FAQ created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FAQResponse'
 *               example:
 *                 message: FAQ created successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234f01
 *                   question: How do I apply for a job?
 *                   answer: Create an account, upload your CV, and click apply on any job posting.
 *                   slug: how-to-apply
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /api/faq/{id}:
 *     get:
 *       tags: [FAQ]
 *       summary: Get FAQ by ID
 *       description: Retrieve detailed information about a specific FAQ
 *       security: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: FAQ ID
 *       responses:
 *         '200':
 *           description: FAQ retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FAQResponse'
 *               example:
 *                 message: FAQ fetched successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234f01
 *                   question: How do I apply for a job?
 *                   answer: Create an account, upload your CV, and click apply on any job posting.
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     put:
 *       tags: [FAQ]
 *       summary: Update an existing FAQ
 *       description: Update FAQ information. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: FAQ ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FAQUpdateRequest'
 *             example:
 *               answer: Updated answer with more details about the application process.
 *       responses:
 *         '200':
 *           description: FAQ updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FAQResponse'
 *               example:
 *                 message: FAQ updated successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234f01
 *                   question: How do I apply for a job?
 *                   answer: Updated answer with more details about the application process.
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     delete:
 *       tags: [FAQ]
 *       summary: Delete an FAQ
 *       description: Soft delete an FAQ entry (marks as deleted). Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: FAQ ID
 *       responses:
 *         '200':
 *           description: FAQ deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: FAQ deleted successfully
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
