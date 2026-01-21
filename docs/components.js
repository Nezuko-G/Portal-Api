/**
 * @openapi
 * components:
 *   schemas:
 *     UserPublic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65a1234bcf9e2a001234abcd
 *         name:
 *           type: string
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           example: jane@example.com
 *         phone:
 *           type: string
 *           example: 01012345678
 *         role:
 *           type: string
 *           description: User role assigned by the system.
 *           example: user
 *         provider:
 *           type: string
 *           example: local
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: https://cdn.example.com/avatar.jpg
 *         cv:
 *           type: string
 *           nullable: true
 *           example: https://cdn.example.com/cv.pdf
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *         is_deleted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CategoryCreateRequest:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *           description: Must be one of JOB_CATEGORIES.
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *     CategoryUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *         is_deleted:
 *           type: boolean
 *     CountryCity:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         is_deleted:
 *           type: boolean
 *     Country:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         code:
 *           type: string
 *           example: EG
 *         cities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CountryCity'
 *         is_deleted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CountryCreateRequest:
 *       type: object
 *       required: [name, code]
 *       properties:
 *         name:
 *           type: string
 *         code:
 *           type: string
 *           example: EG
 *         cities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CountryCity'
 *     CountryUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         cities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CountryCity'
 *         is_deleted:
 *           type: boolean
 *     ExperienceLevel:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *             ar:
 *               type: string
 *         slug:
 *           type: string
 *         minYears:
 *           type: number
 *         maxYears:
 *           type: number
 *           nullable: true
 *         is_deleted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ExperienceLevelCreateRequest:
 *       type: object
 *       required: [title, minYears]
 *       properties:
 *         title:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *             ar:
 *               type: string
 *         minYears:
 *           type: number
 *         maxYears:
 *           type: number
 *     ExperienceLevelUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *             ar:
 *               type: string
 *         minYears:
 *           type: number
 *         maxYears:
 *           type: number
 *         is_deleted:
 *           type: boolean
 *     FAQ:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         slug:
 *           type: string
 *         question:
 *           type: string
 *         answer:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         is_deleted:
 *           type: boolean
 *     FAQCreateRequest:
 *       type: object
 *       required: [question, answer]
 *       properties:
 *         slug:
 *           type: string
 *         question:
 *           type: string
 *         answer:
 *           type: string
 *     FAQUpdateRequest:
 *       type: object
 *       properties:
 *         slug:
 *           type: string
 *         question:
 *           type: string
 *         answer:
 *           type: string
 *         is_deleted:
 *           type: boolean
 *     JobListItem:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *     Job:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         jobId:
 *           type: string
 *         company:
 *           type: string
 *         organization:
 *           type: string
 *         description:
 *           type: string
 *         fieldOfWork:
 *           type: string
 *         experienceLevel:
 *           type: string
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *         jobType:
 *           type: string
 *           enum: [full-time, part-time, internship]
 *         employmentType:
 *           type: string
 *           enum: [fixed-term, permanent, contract]
 *         responsibilities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/JobListItem'
 *         requirements:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/JobListItem'
 *         country:
 *           type: string
 *         locationDetails:
 *           type: string
 *         workMode:
 *           type: string
 *           enum: [office, remote, hybrid]
 *         expirationDate:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: string
 *         is_deleted:
 *           type: boolean
 *         is_active:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     JobCreateRequest:
 *       type: object
 *       required:
 *         [title, company, description, fieldOfWork, experienceLevel, country, expirationDate]
 *       properties:
 *         title:
 *           type: string
 *         jobId:
 *           type: string
 *         company:
 *           type: string
 *         organization:
 *           type: string
 *         description:
 *           type: string
 *         fieldOfWork:
 *           type: string
 *           description: Category id
 *         experienceLevel:
 *           type: string
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *         jobType:
 *           type: string
 *           enum: [full-time, part-time, internship]
 *         employmentType:
 *           type: string
 *           enum: [fixed-term, permanent, contract]
 *         responsibilities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/JobListItem'
 *         requirements:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/JobListItem'
 *         country:
 *           type: string
 *           description: Country id
 *         locationDetails:
 *           type: string
 *         workMode:
 *           type: string
 *           enum: [office, remote, hybrid]
 *         expirationDate:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: string
 *     JobUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         jobId:
 *           type: string
 *         company:
 *           type: string
 *         organization:
 *           type: string
 *         description:
 *           type: string
 *         fieldOfWork:
 *           type: string
 *         experienceLevel:
 *           type: string
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *         jobType:
 *           type: string
 *         employmentType:
 *           type: string
 *         responsibilities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/JobListItem'
 *         requirements:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/JobListItem'
 *         country:
 *           type: string
 *         locationDetails:
 *           type: string
 *         workMode:
 *           type: string
 *         expirationDate:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: string
 *         is_deleted:
 *           type: boolean
 *         is_active:
 *           type: boolean
 *     JobApplication:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         job:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *         is_deleted:
 *           type: boolean
 *         is_active:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     JobApplicationStatusUpdate:
 *       type: object
 *       required: [status]
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *     Keyword:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         word:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *             ar:
 *               type: string
 *         slug:
 *           type: string
 *         is_deleted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     KeywordCreateRequest:
 *       type: object
 *       required: [word]
 *       properties:
 *         word:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *             ar:
 *               type: string
 *     KeywordUpdateRequest:
 *       type: object
 *       properties:
 *         word:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *             ar:
 *               type: string
 *     ContactUs:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         message:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         is_deleted:
 *           type: boolean
 *     ContactUsCreateRequest:
 *       type: object
 *       required: [name, email, message]
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         message:
 *           type: string
 *           minLength: 10
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Operation completed successfully
 *     StatusMessageResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Action completed
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Category created
 *         data:
 *           $ref: '#/components/schemas/Category'
 *     CategoryListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         total:
 *           type: integer
 *           example: 3
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *     CountryResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Country created
 *         country:
 *           $ref: '#/components/schemas/Country'
 *     CountryListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         total:
 *           type: integer
 *           example: 2
 *         countries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Country'
 *     ExperienceLevelResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Experience level created
 *         data:
 *           $ref: '#/components/schemas/ExperienceLevel'
 *     ExperienceLevelListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         total:
 *           type: integer
 *           example: 4
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExperienceLevel'
 *     FAQResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/FAQ'
 *     FAQListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         total:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FAQ'
 *     JobResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Job'
 *     JobListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Job'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             totalPages:
 *               type: integer
 *           example:
 *             total: 25
 *             page: 1
 *             limit: 10
 *             totalPages: 3
 *     JobApplicationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/JobApplication'
 *     JobApplicationListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/JobApplication'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationMeta'
 *     JobApplicationAdminListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/JobApplication'
 *         stats:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             pending:
 *               type: integer
 *             accepted:
 *               type: integer
 *             rejected:
 *               type: integer
 *         pagination:
 *           $ref: '#/components/schemas/PaginationMeta'
 *     KeywordResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Keyword'
 *     KeywordListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         total:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Keyword'
 *     ContactUsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/ContactUs'
 *     ContactUsListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         total:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ContactUs'
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/UserPublic'
 *     UserAvatarResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         avatar:
 *           type: string
 *           example: https://cdn.example.com/avatar.jpg
 *     UserCvResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         cv:
 *           type: string
 *           example: https://cdn.example.com/cv.pdf
 *         public_id:
 *           type: string
 *           example: cvs/cv_65a1234bcf9e2a001234abcd
 *     AuthLoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/UserPublic'
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     AuthLogoutResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Logged out successfully
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         total:
 *           type: integer
 *           example: 42
 *         totalPages:
 *           type: integer
 *           example: 5
 *     AuthSignUpRequest:
 *       type: object
 *       required: [name, email, phone, password]
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *           pattern: '^01[0125][0-9]{8}$'
 *         password:
 *           type: string
 *           minLength: 8
 *           description: Must include upper, lower, digit, and special character.
 *         role:
 *           type: string
 *           description: Optional; defaults to user.
 *           example: user
 *     AuthLoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 8
 *     AuthForgotPasswordRequest:
 *       type: object
 *       required: [email]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *     AuthVerifyResetCodeRequest:
 *       type: object
 *       required: [email, code]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         code:
 *           type: string
 *           minLength: 6
 *           maxLength: 6
 *           example: "123456"
 *     AuthResetPasswordRequest:
 *       type: object
 *       required: [email, code, password, confirmPassword]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         code:
 *           type: string
 *           minLength: 6
 *           maxLength: 6
 *         password:
 *           type: string
 *           minLength: 8
 *           description: Must include upper, lower, digit, and special character.
 *         confirmPassword:
 *           type: string
 *           description: Must match password.
 *     AuthSuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/UserPublic'
 *         token:
 *           type: string
 *           description: JWT returned in both body and http-only cookie named jwt.
 *     AuthMessageResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Authentication token missing or invalid.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: error
 *               message:
 *                 type: string
 *                 example: Unauthorized
 *     ForbiddenError:
 *       description: Authenticated user lacks the required role.
 *     NotFoundError:
 *       description: Resource not found.
 *     ValidationError:
 *       description: Request body or params failed validation.
 */
