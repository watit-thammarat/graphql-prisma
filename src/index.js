import '@babel/polyfill/noConflict';

import { GraphQLServer, PubSub } from 'graphql-yoga';

import resolvers, { fragmentReplacements } from './resolvers';
import prisma from './prisma';

const port = process.env.PORT || 4000;

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    pubsub,
    prisma,
    req
  }),
  fragmentReplacements
});

server.start({ port }, () => {
  console.log(`The server is up at port: ${port}`);
});
