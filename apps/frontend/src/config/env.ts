const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error('A variável de ambiente VITE_API_URL é obrigatória.');
}

export const env = {
  apiUrl,
} as const;
