export default {
  users: async (_, { query = '' }, { prisma }, info) => {
    const options = {};
    if (query.trim().length > 0) {
      options.where = {
        OR: [
          { name_contains: query.trim().toLowerCase() },
          { email_contains: query.trim().toLowerCase() }
        ]
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
  posts: async (_, { query = '' }, { prisma }, info) => {
    const options = {};
    if (query.trim().length > 0) {
      options.where = {
        OR: [
          { title_contains: query.trim().toLowerCase() },
          { body_contains: query.trim().toLowerCase() }
        ]
      };
    }
    try {
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
  me() {
    return {
      id: '123',
      name: 'Watit Thammart',
      email: 'tongnakub@hotmail.com',
      age: null
    };
  },
  post() {
    return { id: '123', title: 'title', body: 'body', published: false };
  }
};
