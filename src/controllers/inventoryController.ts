import type { RequestHandler } from 'express';
import { z } from 'zod';
import { SyncService } from '../services/syncService.js';
import type { IInventoryRepo } from '../repositories/inventoryRepo.js';


const syncBody = z.object({
    provider: z.string().min(1),
    skuList: z.string().regex(/^[A-Z0-9-]+$/i).array().optional(),
});


export const makeGetInventory = (repo: IInventoryRepo): RequestHandler => async (req, res, next) => {
    try {
        const sku = req.params.sku;
        const item = await repo.getBySku(sku);
        if (!item) return res.status(404).json({ error: 'SKU not found' });
        return res.json({
            sku: item.sku,
            quantity: item.quantity,
            location: item.location,
            lastUpdated: item.lastUpdated.toISOString(),
        });
    } catch (e) { next(e); }
};


export const makePostSync = (sync: SyncService): RequestHandler => async (req, res, next) => {
    try {
        const body = syncBody.parse(req.body ?? {});
        const result = await sync.run(body.provider, body.skuList);
        res.json(result);
    } catch (e: any) {
        if (e?.name === 'ZodError') {
            return res.status(400).json({ error: e.issues.map((i: any) => i.message).join(', ') });
        }
        next(e);
    }
};