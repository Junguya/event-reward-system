import { HttpException } from '@nestjs/common';

export function handleAxiosError(error: any): never {
  if (error.isAxiosError && error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data || 'Axios Error';
    throw new HttpException(message, status);
  }
  throw error;
}
