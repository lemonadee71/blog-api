const mongoose = require('mongoose');
const { Timestamp, ObjectId } = require('./utils');

const Schema = mongoose.Schema;

// TODO: Allow html and md body
const CommentSchema = new Schema({
  author: { type: String, ref: 'User', required: true },
  post: { type: ObjectId, ref: 'Post', required: true },
  body: { type: String, trim: true },
  date_created: Timestamp,
});

CommentSchema.methods.toSafeObject = function () {
  return this.toObject({ getters: true });
};

CommentSchema.statics.findByAuthor = function (username) {
  return this.find({ author: username }).sort({ date_created: 'desc' });
};

CommentSchema.statics.findByPost = function (postid) {
  return this.find({ post: postid }).sort({ date_created: 'asc' });
};

module.exports = mongoose.model('Comment', CommentSchema);
