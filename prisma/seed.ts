import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


async function main() {
    await prisma.inventoryItem.upsert({
        where: { sku: 'ABC-1234' },
        update: { quantity: 35, location: 'Warehouse-A', lastUpdated: new Date('2025-08-01T12:00:00Z') },
        create: { sku: 'ABC-1234', quantity: 35, location: 'Warehouse-A', lastUpdated: new Date('2025-08-01T12:00:00Z') },
    });
    await prisma.inventoryItem.upsert({
        where: { sku: 'XYZ-5678' },
        update: { quantity: 10, location: 'Warehouse-B', lastUpdated: new Date('2025-08-01T11:00:00Z') },
        create: { sku: 'XYZ-5678', quantity: 10, location: 'Warehouse-B', lastUpdated: new Date('2025-08-01T11:00:00Z') },
    });
}


main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });