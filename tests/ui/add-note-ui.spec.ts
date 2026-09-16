import { test, expect } from '../../fixtures/baseFixture';

test('User can add a note',
  { tag: ['@smoke', '@ui'] },
  async ({ homePage, notesAppPage, loginPage, request }) => {
    await homePage.open();
    await homePage.goToNotesApp();
    await expect(notesAppPage.welcomeText).toBeVisible();
    await notesAppPage.goToLogin();
    await loginPage.login(process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);
    await notesAppPage.addNote();
    await expect(notesAppPage.getNoteTitle('note_home_title2')).toBeVisible();

    const loginResponse = await request.post(`${process.env.API_URL}users/login`, {
      form: { email: process.env.TEST_EMAIL!, password: process.env.TEST_PASSWORD! },
    });
    const { data: { token } } = await loginResponse.json();

    const notesResponse = await request.get(`${process.env.API_URL}notes`, {
      headers: { 'x-auth-token': token },
    });
    const { data: notes } = await notesResponse.json();
    const noteId = notes.find((note: { title: string }) => note.title === 'note_home_title2').id;

    await request.delete(`${process.env.API_URL}notes/${noteId}`, {
      headers: { 'x-auth-token': token },
    });

    await notesAppPage.reload();
    await expect(notesAppPage.getNoteCard('note_home_title2')).not.toBeVisible();
  },
);