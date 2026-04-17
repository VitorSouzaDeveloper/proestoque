import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Tarefa {
  id: string;
  titulo: string;
  feita: boolean;
}

interface TarefasContextData {
  tarefas: Tarefa[];
  adicionarTarefa: (titulo: string) => void;
  toggleTarefa: (id: string) => void;
  deletarTarefa: (id: string) => void;
}

const TarefasContext = createContext<TarefasContextData>({} as TarefasContextData);

export function TarefasProvider({ children }: { children: ReactNode }) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    { id: '1', titulo: 'Estudar React Native', feita: false },
    { id: '2', titulo: 'Criar o projeto GerenciaTask', feita: true },
    { id: '3', titulo: 'Aprender Expo Router', feita: false },
  ]);

  function adicionarTarefa(titulo: string) {
    const novaTarefa: Tarefa = {
      id: Date.now().toString(),
      titulo,
      feita: false,
    };
    setTarefas((prev) => [novaTarefa, ...prev]);
  }

  function toggleTarefa(id: string) {
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t))
    );
  }

  function deletarTarefa(id: string) {
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <TarefasContext.Provider value={{ tarefas, adicionarTarefa, toggleTarefa, deletarTarefa }}>
      {children}
    </TarefasContext.Provider>
  );
}

export function useTarefas() {
  const context = useContext(TarefasContext);
  if (!context) {
    throw new Error('useTarefas deve ser usado dentro de TarefasProvider');
  }
  return context;
}
