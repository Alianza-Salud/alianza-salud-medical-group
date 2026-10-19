function createRateLimit({ windowMs, max, message }) {
  const requests = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const current = requests.get(key);
    const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
    entry.count += 1;
    requests.set(key, entry);
    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    res.setHeader('RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));
    if (entry.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ success: false, error: { message: message || 'Demasiadas solicitudes. Intente nuevamente más tarde.', status: 429 } });
    }
    if (requests.size > 10000) {
      for (const [storedKey, value] of requests) if (value.resetAt <= now) requests.delete(storedKey);
    }
    next();
  };
}

const authRateLimit = createRateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const registerRateLimit = createRateLimit({ windowMs: 30 * 60 * 1000, max: 5 });
const publicFormRateLimit = createRateLimit({ windowMs: 60 * 60 * 1000, max: 25 });
module.exports = { createRateLimit, authRateLimit, registerRateLimit, publicFormRateLimit };
