import { useState, useEffect } from "react";
import { api } from "@/src/services/api";

export type Categoria = {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  _count?: { produtos: number };
};

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategorias() {
      try {
        setIsLoading(true);
        const response = await api.get("/categorias");
        setCategorias(response.data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar categorias");
      } finally {
        setIsLoading(false);
      }
    }

    loadCategorias();
  }, []);

  return { categorias, isLoading, error };
}
