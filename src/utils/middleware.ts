import express from "express";
import { getValidToken } from "../services/ghlService";
import { IToken } from "../models/Token";

// Extend Express Request with token property
declare global {
  namespace Express {
    interface Request {
      token?: IToken;
    }
  }
}

// Middleware to validate Authorization header and attach token
export const validateToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header with Bearer token is required" });
  }

  const accessToken = authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Valid Bearer token is required" });
  }

  try {
    const token = await getValidToken(accessToken);
    if (!token) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.token = token; // Attach token for later use
    next(); // Continue processing
  } catch (error: any) {
    return res.status(401).json({ error: error.message || "Unauthorized" });
  }
};
