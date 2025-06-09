const localLogger = true

export function logger(req, res, next) {
    if (localLogger) {
        console.log('Request URL:', req.originalUrl);
        console.log('Request Method:', req.method);
        console.log(req.params);
    }
    next();
}
