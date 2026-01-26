/**
 * @swagger
 * tags:
 *   - name: Category
 *     description: Job category management operations
 *
 * paths:
 *   /api/category:
 *     get:
 *       tags: [Category]
 *       summary: List all job categories
 *       description: Retrieve all available job categories
 *       security: []
 *       responses:
 *         '200':
 *           description: Categories retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CategoryListResponse'
 *               example:
 *                 message: Categories fetched successfully
 *                 total: 2
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234aaa
 *                     name: Engineering
 *                     slug: engineering
 *                     description: Software and hardware engineering roles
 *                     keywords: [backend, frontend, devops]
 *                   - _id: 65a1234bcf9e2a001234aab
 *                     name: Marketing
 *                     slug: marketing
 *                     description: Marketing and advertising positions
 *                     keywords: [digital, content, social media]
 *
 *     post:
 *       tags: [Category]
 *       summary: Create a new category
 *       description: Create a new job category. Requires admin role.
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
 *               description: Software and hardware engineering roles
 *               keywords: [backend, frontend, devops]
 *       responses:
 *         '201':
 *           description: Category created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *               example:
 *                 message: Category created successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234aaa
 *                   name: Engineering
 *                   slug: engineering
 *                   description: Software and hardware engineering roles
 *                   keywords: [backend, frontend, devops]
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /api/category/{id}:
 *     get:
 *       tags: [Category]
 *       summary: Get category by ID
 *       description: Retrieve detailed information about a specific category
 *       security: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Category ID
 *       responses:
 *         '200':
 *           description: Category retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *               example:
 *                 message: Category fetched successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234aaa
 *                   name: Engineering
 *                   slug: engineering
 *                   description: Software and hardware engineering roles
 *                   keywords: [backend, frontend, devops]
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     patch:
 *       tags: [Category]
 *       summary: Update an existing category
 *       description: Update category information. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Category ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryUpdateRequest'
 *             example:
 *               description: Updated category description
 *               keywords: [backend, frontend, mobile, devops]
 *       responses:
 *         '200':
 *           description: Category updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *               example:
 *                 message: Category updated successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234aaa
 *                   name: Engineering
 *                   slug: engineering
 *                   description: Updated category description
 *                   keywords: [backend, frontend, mobile, devops]
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
 *       tags: [Category]
 *       summary: Delete a category
 *       description: Soft delete a category (marks as deleted). Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Category ID
 *       responses:
 *         '200':
 *           description: Category deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Category deleted successfully
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
