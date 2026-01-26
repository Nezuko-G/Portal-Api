/**
 * @swagger
 * tags:
 *   - name: Keyword
 *     description: Keyword management operations for job tagging
 *
 * paths:
 *   /api/keyword:
 *     get:
 *       tags: [Keyword]
 *       summary: List all keywords
 *       description: Retrieve all available keywords with bilingual support
 *       security: []
 *       responses:
 *         '200':
 *           description: Keywords retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/KeywordListResponse'
 *               example:
 *                 message: Keywords fetched successfully
 *                 total: 3
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234k01
 *                     word:
 *                       en: Backend
 *                       ar: تطوير خلفي
 *                     slug: backend
 *                   - _id: 65a1234bcf9e2a001234k02
 *                     word:
 *                       en: Frontend
 *                       ar: تطوير أمامي
 *                     slug: frontend
 *                   - _id: 65a1234bcf9e2a001234k03
 *                     word:
 *                       en: DevOps
 *                       ar: إدارة التشغيل
 *                     slug: devops
 *
 *     post:
 *       tags: [Keyword]
 *       summary: Create a new keyword
 *       description: Create a new keyword with bilingual names. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordCreateRequest'
 *             example:
 *               word:
 *                 en: Backend
 *                 ar: تطوير خلفي
 *       responses:
 *         '201':
 *           description: Keyword created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/KeywordResponse'
 *               example:
 *                 message: Keyword created successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234k01
 *                   word:
 *                     en: Backend
 *                     ar: تطوير خلفي
 *                   slug: backend
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /api/keyword/{id}:
 *     get:
 *       tags: [Keyword]
 *       summary: Get keyword by ID
 *       description: Retrieve detailed information about a specific keyword
 *       security: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Keyword ID
 *       responses:
 *         '200':
 *           description: Keyword retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/KeywordResponse'
 *               example:
 *                 message: Keyword fetched successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234k01
 *                   word:
 *                     en: Backend
 *                     ar: تطوير خلفي
 *                   slug: backend
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     put:
 *       tags: [Keyword]
 *       summary: Update an existing keyword
 *       description: Update keyword information. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Keyword ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordUpdateRequest'
 *             example:
 *               word:
 *                 en: Full Stack
 *                 ar: تطوير متكامل
 *       responses:
 *         '200':
 *           description: Keyword updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/KeywordResponse'
 *               example:
 *                 message: Keyword updated successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234k01
 *                   word:
 *                     en: Full Stack
 *                     ar: تطوير متكامل
 *                   slug: full-stack
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
 *       tags: [Keyword]
 *       summary: Delete a keyword
 *       description: Soft delete a keyword (marks as deleted). Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Keyword ID
 *       responses:
 *         '200':
 *           description: Keyword deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Keyword deleted successfully
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
