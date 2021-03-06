import { GraphQLServer, PubSub } from 'graphql-yoga';

import resolvers, { fragmentReplacements } from './resolvers';
import prisma from './prisma';

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

export default server;
