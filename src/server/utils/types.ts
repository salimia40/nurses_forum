import { auth } from '~/auth';
// Define User interface to avoid type errors
export type User = typeof auth.$Infer.Session.user;
