import { test, expect } from '../../fixtures/userFixture';

test('User can login',
  { tag: ['@smoke', '@ui', '@flaky'] },
  async ({ homePage, notesAppPage, loginPage, testUser }) => {
    await homePage.open();
    await homePage.goToNotesApp();
    // await expect(notesAppPage.welcomeText).toBeVisible();
    await notesAppPage.goToLogin();

    await loginPage.login(testUser.email, testUser.password);

    await expect(notesAppPage.profileLink).toBeVisible();
  }
)