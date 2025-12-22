import express, { type NextFunction, type Request, type Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"

const JWT_SECRET = "SUPER_SECRET_KEY"

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization

    if (!token) {
        res.status(403).json({ message: "Token missing" })
        return
    }

    try {
        const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload
        if(!decoded){
            res.status(401).json({message: "Wrong or expired token"})
            return
        }
        req.userId = decoded.userId
        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }

}