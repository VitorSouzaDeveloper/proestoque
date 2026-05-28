import { Router } from 'express';
import { categoriaRoutes } from './categoria.routes';
import { produtoRoutes } from './produto.routes';

const routes = Router();

routes.use('/categorias', categoriaRoutes);
routes.use('/produtos', produtoRoutes);

export { routes };
