import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from 'express';
import ApiResponse from "../utils/Apiresponse";
import { decodeToken, verifyRefreshToken } from "../utils/tokenUtils";
import { verifyAccessToken } from '../utils/tokenUtils';  // Replace with your response class
import User from "../models/userModel";
import Labor from "../models/LaborModel";
import { ApiError } from "./errorHander";
import Admin from "../models/AdminModal";
// import { JwtPayload } from 'jsonwebtoken'; 


interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
  iat: number;     
  exp: number;
}

interface ExtendedRequest extends Request {
  admin?: jwt.JwtPayload | { token: string; rawToken: string };
  labor?: jwt.JwtPayload | { token: string; rawToken: string };
  user?: jwt.JwtPayload | { token: string; rawToken: string };
}

interface TokenSource {
  cookie: string;
  header: string;
  property: 'admin' | 'labor' | 'user';
}

export const identifyUserRole = (
    req: Request & { user?: any; labor?: any; admin?: any },
    res: Response,
    next: NextFunction
): void => {
    const userToken = req.cookies["UserRefreshToken"] || req.header("UserRefreshToken");
    const laborToken = req.cookies["LaborRefreshToken"] || req.header("LaborRefreshToken");
    const adminToken = req.cookies["AdminRefreshToken"] || req.header("AdminRefreshToken");
   
    try {
        if (adminToken) {
            const decodedToken = decodeToken(adminToken);
            if (decodedToken.role.toLowerCase() !== 'admin') {
                throw new Error('Invalid admin token');
            }
            req.admin = { ...decodedToken, rawToken: adminToken };
            console.log("Admin Identified:", req.admin);
            next();
            return;
        }

        if (userToken) {
            const decodedToken = decodeToken(userToken);
            if (decodedToken.role.toLowerCase() !== 'user') {
                throw new Error('Invalid user token');
            }
            req.user = { ...decodedToken, rawToken: userToken };
            console.log("User Identified:", req.user);
            next();
            return;
        }

        if (laborToken) {
            const decodedToken = decodeToken(laborToken);
            if (decodedToken.role.toLowerCase() !== 'labor') {
                throw new Error('Invalid labor token');
            }
            req.labor = { ...decodedToken, rawToken: laborToken };
            console.log("Labor Identified:", req.labor);
            next();
            return;
        }

        console.log("No valid token found");
        res.status(401).json(new ApiResponse(401, null, "Access Denied"));
    } catch (err) {
        console.log("Token Decoding Error:", err);
        res.status(401).json(new ApiResponse(401, null, "Invalid Token"));
    }
};

export const verifyAnyRefreshTokenMiddleware: RequestHandler = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {

  const tokenSources: TokenSource[] = [
    { cookie: 'AdminRefreshToken', header: 'adminRefreshToken', property: 'admin' },
    { cookie: 'LaborRefreshToken', header: 'laborRefreshToken', property: 'labor' },
    { cookie: 'UserRefreshToken', header: 'userRefreshToken', property: 'user' }
  ];

  const presentTokens = tokenSources.map(source => {
    const cookieToken = req.cookies[source.cookie];
    const headerToken = req.header(source.header);
    
    console.log(`\nChecking ${source.property} tokens:`);
    console.log(`- Cookie (${source.cookie}):`, cookieToken ? 'Present' : 'Not present');
    console.log(`- Header (${source.header}):`, headerToken ? 'Present' : 'Not present');
    
    return {
      ...source,
      token: cookieToken || headerToken
    };
  }).filter(t => t.token);

  console.log('\nPresent Tokens Count:', presentTokens.length);

  // If no tokens are present
  if (presentTokens.length === 0) {
    res.status(401).json(
      new ApiResponse(401, null, "Access Denied - No refresh token provided")
    );
    return;
  }

  // If multiple tokens are present, we should probably warn about it
  if (presentTokens.length > 1) {
    console.warn(`Multiple refresh tokens detected for request to ${req.path}`);
  }

  // Try to verify each present token
  for (const { token, property } of presentTokens) {
    try {
      const decoded = verifyRefreshToken(token);
      
      // Set the decoded token on the appropriate property
      req[property] = typeof decoded === 'object'
        ? { ...decoded, rawToken: token }
        : { token: decoded, rawToken: token };

      next();
      return;
    } catch (err) {
      // Continue to next token if this one fails
      continue;
    }
  }

  // If we get here, all present tokens were invalid
  res.status(401).json(
    new ApiResponse(401, null, "Invalid Token or Expired")
  );
};


export const authenticateLabor = async (
  req: Request & Partial<{ labor: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): Promise<void> => {

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
    const decoded = verifyAccessToken(token) as DecodedToken; 
    req.labor = decoded;

    const {id } = req.labor

    const labor = await Labor.findById(id);

    console.log("This is the laborr;;;;;;;;;;;;;;;;;;;;;;;;;;;;",labor)

     if (labor.isBlocked) {
      res.status(403).json(new ApiResponse(403, null, "Your account has been blocked. Please contact support."));
      return;
    }
     if (labor.status === 'rejected') {
      res.status(403).json(new ApiResponse(404, null, "Your are rejected by the Autherized team. Please contact support."));
      return;
    }


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



export const authenticateUser = async (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  
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
    const decoded = verifyAccessToken(token) as DecodedToken; 
    req.user = decoded;

    const {id } = req.user

    const user = await User.findById(id);

    if (decoded.role !== 'user') {
      res.status(401).json(new ApiResponse(401, null, 'You are not authorized'));
      return;
    }

    if (user.isBlocked) {
      res.status(403).json(new ApiResponse(403, null, "Your account has been blocked. Please contact support."));
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
  req: Request & { labor?: any },
  res: Response,
  next: NextFunction
): void => {
  try {
    console.log('Arriving at refresh token middleware');
    const refreshToken = req.cookies['LaborRefreshToken'] || req.header('authorization')?.replace('Bearer ', '');

    if (!refreshToken) {
      res.status(401).json(new ApiResponse(401, null, "Access Denied"));
      return;
    }

    const decoded = decodeToken(refreshToken);
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      res.status(401).json(new ApiResponse(401, null, "Invalid Token Format"));
      return;
    }   

    // Store only necessary information
    req.labor = {
      id: decoded.id,
      role: decoded.role,
      rawToken: refreshToken
    };

    next();
  } catch (err) {
    console.error('Token decode error:', err);
    res.status(401).json(new ApiResponse(401, null, "Invalid Token"));
  }
};


export const decodedAdminRefreshToken = (
  req: Request & Partial<{ admin: string | jwt.JwtPayload }>, 
  res: Response, 
  next: NextFunction
): void => {
  console.log('Checking admin refresh token')
  const refreshToken = req.cookies['adminRefreshToken'] || req.header('authorization');

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
  req: Request & Partial<{ admin: string | jwt.JwtPayload }>,
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
    req.admin = typeof decoded === 'object' 
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
  req: Request & Partial<{ labor: string  | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies['LaborRefreshToken'] || req.header('LaborRefreshToken');

  console.log('Thsi is the refeshToken  ;;;;;',refreshToken)

  if (!refreshToken) {
    res.status(401).json(
      new ApiResponse(401, null, "Access Denied")
    );
    return;    
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    // Check if decoded is an object before spreading
    req.labor = typeof decoded === 'object' 
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