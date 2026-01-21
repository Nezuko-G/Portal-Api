/**
 * @openapi
 * tags:
 *   - name: JobApplication
 *     description: Job application submission and review.
 * paths:
 *   /api/job-application/apply/{jobId}:
 *     post:
 *       tags: [JobApplication]
 *       summary: Apply to a job
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: jobId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '201':
 *           description: Application created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationResponse'
 *               example:
 *                 message: Job application created
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ap1
 *                   job: 65a1234bcf9e2a001234j01
 *                   user: 65a1234bcf9e2a001234u01
 *                   status: pending
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *   /api/job-application/my-applications:
 *     get:
 *       tags: [JobApplication]
 *       summary: List my applications
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: status
 *           schema:
 *             type: string
 *             enum: [pending, accepted, rejected]
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *       responses:
 *         '200':
 *           description: Paginated applications
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationListResponse'
 *               example:
 *                 message: Applications fetched
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234ap1
 *                     job: 65a1234bcf9e2a001234j01
 *                     status: pending
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 1
 *                   totalPages: 1
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *   /api/job-application/my-applications/{id}:
 *     get:
 *       tags: [JobApplication]
 *       summary: Get my application by id
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
 *           description: Application details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationResponse'
 *               example:
 *                 message: Application fetched
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ap1
 *                   job: 65a1234bcf9e2a001234j01
 *                   status: pending
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     delete:
 *       tags: [JobApplication]
 *       summary: Cancel my application
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
 *           description: Application cancelled
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Job application cancelled
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *   /api/job-application/admin/all:
 *     get:
 *       tags: [JobApplication]
 *       summary: List all applications (admin)
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: status
 *           schema:
 *             type: string
 *             enum: [pending, accepted, rejected]
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *       responses:
 *         '200':
 *           description: Paginated applications
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationAdminListResponse'
 *               example:
 *                 message: Applications fetched
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234ap1
 *                     user: 65a1234bcf9e2a001234u01
 *                     status: pending
 *                 stats:
 *                   total: 12
 *                   pending: 8
 *                   accepted: 3
 *                   rejected: 1
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 12
 *                   totalPages: 2
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *   /api/job-application/admin/job/{jobId}:
 *     get:
 *       tags: [JobApplication]
 *       summary: List applications for a job (admin)
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: jobId
 *           required: true
 *           schema:
 *             type: string
 *         - in: query
 *           name: status
 *           schema:
 *             type: string
 *             enum: [pending, accepted, rejected]
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *       responses:
 *         '200':
 *           description: Paginated applications
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationAdminListResponse'
 *               example:
 *                 message: Job applications fetched
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234ap1
 *                     user: 65a1234bcf9e2a001234u01
 *                     status: pending
 *                 stats:
 *                   total: 5
 *                   pending: 4
 *                   accepted: 1
 *                   rejected: 0
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 5
 *                   totalPages: 1
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *   /api/job-application/admin/{id}/status:
 *     patch:
 *       tags: [JobApplication]
 *       summary: Update application status (admin)
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
 *               $ref: '#/components/schemas/JobApplicationStatusUpdate'
 *             example:
 *               status: accepted
 *       responses:
 *         '200':
 *           description: Status updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationResponse'
 *               example:
 *                 message: Job application status updated
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ap1
 *                   status: accepted
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
