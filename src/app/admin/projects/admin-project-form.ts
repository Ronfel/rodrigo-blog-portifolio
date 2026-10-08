import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreAdminService, FirestoreWriteTimeoutError, getFirestoreWriteErrorMessage } from '../firestore-admin.service';

@Component({
  imports: [FormsModule],
  selector: 'app-admin-project-form',
  templateUrl: './admin-project-form.html',
})
export class AdminProjectForm {
  private readonly content = inject(FirestoreAdminService);

  protected number = '';
  protected name = '';
  protected description = '';
  protected technologiesText = '';
  protected order = 1;
  protected published = true;
  protected saving = false;
  protected writeTimedOut = false;
  protected message = '';
  protected errorMessage = '';

  protected async saveProject(): Promise<void> {
    if (this.saving || this.writeTimedOut) {
      return;
    }

    this.saving = true;
    this.message = '';
    this.errorMessage = '';

    try {
      const technologies = this.technologiesText
        .split(',')
        .map((technology) => technology.trim())
        .filter(Boolean);

      await this.content.createProject({
        number: this.number.trim(),
        name: this.name.trim(),
        description: this.description.trim(),
        technologies,
        order: Number(this.order),
        published: this.published,
      });

      this.message = 'Projeto cadastrado com sucesso.';
      this.number = '';
      this.name = '';
      this.description = '';
      this.technologiesText = '';
      this.order += 1;
    } catch (error) {
      console.error('Project creation failed.', error);
      this.writeTimedOut = error instanceof FirestoreWriteTimeoutError;
      this.errorMessage = getFirestoreWriteErrorMessage(error, 'projeto');
    } finally {
      this.saving = false;
    }
  }
}
