import { Router } from 'express';
import { authRouter } from './auth.routes';
import { categoriaRoutes } from './categoria.routes';
import { produtoRoutes } from './produto.routes';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/categorias', categoriaRoutes);
routes.use('/produtos', produtoRoutes);

export { routes };
