import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import ApiResponse from "../utils/Apiresponse";
import { decodeToken, verifyRefreshToken } from "../utils/tokenUtils";
import { verifyAccessToken } from '../utils/tokenUtils';  // Replace with your response class
// import { JwtPayload } from 'jsonwebtoken'; 


interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}


export const authenticateLabor = (
  req: Request & Partial<{ labor: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {

  // console.log('Hi iiii imaa here ......!!!!!!-----------')
  
  const publicRoutes = [
    '/api/labor/auth/login',
    '/api/labor/auth/register',
    '/api/labor/auth/google-sign-in',
  ];
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const token = req.headers['authorization']?.split(' ')[1] || req.header('authorization');

  if (!token) {
    res.status(401).send('Access denied');
    return;
  }

  try {
    const decoded = verifyAccessToken(token) as DecodedToken; // Ensure DecodedToken includes `userId` type definition
    req.labor = decoded;
      // console.log("Decoded Token: --------++++------", decoded);
      // console.log("Decoded Token  and rolee........!: --------++++------", decoded.role);
    // Check role
    if (decoded.role !== 'labor') {
      res.status(401).json(new ApiResponse(401, null, 'You are not authorized'));
      return;
    }

    next();
  } catch (err) {
    res.status(401).json(new ApiResponse(401, null, 'Invalid Token or Expired'));
  }
};



export const authenticateUser = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {

  // console.log('Hi iiii imaa here ......!!!!!!-----------')
  
  const publicRoutes = [
    '/api/user/auth/login',
    '/api/user/auth/register',
    '/api/user/auth/google-sign-in',
  ];
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const token = req.headers['authorization']?.split(' ')[1] || req.header('authorization');

  if (!token) {
    res.status(401).send('Access denied');
    return;
  }

  try {
    const decoded = verifyAccessToken(token) as DecodedToken; // Ensure DecodedToken includes `userId` type definition
    req.user = decoded;
      // console.log("Decoded Token: --------++++------", decoded);
      // console.log("Decoded Token  and rolee........!: --------++++------", decoded.role);
    // Check role
    if (decoded.role !== 'user') {
      res.status(401).json(new ApiResponse(401, null, 'You are not authorized'));
      return;
    }

    next();
  } catch (err) {
    res.status(401).json(new ApiResponse(401, null, 'Invalid Token or Expired'));
  }
};


export const authenticate = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>, 
  res: Response, 
  next: NextFunction
): void => {
  const token = req.headers['authorization']?.split(' ')[1] || req.header('authorization');

  if (!token) {
    res.status(401).send('Access denied');
    return;
  }

  try {
    const decoded = verifyAccessToken(token) as DecodedToken;
    req.user = decoded;

    if (decoded.role !== "admin") {
      res.status(401).json(
        new ApiResponse(
          401,
          null,
          "you are not authorized"
        )
      );
      return;
    }

    next();
  } catch (err) {
    res.status(401).json(
      new ApiResponse(
        401,
        null,
        "Invalid Token or Expired"
      )
    );
    return;
  }
};

// Middleware function to decode the refresh token
export const decodedUserRefreshToken = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>, 
  res: Response, 
  next: NextFunction
): void => {  // Return type should be void, not Response
  const refreshToken = req.cookies['UserRefreshToken'] || req.header('UserRefreshToken');

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




export const decodedLaborRefreshToken = (
  req: Request & Partial<{ labor: string | jwt.JwtPayload }>, 
  res: Response, 
  next: NextFunction
): void => {  // Return type should be void, not Response
  console.log('Iam arraive here')
  const refreshToken = req.cookies['LaborRefreshToken'] || req.header('LaborRefreshToken');

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

    req.labor = { ...decoded, rawToken: refreshToken };

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


export const decodedAdminRefreshToken = (
  req: Request & Partial<{ admin: string | jwt.JwtPayload }>, 
  res: Response, 
  next: NextFunction
): void => {
  console.log('Checking admin refresh token')
  const refreshToken = req.cookies['adminRefreshToken'] || req.header('adminRefreshToken');

  if (!refreshToken) {
    res.status(401).json(new ApiResponse(
      401,
      null,
      "Access Denied. No admin refresh token found"
    ));
    return;
  }

  try {
    const decoded = decodeToken(refreshToken);
    
    // Add role verification
    if (decoded.role !== 'admin') {
      res.status(403).json(new ApiResponse(
        403,
        null,
        "Unauthorized: Admin access required"
      ));
      return;
    }

    req.admin = { ...decoded, rawToken: refreshToken };
    next();
  } catch (err) {
    res.status(401).json(new ApiResponse(
      401,
      null,
      "Invalid Admin Token"
    ));
    return;
  }
};



export const verifyRefreshAdminTokenMiddleware = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies['adminRefreshToken'] || req.header('adminRefreshToken');

  if (!refreshToken) {
    res.status(401).json(
      new ApiResponse(401, null, "Access Denied")
    );
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    // Check if decoded is an object before spreading
    req.user = typeof decoded === 'object' 
      ? { ...decoded, rawToken: refreshToken }
      : { token: decoded, rawToken: refreshToken };
    next();
  } catch (err) {
    res.status(401).json(
      new ApiResponse(401, null, "Invalid Token or Expired")
    );
    return;
  }
};

// LaborRefreshToken


export const verifyRefreshLaborTokenMiddleware = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies['LaborRefreshToken'] || req.header('LaborRefreshToken');

  if (!refreshToken) {
    res.status(401).json(
      new ApiResponse(401, null, "Access Denied")
    );
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    // Check if decoded is an object before spreading
    req.user = typeof decoded === 'object' 
      ? { ...decoded, rawToken: refreshToken }
      : { token: decoded, rawToken: refreshToken };
    next();
  } catch (err) {
    res.status(401).json(
      new ApiResponse(401, null, "Invalid Token or Expired")
    );
    return;
  }
};


// user RefreshToken


export const verifyRefreshUserTokenMiddleware = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies['UserRefreshToken'] || req.header('UserRefreshToken');

  if (!refreshToken) {
    res.status(401).json(
      new ApiResponse(401, null, "Access Denied")
    );
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    // Check if decoded is an object before spreading
    req.user = typeof decoded === 'object' 
      ? { ...decoded, rawToken: refreshToken }
      : { token: decoded, rawToken: refreshToken };
    next();
  } catch (err) {
    res.status(401).json(
      new ApiResponse(401, null, "Invalid Token or Expired")
    );
    return;
  }
};