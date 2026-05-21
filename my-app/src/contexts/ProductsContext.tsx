import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto } from '../types';
import { PRODUTOS_MOCK } from '../data/mockData';

// ─────────────────────────────────────────────
// Chaves do AsyncStorage
// ─────────────────────────────────────────────
const STORAGE_KEYS = {
  PRODUTOS: '@proestoque:produtos',
};

// ─────────────────────────────────────────────
// Tipos do Estado e Ações
// ─────────────────────────────────────────────
type State = {
  produtos: Produto[];
  isLoading: boolean;
};

type Action =
  | { type: 'LOAD'; payload: Produto[] }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string }; // ID do produto

interface ProductsContextType {
  produtos: Produto[];
  isLoading: boolean;
  adicionarProduto: (produtoData: Omit<Produto, 'id'>) => void;
  editarProduto: (id: string, produtoData: Partial<Produto>) => void;
  excluirProduto: (id: string) => void;
}

// ─────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────
function productsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        produtos: action.payload,
        isLoading: false,
      };
    case 'ADD':
      return {
        ...state,
        produtos: [action.payload, ...state.produtos],
      };
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

// ─────────────────────────────────────────────
// Contexto
// ─────────────────────────────────────────────
const ProductsContext = createContext<ProductsContextType | null>(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, {
    produtos: [],
    isLoading: true,
  });

  // Carrega produtos do AsyncStorage na inicialização
  useEffect(() => {
    async function loadStoredProducts() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.PRODUTOS);
        if (stored) {
          dispatch({ type: 'LOAD', payload: JSON.parse(stored) });
        } else {
          // Se não houver produtos salvos, inicializa com os mocks e salva no disco
          await AsyncStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(PRODUTOS_MOCK));
          dispatch({ type: 'LOAD', payload: PRODUTOS_MOCK });
        }
      } catch (error) {
        console.error('Erro ao carregar produtos do AsyncStorage:', error);
        // Fallback para mock em caso de erro
        dispatch({ type: 'LOAD', payload: PRODUTOS_MOCK });
      }
    }

    loadStoredProducts();
  }, []);

  // Salva no AsyncStorage sempre que a lista de produtos mudar (e após o carregamento inicial)
  useEffect(() => {
    async function saveProducts() {
      if (state.isLoading) return;
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(state.produtos));
      } catch (error) {
        console.error('Erro ao salvar produtos no AsyncStorage:', error);
      }
    }

    saveProducts();
  }, [state.produtos, state.isLoading]);

  // Ações expostas pelo context
  const adicionarProduto = (produtoData: Omit<Produto, 'id'>) => {
    const novoProduto: Produto = {
      ...produtoData,
      id: Date.now().toString(), // Gera ID baseado em timestamp
    };
    dispatch({ type: 'ADD', payload: novoProduto });
  };

  const editarProduto = (id: string, produtoData: Partial<Produto>) => {
    const produtoExistente = state.produtos.find((p) => p.id === id);
    if (!produtoExistente) return;

    const produtoAtualizado: Produto = {
      ...produtoExistente,
      ...produtoData,
      id, // Garante que o ID não mude
    };
    dispatch({ type: 'UPDATE', payload: produtoAtualizado });
  };

  const excluirProduto = (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  return (
    <ProductsContext.Provider
      value={{
        produtos: state.produtos,
        isLoading: state.isLoading,
        adicionarProduto,
        editarProduto,
        excluirProduto,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook Customizado
// ─────────────────────────────────────────────
export function useProducts(): ProductsContextType {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error(
      'useProducts() deve ser usado dentro de um <ProductsProvider>. ' +
      'Verifique se o Provider envolve o componente no _layout.tsx.'
    );
  }
  return context;
}
