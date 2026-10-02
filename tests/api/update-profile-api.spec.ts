import { test, expect } from '../../fixtures/userFixture';

test('Update profile via API',
  { tag: ['@regression', '@flaky'] },
  async ({ testUser, authToken, request }) => {
    const apiURL = process.env.API_URL!;

    const updateResponse = await request.patch(`${apiURL}users/profile`, {
      headers: { 'x-auth-token': authToken },
      data: {
        name: testUser.name,
        phone: '0123456789',
        company: 'Company',
      },
    });
    expect(updateResponse.status()).toBe(200);

    const updateBody = await updateResponse.json();
    expect(updateBody.data.id).toBeTruthy();
    expect(updateBody.data.name).toBe(testUser.name);
    expect(updateBody.data.phone).toBe('0123456789');
    expect(updateBody.data.company).toBe('Company');

  },
);
