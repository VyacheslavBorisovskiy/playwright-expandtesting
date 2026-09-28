# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/add-note-api.spec.ts >> Note can be added with API
- Location: tests/api/add-note-api.spec.ts:3:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401
```

# Test source

```ts
  1  | import { test as base, expect } from './pageFixture';
  2  | import { randomUUID } from 'crypto';
  3  | 
  4  | type TestUser = {
  5  |   name: string;
  6  |   email: string;
  7  |   password: string;
  8  | };
  9  | 
  10 | type UserFixture = {
  11 |   testUser: TestUser;
  12 |   authToken: string;
  13 | };
  14 | 
  15 | export const test = base.extend<UserFixture>({
  16 |   testUser: async ({ request }, use) => {
  17 |     const apiURL = process.env.API_URL!;
  18 |     const user: TestUser = {
  19 |       name: 'Test User',
  20 |       email: `test.${randomUUID()}@gmail.com`,
  21 |       password: process.env.TEST_PASSWORD!,
  22 |     };
  23 | 
  24 |     const registerResponse = await request.post(
  25 |       `${apiURL}users/register`,
  26 |       {
  27 |         data: user
  28 |       }
  29 |     );
  30 | 
  31 |     expect(registerResponse.status()).toBe(201);
  32 | 
  33 |     await use(user);
  34 |   },
  35 | 
  36 |   authToken: async ({ request, testUser }, use) => {
  37 |     const apiURL = process.env.API_URL!;
  38 | 
  39 |     const loginResponse = await request.post(`${apiURL}users/login`, {
  40 |       data: {
  41 |         email: testUser.email,
  42 |         password: testUser.password,
  43 |       },
  44 |     });
  45 | 
  46 |     expect(loginResponse.status()).toBe(200);
  47 | 
  48 |     const loginResponseBody = await loginResponse.json();
  49 |     const token = loginResponseBody.data.token;
  50 | 
  51 |     await use(token);
  52 | 
  53 |     const deleteResponse = await request.delete(`${apiURL}users/delete-account`, {
  54 |       headers: { 'x-auth-token': token },
  55 |     });
> 56 |     expect(deleteResponse.status()).toBe(200);
     |                                     ^ Error: expect(received).toBe(expected) // Object.is equality
  57 |   },
  58 | });
  59 | 
  60 | export { expect };
```