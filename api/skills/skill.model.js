'use strict'

import mongoose from 'mongoose'
import validate from 'mongoose-validator'
import crypto from 'crypto'
import nconf from 'nconf'
import mongooseAutopopulate from 'mongoose-autopopulate'
import mongooseJsonSelect from 'mongoose-json-select'
import update from 'mongoose-model-update'
import mongooseTimestamp from 'mongoose-timestamp'
import integerValidator from 'mongoose-integer'

const ObjectId = mongoose.Schema.Types.ObjectId

export default parent => {

  if (mongoose.models[parent + 'Skill']) return mongoose.model(parent + 'Skill')

  let baseSchema = {
    name     : {
      type    : String,
      required: true
    },
    level    : {
      type    : Number,
      min     : 1,
      max     : 5,
      default : 1,
      required: true,
      integer : true
    },
    category : {
      type    : String,
      required: true,
      enum    : ['SALARY', 'BEHAVIORAL', 'TECHNICAL', 'LANGUAGE', 'EDUCATION', 'CERTIFICATES']
    },
    language : {
      type    : String,
      required: true
    },
    createdBy: {
      type    : ObjectId,
      ref     : 'User',
      required: true
    }
  }

  if (parent === 'Vacancy') {
    baseSchema.vacancy = {
      type    : ObjectId,
      ref     : parent,
      required: true
    }
  }

  const schema = new mongoose.Schema(baseSchema)

  schema.plugin(integerValidator)
  schema.plugin(mongooseAutopopulate)
  schema.plugin(mongooseTimestamp)
  schema.plugin(mongooseJsonSelect, {
    vacancy: 1,
    name    : 1,
    level   : 1,
    category: 1,
    language: 1
  })

  schema.plugin(update, ['name', 'level', 'category', 'language'])

  return mongoose.model(parent + 'Skill', schema)
}