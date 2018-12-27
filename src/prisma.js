import { Prisma } from 'prisma-binding';

import { fragmentReplacements } from './resolvers';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: 'orN2OXmCAqveZ0nt',
  fragmentReplacements
});

export default prisma;

// const createPost = async (authorId, data) => {
//   const exists = await prisma.exists.User({ id: authorId });

//   if (!exists) {
//     throw new Error('Author not found');
//   }

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId
//           }
//         }
//       }
//     },
//     `
//     {
//       id
//     }
//   `
//   );
//   console.log(JSON.stringify(post, undefined, 2));
// };

// const getUser = async id => {
//   const user = await prisma.query.users(
//     {
//       where: {
//         id
//       }
//     },
//     `
//     {
//       id
//       name
//       email
//       posts {
//         id
//         title
//         body
//       }
//     }
//   `
//   );
//   console.log(JSON.stringify(user, undefined, 2));
// };

// const updatePost = async (id, data) => {
//   const exists = await prisma.exists.Post({ id });
//   if (!exists) {
//     throw new Error('Post not found');
//   }
//   const post = await prisma.mutation.updatePost(
//     {
//       where: { id },
//       data: { ...data }
//     },
//     `
//       {
//         id
//         title
//         body
//         published
//         author {
//           id
//         }
//       }
//     `
//   );
//   console.log(JSON.stringify(post, undefined, 2));
//   return post;
// };

// const getPosts = async () => {
//   const data = await prisma.query.posts(
//     null,
//     `
//       {
//         id
//         title
//         body
//         published
//       }
//     `
//   );
//   console.log(JSON.stringify(data, undefined, 2));
// };

// const getUsers = async () => {
//   const data = await prisma.query.users(
//     null,
//     '{ id name email posts { id title } }'
//   );
//   console.log(JSON.stringify(data, undefined, 2));
// };

// const createComment = async () => {
//   const data = await prisma.query.comments(
//     null,
//     `{
//         id
//         text
//         author {
//           id
//           name
//           email
//         }
//         post {
//           id
//           title
//           body
//         }
//       }`
//   );
//   console.log(JSON.stringify(data, undefined, 2));
// };

// const main = async () => {
//   try {
//     const postId = 'cjq4xtano002c0801h2cig9dk';
//     const post = await updatePost(postId, {
//       title: 'yyy',
//       body: 'yyy',
//       published: true
//     });
//     await getUser(post.author.id);
//   } catch (err) {
//     console.error(err);
//   }
// };

// main();
