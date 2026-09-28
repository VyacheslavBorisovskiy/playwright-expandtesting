import { test, expect } from '../../fixtures/userFixture';

test('Note can be added with API',
  { tag: '@smoke', },
  async ({ authToken, request }) => {
    const apiURL = process.env.API_URL!;

    const title = `note_home_title_${Date.now()}`;

    const createNoteResponse = await request.post(`${apiURL}notes`, {
      headers: { 'x-auth-token': authToken },
      form: {
        title: title,
        description: 'description',
        category: 'Home',
      },
    });

    expect(createNoteResponse.status()).toBe(200);

    const notesResponse = await request.get(`${apiURL}notes`, {
      headers: { 'x-auth-token': authToken },
    });

    console.log('token: ' + authToken);

    const { data: notes } = await notesResponse.json();
    const noteId = notes.find((note: { title: string }) => note.title === title).id;

    await request.delete(`${apiURL}notes/${noteId}`, {
      headers: { 'x-auth-token': authToken },
    });

    const notesResponseDel = await request.get(`${apiURL}notes`, {
      headers: { 'x-auth-token': authToken },
    });
    const { data: notesDel } = await notesResponseDel.json();

    const notedIdDel = notesDel.find((note: { title: string }) => note.title === title)?.id;
    expect(notedIdDel).toBeUndefined();

    const deletedUser = await request.delete(`${apiURL}users/delete-account`, {
      headers: { 'x-auth-token': authToken },
    });

    expect(deletedUser.status()).toBe(200);
  },
);