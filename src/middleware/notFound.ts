import { Request, Response, NextFunction } from "express"

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  })
}

export default notFound
