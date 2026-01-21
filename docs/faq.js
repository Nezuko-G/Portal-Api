/**
 * @openapi
 * tags:
 *   - name: FAQ
 *     description: Frequently asked questions.
 * paths:
 *   /api/faq:
 *     get:
 *       tags: [FAQ]
 *       summary: List FAQs
 *       responses:
 *         '200':
 *           description: Array of FAQs
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FAQListResponse'
 *               example:
 *                 message: FAQs fetched
 *                 total: 2
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234f01
 *                     question: How to apply?
 *                     answer: Create an account then apply to jobs.
 *                   - _id: 65a1234bcf9e2a001234f02
 *                     question: Can I withdraw?
 *                     answer: Yes, while status is pending.
 *     post:
 *       tags: [FAQ]
 *       summary: Create FAQ
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FAQCreateRequest'
 *             example:
 *               question: How to apply?
 *               answer: Create an account then apply to jobs.
 *       responses:
 *         '201':
 *           description: FAQ created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FAQResponse'
 *               example:
 *                 message: FAQ created
 *                 data:
 *                   _id: 65a1234bcf9e2a001234f01
 *                   question: How to apply?
 *                   answer: Create an account then apply to jobs.
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *   /api/faq/{id}:
 *     get:
 *       tags: [FAQ]
 *       summary: Get FAQ by id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: FAQ details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FAQResponse'
 *               example:
 *                 message: FAQ fetched
 *                 data:
 *                   _id: 65a1234bcf9e2a001234f01
 *                   question: How to apply?
 *                   answer: Create an account then apply to jobs.
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     put:
 *       tags: [FAQ]
 *       summary: Update FAQ
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FAQUpdateRequest'
 *             example:
 *               answer: Updated answer text
 *       responses:
 *         '200':
 *           description: FAQ updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FAQResponse'
 *               example:
 *                 message: FAQ updated
 *                 data:
 *                   _id: 65a1234bcf9e2a001234f01
 *                   question: How to apply?
 *                   answer: Updated answer text
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     delete:
 *       tags: [FAQ]
 *       summary: Delete FAQ
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: FAQ deleted
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: FAQ deleted
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
