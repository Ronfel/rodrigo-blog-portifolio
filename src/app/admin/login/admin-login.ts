import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService, ADMIN_EMAIL } from '../admin-auth.service';

@Component({
  imports: [FormsModule],
  selector: 'app-admin-login',
  templateUrl: './admin-login.html',
})
export class AdminLogin {
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly adminEmail = ADMIN_EMAIL;
  protected email = ADMIN_EMAIL;
  protected password = '';
  protected errorMessage = '';
  protected submitting = false;

  protected async login(): Promise<void> {
    this.submitting = true;
    this.errorMessage = '';

    try {
      await this.auth.signIn(this.email, this.password);
      const user = await this.auth.waitForUser();
      if (!this.auth.isAdmin(user)) {
        await this.auth.signOut();
        this.errorMessage = `Use a conta ${this.adminEmail} e confirme o endereço de e-mail antes de entrar.`;
        return;
      }
      await this.router.navigateByUrl('/admin/projetos');
    } catch (error) {
      console.error('Admin sign-in failed.', error);
      this.errorMessage = 'Não foi possível entrar. Confira o e-mail, a senha e a configuração do Firebase Authentication.';
    } finally {
      this.submitting = false;
    }
  }
}
