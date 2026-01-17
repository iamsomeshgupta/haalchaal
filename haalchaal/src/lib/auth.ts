import jwt from "jsonwebtoken";
export function signToken(userId:string){
    return jwt.sign(
        {id:userId},
        process.env.JWT_SECRET!,
        {expiresIn:"1d"}
    );
}
export function verifyToken(token:string){
    return jwt.verify(token,process.env.JWT_SECRET!) as {id:string};
}
/*signToken(userId: string)
Creates a JWT containing the user's ID
Signs it with your secret key (process.env.JWT_SECRET)
Sets expiration to 1 day
Used when a user logs in or registers to generate their auth token

verifyToken(token: string)
Decodes and validates a JWT
Returns the payload with the user's ID
Used in API routes to authenticate requests and identify the current user
Throws an error if the token is invalid or expired */