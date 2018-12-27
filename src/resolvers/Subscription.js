import getUserId from '../utils/getUserId';

export default {
  comment: {
    subscribe(_, { postId }, { prisma }, info) {
      return prisma.subscription.comment(
        { where: { node: { post: { id: postId } } } },
        info
      );
    }
  },
  post: {
    subscribe(_, args, { prisma }, info) {
      return prisma.subscription.post(
        {
          where: {
            node: {
              published: true
            }
          }
        },
        info
      );
    }
  },
  myPost: {
    subscribe(_, args, { prisma, req }, info) {
      const userId = getUserId(req);
      return prisma.subscription.post(
        {
          where: {
            node: {
              author: {
                id: userId
              }
            }
          }
        },
        info
      );
    }
  }
};
