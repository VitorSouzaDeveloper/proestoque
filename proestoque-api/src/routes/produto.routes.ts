import { Router } from 'express';
import produtoController from '../controllers/produto.controller';

const produtoRoutes = Router();

produtoRoutes.get('/', produtoController.listar);
produtoRoutes.get('/:id', produtoController.buscarPorId);
produtoRoutes.post('/', produtoController.criar);
produtoRoutes.put('/:id', produtoController.atualizar);
produtoRoutes.delete('/:id', produtoController.deletar);

// Movimentações
produtoRoutes.post('/:id/movimentacao', produtoController.registrarMovimentacao);
produtoRoutes.get('/:id/movimentacoes', produtoController.listarMovimentacoes);

export { produtoRoutes };
