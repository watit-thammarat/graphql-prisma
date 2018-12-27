import 'cross-fetch/polyfill';

import prisma from '../src/prisma';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import {
  getPosts,
  getMyPosts,
  createPost,
  updatePost,
  deletePost
} from './utils/operation';

const client = getClient();

beforeEach(seedDatabase);

test('Should expose published posts', async () => {
  const res = await client.query({ query: getPosts });
  expect(res.data.posts.length).toBe(1);
  expect(res.data.posts[0].published).toBe(true);
});

test('Should fetch user posts', async () => {
  const client = getClient(userOne.jwt);
  const res = await client.query({ query: getMyPosts });
  const posts = res.data.myPosts;
  expect(posts.length).toBe(2);
});

test('Should be able to update own post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postTwo.post.id,
    data: {
      published: false
    }
  };
  const { data } = await client.mutate({ mutation: updatePost, variables });
  const exists = await prisma.exists.Post({ id: postTwo.id, published: false });
  expect(exists).toBe(true);
  expect(data.updatePost.published).toBe(false);
});

test('create post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: { title: 'title 3', body: 'body 3', published: true }
  };
  const { data } = await client.mutate({ mutation: createPost, variables });
  const post = data.createPost;
  const exists = await prisma.exists.Post({ id: post.id });
  expect(exists);
  expect(post.title).toBe(variables.data.title);
  expect(post.body).toBe(variables.data.body);
  expect(post.published).toBe(variables.data.published);
});

test('delete post', async () => {
  const client = getClient(userOne.jwt);
  const variables = { id: postOne.post.id };
  await client.mutate({ mutation: deletePost, variables });
  const exists = await prisma.exists.Post({ id: postOne.post.id });
  expect(exists).toBe(false);
});
