const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;

    console.error(`[${statusCode} ERROR] ${err.name}: ${err.message}`);

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || "An unexpected error occurred.",
        // good to implement \/
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default errorHandler;
