import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: process.env.DB_TYPE as any,
        host: process.env.DB_HOST as any,
        port: process.env.DB_POST as any,
        username: process.env.DB_USER as any,
        password: process.env.DB_PASSWORD as any,
        database: process.env.DB_NAME as any,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
  },
];
