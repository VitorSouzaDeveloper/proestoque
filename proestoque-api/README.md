# ⚙️ ProEstoque - API Backend

Esta é a API RESTful do sistema **ProEstoque**, desenvolvida com **Node.js**, **Express**, **Prisma ORM** e **SQLite**.

Para ver a documentação completa do projeto (incluindo o aplicativo mobile, modelo ERD completo e arquitetura), acesse o [README principal do projeto](../README.md).

## 🚀 Como Executar a API

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente no arquivo `.env`:
   ```env
   PORT=3333
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="sua_chave_secreta"
   JWT_EXPIRES_IN="5s"
   JWT_REFRESH_EXPIRES_IN="30d"
   ```

3. Execute as migrações do Prisma e popule o banco (Seed):
   ```bash
   npx prisma db push
   npm run seed
   ```

4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   *Servidor rodando em `http://localhost:3333`*
