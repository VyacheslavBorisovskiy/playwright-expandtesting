import { test as base, expect } from './pageFixture';
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { randomUUID } from 'crypto';

type TestUser = {
  name: string;
  email: string;
  password: string;
};

type UserFixture = {
  testUser: TestUser;
  authToken: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Works whether API_URL ends with a slash or not.
function apiUrl(path: string): string {
  const root = requireEnv('API_URL').replace(/\/+$/, '');
  return `${root}/${path.replace(/^\/+/, '')}`;
}

// Throws with the response body included, so CI failures are self-explanatory.
async function expectStatus(
  response: APIResponse,
  expected: number,
  action: string,
) {
  if (response.status() !== expected) {
    throw new Error(
      `${action} failed: expected ${expected}, got ${response.status()}. Body: ${await response.text()}`,
    );
  }
}

async function login(request: APIRequestContext, user: TestUser) {
  const response = await request.post(apiUrl('users/login'), {
    data: { email: user.email, password: user.password },
  });
  await expectStatus(response, 200, 'Login');

  const token = (await response.json()).data?.token;
  if (!token) {
    throw new Error('Login response did not contain data.token');
  }
  return token;
}

export const test = base.extend<UserFixture>({
  testUser: async ({ request }, use) => {
    const user: TestUser = {
      name: 'Test User',
      // Reserved domain, so no real mailbox is hit if the app sends email.
      // Keep the "test." prefix: it makes leftovers easy to find and sweep.
      email: `test.${randomUUID()}@example.com`,
      password: requireEnv('TEST_PASSWORD'),
    };

    const registerResponse = await request.post(apiUrl('users/register'), { data: user });
    await expectStatus(registerResponse, 201, 'Register');

    await use(user);

    // Cleanup lives with the fixture that created the user, so it runs even
    // when a test never requests authToken. A fresh login also avoids
    // expired-token failures on long tests.
    // Warns instead of throwing so a flaky cleanup doesn't fail a passing
    // test; switch to throw if you want leaks to fail CI.
    try {
      const token = await login(request, user);
      const deleteResponse = await request.delete(apiUrl('users/delete-account'), {
        headers: { 'x-auth-token': token },
      });
      if (!deleteResponse.ok()) {
        console.warn(
          `Cleanup: could not delete ${user.email} (${deleteResponse.status()}): ${await deleteResponse.text()}`,
        );
      }
    } catch (error) {
      // Expected when a test deleted the account itself (login no longer works).
      console.warn(`Cleanup skipped for ${user.email}:`, error);
    }
  },

  authToken: async ({ request, testUser }, use) => {
    await use(await login(request, testUser));
  },
});

export { expect };