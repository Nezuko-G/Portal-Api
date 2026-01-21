/**
 * @openapi
 * tags:
 *   - name: Country
 *     description: Countries and cities.
 * paths:
 *   /api/country:
 *     get:
 *       tags: [Country]
 *       summary: List countries
 *       responses:
 *         '200':
 *           description: Array of countries
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CountryListResponse'
 *               example:
 *                 message: Countries fetched
 *                 total: 2
 *                 countries:
 *                   - _id: 65a1234bcf9e2a001234abc
 *                     name: Egypt
 *                     code: EG
 *                     cities:
 *                       - name: Cairo
 *                       - name: Giza
 *                   - _id: 65a1234bcf9e2a001234abd
 *                     name: Saudi Arabia
 *                     code: SA
 *                     cities:
 *                       - name: Riyadh
 *                       - name: Jeddah
 *     post:
 *       tags: [Country]
 *       summary: Create country
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
 *       responses:
 *         '201':
 *           description: Country created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CountryResponse'
 *               example:
 *                 message: Country created
 *                 country:
 *                   _id: 65a1234bcf9e2a001234abc
 *                   name: Egypt
 *                   code: EG
 *                   cities:
 *                     - name: Cairo
 *                     - name: Giza
 *                   createdAt: 2024-01-01T00:00:00.000Z
 *                   updatedAt: 2024-01-01T00:00:00.000Z
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *   /api/country/{id}:
 *     get:
 *       tags: [Country]
 *       summary: Get country by id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Country details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CountryResponse'
 *               example:
 *                 message: Country fetched
 *                 country:
 *                   _id: 65a1234bcf9e2a001234abc
 *                   name: Egypt
 *                   code: EG
 *                   cities:
 *                     - name: Cairo
 *                     - name: Giza
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *     patch:
 *       tags: [Country]
 *       summary: Update country
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
 *               $ref: '#/components/schemas/CountryUpdateRequest'
 *             example:
 *               cities:
 *                 - name: Cairo
 *                 - name: Alexandria
 *       responses:
 *         '200':
 *           description: Country updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CountryResponse'
 *               example:
 *                 message: Country updated
 *                 country:
 *                   _id: 65a1234bcf9e2a001234abc
 *                   name: Egypt
 *                   code: EG
 *                   cities:
 *                     - name: Cairo
 *                     - name: Alexandria
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 *     delete:
 *       tags: [Country]
 *       summary: Delete country
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
 *           description: Country deleted
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageResponse'
 *               example:
 *                 message: Country deleted
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenError'
 */
