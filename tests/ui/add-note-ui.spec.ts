import { test, expect } from '../../fixtures/baseFixture';

test('User can add note',
  { tag: ['@smoke', '@ui'] },
  async ({ homePage, notesAppPage, loginPage }) => {
    await homePage.open();
    await homePage.goToNotesApp();
    await expect(notesAppPage.welcomeText).toBeVisible();
    await notesAppPage.goToLogin();
    await loginPage.login(process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);
    await notesAppPage.addNote();
    await expect(notesAppPage.getNoteTitle('note_home_title2')).toBeVisible();
  },
);