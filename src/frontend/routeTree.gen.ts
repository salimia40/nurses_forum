/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as ResetPasswordImport } from './routes/reset-password';
import { Route as RegisterImport } from './routes/register';
import { Route as PasswordResetSuccessImport } from './routes/password-reset-success';
import { Route as LoginImport } from './routes/login';
import { Route as ForgotPasswordImport } from './routes/forgot-password';
import { Route as AboutImport } from './routes/about';
import { Route as IndexImport } from './routes/index';

// Create/Update Routes

const ResetPasswordRoute = ResetPasswordImport.update({
  id: '/reset-password',
  path: '/reset-password',
  getParentRoute: () => rootRoute,
} as any);

const RegisterRoute = RegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => rootRoute,
} as any);

const PasswordResetSuccessRoute = PasswordResetSuccessImport.update({
  id: '/password-reset-success',
  path: '/password-reset-success',
  getParentRoute: () => rootRoute,
} as any);

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any);

const ForgotPasswordRoute = ForgotPasswordImport.update({
  id: '/forgot-password',
  path: '/forgot-password',
  getParentRoute: () => rootRoute,
} as any);

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    '/about': {
      id: '/about';
      path: '/about';
      fullPath: '/about';
      preLoaderRoute: typeof AboutImport;
      parentRoute: typeof rootRoute;
    };
    '/forgot-password': {
      id: '/forgot-password';
      path: '/forgot-password';
      fullPath: '/forgot-password';
      preLoaderRoute: typeof ForgotPasswordImport;
      parentRoute: typeof rootRoute;
    };
    '/login': {
      id: '/login';
      path: '/login';
      fullPath: '/login';
      preLoaderRoute: typeof LoginImport;
      parentRoute: typeof rootRoute;
    };
    '/password-reset-success': {
      id: '/password-reset-success';
      path: '/password-reset-success';
      fullPath: '/password-reset-success';
      preLoaderRoute: typeof PasswordResetSuccessImport;
      parentRoute: typeof rootRoute;
    };
    '/register': {
      id: '/register';
      path: '/register';
      fullPath: '/register';
      preLoaderRoute: typeof RegisterImport;
      parentRoute: typeof rootRoute;
    };
    '/reset-password': {
      id: '/reset-password';
      path: '/reset-password';
      fullPath: '/reset-password';
      preLoaderRoute: typeof ResetPasswordImport;
      parentRoute: typeof rootRoute;
    };
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute;
  '/about': typeof AboutRoute;
  '/forgot-password': typeof ForgotPasswordRoute;
  '/login': typeof LoginRoute;
  '/password-reset-success': typeof PasswordResetSuccessRoute;
  '/register': typeof RegisterRoute;
  '/reset-password': typeof ResetPasswordRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute;
  '/about': typeof AboutRoute;
  '/forgot-password': typeof ForgotPasswordRoute;
  '/login': typeof LoginRoute;
  '/password-reset-success': typeof PasswordResetSuccessRoute;
  '/register': typeof RegisterRoute;
  '/reset-password': typeof ResetPasswordRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexRoute;
  '/about': typeof AboutRoute;
  '/forgot-password': typeof ForgotPasswordRoute;
  '/login': typeof LoginRoute;
  '/password-reset-success': typeof PasswordResetSuccessRoute;
  '/register': typeof RegisterRoute;
  '/reset-password': typeof ResetPasswordRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | '/'
    | '/about'
    | '/forgot-password'
    | '/login'
    | '/password-reset-success'
    | '/register'
    | '/reset-password';
  fileRoutesByTo: FileRoutesByTo;
  to:
    | '/'
    | '/about'
    | '/forgot-password'
    | '/login'
    | '/password-reset-success'
    | '/register'
    | '/reset-password';
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/forgot-password'
    | '/login'
    | '/password-reset-success'
    | '/register'
    | '/reset-password';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  AboutRoute: typeof AboutRoute;
  ForgotPasswordRoute: typeof ForgotPasswordRoute;
  LoginRoute: typeof LoginRoute;
  PasswordResetSuccessRoute: typeof PasswordResetSuccessRoute;
  RegisterRoute: typeof RegisterRoute;
  ResetPasswordRoute: typeof ResetPasswordRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  ForgotPasswordRoute: ForgotPasswordRoute,
  LoginRoute: LoginRoute,
  PasswordResetSuccessRoute: PasswordResetSuccessRoute,
  RegisterRoute: RegisterRoute,
  ResetPasswordRoute: ResetPasswordRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/forgot-password",
        "/login",
        "/password-reset-success",
        "/register",
        "/reset-password"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/forgot-password": {
      "filePath": "forgot-password.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/password-reset-success": {
      "filePath": "password-reset-success.tsx"
    },
    "/register": {
      "filePath": "register.tsx"
    },
    "/reset-password": {
      "filePath": "reset-password.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
