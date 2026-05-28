import { Router } from 'express';
import categoriaController from '../controllers/categoria.controller';

const categoriaRoutes = Router();

categoriaRoutes.get('/', categoriaController.listar);
categoriaRoutes.get('/:id', categoriaController.buscarPorId);

export { categoriaRoutes };
