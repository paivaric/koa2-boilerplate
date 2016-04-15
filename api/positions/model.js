'use strict';

import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

const schema = new new mongoose.Schema({
  'title': {
    'type': String,
    'required': true
  },
  'description': {
    'type': String,
    'required': true
  },
  'city': {
    'type': String,
    'required': true
  },
  'state': {
    'type': String,
    'required': true
  },
  'status': {
    'type': String,
    'required': true
  },
  'company': {
    'type': String
  },
  'createdBy': {
    'type': ObjectId,
    'ref': 'User',
    'autopopulate': {
      'select': 'name email _id'
    },
    'required': true
  }
})

schema.index({
  '$**': 'text'
})

schema.plugin(require('mongoose-timestamp'))
schema.plugin(require('mongoose-autopopulate'))
schema.plugin(require('mongoose-json-select'), {
  title: 1,
  description: 1,
  city: 1,
  state: 1,
  company: 1,
  createdAt: 1
})

export default mongoose.model('Position', schema)
