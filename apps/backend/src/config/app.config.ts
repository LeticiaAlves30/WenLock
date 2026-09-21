import { registerAs } from '@nestjs/config';

const DEFAULT_PORT = 3000;
const DEFAULT_WEB_ORIGIN = 'http://localhost:5173';

export const appConfig = registerAs('app', () => ({
  port: Number.parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10),
  webOrigin: process.env.WEB_ORIGIN ?? DEFAULT_WEB_ORIGIN,
}));
