import { test, expect } from '../../fixtures/baseFixture';

test('User can login',
  { tag: '@smoke' },
  async ({ homePage, notesAppPage, loginPage }) => {
    await homePage.open();
    await homePage.goToNotesApp();
    await expect(notesAppPage.welcomeText).toBeVisible();
    await notesAppPage.goToLogin();
    await loginPage.login(process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);
    await expect(notesAppPage.profileLink).toBeVisible();
  }
)