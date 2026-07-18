import path from 'node:path';
import fs from 'node:fs';
import { defineConfig } from '@prisma/config';


export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    async adapter() {
      const { PrismaPg } = await import('@prisma/adapter-pg');
      return new PrismaPg({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: true,
          ca: fs.readFileSync(path.join(process.cwd(), 'ca.pem')).toString(),
        },
      });
    },
  },
});