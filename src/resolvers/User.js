export default {
  posts: async ({ id }, args, { prisma }, info) => {
    // return db.posts.filter(p => p.author === id);
  },
  comments: async ({ id }, args, { prisma }, info) => {
    // return db.comments.filter(c => c.author === id);
  }
};
