import getUserId from '../utils/getUserId';

export default {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve({ id, email }, args, { req }, info) {
      const userId = getUserId(req, false);
      return id === userId ? email : null;
    }
  },

  posts: {
    fragment: 'fragment userId on User { id }',
    resolve: async ({ id }, args, { prisma }, info) => {
      const posts = await prisma.query.posts(
        {
          where: {
            author: { id },
            published: true
          }
        },
        info
      );
      return posts;
    }
  }
};
