import { expect, test } from "../../fixtures/userFixture";
import { Page } from "@playwright/test";
import { students } from "../../test-data/students";

test.describe("Student table - row data", () => {
  test.beforeEach(async ({ homePage, tablePaginationPage }) => {
    await homePage.open();
    await homePage.goToPagination();
    await expect(tablePaginationPage.table).toBeVisible();
  });

  // test('The column headers are shown',
  //   { tag: ['@regression', '@ui'] },
  //   async ({ tablePaginationPage }) => {

  //     const expectedHeaders = [
  //       'Student Name',
  //       'Gender',
  //       'Class Level',
  //       'Home State',
  //       'Major',
  //       'Extracurricular Activity',
  //     ];

  //     const headers = tablePaginationPage.table.getByRole('columnheader');
  //     await expect(headers).toHaveCount(6);
  //     await expect(headers).toHaveText(expectedHeaders);
  //   }
  // )

  // test('The rows values are shown on the first page when three rows are on it',
  //   { tag: ['@regression', '@ui'] },
  //   async ({ tablePaginationPage }) => {

  //     await expect(tablePaginationPage.rows).toHaveCount(3);
  //     for (let i = 0; i < 3; i++) {
  //       await tablePaginationPage.expectRowMatch(i, students[i]);
  //     }
  //   }
  // )

  // test('all pages together match the expected dataset',
  //   { tag: ['@regression', '@ui'] },
  //   async ({ tablePaginationPage }) => {

  //     const actual = await tablePaginationPage.readAllPages();
  //     expect(actual).toHaveLength(students.length);
  //     expect(actual).toEqual(students);

  //   }
  // )

  test(
    "every page should match the expected dataset",
    { tag: ["@regression", "@ui"] },
    async ({ tablePaginationPage, page }) => {
      const numberOfRows: number = (await tablePaginationPage.readAllPages())
        .length;

      const numberOfPages = (): number => {
        return Math.ceil(numberOfRows / 3);
      };

      for (let i = 0; i < numberOfPages(); i++) {
        await page.reload();
        const numberOfRows: number = await tablePaginationPage.getRowsOnPage();
        console.log("Number of rows: " + numberOfRows);

        const studentOnPage = await tablePaginationPage.readEveryPage();
        console.log("Student on page: " + studentOnPage.length);

        expect(studentOnPage).toEqual(students.slice(0, numberOfRows));

        const match = await tablePaginationPage.getRegexOnInfo();
        if (Number(match[1]) >= Number(match[2])) break;
        await tablePaginationPage.goToNextPage();
      }
    },
  );
});
