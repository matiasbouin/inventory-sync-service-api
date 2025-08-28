import { PrismaClient, InventoryItem } from '@prisma/client';

const prisma = new PrismaClient();


export interface IInventoryRepo {
    getBySku(sku: string): Promise<InventoryItem | null>;
    upsert(item: InventoryItem): Promise<void>;
}


export class PrismaInventoryRepo implements IInventoryRepo {
    constructor(private prisma: PrismaClient) { }
    async getBySku(sku: string) {
        return this.prisma.inventoryItem.findUnique({ where: { sku } });
    }
    async upsert(item: InventoryItem) {
        await this.prisma.inventoryItem.upsert({
            where: { sku: item.sku },
            update: {
                quantity: item.quantity,
                location: item.location,
                lastUpdated: item.lastUpdated,
            },
            create: item,
        });
    }
}


// In-memory repo for tests
export class InMemoryInventoryRepo implements IInventoryRepo {
    private store = new Map<string, InventoryItem>();
    async getBySku(sku: string) {
        return this.store.get(sku) ?? null;
    }
    async upsert(item: InventoryItem) {
        this.store.set(item.sku, item);
    }
}