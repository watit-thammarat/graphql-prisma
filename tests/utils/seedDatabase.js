import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../../src/prisma';
import { secret } from '../../src/utils/config';

export const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('abcd1234', 10)
  },
  user: null,
  jwt: null
};

export const userTwo = {
  input: {
    name: 'Joe',
    email: 'joe@example.com',
    password: bcrypt.hashSync('abcd1234', 10)
  },
  user: null,
  jwt: null
};

export const postOne = {
  input: {
    title: 'title 1',
    body: 'body 1',
    published: false
  },
  post: null
};

export const postTwo = {
  input: {
    title: 'title 2',
    body: 'body 2',
    published: true
  },
  post: null
};

export const commentOne = {
  input: {
    text: 'comment 1'
  },
  comment: null
};

export const commentTwo = {
  input: {
    text: 'comment 2'
  },
  comment: null
};

export default async () => {
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  userOne.user = await prisma.mutation.createUser({ data: userOne.input });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, secret, {
    expiresIn: '7 days'
  });

  userTwo.user = await prisma.mutation.createUser({ data: userTwo.input });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, secret, {
    expiresIn: '7 days'
  });

  postOne.post = await prisma.mutation.createPost({
    data: { ...postOne.input, author: { connect: { id: userOne.user.id } } }
  });

  postTwo.post = await prisma.mutation.createPost({
    data: { ...postTwo.input, author: { connect: { id: userOne.user.id } } }
  });

  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: { connect: { id: userOne.user.id } },
      post: { connect: { id: postTwo.post.id } }
    }
  });

  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: { connect: { id: userTwo.user.id } },
      post: { connect: { id: postTwo.post.id } }
    }
  });
};
