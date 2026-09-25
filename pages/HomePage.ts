import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly notesAppLink: Locator;
  readonly webInputsLink: Locator;

  constructor(private readonly page: Page) {
    this.notesAppLink = page.getByRole("link", { name: 'Notes App | React' });
    this.webInputsLink = page.getByRole("link", { name: 'Web inputs' });
  }

  async open() {
    await this.page.goto('/');
  }

  async goToNotesApp() {
    await this.notesAppLink.click();
  }

  async goToWebInputs() {
    await this.webInputsLink.click();
  }

}