import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { AppError } from '../middlewares/errorHandler';

class CategoriaController {
  async listar(req: Request, res: Response) {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nome: 'asc' }
    });
    return res.json(categorias);
  }

  async buscarPorId(req: Request, res: Response) {
    const id = req.params.id as string;
    
    const categoria = await prisma.categoria.findUnique({
      where: { id }
    });

    if (!categoria) {
      throw new AppError('Categoria não encontrada', 404);
    }

    return res.json(categoria);
  }
}

export default new CategoriaController();
