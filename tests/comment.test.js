import 'cross-fetch/polyfill';

import prisma from '../src/prisma';
import seedDatabase, {
  userOne,
  userTwo,
  postOne,
  postTwo,
  commentOne,
  commentTwo
} from './utils/seedDatabase';
import getClient from './utils/getClient';
import {
  deleteComment,
  subscribeToComments,
  subscribeToPosts
} from './utils/operation';

const client = getClient();

beforeEach(seedDatabase);

test('Should delete own comment', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentOne.comment.id
  };
  await client.mutate({ mutation: deleteComment, variables });
  const exists = await prisma.exists.Comment({ id: commentOne.comment.id });
  expect(exists).toBe(false);
});

test('Should not delete other comment', async () => {
  const client = getClient(userOne.jwt);
  const variables = { id: commentTwo.comment.id };
  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow();
});

test('Should subscribe to comments for a post', async done => {
  const variables = { postId: postTwo.post.id };
  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe('DELETED');
      done();
    }
  });
  await prisma.mutation.deleteComment({
    where: { id: commentOne.comment.id }
  });
});

test('Should subscribe to changes for published posts', async done => {
  client.subscribe({ query: subscribeToPosts }).subscribe({
    next(response) {
      expect(response.data.post.mutation).toBe('DELETED');
      done();
    }
  });
  await prisma.mutation.deletePost({ where: { id: postTwo.post.id } });
});
