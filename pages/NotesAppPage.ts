import { Page, Locator } from '@playwright/test';

export class NotesAppPage {
  readonly welcomeText: Locator;
  readonly loginLink: Locator;
  readonly profileLink: Locator;

  constructor(private readonly page: Page) {
    this.welcomeText = page.getByText('Welcome to Notes App');
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.profileLink = page.getByRole('link', {name: 'Profile'});
  }

  async goToLogin() {
    await this.loginLink.click();
  }

}