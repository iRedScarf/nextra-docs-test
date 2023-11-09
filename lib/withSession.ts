// Import the required functions and types from iron-session and Next.js
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from "next";

// Define the session options including the password for the cookie encryption,
// the cookie name, and additional cookie options
const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "Nextra-Docs",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as "strict",
  },
};

// Create a higher-order function to wrap API routes with session handling
export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Create a higher-order function to wrap server-side rendering (SSR) handlers with session handling
export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionOptions);
}

// Extend the Session interface from iron-session to include an optional authenticated boolean
declare module "iron-session" {
  interface Session {
    authenticated?: boolean;
  }
}
