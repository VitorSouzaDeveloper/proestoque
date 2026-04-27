// ProEstoque — Tipo: Produto

import type { Categoria } from './categoria';

export type StatusEstoque = 'normal' | 'baixo' | 'sem_estoque';

export interface Produto {
  id: string;
  nome: string;
  categoria: Categoria;
  quantidade: number;
  estoqueMinimo: number;
  unidade: string; // ex: "un", "cx", "kg", "L"
  preco: number;   // preço unitário em R$
  emoji: string;
}
