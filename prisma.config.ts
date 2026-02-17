import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Aquí es donde Migrate buscará la base de datos
    url: process.env.DATABASE_URL,
  },
});