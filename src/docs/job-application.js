/**
 * @swagger
 * tags:
 *   - name: JobApplication
 *     description: Job application submission and management operations
 *
 * paths:
 *   /api/job-application/apply/{jobId}:
 *     post:
 *       tags: [JobApplication]
 *       summary: Apply to a job posting
 *       description: Submit an application to a specific job. Requires authentication and user must have uploaded CV.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: jobId
 *           required: true
 *           schema:
 *             type: string
 *           description: Job ID to apply to
 *       responses:
 *         '201':
 *           description: Application submitted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationResponse'
 *               example:
 *                 message: Job application created successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ap1
 *                   job: 65a1234bcf9e2a001234j01
 *                   user: 65a1234bcf9e2a001234u01
 *                   status: pending
 *                   createdAt: 2026-01-26T00:00:00.000Z
 *         '400':
 *           description: Invalid request or already applied
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '404':
 *           description: Job not found
 *
 *   /api/job-application/my-applications:
 *     get:
 *       tags: [JobApplication]
 *       summary: Get my job applications
 *       description: Retrieve paginated list of current user's job applications
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: status
 *           schema:
 *             type: string
 *             enum: [pending, accepted, rejected]
 *           description: Filter by application status
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
 *           description: Applications retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationListResponse'
 *               example:
 *                 message: Applications fetched successfully
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234ap1
 *                     job: 65a1234bcf9e2a001234j01
 *                     status: pending
 *                     createdAt: 2026-01-26T00:00:00.000Z
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 1
 *                   totalPages: 1
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /api/job-application/my-applications/{id}:
 *     get:
 *       tags: [JobApplication]
 *       summary: Get my application by ID
 *       description: Retrieve detailed information about a specific application by current user
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Application ID
 *       responses:
 *         '200':
 *           description: Application retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationResponse'
 *               example:
 *                 message: Application fetched successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ap1
 *                   job: 65a1234bcf9e2a001234j01
 *                   status: pending
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     delete:
 *       tags: [JobApplication]
 *       summary: Cancel my application
 *       description: Cancel/withdraw a job application (only if status is pending)
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Application ID
 *       responses:
 *         '200':
 *           description: Application cancelled successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Job application cancelled successfully
 *         '400':
 *           description: Cannot cancel non-pending application
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /api/job-application/admin/all:
 *     get:
 *       tags: [JobApplication]
 *       summary: Get all applications (Admin)
 *       description: Retrieve paginated list of all job applications with statistics. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: status
 *           schema:
 *             type: string
 *             enum: [pending, accepted, rejected]
 *           description: Filter by application status
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
 *           description: Applications retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationAdminListResponse'
 *               example:
 *                 message: Applications fetched successfully
 *                 data:
 *                   - _id: 65a1234bcf9e2a001234ap1
 *                     user: 65a1234bcf9e2a001234u01
 *                     job: 65a1234bcf9e2a001234j01
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
 *
 *   /api/job-application/admin/job/{jobId}:
 *     get:
 *       tags: [JobApplication]
 *       summary: Get applications for specific job (Admin)
 *       description: Retrieve all applications for a specific job posting with statistics. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: jobId
 *           required: true
 *           schema:
 *             type: string
 *           description: Job ID
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
 *           description: Job applications retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationAdminListResponse'
 *               example:
 *                 message: Job applications fetched successfully
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
 *
 *   /api/job-application/admin/{id}/status:
 *     patch:
 *       tags: [JobApplication]
 *       summary: Update application status (Admin)
 *       description: Update the status of a job application. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Application ID
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
 *           description: Application status updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobApplicationResponse'
 *               example:
 *                 message: Job application status updated successfully
 *                 data:
 *                   _id: 65a1234bcf9e2a001234ap1
 *                   status: accepted
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
