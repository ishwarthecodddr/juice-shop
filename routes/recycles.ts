/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response } from 'express'
import { RecycleModel } from '../models/recycle'
import { asyncHandler } from '../lib/asyncHandler'

import * as utils from '../lib/utils'

export const getRecycleItem = () => asyncHandler(async (req: Request, res: Response) => {
  const Recycle = await RecycleModel.findAll({
    where: {
      id: JSON.parse(req.params.id)
    }
  })
  res.send(utils.queryResultToJson(Recycle))
})

export const blockRecycleItems = () => (req: Request, res: Response) => {
  const errMsg = { err: 'Sorry, this endpoint is not supported.' }
  return res.send(utils.queryResultToJson(errMsg))
}
