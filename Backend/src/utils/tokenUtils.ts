import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret'
const ACCESS_TOKEN_EXPIRATION = '1h';
const REFRESH_TOKEN_EXPIRATION = '7d'

export const generateAccessToken = (payload: { id: string, role: string }) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { 
        expiresIn: ACCESS_TOKEN_EXPIRATION
    })
};

export const accessTokenForReset =  (payload: object): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
};


export const generateRefreshToken = (payload: { id: string, role: string }) => {
    return jwt.sign(payload, REFRESH_TOKEN_EXPIRATION, {
        expiresIn: REFRESH_TOKEN_EXPIRATION
    })
};

export const verifyAccessToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET)
        return decoded
    } catch (error) {
        throw new Error('Invalid Access Token')
    }
}

export const verifyRefreshToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET)
        return decoded
    } catch (error) {
        throw new Error('Invalid Refresh Token')        
    }
}


export const decodeAndVerifyToken = (token: string): any => {
  try {

    const decoded: any = jwt.verify(token, ACCESS_TOKEN_SECRET);


    if (decoded && decoded._doc) {
      return decoded._doc;
    }


    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};