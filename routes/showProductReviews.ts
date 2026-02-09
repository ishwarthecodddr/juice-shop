/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response } from 'express'

import * as challengeUtils from '../lib/challengeUtils'
import { challenges } from '../data/datacache'
import * as security from '../lib/insecurity'
import { type Review } from 'data/types'
import * as db from '../data/mongodb'
import * as utils from '../lib/utils'
import { asyncHandler } from '../lib/asyncHandler'

// Blocking sleep function as in native MongoDB
// @ts-expect-error FIXME Type safety broken for global object
global.sleep = (time: number) => {
  // Ensure that users don't accidentally dos their servers for too long
  if (time > 2000) {
    time = 2000
  }
  const stop = new Date().getTime()
  while (new Date().getTime() < stop + time) {
    ;
  }
}

export function showProductReviews () {
  return asyncHandler(async (req: Request, res: Response) => {
    // Truncate id to avoid unintentional RCE
    const id = !utils.isChallengeEnabled(challenges.noSqlCommandChallenge) ? Number(req.params.id) : utils.trunc(req.params.id, 40)

    // Measure how long the query takes, to check if there was a nosql dos attack
    const t0 = new Date().getTime()

    const reviews: Review[] = await db.reviewsCollection.find({ $where: 'this.product == ' + id })
    const t1 = new Date().getTime()
    challengeUtils.solveIf(challenges.noSqlCommandChallenge, () => { return (t1 - t0) > 2000 })
    const user = security.authenticatedUsers.from(req)
    for (let i = 0; i < reviews.length; i++) {
      if (user === undefined || reviews[i].likedBy.includes(user.data.email)) {
        reviews[i].liked = true
      }
    }
    res.json(utils.queryResultToJson(reviews))
  })
}
