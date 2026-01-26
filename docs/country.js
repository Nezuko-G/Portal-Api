/**
 * @swagger
 * tags:
 *   - name: Country
 *     description: Country and city management operations
 *
 * paths:
 *   /api/country:
 *     get:
 *       tags: [Country]
 *       summary: List all countries
 *       description: Retrieve all countries with their associated cities
 *       security: []
 *       responses:
 *         '200':
 *           description: Countries retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CountryListResponse'
 *               example:
 *                 message: Countries fetched successfully
 *                 total: 2
 *                 countries:
 *                   - _id: 65a1234bcf9e2a001234abc
 *                     name: Egypt
 *                     code: EG
 *                     cities:
 *                       - name: Cairo
 *                       - name: Giza
 *                       - name: Alexandria
 *                   - _id: 65a1234bcf9e2a001234abd
 *                     name: Saudi Arabia
 *                     code: SA
 *                     cities:
 *                       - name: Riyadh
 *                       - name: Jeddah
 *
 *     post:
 *       tags: [Country]
 *       summary: Create a new country
 *       description: Create a new country with cities. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountryCreateRequest'
 *             example:
 *               name: Egypt
 *               code: EG
 *               cities:
 *                 - name: Cairo
 *                 - name: Giza
 *                 - name: Alexandria
 *       responses:
 *         '201':
 *           description: Country created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CountryResponse'
 *               example:
 *                 message: Country created successfully
 *                 country:
 *                   _id: 65a1234bcf9e2a001234abc
 *                   name: Egypt
 *                   code: EG
 *                   cities:
 *                     - name: Cairo
 *                     - name: Giza
 *                     - name: Alexandria
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /api/country/{id}:
 *     get:
 *       tags: [Country]
 *       summary: Get country by ID
 *       description: Retrieve detailed information about a specific country
 *       security: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Country ID
 *       responses:
 *         '200':
 *           description: Country retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CountryResponse'
 *               example:
 *                 message: Country fetched successfully
 *                 country:
 *                   _id: 65a1234bcf9e2a001234abc
 *                   name: Egypt
 *                   code: EG
 *                   cities:
 *                     - name: Cairo
 *                     - name: Giza
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     patch:
 *       tags: [Country]
 *       summary: Update an existing country
 *       description: Update country information and cities. Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Country ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountryUpdateRequest'
 *             example:
 *               cities:
 *                 - name: Cairo
 *                 - name: Alexandria
 *                 - name: Sharm El Sheikh
 *       responses:
 *         '200':
 *           description: Country updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CountryResponse'
 *               example:
 *                 message: Country updated successfully
 *                 country:
 *                   _id: 65a1234bcf9e2a001234abc
 *                   name: Egypt
 *                   code: EG
 *                   cities:
 *                     - name: Cairo
 *                     - name: Alexandria
 *                     - name: Sharm El Sheikh
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
 *       tags: [Country]
 *       summary: Delete a country
 *       description: Soft delete a country (marks as deleted). Requires admin role.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Country ID
 *       responses:
 *         '200':
 *           description: Country deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Country deleted successfully
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 */
