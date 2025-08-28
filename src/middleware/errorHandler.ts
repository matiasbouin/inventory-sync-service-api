import type { ErrorRequestHandler } from 'express';


export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const status = (err as any).status || 500;
    const message = err.message || 'Internal Server Error';
    if (status >= 500) {
        return res.status(status).json({ error: 'Internal Server Error' });
    }
    return res.status(status).json({ error: message });
};