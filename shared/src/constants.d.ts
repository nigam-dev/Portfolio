export declare const API_VERSION = "v1";
export declare const ADMIN_EMAIL = "nigmanand-dev@gmail.com";
export declare const DEFAULT_PAGE_SIZE = 10;
export declare const MAX_PAGE_SIZE = 100;
export declare const ALLOWED_IMAGE_TYPES: string[];
export declare const ALLOWED_FILE_TYPES: string[];
export declare const MAX_FILE_SIZE: number;
export declare const JWT_COOKIE_NAME = "portfolio_token";
export declare const RATE_LIMIT: {
    WINDOW_MS: number;
    MAX_REQUESTS: number;
};
export declare const CACHE_TTL: {
    SHORT: number;
    MEDIUM: number;
    LONG: number;
    VERY_LONG: number;
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const ERROR_MESSAGES: {
    readonly UNAUTHORIZED: "Unauthorized access";
    readonly FORBIDDEN: "You do not have permission to perform this action";
    readonly NOT_FOUND: "Resource not found";
    readonly VALIDATION_ERROR: "Validation error";
    readonly INTERNAL_ERROR: "Internal server error";
    readonly ADMIN_ONLY: "This action is restricted to admin users only";
};
//# sourceMappingURL=constants.d.ts.map