/**
 * @swagger
 * tags:
 *   - name: Job
 *     description: Job posting management operations
 *
 * paths:
 *   /api/job:
 *     get:
 *       tags: [Job]
 *       summary: List all job postings
 *       description: Retrieve paginated list of active job postings
 *       security: []
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Items per page
 *       responses:
 *         '200':
 *           description: Jobs retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobListResponse'
 *               example:
 *                 message: Jobs fetched successfully
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234j01
 *                     title: Senior Backend Engineer
 *                     slug: senior-backend-engineer
 *                     company: Acme Corp
 *                     workMode: remote
 *                     jobType: full-time
 *                     expirationDate: 2026-02-28T00:00:00.000Z
 *                   - _id: 65a1234bcf9e2a001234j02
 *                     title: QA Engineer
 *                     slug: qa-engineer
 *                     company: TechCo
 *                     workMode: hybrid
 *                     jobType: full-time
 *                     expirationDate: 2026-03-15T00:00:00.000Z
 *                 pagination:
 *                   total: 25
 *                   page: 1
 *                   limit: 10
 *                   totalPages: 3
 *
 *     post:
 *       tags: [Job]
 *       summary: Create a new job posting
 *       description: Create a new job posting. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobCreateRequest'
 *             example:
 *               title: Senior Backend Engineer
 *               company: Acme Corp
 *               description: We are looking for an experienced backend engineer to join our team...
 *               fieldOfWork: 65a1234bcf9e2a001234aaa
 *               experienceLevel: 65a1234bcf9e2a001234ef1
 *               keywords: [65a1234bcf9e2a001234k01, 65a1234bcf9e2a001234k02]
 *               country: 65a1234bcf9e2a001234abc
 *               locationDetails: Cairo, Egypt
 *               workMode: remote
 *               jobType: full-time
 *               employmentType: permanent
 *               expirationDate: 2026-02-28T00:00:00.000Z
 *               responsibilities:
 *                 - text: Design and implement scalable backend services
 *                 - text: Write clean, maintainable code
 *               requirements:
 *                 - text: 5+ years of backend development experience
 *                 - text: Strong knowledge of Node.js and databases
 *       responses:
 *         '201':
 *           description: Job created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobResponse'
 *               example:
 *                 message: Job created successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234j01
 *                   title: Senior Backend Engineer
 *                   company: Acme Corp
 *                   workMode: remote
 *                   jobType: full-time
 *                   expirationDate: 2026-02-28T00:00:00.000Z
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /api/job/{id}:
 *     get:
 *       tags: [Job]
 *       summary: Get job by ID
 *       description: Retrieve detailed information about a specific job posting
 *       security: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Job ID
 *       responses:
 *         '200':
 *           description: Job retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobResponse'
 *               example:
 *                 message: Job fetched successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234j01
 *                   title: Senior Backend Engineer
 *                   company: Acme Corp
 *                   description: We are looking for an experienced backend engineer...
 *                   workMode: remote
 *                   jobType: full-time
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     patch:
 *       tags: [Job]
 *       summary: Update an existing job
 *       description: Update job posting information. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Job ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobUpdateRequest'
 *             example:
 *               workMode: hybrid
 *               expirationDate: 2026-03-31T00:00:00.000Z
 *       responses:
 *         '200':
 *           description: Job updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobResponse'
 *               example:
 *                 message: Job updated successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234j01
 *                   title: Senior Backend Engineer
 *                   workMode: hybrid
 *                   expirationDate: 2026-03-31T00:00:00.000Z
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
 *       tags: [Job]
 *       summary: Delete a job posting
 *       description: Soft delete a job posting (marks as deleted). Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Job ID
 *       responses:
 *         '200':
 *           description: Job deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Job deleted successfully
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /api/job/toggle-activation/{id}:
 *     patch:
 *       tags: [Job]
 *       summary: Toggle job activation status
 *       description: Activate or deactivate a job posting. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Job ID
 *       responses:
 *         '200':
 *           description: Job activation status toggled successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobResponse'
 *               example:
 *                 message: Job deactivated successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234j01
 *                   title: Senior Backend Engineer
 *                   is_active: false
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
