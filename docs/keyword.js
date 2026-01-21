/**
 * @openapi
 * tags:
 *   - name: Keyword
 *     description: Keywords associated with jobs.
 * paths:
 *   /api/keyword:
 *     get:
 *       tags: [Keyword]
 *       summary: List keywords
 *       responses:
 *         '200':
 *           description: Array of keywords
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/KeywordListResponse'
 *               example:
 *                 message: Keywords fetched
 *                 total: 2
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234k01
 *                     word: Backend
 *                     slug: backend
 *                   - _id: 65a1234bcf9e2a001234k02
 *                     word: Frontend
 *                     slug: frontend
 *     post:
 *       tags: [Keyword]
 *       summary: Create keyword
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
 *                 ar: مطور خلفية
 *       responses:
 *         '201':
 *           description: Keyword created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/KeywordResponse'
 *               example:
 *                 message: Keyword created
 *                 data:
 *                   _id: 65a1234bcf9e2a001234k01
 *                   word:
 *                     en: Backend
 *                     ar: مطور خلفية
 *                   slug: backend
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *   /api/keyword/{id}:
 *     get:
 *       tags: [Keyword]
 *       summary: Get keyword by id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Keyword details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/KeywordResponse'
 *               example:
 *                 message: Keyword fetched
 *                 data:
 *                   _id: 65a1234bcf9e2a001234k01
 *                   word:
 *                     en: Backend
 *                     ar: مطور خلفية
 *                   slug: backend
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     put:
 *       tags: [Keyword]
 *       summary: Update keyword
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
 *               $ref: '#/components/schemas/KeywordUpdateRequest'
 *             example:
 *               word:
 *                 en: Platform
 *                 ar: منصات
 *       responses:
 *         '200':
 *           description: Keyword updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/KeywordResponse'
 *               example:
 *                 message: Keyword updated
 *                 data:
 *                   _id: 65a1234bcf9e2a001234k01
 *                   word:
 *                     en: Platform
 *                     ar: منصات
 *                   slug: platform
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     delete:
 *       tags: [Keyword]
 *       summary: Delete keyword
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
 *           description: Keyword deleted
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Keyword deleted
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
