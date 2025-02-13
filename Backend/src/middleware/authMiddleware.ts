import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import ApiResponse from "../utils/Apiresponse";
import { decodeToken, verifyRefreshToken } from "../utils/tokenUtils";
import { verifyAccessToken } from '../utils/tokenUtils';  // Replace with your response class
import User from "../models/userModel";
import Labor from "../models/LaborModel";
// import { JwtPayload } from 'jsonwebtoken'; 


interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
  iat: number;     
  exp: number;
}

// export const authenticateUserOrLabor = async (
//   req: Request & Partial<{ user: string | jwt.JwtPayload; labor: string | jwt.JwtPayload }>,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
  
//   // Public routes that do not require authentication
//   const publicRoutes = [
//     '/api/auth/login',
//     '/api/auth/register',
//     '/api/auth/google-sign-in',
//   ];
  
//   if (publicRoutes.includes(req.path)) {
//     return next();
//   }

//   // Get token from header
//   const token = req.headers['authorization']?.split(' ')[1] || req.header('authorization');

//   if (!token) {
//     res.status(401).json(new ApiResponse(401, null, 'Access denied. No token provided.'));
//     return;
//   }

//   try {
//     const decoded = verifyAccessToken(token) as { id: string; role: string };

//     if (!decoded || !decoded.id || !decoded.role) {
//       res.status(401).json(new ApiResponse(401, null, 'Invalid token structure.'));
//       return;
//     }

//     let userOrLabor;

//     if (decoded.role === 'user') {
//       const user = await User.findById(decoded.id);
//       if (!user) {
//         res.status(404).json(new ApiResponse(404, null, 'User not found.'));
//         return;
//       }
//       if (user.isBlocked) {
//         res.status(403).json(new ApiResponse(403, null, 'Your account has been blocked. Please contact support.'));
//         return;
//       }
//       req.user = decoded;
//       userOrLabor = user;
//     } 
//     else if (decoded.role === 'labor') {
//       const labor = await Labor.findById(decoded.id);
//       if (!labor) {
//         res.status(404).json(new ApiResponse(404, null, 'Labor not found.'));
//         return;
//       }
//       if (labor.isBlocked) {
//         res.status(403).json(new ApiResponse(403, null, 'Your account has been blocked. Please contact support.'));
//         return;
//       }
//       if (labor.status === 'rejected') {
//         res.status(403).json(new ApiResponse(403, null, 'You are rejected by the authorized team. Please contact support.'));
//         return;
//       }
//       req.labor = decoded;
//       userOrLabor = labor;
//     } 
//     else {
//       res.status(401).json(new ApiResponse(401, null, 'Invalid role.'));
//       return;
//     }

//     console.log('Authenticated:', {
//       id: decoded.id,
//       role: decoded.role,
//       userOrLabor,
//     });

//     next();
//   } catch (err) {
//     console.error('Authentication Error:', err);
//     res.status(401).json(new ApiResponse(401, null, 'Invalid token or expired.'));
//   }
// };



export const authenticateLabor = async (
  req: Request & Partial<{ labor: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): Promise<void> => {

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
): Promise<void>=> {

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
      console.log('Iam heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      // console.log("Decoded Token  and rolee........!: --------++++------", decoded.role);
    
    // Check role
    
    const {id } = req.user

    const user = await User.findById(id);

      console.log("This is The user ..................................",user)

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