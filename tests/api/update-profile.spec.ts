import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test('Update profile via API',
  { tag: '@regression' },
  async ({ request }) => {
    const apiURL = process.env.API_URL!;
    const email = `test.${randomUUID()}@example.com`;
    const password = 'Password123';

    const registerResponse = await request.post(`${apiURL}users/register`, {
      data: {
        name: 'Test User',
        email,
        password,
      },
    });
    expect(registerResponse.status()).toBe(201);

    const loginResponse = await request.post(`${apiURL}users/login`, {
      data: { email, password },
    });
    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    const token = loginBody.data.token;

    const updateResponse = await request.patch(`${apiURL}users/profile`, {
      headers: { 'x-auth-token': token },
      data: {
        name: 'Test Name',
        phone: '0123456789',
        company: 'Company',
      },
    });
    expect(updateResponse.status()).toBe(200);

    const updateBody = await updateResponse.json();
    expect(updateBody.data.id).toBeTruthy();
    expect(updateBody.data.name).toBe('Test Name');
    expect(updateBody.data.phone).toBe('0123456789');
    expect(updateBody.data.company).toBe('Company');

    const deleteResponse = await request.delete(`${apiURL}users/delete-account`, {
      headers: { 'x-auth-token': token },
    });
    expect(deleteResponse.status()).toBe(200);
  },
);
