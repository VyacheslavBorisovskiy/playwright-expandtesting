import { test as base, expect } from './pageFixture';
import { randomUUID } from 'crypto';

type TestUser = {
  name: string;
  email: string;
  password: string;
};

type UserFixture = {
  testUser: TestUser;
};

export const test = base.extend<UserFixture>({
  testUser: async ({ request }, use) => {
    const apiURL = process.env.API_URL!;
    const user: TestUser = {
      name: 'Test User',
      email: `test.${randomUUID()}@gmail.com`,
      password: process.env.TEST_PASSWORD!,
    };

    const registerResponse = await request.post(
      `${apiURL}users/register`,
      {
        data: user,
      }
    );

    expect(registerResponse.status()).toBe(201);

    // Get the authentication token
    const loginResponse = await request.post(`${apiURL}users/login`, {
      data: {
        email: user.email,
        password: user.password,
      },
    });

    const loginResponseBody = await loginResponse.json();
    const token = loginResponseBody.data.token;

    await use(user);

    const deleteResponse = await request.delete(`${apiURL}users/delete-account`, {
      headers: { 'x-auth-token': token },
    });
    expect(deleteResponse.status()).toBe(200);
  },
});

export { expect };