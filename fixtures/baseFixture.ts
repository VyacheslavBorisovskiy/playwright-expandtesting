import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage'
import { NotesAppPage } from '../pages/NotesAppPage';
import { WebInputsPage } from '../pages/WebInputsPage';

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  notesAppPage: NotesAppPage;
  webInputsPage: WebInputsPage;
};

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await page.route(
      /googlesyndication|doubleclick|adsbygoogle|googletagservices|google-analytics|googletagmanager|pagead2|adtrafficquality/,
      (route) => route.abort(),
    );
    await use(page);
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  notesAppPage: async ({ page }, use) => {
    await use(new NotesAppPage(page));
  },
  webInputsPage: async ({ page }, use) => {
    await use(new WebInputsPage(page));
  }
});

export { expect };