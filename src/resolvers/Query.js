import getUserId from '../utils/getUserId';

export default {
  users: async (parent, { query = '' }, { prisma }, info) => {
    const options = {};
    if (query.trim().length > 0) {
      options.where = {
        OR: [{ name_contains: query.trim().toLowerCase() }]
      };
    }
    try {
      const users = await prisma.query.users(options, info);
      return users;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  myPosts: async (parent, { query = '' }, { prisma, req }, info) => {
    try {
      const userId = getUserId(req);
      const options = { where: { author: { id: userId } } };
      if (query.trim().length > 0) {
        options.where.OR = [
          { title_contains: query.trim().toLowerCase() },
          { body_contains: query.trim().toLowerCase() }
        ];
      }
      const posts = await prisma.query.posts(options, info);
      return posts;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  posts: async (_, { query = '' }, { prisma }, info) => {
    try {
      const options = { where: { published: true } };
      if (query.trim().length > 0) {
        options.where.OR = [
          { title_contains: query.trim().toLowerCase() },
          { body_contains: query.trim().toLowerCase() }
        ];
      }

      const posts = await prisma.query.posts(options, info);
      return posts;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  comments: async (_, args, { prisma }, info) => {
    try {
      const comments = await prisma.query.comments(null, info);
      return comments;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  me: async (parent, args, { prisma, req }, info) => {
    try {
      const userId = getUserId(req);
      const user = await prisma.query.user({ where: { id: userId } }, info);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  post: async (parent, { id }, { prisma, req }, info) => {
    try {
      const userId = getUserId(req, false);
      const [post] = await prisma.query.posts(
        {
          where: { id, OR: [{ published: true }, { author: { id: userId } }] }
        },
        info
      );
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};
