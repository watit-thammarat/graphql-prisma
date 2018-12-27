import jwt from 'jsonwebtoken';

import { secret } from './config';

export default (req, required = true) => {
  const headers = req.request
    ? req.request.headers.authorization
    : req.connection.context.Authorization;
  if (!headers) {
    if (required) {
      throw new Error('Authorization required');
    } else {
      return;
    }
  }
  const [scheme, token] = headers.split(' ');
  if (scheme.toLowerCase() !== 'bearer') {
    if (required) {
      throw new Error('Invalid Authorization Scheme');
    } else {
      return;
    }
  }
  try {
    const { userId } = jwt.verify(token, secret);
    return userId;
  } catch (err) {
    console.error(err);
    if (required) {
      throw new Error('Invalid token');
    } else {
      return;
    }
  }
};
