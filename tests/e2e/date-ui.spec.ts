import { test, expect } from '../../fixtures/baseFixture';

test('date should be properly entered',
  { tag: '@regression' },
  async ({ homePage, webInputsPage }) => {
    await homePage.open();
    await homePage.goToWebInputs();
    await webInputsPage.inputDate();
    await expect(webInputsPage.webInputsText).toBeVisible();
  }
)