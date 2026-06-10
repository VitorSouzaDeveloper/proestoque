import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import type { JwtPayload } from "../controllers/auth.controller";

declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload;
    }
  }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: "Token não fornecido" });
      return;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
      res.status(401).json({ error: "Token error" });
      return;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      res.status(401).json({ error: "Token mal formatado" });
      return;
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Token inválido" });
        return;
      }

      req.usuario = decoded as JwtPayload;
      return next();
    });
  } catch (err) {
    res.status(401).json({ error: "Erro na autenticação" });
    return;
  }
}
