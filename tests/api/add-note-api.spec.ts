import { test, expect } from '@playwright/test';

test('Note can be added with API',
  { tag: '@smoke', },
  async ({ request }) => {
    const apiURL = process.env.API_URL!;
    const email = `test.api.${Date.now()}@gmail.com`;
    const password = 'Password123';
    const registerResponse = await request.post(`${apiURL}users/register`, {
      form: {
        name: 'Test User',
        email,
        password,
      },
    });
    expect(registerResponse.status()).toBe(201);

    const loginResponse = await request.post(`${apiURL}users/login`, {
      form: {
        email,
        password
      },
    });

    expect(loginResponse.status()).toBe(200);
    const loginResponseBody = await loginResponse.json();
    const token = loginResponseBody.data.token;

    const createNoteResponse = await request.post(`${apiURL}notes`, {
      headers: { 'x-auth-token': token },
      form: {
        title: 'home-note-titlea',
        description: 'home-note-descra',
        category: 'Home',
      },
    });
    expect(createNoteResponse.status()).toBe(200);

    const notesResponse = await request.get(`${apiURL}notes`, {
      headers: { 'x-auth-token': token },
    });

    const { data: notes } = await notesResponse.json();
    const noteId = notes.find((note: { title: string }) => note.title === 'home-note-titlea').id;

    await request.delete(`${apiURL}notes/${noteId}`, {
      headers: { 'x-auth-token': token },
    });

    const notesResponseDel = await request.get(`${apiURL}notes`, {
      headers: { 'x-auth-token': token },
    });
    const { data: notesDel } = await notesResponseDel.json();

    const notedIdDel = notesDel.find((note: { title: string }) => note.title === 'home-note-titlea')?.id;
    expect(notedIdDel).toBeUndefined();

    const deletedUser = await request.delete(`${apiURL}users/delete-account`, {
      headers: { 'x-auth-token': token },
    });

    expect(deletedUser.status()).toBe(200);
  },
);