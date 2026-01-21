/**
 * @openapi
 * tags:
 *   - name: Category
 *     description: Job categories.
 * paths:
 *   /api/category:
 *     get:
 *       tags: [Category]
 *       summary: List categories
 *       responses:
 *         '200':
 *           description: Array of categories
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CategoryListResponse'
 *               example:
 *                 message: Categories fetched
 *                 total: 2
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234aaa
 *                     name: Engineering
 *                     slug: engineering
 *                   - _id: 65a1234bcf9e2a001234aab
 *                     name: Marketing
 *                     slug: marketing
 *     post:
 *       tags: [Category]
 *       summary: Create category
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryCreateRequest'
 *             example:
 *               name: Engineering
 *               slug: engineering
 *               description: Software and hardware roles
 *               keywords: [backend, frontend]
 *       responses:
 *         '201':
 *           description: Category created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *               example:
 *                 message: Category created
 *                 data:
 *                   _id: 65a1234bcf9e2a001234aaa
 *                   name: Engineering
 *                   slug: engineering
 *                   description: Software and hardware roles
 *                   keywords: [backend, frontend]
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *   /api/category/{id}:
 *     get:
 *       tags: [Category]
 *       summary: Get category by id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Category details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *               example:
 *                 message: Category fetched
 *                 data:
 *                   _id: 65a1234bcf9e2a001234aaa
 *                   name: Engineering
 *                   slug: engineering
 *                   description: Software and hardware roles
 *                   keywords: [backend, frontend]
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     patch:
 *       tags: [Category]
 *       summary: Update category
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
 *               $ref: '#/components/schemas/CategoryUpdateRequest'
 *             example:
 *               description: Updated description
 *       responses:
 *         '200':
 *           description: Category updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *               example:
 *                 message: Category updated
 *                 data:
 *                   _id: 65a1234bcf9e2a001234aaa
 *                   name: Engineering
 *                   slug: engineering
 *                   description: Updated description
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     delete:
 *       tags: [Category]
 *       summary: Delete category
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
 *           description: Category deleted
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Category deleted
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
