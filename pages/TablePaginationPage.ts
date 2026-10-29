import { Page, Locator, expect } from '@playwright/test';
import { Student } from '../test-data/students';

export class TablePaginationPage {
  readonly table: Locator;
  readonly rows: Locator;
  readonly searchInput: Locator;
  readonly pageLengthSelect: Locator;
  readonly nextButton: Locator;
  readonly info: Locator;

  constructor(private readonly page: Page) {
    this.table = page.locator('.table');
    this.rows = page.locator('table tbody tr');
    this.searchInput = page.getByRole('searchbox', { name: 'Search:' });
    this.pageLengthSelect = page.locator('.form-select');
    // this.nextButton = page.locator('#example_next');
    this.nextButton = page.getByRole('link', { name: 'Next' });
    this.info = page.locator('.dataTables_info');
  }

  // Assert one row matches the expected student
  async expectRowMatch(index: number, s: Student) {
    await expect(this.rows.nth(index).locator('td')).toHaveText([
      s.name, s.gender, s.classLevel, s.homeState, s.major, s.activity,
    ]);
  }

  async readCurrentPage() {
    await this.waitForRows();
    const rowCount = await this.rows.count();
    const result: Student[] = [];

    for (let i = 0; i < rowCount; i++) {
      const cells = await this.rows.nth(i).locator('td').allTextContents();
      const [name, gender, classLevel, homeState, major, activity] = cells.map(c => c.trim());
      result.push({ name, gender, classLevel, homeState, major, activity } as Student);
    }
    return result;
  }

  async waitForRows() {
    await expect(this.rows.first()).toBeVisible();
    await expect(this.rows.first().locator('td')).toHaveCount(6);
  }

  async readEveryPage() {
    const studentsOnPage: Student[] = [];

    const currentRows = await this.readCurrentPage();

    studentsOnPage.push(...currentRows);
    return studentsOnPage;
  }

  async getRowsOnPage() {
    return await this.rows.count();
  }

  async getRegexOnInfo() {
    const currentInfo = await this.info.innerText();
    return currentInfo.match(/to\s+(\d+)\s+of\s+(\d+)/);
  }

  async goToNextPage() {
    const before = await this.info.innerText();
    await this.nextButton.click();
    await expect(this.info).not.toHaveText(before);
  }

  async readAllPages() {
    const all: Student[] = [];

    while (true) {
      all.push(...(await this.readCurrentPage()));

      const match = (await this.info.innerText()).match(/to\s+(\d+)\s+of\s+(\d+)/);
      if (!match || Number(match[1]) >= Number(match[2])) break;
      await this.goToNextPage();
    }
    return all;
  }
}
