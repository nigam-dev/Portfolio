"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.HTTP_STATUS = exports.CACHE_TTL = exports.RATE_LIMIT = exports.JWT_COOKIE_NAME = exports.MAX_FILE_SIZE = exports.ALLOWED_FILE_TYPES = exports.ALLOWED_IMAGE_TYPES = exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = exports.ADMIN_EMAIL = exports.API_VERSION = void 0;
exports.API_VERSION = 'v1';
exports.ADMIN_EMAIL = 'nigmanand-dev@gmail.com';
exports.DEFAULT_PAGE_SIZE = 10;
exports.MAX_PAGE_SIZE = 100;
exports.ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
exports.ALLOWED_FILE_TYPES = [...exports.ALLOWED_IMAGE_TYPES, 'application/pdf'];
exports.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
exports.JWT_COOKIE_NAME = 'portfolio_token';
exports.RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
};
exports.CACHE_TTL = {
    SHORT: 60, // 1 minute
    MEDIUM: 300, // 5 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400, // 24 hours
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
};
exports.ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'You do not have permission to perform this action',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_ERROR: 'Internal server error',
    ADMIN_ONLY: 'This action is restricted to admin users only',
};
//# sourceMappingURL=constants.js.map