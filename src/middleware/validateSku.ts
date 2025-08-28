import type { RequestHandler } from 'express';


const skuRegex = /^[A-Z0-9-]+$/i;


export const validateSku: RequestHandler = (req, res, next) => {
    const { sku } = req.params;
    if (!sku || !skuRegex.test(sku)) {
        return res.status(400).json({ error: 'Invalid SKU format' });
    }
    next();
};