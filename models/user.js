const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { NotFoundError } = require('../utils');
const { Timestamp } = require('./utils');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {
    type: String,
    maxLength: 30,
    alias: 'username',
    set: (value) => value.replace(' ', '-').toLowerCase(),
  },
  // email: { type: String, required: true },
  password: { type: String, required: true },
  display_name: {
    type: String,
    maxLength: 30,
    default: function () {
      return this.username;
    },
  },
  bio: { type: String, maxLength: 300 },
  token: String,
  token_date_created: Timestamp,
  date_created: Timestamp,
});

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

UserSchema.methods.setPassword = async function (newPassword) {
  this.password = await bcrypt.hash(newPassword, 10);
};

UserSchema.methods.comparePassword = function (input) {
  return bcrypt.compare(input, this.password);
};

UserSchema.methods.toSafeObject = function () {
  const o = this.toObject({ virtuals: true });
  delete o.password;
  delete o.token;
  return o;
};

UserSchema.statics.findByName = function (username) {
  return this.findById(username).orFail(new NotFoundError('User not found'));
};

// UserSchema.statics.findByEmail = function (email) {
//   return this.findOne({ email }).orFail(new NotFoundError('User not found'));
// };

module.exports = mongoose.model('User', UserSchema);
