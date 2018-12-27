import { extractFragmentReplacements } from 'prisma-binding';

import Query from './Query';
import Mutation from './Muation';
import User from './User';
import Post from './Post';
import Comment from './Comment';
import Subscription from './Subscription';

const resolver = {
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  Comment
};

export const fragmentReplacements = extractFragmentReplacements(resolver);

export default resolver;
