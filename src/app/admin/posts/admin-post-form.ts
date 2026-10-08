import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreAdminService, FirestoreWriteTimeoutError, getFirestoreWriteErrorMessage } from '../firestore-admin.service';

@Component({
  imports: [FormsModule],
  selector: 'app-admin-post-form',
  templateUrl: './admin-post-form.html',
})
export class AdminPostForm {
  private readonly content = inject(FirestoreAdminService);

  protected category = '';
  protected title = '';
  protected description = '';
  protected date = '';
  protected readingTime = '5 min de leitura';
  protected order = 1;
  protected published = true;
  protected readonly saving = signal(false);
  protected readonly writeTimedOut = signal(false);
  protected readonly message = signal('');
  protected readonly errorMessage = signal('');

  protected async savePost(): Promise<void> {
    if (this.saving() || this.writeTimedOut()) {
      return;
    }

    this.saving.set(true);
    this.message.set('');
    this.errorMessage.set('');

    try {
      await this.content.createPost({
        category: this.category.trim(),
        title: this.title.trim(),
        description: this.description.trim(),
        date: this.date,
        readingTime: this.readingTime.trim(),
        order: Number(this.order),
        published: this.published,
      });

      this.message.set('Post cadastrado com sucesso.');
      this.category = '';
      this.title = '';
      this.description = '';
      this.date = '';
      this.readingTime = '5 min de leitura';
      this.order += 1;
    } catch (error) {
      console.error('Post creation failed.', error);
      this.writeTimedOut.set(error instanceof FirestoreWriteTimeoutError);
      this.errorMessage.set(getFirestoreWriteErrorMessage(error, 'post'));
    } finally {
      this.saving.set(false);
    }
  }
}
