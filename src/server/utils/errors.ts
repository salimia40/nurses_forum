import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * Application error codes
 */
export enum ErrorCode {
  // General errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Thread errors
  THREAD_NOT_FOUND = 'THREAD_NOT_FOUND',
  THREAD_CREATE_FAILED = 'THREAD_CREATE_FAILED',
  THREAD_UPDATE_FAILED = 'THREAD_UPDATE_FAILED',
  THREAD_DELETE_FAILED = 'THREAD_DELETE_FAILED',
  THREAD_ALREADY_LOCKED = 'THREAD_ALREADY_LOCKED',

  // User errors
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USERNAME_TAKEN = 'USERNAME_TAKEN',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Category errors
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',

  // Comment errors
  COMMENT_NOT_FOUND = 'COMMENT_NOT_FOUND',
  COMMENT_CREATE_FAILED = 'COMMENT_CREATE_FAILED',
  COMMENT_UPDATE_FAILED = 'COMMENT_UPDATE_FAILED',
  COMMENT_DELETE_FAILED = 'COMMENT_DELETE_FAILED',

  // Permission errors
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ADMIN_REQUIRED = 'ADMIN_REQUIRED',

  // Other
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

/**
 * Map error codes to HTTP status codes
 */
export const errorStatusMap: Record<ErrorCode, ContentfulStatusCode> = {
  // General errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: 500,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.VALIDATION_ERROR]: 400,

  // Thread errors
  [ErrorCode.THREAD_NOT_FOUND]: 404,
  [ErrorCode.THREAD_CREATE_FAILED]: 500,
  [ErrorCode.THREAD_UPDATE_FAILED]: 500,
  [ErrorCode.THREAD_DELETE_FAILED]: 500,
  [ErrorCode.THREAD_ALREADY_LOCKED]: 400,

  // User errors
  [ErrorCode.USER_NOT_FOUND]: 404,
  [ErrorCode.USER_ALREADY_EXISTS]: 409,
  [ErrorCode.USERNAME_TAKEN]: 409,
  [ErrorCode.EMAIL_TAKEN]: 409,
  [ErrorCode.INVALID_CREDENTIALS]: 401,

  // Category errors
  [ErrorCode.CATEGORY_NOT_FOUND]: 404,

  // Comment errors
  [ErrorCode.COMMENT_NOT_FOUND]: 404,
  [ErrorCode.COMMENT_CREATE_FAILED]: 500,
  [ErrorCode.COMMENT_UPDATE_FAILED]: 500,
  [ErrorCode.COMMENT_DELETE_FAILED]: 500,

  // Permission errors
  [ErrorCode.PERMISSION_DENIED]: 403,
  [ErrorCode.ADMIN_REQUIRED]: 403,

  // Other
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 429,
};

/**
 * User-friendly error messages (Persian)
 */
export const errorMessageMap: Record<ErrorCode, string> = {
  // General errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'خطای سرور داخلی رخ داده است.',
  [ErrorCode.NOT_FOUND]: 'موردی یافت نشد.',
  [ErrorCode.BAD_REQUEST]: 'درخواست نامعتبر است.',
  [ErrorCode.UNAUTHORIZED]: 'لطفا وارد حساب کاربری خود شوید.',
  [ErrorCode.FORBIDDEN]: 'شما مجوز دسترسی به این بخش را ندارید.',
  [ErrorCode.VALIDATION_ERROR]: 'اطلاعات وارد شده معتبر نمی‌باشد.',

  // Thread errors
  [ErrorCode.THREAD_NOT_FOUND]: 'تاپیک مورد نظر یافت نشد.',
  [ErrorCode.THREAD_CREATE_FAILED]: 'خطا در ایجاد تاپیک جدید.',
  [ErrorCode.THREAD_UPDATE_FAILED]: 'خطا در به‌روزرسانی تاپیک.',
  [ErrorCode.THREAD_DELETE_FAILED]: 'خطا در حذف تاپیک.',
  [ErrorCode.THREAD_ALREADY_LOCKED]: 'این تاپیک قبلا قفل شده است.',

  // User errors
  [ErrorCode.USER_NOT_FOUND]: 'کاربر مورد نظر یافت نشد.',
  [ErrorCode.USER_ALREADY_EXISTS]: 'این کاربر قبلا ثبت نام کرده است.',
  [ErrorCode.USERNAME_TAKEN]: 'این نام کاربری قبلا استفاده شده است.',
  [ErrorCode.EMAIL_TAKEN]: 'این ایمیل قبلا استفاده شده است.',
  [ErrorCode.INVALID_CREDENTIALS]: 'نام کاربری یا رمز عبور اشتباه است.',

  // Category errors
  [ErrorCode.CATEGORY_NOT_FOUND]: 'دسته‌بندی مورد نظر یافت نشد.',

  // Comment errors
  [ErrorCode.COMMENT_NOT_FOUND]: 'نظر مورد نظر یافت نشد.',
  [ErrorCode.COMMENT_CREATE_FAILED]: 'خطا در ثبت نظر جدید.',
  [ErrorCode.COMMENT_UPDATE_FAILED]: 'خطا در به‌روزرسانی نظر.',
  [ErrorCode.COMMENT_DELETE_FAILED]: 'خطا در حذف نظر.',

  // Permission errors
  [ErrorCode.PERMISSION_DENIED]: 'شما مجوز انجام این عملیات را ندارید.',
  [ErrorCode.ADMIN_REQUIRED]: 'این عملیات نیاز به دسترسی مدیر دارد.',

  // Other
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفا کمی صبر کنید.',
};

/**
 * Custom Application Error class
 */
export class AppError extends HTTPException {
  code: ErrorCode;
  status: ContentfulStatusCode;

  constructor(code: ErrorCode) {
    // Use provided message or get default from map
    super(errorStatusMap[code], {
      message: errorMessageMap[code] || 'خطایی در اجرای عملیات رخ داد',
    });

    this.name = 'AppError';
    this.code = code;
    this.status = errorStatusMap[code];
  }
}
