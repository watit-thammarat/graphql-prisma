import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db.js';
import resolvers from './resolvers';
import prisma from './prisma';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    db,
    pubsub,
    prisma,
    req
  })
});

server.start(() => {
  console.log('The server is up');
});
