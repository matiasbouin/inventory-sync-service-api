import { Router } from 'express';
import { makeGetInventory, makePostSync } from '../controllers/inventoryController.js';
import { validateSku } from '../middleware/validateSku.js';
import { syncLimiter } from '../middleware/rateLimit.js';
import { SyncService } from '../services/syncService.js';
import type { IInventoryRepo } from '../repositories/inventoryRepo.js';
import type { ISyncLogRepo } from '../repositories/syncLogRepo.js';


export function inventoryRouter(repos: { inventory: IInventoryRepo; syncLog: ISyncLogRepo }) {
    const router = Router();
    const syncService = new SyncService(repos.inventory, repos.syncLog);

    /**
     * @openapi
     * /inventory/{sku}:
     *   get:
     *     summary: Retrieve inventory information for a specific SKU
     *     tags:
     *       - Inventory
     *     parameters:
     *       - in: path
     *         name: sku
     *         required: true
     *         schema:
     *           type: string
     *         description: Stock Keeping Unit
     *     responses:
     *       200:
     *         description: Inventory item found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 sku:
     *                   type: string
     *                 quantity:
     *                   type: integer
     *                 location:
     *                   type: string
     *                 lastUpdated:
     *                   type: string
     *                   format: date-time
     *       400:
     *         description: Invalid SKU format
     *       404:
     *         description: SKU not found
     */
    router.get('/:sku', validateSku, makeGetInventory(repos.inventory));

    /**
     * @openapi
     * /inventory/sync:
     *   post:
     *     summary: Trigger a sync operation from external warehouse system
     *     tags:
     *       - Inventory
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               provider:
     *                 type: string
     *               skuList:
     *                 type: array
     *                 items:
     *                   type: string
     *     responses:
     *       200:
     *         description: Sync completed
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 synced:
     *                   type: integer
     *                 errors:
     *                   type: array
     *                   items:
     *                     type: string
     *                 timestamp:
     *                   type: string
     *                   format: date-time
     *       500:
     *         description: External system failure
     */
    router.post('/sync', syncLimiter, makePostSync(syncService));

    return router;
}
