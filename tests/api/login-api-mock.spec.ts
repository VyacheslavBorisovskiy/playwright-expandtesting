import { test, expect } from '../../fixtures/baseFixture';

test('User can login with a mocked successful API response',
  { tag: ['@smoke', '@api'] },
  async ({ page, homePage, notesAppPage, loginPage }) => {
    await page.route(`${process.env.API_URL}users/login`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          status: 200,
          message: 'Login successful',
          data: {
            id: 'mock-user-id',
            name: 'Mock User',
            email: 'mock.user@gmail.com',
            token: 'mock-token',
          },
        }),
      });
    });

    await homePage.open();
    await homePage.goToNotesApp();
    await notesAppPage.goToLogin();
    await loginPage.login('mock.user@gmail.com', 'anyPassword123');

    await expect(notesAppPage.profileLink).toBeVisible();
  },
);

test('User cannot login with a mocked failed API response',
  { tag: ['@smoke', '@api'] },
  async ({ page, homePage, notesAppPage, loginPage }) => {
    await page.route(`${process.env.API_URL}users/login`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          status: 401,
          message: 'Incorrect email address or password',
        }),
      });
    });

    await homePage.open();
    await homePage.goToNotesApp();
    await notesAppPage.goToLogin();
    await loginPage.login('mock.user@gmail.com', 'wrongPassword123');

    await expect(loginPage.errorMessage).toHaveText('Incorrect email address or password');
    await expect(notesAppPage.profileLink).not.toBeVisible();
  },
);
