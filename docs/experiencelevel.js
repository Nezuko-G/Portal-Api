/**
 * @openapi
 * tags:
 *   - name: ExperienceLevel
 *     description: Years-of-experience ranges used for jobs.
 * paths:
 *   /api/experience:
 *     get:
 *       tags: [ExperienceLevel]
 *       summary: List experience levels
 *       responses:
 *         '200':
 *           description: Array of experience levels
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ExperienceLevelListResponse'
 *               example:
 *                 message: Experience levels fetched
 *                 total: 2
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234ef1
 *                     title: Junior
 *                     slug: junior
 *                     minYears: 0
 *                     maxYears: 2
 *                   - _id: 65a1234bcf9e2a001234ef2
 *                     title: Senior
 *                     slug: senior
 *                     minYears: 5
 *                     maxYears: 10
 *     post:
 *       tags: [ExperienceLevel]
 *       summary: Create experience level
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
 *           description: Experience level created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ExperienceLevelResponse'
 *               example:
 *                 message: Experience level created
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ef1
 *                   title:
 *                     en: Senior
 *                     ar: خبير
 *                   slug: senior
 *                   minYears: 5
 *                   maxYears: 10
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *   /api/experience/{id}:
 *     get:
 *       tags: [ExperienceLevel]
 *       summary: Get experience level by id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Experience level details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ExperienceLevelResponse'
 *               example:
 *                 message: Experience level fetched
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ef1
 *                   title: Senior
 *                   slug: senior
 *                   minYears: 5
 *                   maxYears: 10
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     put:
 *       tags: [ExperienceLevel]
 *       summary: Update experience level
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
 *               $ref: '#/components/schemas/ExperienceLevelUpdateRequest'
 *             example:
 *               title:
 *                 en: Staff Engineer
 *                 ar: خبير أول
 *               minYears: 8
 *       responses:
 *         '200':
 *           description: Experience level updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ExperienceLevelResponse'
 *               example:
 *                 message: Experience level updated
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ef1
 *                   title:
 *                     en: Staff Engineer
 *                     ar: خبير أول
 *                   slug: staff-engineer
 *                   minYears: 8
 *                   maxYears: 10
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     delete:
 *       tags: [ExperienceLevel]
 *       summary: Delete experience level
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
 *           description: Experience level deleted
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Experience level deleted
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
