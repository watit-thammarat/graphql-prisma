import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import getUserId from '../utils/getUserId';
import { secret } from '../utils/config';

export default {
  login: async (parent, { email, password }, { prisma }, info) => {
    try {
      const [user] = await prisma.query.users({ where: { email } });
      if (!user) {
        throw new Error('Invalid user name and/or password');
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error('Invalid user name and/or password');
      }
      return { user, token: jwt.sign({ userId: user.id }, secret) };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  createUser: async (
    _,
    { data: { name, email, password } },
    { prisma },
    info
  ) => {
    try {
      if (password.trim().length < 8) {
        throw new Error('Password must be 8 characters or longer');
      }
      const exists = await prisma.exists.User({ email });
      if (exists) {
        throw new Error('Email is in use');
      }
      password = await bcrypt.hash(password, 10);
      const user = await prisma.mutation.createUser({
        data: { name, email, password }
      });
      return { user, token: jwt.sign({ userId: user.id }, secret) };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  updateUser: async (_, { data }, { prisma, req }, info) => {
    try {
      const userId = getUserId(req);
      const exists = await prisma.exists.User({ id: userId });
      if (!exists) {
        throw new Error('User not found');
      }
      const user = await prisma.mutation.updateUser(
        {
          where: { id: userId },
          data
        },
        info
      );
      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  deleteUser: async (_, args, { prisma, req }, info) => {
    try {
      const userId = getUserId(req);
      const user = await prisma.mutation.deleteUser(
        { where: { id: userId } },
        info
      );
      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  createPost: async (
    _,
    { data: { title, body, published, author } },
    { prisma, req },
    info
  ) => {
    try {
      const userId = getUserId(req);
      const exists = await prisma.exists.User({ id: author });
      if (!exists) {
        throw new Error('Invalid author');
      }
      const post = await prisma.mutation.createPost(
        {
          data: { title, body, published, author: { connect: { id: userId } } }
        },
        info
      );
      if (published) {
      }
      return post;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  updatePost: async (_, { id, data }, { prisma, req }, info) => {
    try {
      const userId = getUserId(req);
      const exists = await prisma.exists.Post({ id, author: { id: userId } });
      if (!exists) {
        throw new Error('Unable to update post');
      }
      const post = await prisma.mutation.updatePost(
        { where: { id }, data },
        info
      );
      return post;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  deletePost: async (_, { id }, { prisma, req }, info) => {
    try {
      const userId = getUserId(req);
      const exists = await prisma.exists.Post({ id, author: { id: userId } });
      if (!exists) {
        throw new Error('Unable to delete post');
      }
      const post = await prisma.mutation.deletePost({ where: { id } }, info);
      return post;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  createComment: async (_, { data: { text, post } }, { prisma, req }, info) => {
    try {
      const userId = getUserId(req);
      const exists = await prisma.exists.Post({ id: post });
      if (!exists) {
        throw new Error('Invalid post');
      }
      const comment = await prisma.mutation.createComment(
        {
          data: {
            text,
            author: { connect: { id: userId } },
            post: { connect: { id: post } }
          }
        },
        info
      );
      return comment;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  updateComment: async (_, { id, data }, { prisma, req }, info) => {
    try {
      const userId = getUserId(req);
      const exists = await prisma.exists.Comment({
        id,
        author: { id: userId }
      });
      if (!exists) {
        throw new Error('Unable to update comment');
      }
      const comment = await prisma.mutation.updateComment(
        {
          where: { id },
          data
        },
        info
      );
      return comment;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  deleteComment: async (_, { id }, { prisma, req }, info) => {
    try {
      const userId = getUserId(req);
      const exists = await prisma.exists.Comment({
        id,
        author: { id: userId }
      });
      if (!exists) {
        throw new Error('Unable to delete comment');
      }
      const comment = await prisma.mutation.deleteComment(
        { where: { id } },
        info
      );
      return comment;
    } catch (err) {
      console.error(err);
      throw err;
    }
    // const comment = db.comments.find(c => c.id === id);
    // if (!comment) {
    //   throw new Error('comment does not exist');
    // }
    // db.comments = db.comments.filter(c => c.id !== id);
    // pubsub.publish(`comment_${comment.post}`, {
    //   comment: { mutation: 'DELETED', data: comment }
    // });
    // return comment;
  }
};
