import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Produto } from '../types';
import { notificarEstoqueCritico } from '../services/notifications';

type State = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Produto[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string };

interface ProductsContextType {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  carregarProdutos: () => Promise<void>;
  adicionarProduto: (produtoData: any) => Promise<void>;
  editarProduto: (id: string, produtoData: any) => Promise<void>;
  excluirProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
}

function productsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, produtos: action.payload, isLoading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD':
      return { ...state, produtos: [action.payload, ...state.produtos] };
    case 'UPDATE':
      return {
        ...state,
        produtos: state.produtos.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE':
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, {
    produtos: [],
    isLoading: true,
    error: null,
  });

  const carregarProdutos = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const response = await api.get('/produtos');
      dispatch({ type: 'LOAD_SUCCESS', payload: response.data });
      
      const criticos = response.data.filter((p: Produto) => p.quantidade < p.quantidadeMinima);
      if (criticos.length > 0) {
        notificarEstoqueCritico(criticos);
      }
    } catch (error: any) {
      dispatch({ type: 'LOAD_ERROR', payload: error.message || 'Erro ao carregar produtos' });
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const adicionarProduto = async (produtoData: any) => {
    const response = await api.post('/produtos', produtoData);
    dispatch({ type: 'ADD', payload: response.data });
  };

  const editarProduto = async (id: string, produtoData: any) => {
    const response = await api.put(`/produtos/${id}`, produtoData);
    dispatch({ type: 'UPDATE', payload: response.data });
  };

  const excluirProduto = async (id: string) => {
    await api.delete(`/produtos/${id}`);
    dispatch({ type: 'DELETE', payload: id });
  };

  const getProdutoById = (id: string) => {
    return state.produtos.find((p) => p.id === id);
  };

  return (
    <ProductsContext.Provider
      value={{
        produtos: state.produtos,
        isLoading: state.isLoading,
        error: state.error,
        carregarProdutos,
        adicionarProduto,
        editarProduto,
        excluirProduto,
        getProdutoById,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts(): ProductsContextType {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts() deve ser usado dentro de um <ProductsProvider>.');
  }
  return context;
}
