import jwt from 'jsonwebtoken';

import { secret } from './config';

export default req => {
  const { headers } = req.request;
  if (!headers.authorization) {
    throw new Error('Authorization required');
  }
  const [scheme, token] = headers.authorization.split(' ');
  if (scheme.toLowerCase() !== 'bearer') {
    throw new Error('Invalid Authorization Scheme');
  }
  try {
    const { userId } = jwt.verify(token, secret);
    return userId;
  } catch (err) {
    console.error(err);
    throw new Error('Invalid token');
  }
};
