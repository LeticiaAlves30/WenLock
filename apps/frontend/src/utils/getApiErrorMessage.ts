import axios from 'axios';

type ApiErrorResponse = {
  message?: string | string[];
};

const DEFAULT_ERROR_MESSAGE = 'Não foi possível concluir a solicitação. Tente novamente.';

export function getApiErrorMessage(error: unknown, fallbackMessage = DEFAULT_ERROR_MESSAGE): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  if ((error.response?.status ?? 500) >= 500) {
    return fallbackMessage;
  }

  const { message } = error.response?.data ?? {};

  if (Array.isArray(message)) {
    return message[0] ?? fallbackMessage;
  }

  return typeof message === 'string' ? message : fallbackMessage;
}

export function hasApiErrorStatus(error: unknown, status: number): boolean {
  return axios.isAxiosError(error) && error.response?.status === status;
}
