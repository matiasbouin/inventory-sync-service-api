import fs from 'fs/promises';


export type WmsItem = { sku: string; quantity: number; location: string; lastUpdated: string };
export type WmsResponse = { provider: string; items: WmsItem[] };


function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }


export class WmsClient {
    constructor(private options: { failRate?: number } = {}) { }


    private maybeFail() {
        const p = this.options.failRate ?? Number(process.env.WMS_FAIL_RATE ?? 0);
        if (p > 0 && Math.random() < p) {
            throw new Error('Simulated WMS outage');
        }
    }


    async fetch(provider: string, skuList?: string[], attempt = 1): Promise<WmsResponse> {
        try {
            this.maybeFail();
            const raw = await fs.readFile(`data/${provider}.json`, 'utf-8');
            const json = JSON.parse(raw) as WmsResponse;
            const items = skuList && skuList.length > 0
                ? json.items.filter(i => skuList.includes(i.sku))
                : json.items;
            return { provider: json.provider, items };
        } catch (err) {
            // Retry with exponential backoff: 200ms * 2^(attempt-1)
            if (attempt < 3) {
                const delay = 200 * 2 ** (attempt - 1);
                await sleep(delay);
                return this.fetch(provider, skuList, attempt + 1);
            }
            throw err;
        }
    }
}