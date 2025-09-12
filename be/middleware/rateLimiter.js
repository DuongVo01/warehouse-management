// Simple rate limiter middleware
const rateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    if (requests.has(ip)) {
      const userRequests = requests.get(ip).filter(time => time > windowStart);
      requests.set(ip, userRequests);
    }

    // Get current requests for this IP
    const currentRequests = requests.get(ip) || [];

    if (currentRequests.length >= max) {
      return res.status(429).json({
        success: false,
        message: 'Quá nhiều yêu cầu, vui lòng thử lại sau'
      });
    }

    // Add current request
    currentRequests.push(now);
    requests.set(ip, currentRequests);

    next();
  };
};

module.exports = rateLimiter;