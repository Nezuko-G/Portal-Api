/**
 * @swagger
 * tags:
 *   - name: ExperienceLevel
 *     description: Experience level management operations
 *
 * paths:
 *   /api/experience:
 *     get:
 *       tags: [ExperienceLevel]
 *       summary: List all experience levels
 *       description: Retrieve all available experience levels
 *       security: []
 *       responses:
 *         '200':
 *           description: Experience levels retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ExperienceLevelListResponse'
 *               example:
 *                 message: Experience levels fetched successfully
 *                 total: 4
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234ef1
 *                     title:
 *                       en: Entry Level
 *                       ar: مبتدئ
 *                     slug: entry-level
 *                     minYears: 0
 *                     maxYears: 2
 *                   - _id: 65a1234bcf9e2a001234ef2
 *                     title:
 *                       en: Mid Level
 *                       ar: متوسط الخبرة
 *                     slug: mid-level
 *                     minYears: 2
 *                     maxYears: 5
 *                   - _id: 65a1234bcf9e2a001234ef3
 *                     title:
 *                       en: Senior
 *                       ar: خبير
 *                     slug: senior
 *                     minYears: 5
 *                     maxYears: 10
 *                   - _id: 65a1234bcf9e2a001234ef4
 *                     title:
 *                       en: Expert
 *                       ar: خبير أول
 *                     slug: expert
 *                     minYears: 10
 *                     maxYears: null
 *
 *     post:
 *       tags: [ExperienceLevel]
 *       summary: Create a new experience level
 *       description: Create a new experience level with bilingual titles. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExperienceLevelCreateRequest'
 *             example:
 *               title:
 *                 en: Senior
 *                 ar: خبير
 *               minYears: 5
 *               maxYears: 10
 *       responses:
 *         '201':
 *           description: Experience level created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ExperienceLevelResponse'
 *               example:
 *                 message: Experience level created successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ef1
 *                   title:
 *                     en: Senior
 *                     ar: خبير
 *                   slug: senior
 *                   minYears: 5
 *                   maxYears: 10
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /api/experience/{id}:
 *     get:
 *       tags: [ExperienceLevel]
 *       summary: Get experience level by ID
 *       description: Retrieve detailed information about a specific experience level
 *       security: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Experience level ID
 *       responses:
 *         '200':
 *           description: Experience level retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ExperienceLevelResponse'
 *               example:
 *                 message: Experience level fetched successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ef1
 *                   title:
 *                     en: Senior
 *                     ar: خبير
 *                   slug: senior
 *                   minYears: 5
 *                   maxYears: 10
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     put:
 *       tags: [ExperienceLevel]
 *       summary: Update an existing experience level
 *       description: Update experience level information. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Experience level ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExperienceLevelUpdateRequest'
 *             example:
 *               title:
 *                 en: Staff Engineer
 *                 ar: مهندس أول
 *               minYears: 8
 *               maxYears: 15
 *       responses:
 *         '200':
 *           description: Experience level updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ExperienceLevelResponse'
 *               example:
 *                 message: Experience level updated successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ef1
 *                   title:
 *                     en: Staff Engineer
 *                     ar: مهندس أول
 *                   slug: staff-engineer
 *                   minYears: 8
 *                   maxYears: 15
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
 *       tags: [ExperienceLevel]
 *       summary: Delete an experience level
 *       description: Soft delete an experience level (marks as deleted). Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Experience level ID
 *       responses:
 *         '200':
 *           description: Experience level deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Experience level deleted successfully
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
