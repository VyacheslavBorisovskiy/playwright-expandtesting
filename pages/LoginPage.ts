import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.emailField = page.getByLabel('Email address');
    this.passwordField = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' }); ``
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

}