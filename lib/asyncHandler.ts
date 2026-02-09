/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'

/**
 * Wraps an async route handler to ensure errors are properly passed to Express error middleware.
 * This eliminates the need for try/catch blocks in every async route handler.
 *
 * Usage:
 *   import { asyncHandler } from '../lib/asyncHandler'
 *
 *   export function myRoute() {
 *     return asyncHandler(async (req: Request, res: Response) => {
 *       const data = await someAsyncOperation()
 *       res.json(data)
 *     })
 *   }
 *
 * @param fn - The async request handler function to wrap
 * @returns A request handler that catches any errors and forwards them to next()
 */
export function asyncHandler (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Creates an async handler that returns a factory function (matching common Juice Shop patterns).
 * Use this when the route handler needs to be called as a function (e.g., login())
 *
 * Usage:
 *   import { asyncHandlerFactory } from '../lib/asyncHandler'
 *
 *   export const myRoute = asyncHandlerFactory(async (req: Request, res: Response) => {
 *     const data = await someAsyncOperation()
 *     res.json(data)
 *   })
 *
 * @param fn - The async request handler function to wrap
 * @returns A factory function that returns the wrapped handler
 */
export function asyncHandlerFactory (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
): () => RequestHandler {
  return () => asyncHandler(fn)
}
