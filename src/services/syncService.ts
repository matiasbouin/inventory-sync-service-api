import { IInventoryRepo } from '../repositories/inventoryRepo.js';
import { ISyncLogRepo } from '../repositories/syncLogRepo.js';
import { WmsClient } from './wmsClient.js';


export class SyncService {
    constructor(
        private inventoryRepo: IInventoryRepo,
        private syncLogRepo: ISyncLogRepo,
        private wmsClient = new WmsClient()
    ) { }


    async run(provider: string, skuList?: string[]) {
        const startedAt = new Date();
        try {
            const resp = await this.wmsClient.fetch(provider, skuList);
            const errors: string[] = [];
            let synced = 0;
            for (const i of resp.items) {
                try {
                    await this.inventoryRepo.upsert({
                        sku: i.sku,
                        quantity: i.quantity,
                        location: i.location,
                        lastUpdated: new Date(i.lastUpdated),
                    });
                    synced++;
                } catch (e: any) {
                    errors.push(`${i.sku}: ${e.message}`);
                }
            }
            const finishedAt = new Date();
            await this.syncLogRepo.create({
                provider,
                skuList: skuList ?? [],
                synced,
                errors,
                status: errors.length ? 'partial' : 'success',
                startedAt,
                finishedAt,
            });
            return { synced, errors, timestamp: finishedAt.toISOString() };
        } catch (e: any) {
            const finishedAt = new Date();
            await this.syncLogRepo.create({
                provider,
                skuList: skuList ?? [],
                synced: 0,
                errors: [e.message],
                status: 'failed',
                startedAt,
                finishedAt,
            });
            const error: any = new Error('External data failure');
            error.status = 500;
            throw error;
        }
    }
}