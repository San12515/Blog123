export function withMulter(handler, multerMiddleware) {
  return async (req, res) => {
    return new Promise((resolve, reject) => {
      multerMiddleware(req, res, async (err) => {
        if (err) {
          console.error("Multer error:", err);
          return reject(err);
        }
        try {
          const response = await handler(req, res);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });
  };
}
