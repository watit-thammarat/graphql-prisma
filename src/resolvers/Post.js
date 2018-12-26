export default {
  author: async ({ author }, args, { prisma }, info) => {
    // return db.users.find(u => u.id === author);
  },
  comments: async ({ id }, args, { prisma }, info) => {
    // return db.comments.filter(c => c.post === id);
  }
};
