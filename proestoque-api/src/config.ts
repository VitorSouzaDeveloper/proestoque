// Centraliza e valida as variáveis de ambiente na inicialização
// Se uma variável obrigatória não existir, o servidor cai com mensagem clara

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variável de ambiente faltando: ${key}`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || "3333", 10),
  jwtSecret: getEnvVar("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
};
