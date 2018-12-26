export default {
  author: async ({ author }, args, { prisma }, info) => {
    // return db.users.find(u => u.id === author);
  },
  post: async ({ post }, arg, { prisma }, info) => {
    // return db.posts.find(p => p.id === post);
  }
};
