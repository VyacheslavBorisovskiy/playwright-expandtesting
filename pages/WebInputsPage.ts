import { Page, Locator } from '@playwright/test';

export class WebInputsPage {
  readonly webInputsText: Locator;
  readonly dateInput: Locator;

  constructor(private readonly page: Page) {
    this.webInputsText = page.getByText('Web inputs page for Automation Testing Practice');
    this.dateInput = page.getByLabel('Input: Date');
  }

  async inputDate() {
    await this.dateInput.fill('2026-06-20');
  }
}