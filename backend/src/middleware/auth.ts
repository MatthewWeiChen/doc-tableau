import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define a more specific user type
interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthRequest extends Request {
  userId: string; // Remove optional since we guarantee this exists after auth
  user: AuthenticatedUser; // Remove optional since we guarantee this exists after auth
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
    } catch (jwtError) {
      return res.status(401).json({ error: "Invalid token format." });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    // Ensure all required fields exist (additional safety check)
    if (!user.id || !user.email || !user.name) {
      return res.status(401).json({ error: "User data incomplete." });
    }

    // Cast the request to AuthRequest and assign values
    const authReq = req as AuthRequest;
    authReq.userId = user.id;
    authReq.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication service error." });
  }
};
