import request from 'supertest';
import express from 'express';
import { makeGetInventory } from '../src/controllers/inventoryController';
import { InMemoryInventoryRepo } from '../src/repositories/inventoryRepo';
import { validateSku } from '../src/middleware/validateSku';


function buildTestApp() {
    const app = express();
    app.use(express.json());
    const repo = new InMemoryInventoryRepo();
    // seed
    repo.upsert({ sku: 'ABC-1234', quantity: 35, location: 'Warehouse-A', lastUpdated: new Date('2025-08-01T12:00:00Z') });


    app.get('/inventory/:sku', validateSku, makeGetInventory(repo));
    return app;
}


describe('GET /inventory/:sku', () => {
    const app = buildTestApp();


    it('returns 200 and item when SKU exists', async () => {
        const res = await request(app).get('/inventory/ABC-1234');
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ sku: 'ABC-1234', quantity: 35, location: 'Warehouse-A' });
        expect(typeof res.body.lastUpdated).toBe('string');
    });


    it('returns 404 when SKU does not exist', async () => {
        const res = await request(app).get('/inventory/NOPE-0000');
        expect(res.status).toBe(404);
    });


    it('validates SKU format', async () => {
        const res = await request(app).get('/inventory/@@bad');
        expect(res.status).toBe(400);
    });
});