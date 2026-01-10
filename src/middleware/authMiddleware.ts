
import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../lib/auth.js";
declare global{
    namespace Express{
        interface Request {
           user?:{
            id:string,
            email:string,
            name:string,
            role:string,
            emailVerified :boolean
           }
        }
    }
}

 export const authMiddleware = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    console.log("before session");
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }
    console.log("after session");

    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account",
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as string,
      emailVerified: session.user.emailVerified,
    };


    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    
    next();
  };
};