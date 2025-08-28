import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaInventoryRepo } from './repositories/inventoryRepo.js';
import { PrismaSyncLogRepo } from './repositories/syncLogRepo.js';
import { inventoryRouter } from './routes/inventory.js';
import { httpLogger } from './logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSwagger } from './docs/swagger.js';


export function createApp() {
    const app = express();
    const prisma = new PrismaClient();
    const repos = {
        inventory: new PrismaInventoryRepo(prisma),
        syncLog: new PrismaSyncLogRepo(prisma),
    };


    app.use(httpLogger);
    app.use(express.json());


    app.use(inventoryRouter(repos));
    setupSwagger(app);


    app.use(errorHandler);
    return app;
}