import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-contact',
  templateUrl: './contact.html',
})
export class Contact {
  protected name = '';
  protected email = '';
  protected message = '';

  protected sendMessage(): void {
    const subject = encodeURIComponent(`Contato pelo portfólio: ${this.name}`);
    const body = encodeURIComponent(
      `${this.message}`,
    );
    window.location.href = `mailto:rodrigonflara@gmail.com?subject=${subject}&body=${body}`;
  }
}
