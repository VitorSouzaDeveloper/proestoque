import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { AppError } from '../middlewares/errorHandler';

class ProdutoController {
  async listar(req: Request, res: Response) {
    const produtos = await prisma.produto.findMany({
      include: { categoria: true },
      orderBy: { nome: 'asc' }
    });
    return res.json(produtos);
  }

  async buscarPorId(req: Request, res: Response) {
    const id = req.params.id as string;
    
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: { categoria: true }
    });

    if (!produto) {
      throw new AppError('Produto não encontrado', 404);
    }

    return res.json(produto);
  }

  async criar(req: Request, res: Response) {
    const { nome, quantidade, categoriaId, quantidadeMinima, preco, unidade, foto, emoji } = req.body;

    if (!nome || !categoriaId) {
      throw new AppError('Nome e categoria são obrigatórios', 400);
    }

    const categoriaExiste = await prisma.categoria.findUnique({ where: { id: categoriaId } });
    if (!categoriaExiste) {
      throw new AppError('Categoria não encontrada', 404);
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        quantidade: quantidade || 0,
        quantidadeMinima: quantidadeMinima || 0,
        preco: preco || 0,
        unidade: unidade || 'un',
        foto,
        emoji,
        categoriaId
      },
      include: { categoria: true }
    });

    return res.status(201).json(produto);
  }

  async atualizar(req: Request, res: Response) {
    const id = req.params.id as string;
    const { nome, quantidade, categoriaId, quantidadeMinima, preco, unidade, foto, emoji } = req.body;

    const produtoExiste = await prisma.produto.findUnique({ where: { id } });
    if (!produtoExiste) {
      throw new AppError('Produto não encontrado', 404);
    }

    if (categoriaId) {
      const categoriaExiste = await prisma.categoria.findUnique({ where: { id: categoriaId } });
      if (!categoriaExiste) {
        throw new AppError('Categoria não encontrada', 404);
      }
    }

    const produto = await prisma.produto.update({
      where: { id },
      data: { nome, quantidade, categoriaId, quantidadeMinima, preco, unidade, foto, emoji },
      include: { categoria: true }
    });

    return res.json(produto);
  }

  async deletar(req: Request, res: Response) {
    const id = req.params.id as string;

    const produtoExiste = await prisma.produto.findUnique({ where: { id } });
    if (!produtoExiste) {
      throw new AppError('Produto não encontrado', 404);
    }

    await prisma.produto.delete({ where: { id } });

    return res.status(204).send();
  }

  // Feature extra: Movimentações
  async registrarMovimentacao(req: Request, res: Response) {
    const id = req.params.id as string;
    const { tipo, quantidade, observacao } = req.body;

    if (!tipo || !quantidade || quantidade <= 0) {
      throw new AppError('Tipo e quantidade são obrigatórios e quantidade deve ser maior que 0', 400);
    }

    if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
      throw new AppError('Tipo deve ser ENTRADA ou SAIDA', 400);
    }

    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      throw new AppError('Produto não encontrado', 404);
    }

    if (tipo === 'SAIDA' && produto.quantidade < quantidade) {
      throw new AppError('Quantidade insuficiente em estoque', 400);
    }

    const novaQuantidade = tipo === 'ENTRADA' 
      ? produto.quantidade + quantidade 
      : produto.quantidade - quantidade;

    // Atualiza a quantidade do produto e cria a movimentação atomicamente
    const result = await prisma.$transaction([
      prisma.produto.update({
        where: { id },
        data: { quantidade: novaQuantidade }
      }),
      prisma.movimentacao.create({
        data: {
          tipo,
          quantidade,
          observacao,
          produtoId: id
        }
      })
    ]);

    return res.status(201).json({
      produto: result[0],
      movimentacao: result[1]
    });
  }

  async listarMovimentacoes(req: Request, res: Response) {
    const id = req.params.id as string;

    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      throw new AppError('Produto não encontrado', 404);
    }

    const movimentacoes = await prisma.movimentacao.findMany({
      where: { produtoId: id },
      orderBy: { criadoEm: 'desc' }
    });

    return res.json(movimentacoes);
  }
}

export default new ProdutoController();
