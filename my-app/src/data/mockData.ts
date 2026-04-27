// ProEstoque — Mock Data
// Seção 3: Dados simulados de estoque

import type { StatusEstoque, Categoria, Produto, CardResumo, Usuario } from '../types';

// Re-exporta os tipos para não quebrar imports existentes
export type { StatusEstoque, Categoria, Produto, CardResumo, Usuario };

// ─────────────────────────────────────────────
// Helper: status do produto
// ─────────────────────────────────────────────

export function getStatusEstoque(produto: Produto): StatusEstoque {
  if (produto.quantidade === 0) return 'sem_estoque';
  if (produto.quantidade <= produto.estoqueMinimo) return 'baixo';
  return 'normal';
}

// ─────────────────────────────────────────────
// Dados mock — pelo menos 8 produtos
// ─────────────────────────────────────────────

export const PRODUTOS_MOCK: Produto[] = [
  {
    id: '1',
    nome: 'Café Especial 250g',
    categoria: 'Bebidas',
    quantidade: 4,
    estoqueMinimo: 10,
    unidade: 'un',
    preco: 28.9,
    emoji: '☕',
  },
  {
    id: '2',
    nome: 'Água Mineral 600ml',
    categoria: 'Bebidas',
    quantidade: 48,
    estoqueMinimo: 20,
    unidade: 'un',
    preco: 2.5,
    emoji: '💧',
  },
  {
    id: '3',
    nome: 'Suco de Laranja',
    categoria: 'Bebidas',
    quantidade: 8,
    estoqueMinimo: 12,
    unidade: 'un',
    preco: 7.9,
    emoji: '🍊',
  },
  {
    id: '4',
    nome: 'Arroz Branco 5kg',
    categoria: 'Alimentos',
    quantidade: 15,
    estoqueMinimo: 10,
    unidade: 'cx',
    preco: 24.5,
    emoji: '🍚',
  },
  {
    id: '5',
    nome: 'Feijão Carioca',
    categoria: 'Alimentos',
    quantidade: 3,
    estoqueMinimo: 8,
    unidade: 'cx',
    preco: 9.9,
    emoji: '🫘',
  },
  {
    id: '6',
    nome: 'Canela Caligráfica',
    categoria: 'Alimentos',
    quantidade: 1,
    estoqueMinimo: 5,
    unidade: 'un',
    preco: 5.5,
    emoji: '🌿',
  },
  {
    id: '7',
    nome: 'Sabão em Pó 3kg',
    categoria: 'Limpeza',
    quantidade: 0,
    estoqueMinimo: 4,
    unidade: 'un',
    preco: 19.9,
    emoji: '🧺',
  },
  {
    id: '8',
    nome: 'Detergente 500ml',
    categoria: 'Limpeza',
    quantidade: 12,
    estoqueMinimo: 8,
    unidade: 'un',
    preco: 3.2,
    emoji: '🫧',
  },
  {
    id: '9',
    nome: 'Shampoo 350ml',
    categoria: 'Higiene',
    quantidade: 2,
    estoqueMinimo: 6,
    unidade: 'un',
    preco: 14.9,
    emoji: '🧴',
  },
  {
    id: '10',
    nome: 'Papel Higiênico 12un',
    categoria: 'Higiene',
    quantidade: 20,
    estoqueMinimo: 10,
    unidade: 'pct',
    preco: 18.0,
    emoji: '🧻',
  },
];

// ─────────────────────────────────────────────
// Categorias disponíveis (derivadas dos produtos)
// ─────────────────────────────────────────────

export const CATEGORIAS: Categoria[] = [
  'Bebidas',
  'Alimentos',
  'Limpeza',
  'Higiene',
  'Eletrônicos',
  'Outros',
];

// ─────────────────────────────────────────────
// Dados do usuário logado (mock)
// ─────────────────────────────────────────────

export const USUARIO_MOCK: Usuario = {
  nome: 'João',
  email: 'joao@proestoque.com',
};

