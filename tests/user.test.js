import 'cross-fetch/polyfill';

import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { getUsers, createUser, login, me } from './utils/operation';

const client = getClient();

beforeEach(seedDatabase);

test('Should create a new user', async () => {
  const variables = {
    data: { name: 'test', email: 'test@test.com', password: 'abcd1234' }
  };
  const { data } = await client.mutate({ mutation: createUser, variables });
  const id = data.createUser.user.id;
  const exists = await prisma.exists.User({ id });
  expect(exists).toBe(true);
});

test('Should expose public author profiles', async () => {
  const res = await client.query({ query: getUsers });
  expect(res.data.users.length).toBe(2);
  expect(res.data.users[0].email).toBe(null);
  expect(res.data.users[0].name).toBe('Jen');
});

test('Should not login with bad credential', async () => {
  const variables = { email: 'jen@example.com', password: 'abcd12345' };
  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
});

test('Should not signup with invalid password', async () => {
  const variables = {
    data: { name: 'test', email: 'test@test.com', password: '1234' }
  };
  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt);
  const res = await client.query({ query: me });
  const user = res.data.me;
  expect(user.id).toBe(userOne.user.id);
  expect(user.name).toBe(userOne.user.name);
  expect(user.email).toBe(userOne.user.email);
});
