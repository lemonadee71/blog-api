const mongoose = require('mongoose');
const slugify = require('slugify');
const escapeHTML = require('escape-html');
const { NotFoundError, convertToMarkdown } = require('../utils');
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
  body_html: {
    type: String,
    alias: 'body',
    trim: true,
    set: function (str) {
      this.body_markdown = str;
      return str;
    },
  },
  body_markdown: { type: String, trim: true, set: convertToMarkdown },
  tags: [String],
  published: { type: Boolean, default: true },
  date_created: Timestamp,
  last_updated: Timestamp,
});

PostSchema.pre('save', async function () {
  this.last_updated = Date.now();
});

PostSchema.virtual('body_html_escaped').get(function () {
  return escapeHTML(this.body_html);
});

PostSchema.methods.toSafeObject = function () {
  return this.toObject({ getters: true, virtuals: true });
};

PostSchema.statics.findByShortId = function (shortid) {
  return this.findOne({ shortid }).orFail(new NotFoundError('Post not found'));
};

PostSchema.statics.createDraftOrUpdate = function (filter, update) {
  return this.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
  });
};

// We might want to enable this only if user is also provided
// PostSchema.statics.findBySlug = function (slug) {
//   return this.findOne({ slug }).orFail(new NotFoundError('Post not found'));
// };

PostSchema.statics.findByAuthor = function (username) {
  return this.find({ author: username });
};

PostSchema.statics.findByTag = function (tag) {
  return this.find({ tags: tag });
};

module.exports = mongoose.model('Post', PostSchema);
