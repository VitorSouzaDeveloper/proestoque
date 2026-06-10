import { z } from 'zod';

export const produtoSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  categoriaId: z.string().min(1, 'Selecione uma categoria'),
  quantidade: z.number({ message: 'A quantidade deve ser um número' })
    .min(0, 'A quantidade não pode ser negativa'),
  quantidadeMinima: z.number({ message: 'O estoque mínimo deve ser um número' })
    .min(0, 'O estoque mínimo não pode ser negativo'),
  unidade: z.string().min(1, 'A unidade é obrigatória'),
  preco: z.number({ message: 'O preço deve ser um número' })
    .min(0, 'O preço não pode ser negativo'),
  emoji: z.string().min(1, 'O emoji é obrigatório').optional(),
  foto: z.string().optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
