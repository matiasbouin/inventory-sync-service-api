import express from 'express';
import { setupSwagger } from './docs/swagger';
import { inventoryRouter } from './routes/inventory';
import { PrismaClient } from '@prisma/client';
import { PrismaInventoryRepo } from './repositories/inventoryRepo';
import { PrismaSyncLogRepo } from './repositories/syncLogRepo';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

const prisma = new PrismaClient();
const inventoryRepo = new PrismaInventoryRepo(prisma);
const syncLogRepo = new PrismaSyncLogRepo(prisma);

app.use(
  '/inventory',
  inventoryRouter({ inventory: inventoryRepo, syncLog: syncLogRepo })
);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Inventory Sync Service API 🚀',
    docs: `http://localhost:${PORT}/docs`,
    health: `http://localhost:${PORT}/health`,
  });
});

setupSwagger(app, PORT);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});
