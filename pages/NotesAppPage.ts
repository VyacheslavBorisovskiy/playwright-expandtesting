import { Page, Locator } from '@playwright/test';
import { expect } from '../fixtures/baseFixture';

export class NotesAppPage {
  readonly welcomeText: Locator;
  readonly loginLink: Locator;
  readonly profileLink: Locator;
  readonly addNoteButton: Locator;
  readonly addNewNoteText: Locator;
  readonly noteTitleLabel: Locator;
  readonly noteDescriptionLabel: Locator;
  readonly noteCreateButton: Locator;

  constructor(private readonly page: Page) {
    this.welcomeText = page.getByText('Welcome to Notes App');
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.profileLink = page.getByRole('link', { name: 'Profile' });
    this.addNoteButton = page.getByRole('button', { name: '+ Add Note' });
    this.addNewNoteText = page.getByText('Add new note');
    this.noteTitleLabel = page.getByLabel('Title');
    this.noteDescriptionLabel = page.getByLabel('Description');
    this.noteCreateButton = page.getByRole('button', { name: 'Create' });
  }

  async goToLogin() {
    await this.loginLink.click();
  }

  async addNote() {
    await this.addNoteButton.click();
    await expect(this.addNewNoteText).toBeVisible();
    await this.noteTitleLabel.fill('note_home_title2');
    await this.noteDescriptionLabel.fill('note_home_descr2');
    await this.noteCreateButton.click();
  }

  getNoteTitle(title: string): Locator {
    return this.page.getByText(title);
  }

}