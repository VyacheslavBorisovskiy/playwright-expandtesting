import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly notesAppLink: Locator;
  readonly webInputsLink: Locator;
  readonly pageTableLink: Locator;

  constructor(private readonly page: Page) {
    this.notesAppLink = page.getByRole('link', { name: 'Notes App | React' });
    this.webInputsLink = page.getByRole('link', { name: 'Web inputs' });
    this.pageTableLink = page.getByRole('link', { name: 'Dynamic Pagination Table' });
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

  async goToPagination() {
    await this.pageTableLink.click();
  }

}