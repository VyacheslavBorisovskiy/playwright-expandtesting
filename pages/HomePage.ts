import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly notesAppLink: Locator;

  constructor(private readonly page: Page) {
    this.notesAppLink = page.getByRole("link", { name: 'Notes App | React' });

  }

  async open() {
    await this.page.goto('/');
  }

  async goToNotesApp() {
    await this.notesAppLink.click();
  }

}