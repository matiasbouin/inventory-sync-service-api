import rateLimit from 'express-rate-limit';


export const syncLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many sync requests, please try again later.' },
});