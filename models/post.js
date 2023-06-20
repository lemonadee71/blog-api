const mongoose = require('mongoose');
const slugify = require('slugify');
const { NotFoundError } = require('../utils');
const { Timestamp } = require('./utils');

const createSlug = function (value) {
  const slug = slugify(value, {
    lower: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
  // limit to 10 words
  return slug.split('-').slice(0, 10).join('-');
};

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  shortid: {
    type: String,
    default: () => Math.random().toString(36).slice(2, 6),
  },
  slug: {
    type: String,
    default: function () {
      return createSlug(this.title);
    },
    set: createSlug,
  },
  author: { type: String, ref: 'User', required: true },
  title: {
    type: String,
    required: true,
    maxLength: 150,
    set: function (str) {
      this.slug = str;
      return str;
    },
  },
  summary: { type: String, trim: true, maxLength: 300 },
  body: { type: String, trim: true },
  tags: [{ type: String }],
  private: { type: Boolean, default: false },
  date_created: Timestamp,
});

PostSchema.virtual('shorturl').get(function () {
  return `/${this.author}/${this.shortid}`;
});

PostSchema.virtual('url').get(function () {
  return `/${this.author}/${this.slug}-${this.shortid}`;
});

PostSchema.methods.toSafeObject = function () {
  return this.toObject({ getters: true, virtuals: true });
};

PostSchema.statics.findByShortId = function (shortid) {
  return this.findOne({ shortid }).orFail(new NotFoundError('Post not found'));
};

PostSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug }).orFail(new NotFoundError('Post not found'));
};

PostSchema.statics.findByAuthor = function (username) {
  return this.find({ author: username });
};

module.exports = mongoose.model('Post', PostSchema);
