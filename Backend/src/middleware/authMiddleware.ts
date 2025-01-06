import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import ApiResponse from "../utils/Apiresponse";
import { decodeToken } from "../utils/tokenUtils";

// Middleware function to decode the refresh token
export const decodedUserRefreshToken = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>, 
  res: Response, 
  next: NextFunction
): void => {  // Return type should be void, not Response
  const refreshToken = req.cookies['refreshToken'] || req.header('refreshToken');

  if (!refreshToken) {
    // Sending response and ending the request-response cycle here
    res.status(401).json(new ApiResponse(
      401,
      null,
      "Access Denied"
    ));
    return; // Make sure to return here after sending the response
  }

  try {
    const decoded = decodeToken(refreshToken);

    req.user = { ...decoded, rawToken: refreshToken };

    // If everything is fine, pass control to the next middleware/route handler
    next();
  } catch (err) {
    // Sending response for invalid token
    res.status(401).json(new ApiResponse(
      401,
      null,
      "Invalid Token"
    ));
    return; // Return after sending the response to prevent next() from being called
  }
};
