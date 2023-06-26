/* eslint-disable import/no-extraneous-dependencies */
const { faker } = require('@faker-js/faker');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const tags = [
  'top',
  'javascript',
  'coding',
  'programming',
  'nodejs',
  'nextjs',
  'react',
];

const createFakePosts = (n, author) =>
  new Array(n).fill().map(() => ({
    author,
    title: faker.word.words({ count: { min: 5, max: 10 } }),
    summary: faker.lorem.sentences({ min: 1, max: 3 }),
    body: faker.lorem.paragraphs({ min: 3, max: 10 }),
    tags: tags.slice(rand(), rand(tags.length)),
  }));

const createFakeComments = (n, author, post) =>
  new Array(n).fill().map(() => ({
    author,
    post,
    body: faker.hacker.phrase(),
  }));

const rand = (n = 1) => Math.floor(Math.random() * n);

module.exports = async () => {
  await User.create([
    {
      username: 'admin',
      password: 'admin',
    },
    {
      username: 'user',
      password: '1234',
    },
    {
      username: 'lemon',
      password: '1234',
    },
  ]);

  const posts = await Post.create([
    ...createFakePosts(4, 'user'),
    ...createFakePosts(4, 'lemon'),
    ...createFakePosts(4, 'admin'),
  ]);

  for (const post of posts) {
    // eslint-disable-next-line no-await-in-loop
    await Comment.create(createFakeComments(rand(4), post.author, post.id));
  }
};
