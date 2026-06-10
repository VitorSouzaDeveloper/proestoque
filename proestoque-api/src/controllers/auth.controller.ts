import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import { AppError } from "../middlewares/errorHandler";
import { config } from "../config";

export type JwtPayload = {
  sub: string;
  nome: string;
  email: string;
};

const SALT_ROUNDS = 10;

function gerarAccessToken(usuario: { id: string; nome: string; email: string }): string {
  const payload: JwtPayload = {
    sub: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

function gerarRefreshToken(usuarioId: string): string {
  return jwt.sign({ sub: usuarioId }, config.jwtSecret, {
    expiresIn: config.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export class AuthController {
  async registrar(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, email, senha } = req.body;

      const usuarioExiste = await prisma.usuario.findUnique({
        where: { email },
      });

      if (usuarioExiste) {
        throw new AppError("E-mail já está em uso", 409);
      }

      const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash,
        },
      });

      const token = gerarAccessToken(novoUsuario);
      const refreshToken = gerarRefreshToken(novoUsuario.id);

      await prisma.usuario.update({
        where: { id: novoUsuario.id },
        data: { refreshToken },
      });

      res.status(201).json({
        usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email },
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body;

      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        throw new AppError("E-mail ou senha inválidos", 401);
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        throw new AppError("E-mail ou senha inválidos", 401);
      }

      const token = gerarAccessToken(usuario);
      const refreshToken = gerarRefreshToken(usuario.id);

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { refreshToken },
      });

      res.status(200).json({
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async perfil(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = req.usuario?.sub;

      if (!usuarioId) {
        throw new AppError("Usuário não autenticado", 401);
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        select: {
          id: true,
          nome: true,
          email: true,
          criadoEm: true,
        },
      });

      if (!usuario) {
        throw new AppError("Usuário não encontrado", 404);
      }

      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError("Refresh token não fornecido", 401);
      }

      const decoded = jwt.verify(refreshToken, config.jwtSecret) as { sub: string };
      const usuarioId = decoded.sub;

      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
      });

      if (!usuario || usuario.refreshToken !== refreshToken) {
        throw new AppError("Refresh token inválido", 401);
      }

      const novoAccessToken = gerarAccessToken(usuario);
      const novoRefreshToken = gerarRefreshToken(usuario.id);

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { refreshToken: novoRefreshToken },
      });

      res.status(200).json({
        token: novoAccessToken,
        refreshToken: novoRefreshToken,
      });
    } catch (error) {
      next(new AppError("Refresh token inválido ou expirado", 401));
    }
  }
}
