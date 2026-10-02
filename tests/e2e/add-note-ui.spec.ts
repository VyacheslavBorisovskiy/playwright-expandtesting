import { test, expect } from '../../fixtures/userFixture';

test('User can add a note',
  { tag: ['@smoke', '@ui', '@flaky'] },
  async ({ homePage, notesAppPage, loginPage, testUser, authToken, request }) => {
    await homePage.open();
    await homePage.goToNotesApp();
    await expect(notesAppPage.welcomeText).toBeVisible();
    await notesAppPage.goToLogin();
    await loginPage.login(testUser.email, testUser.password);
    const noteTitle = `note_home_title_${Date.now()}`;
    await notesAppPage.addNote(noteTitle, 'descr');
    await expect(notesAppPage.getNoteTitle(noteTitle)).toBeVisible();

    const notesResponse = await request.get(`${process.env.API_URL}notes`, {
      headers: { 'x-auth-token': authToken },
    });
    const { data: notes } = await notesResponse.json();
    const noteId = notes.find((note: { title: string }) => note.title === noteTitle).id;

    await request.delete(`${process.env.API_URL}notes/${noteId}`, {
      headers: { 'x-auth-token': authToken },
    });

    await notesAppPage.reload();
    await expect(notesAppPage.getNoteCard(noteTitle)).not.toBeVisible();
  },
);