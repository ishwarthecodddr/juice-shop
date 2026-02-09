/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response } from 'express'
import { SecurityAnswerModel } from '../models/securityAnswer'
import { UserModel } from '../models/user'
import { SecurityQuestionModel } from '../models/securityQuestion'
import { asyncHandler } from '../lib/asyncHandler'

export function securityQuestion () {
  return asyncHandler(async ({ query }: Request, res: Response) => {
    const email = query.email
    const answer = await SecurityAnswerModel.findOne({
      include: [{
        model: UserModel,
        where: { email: email?.toString() }
      }]
    })
    if (answer != null) {
      const question = await SecurityQuestionModel.findByPk(answer.SecurityQuestionId)
      res.json({ question })
    } else {
      res.json({})
    }
  })
}
