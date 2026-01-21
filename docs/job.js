/**
 * @openapi
 * tags:
 *   - name: Job
 *     description: Job postings.
 * paths:
 *   /api/job:
 *     get:
 *       tags: [Job]
 *       summary: List jobs
 *       responses:
 *         '200':
 *           description: Paginated jobs
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobListResponse'
 *               example:
 *                 message: Jobs fetched
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234j01
 *                     title: Backend Engineer
 *                     slug: backend-engineer
 *                     company: Acme
 *                     workMode: remote
 *                     jobType: full-time
 *                   - _id: 65a1234bcf9e2a001234j02
 *                     title: QA Engineer
 *                     slug: qa-engineer
 *                     company: Acme
 *                     workMode: office
 *                     jobType: full-time
 *                 pagination:
 *                   total: 25
 *                   page: 1
 *                   limit: 10
 *                   totalPages: 3
 *     post:
 *       tags: [Job]
 *       summary: Create job
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobCreateRequest'
 *             example:
 *               title: Backend Engineer
 *               company: Acme
 *               description: Build APIs
 *               fieldOfWork: 65a1234bcf9e2a001234aaa
 *               experienceLevel: 65a1234bcf9e2a001234ef1
 *               keywords: [65a1234bcf9e2a001234k01]
 *               country: 65a1234bcf9e2a001234abc
 *               workMode: remote
 *               expirationDate: 2025-12-31T00:00:00.000Z
 *       responses:
 *         '201':
 *           description: Job created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobResponse'
 *               example:
 *                 message: Job created
 *                 data:
 *                   _id: 65a1234bcf9e2a001234j01
 *                   title: Backend Engineer
 *                   company: Acme
 *                   workMode: remote
 *                   jobType: full-time
 *                   expirationDate: 2025-12-31T00:00:00.000Z
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *   /api/job/{id}:
 *     get:
 *       tags: [Job]
 *       summary: Get job by id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Job details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobResponse'
 *               example:
 *                 message: Job fetched
 *                 data:
 *                   _id: 65a1234bcf9e2a001234j01
 *                   title: Backend Engineer
 *                   company: Acme
 *                   workMode: remote
 *                   jobType: full-time
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     patch:
 *       tags: [Job]
 *       summary: Update job
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
 *               $ref: '#/components/schemas/JobUpdateRequest'
 *             example:
 *               workMode: hybrid
 *               expirationDate: 2026-01-31T00:00:00.000Z
 *       responses:
 *         '200':
 *           description: Job updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobResponse'
 *               example:
 *                 message: Job updated
 *                 data:
 *                   _id: 65a1234bcf9e2a001234j01
 *                   title: Backend Engineer
 *                   workMode: hybrid
 *                   expirationDate: 2026-01-31T00:00:00.000Z
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     delete:
 *       tags: [Job]
 *       summary: Delete job
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
 *           description: Job deleted
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Job deleted
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *   /api/job/toggle-activation/{id}:
 *     patch:
 *       tags: [Job]
 *       summary: Toggle job activation
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
 *           description: Job activation toggled
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobResponse'
 *               example:
 *                 message: Job deactivated
 *                 data:
 *                   _id: 65a1234bcf9e2a001234j01
 *                   title: Backend Engineer
 *                   is_active: false
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
