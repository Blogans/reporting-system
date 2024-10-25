// server/types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
  interface Session {
    userId?: string;
    userEmail?: string;
    userRole?: string;
  }
}