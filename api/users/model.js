'use strict';

import mongoose from 'mongoose'
import validate from 'mongoose-validator';
import bcrypt from 'bcrypt-as-promised';
import mongooseAutopopulate from 'mongoose-autopopulate';
import mongooseJsonSelect from 'mongoose-json-select';

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate: validate({
      validator: 'isEmail',
      message: 'is not valid',
    })
  },
  hashedPassword: {
    type: String
  }
})

schema.plugin(mongooseAutopopulate)
schema.plugin(mongooseJsonSelect, {
  name: 1,
  email: 1
})

schema.virtual('password')
  .set(function setPassword(value) {
    this._password = value
  })
  .get(function getPassword() {
    return this._password
  })

schema.pre('save', async function preSave(next) {
  if (!this.password) return next()
  try {
    this.hashedPassword = await bcrypt.hash(this.password)
    next()
  } catch ( error ) {
    next(error)
  }
})

export default mongoose.model('User', schema)
