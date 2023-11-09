import { withSessionRoute } from "../../lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "iron-session";

// Define an in-memory store to keep track of password attempt counts by IP address
const loginAttemptsByIP: { [key: string]: { count: number; lastAttempt: Date } } = {};

const MAX_ATTEMPTS = 10; // Maximum allowed attempts before locking out
const LOCKOUT_TIME = 2 * 60 * 60 * 1000; // Lockout duration in milliseconds (2 hours)

// API route handler for authentication
const handler = async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
  // Retrieve the IP address from the request
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  ip = Array.isArray(ip) ? ip[0] : ip;
  ip = typeof ip === 'string' ? ip : 'unknown';

  const now = new Date();

  // Get or initialize the attempt record for this IP
  const attempts = loginAttemptsByIP[ip] || { count: 0, lastAttempt: now };

  // Check if the attempts have exceeded the limit and if the lockout time has passed
  if (attempts.count >= MAX_ATTEMPTS && now.getTime() - attempts.lastAttempt.getTime() < LOCKOUT_TIME) {
    return res.status(429).json({ message: "Too many attempts, please try again later." });
  }

  // Handle POST requests for submitting the password
  if (req.method === "POST") {
    const { password } = req.body;

    // Check if the provided password matches the environment variable
    if (password === process.env.PASSWORD) {
      req.session.authenticated = true; // Set the session as authenticated
      await req.session.save(); // Save the session
      // Reset the attempt record for this IP
      loginAttemptsByIP[ip] = { count: 0, lastAttempt: now };
      res.status(200).json({ authenticated: true });
    } else {
      // Update the attempt record for this IP
      loginAttemptsByIP[ip] = { count: attempts.count + 1, lastAttempt: now };
      res.status(401).json({ message: "Invalid password, please try again." });
    }
  } else if (req.method === "GET") {
    // Handle GET requests to check if the session is authenticated
    if (req.session.authenticated) {
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ message: "Not authenticated." });
    }
  } else {
    // Set the allowed methods in the response header
    res.setHeader('Allow', ['GET', 'POST'].join(', '));
    // Return a 405 Method Not Allowed status code
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default withSessionRoute(handler);
