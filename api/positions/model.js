'use strict';

import mongoose from 'mongoose'
import validate from 'mongoose-validator';
import crypto from 'crypto';
import nconf from 'nconf';
import mongooseAutopopulate from 'mongoose-autopopulate';
import mongooseJsonSelect from 'mongoose-json-select';
import mongooseTimestamp from 'mongoose-timestamp'
import update from 'mongoose-model-update';

const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new mongoose.Schema({
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
    'required': true
  }
})

schema.plugin(mongooseTimestamp)
schema.plugin(mongooseAutopopulate)
schema.plugin(mongooseJsonSelect, {
  title: 1,
  description: 1,
  city: 1,
  state: 1,
  company: 1,
  createdAt: 1
})

schema.plugin(update, ['title', 'description', 'city', 'state', 'company']);

export default mongoose.model('Position', schema)
