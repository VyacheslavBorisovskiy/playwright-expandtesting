import { test, expect } from '../../fixtures/baseFixture';

test('User can add a note (flaky - fixed wait races the create request)',
  { tag: ['@ui', '@flaky'] },
  async ({ page, homePage, notesAppPage, loginPage, request }) => {
    await homePage.open();
    await homePage.goToNotesApp();
    await notesAppPage.goToLogin();
    await loginPage.login(process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);

    // Stand in for real-world network variance on the create request, which
    // is what actually causes this class of bug in production, instead of
    // depending on whatever the network happens to be doing right now.
    const extraDelayMs = Math.random() * 2400;
    await page.route('**/notes/api/notes/', async (route) => {
      if (route.request().method() === 'POST') {
        await new Promise((resolve) => setTimeout(resolve, extraDelayMs));
      }
      await route.continue();
    });

    const title = `note_flaky_race_${test.info().testId}`;
    await notesAppPage.addNoteButton.click();
    await notesAppPage.noteTitleLabel.fill(title);
    await notesAppPage.noteDescriptionLabel.fill('note_flaky_race_descr');
    await notesAppPage.noteCreateButton.click();

    try {
      // BUG (intentional): reads visibility with a single, non-retrying
      // check after a fixed wait instead of an auto-waiting assertion, so
      // it races the (now variable-latency) create request and flakes
      // whenever that request lands on the slow side of the wait.
      await page.waitForTimeout(1800);
      expect(await notesAppPage.getNoteCard(title).isVisible()).toBe(true);
    } finally {
      await page.unroute('**/notes/api/notes/');
      const loginResponse = await request.post(`${process.env.API_URL}users/login`, {
        form: { email: process.env.TEST_EMAIL!, password: process.env.TEST_PASSWORD! },
      });
      const { data: { token } } = await loginResponse.json();

      const notesResponse = await request.get(`${process.env.API_URL}notes`, {
        headers: { 'x-auth-token': token },
      });
      const { data: notes } = await notesResponse.json();
      const note = notes.find((n: { title: string }) => n.title === title);
      if (note) {
        await request.delete(`${process.env.API_URL}notes/${note.id}`, {
          headers: { 'x-auth-token': token },
        });
      }
    }
  },
);
