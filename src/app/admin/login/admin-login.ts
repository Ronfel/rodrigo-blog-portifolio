import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { User } from 'firebase/auth';
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
  protected statusMessage = '';
  protected submitting = false;
  protected verificationUser: User | null = null;

  protected async login(): Promise<void> {
    this.submitting = true;
    this.errorMessage = '';
    this.statusMessage = '';
    this.verificationUser = null;

    try {
      const user = await this.auth.signIn(this.email, this.password);
      if (user.email?.toLowerCase() !== this.adminEmail) {
        await this.auth.signOut();
        this.errorMessage = `Esta área está restrita à conta ${this.adminEmail}.`;
        return;
      }

      if (!user.emailVerified) {
        this.verificationUser = user;
        await this.auth.sendVerificationEmail(user);
        this.statusMessage = `Enviamos um link de confirmação para ${this.adminEmail}. Confira também a pasta de spam. Depois de confirmar, volte aqui e clique em "Já confirmei meu e-mail".`;
        return;
      }

      await this.router.navigateByUrl('/admin/projetos');
    } catch (error) {
      console.error('Admin sign-in failed.', error);
      this.errorMessage = this.getAuthErrorMessage(error);
    } finally {
      this.submitting = false;
    }
  }

  protected async resendVerificationEmail(): Promise<void> {
    if (!this.verificationUser) {
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.statusMessage = '';

    try {
      await this.auth.sendVerificationEmail(this.verificationUser);
      this.statusMessage = `Enviamos outro link de confirmação para ${this.adminEmail}. Confira também a pasta de spam.`;
    } catch (error) {
      console.error('Could not send email verification.', error);
      this.errorMessage = 'Não foi possível enviar o e-mail. Tente novamente mais tarde ou confira os modelos de e-mail no Firebase Console.';
    } finally {
      this.submitting = false;
    }
  }

  protected async confirmEmailVerified(): Promise<void> {
    if (!this.verificationUser) {
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.statusMessage = '';

    try {
      const user = await this.auth.refreshUser(this.verificationUser);
      if (!this.auth.isAdmin(user)) {
        this.statusMessage = 'Ainda não encontramos a confirmação. Abra o link recebido por e-mail e tente novamente.';
        return;
      }

      await user.getIdToken(true);
      await this.router.navigateByUrl('/admin/projetos');
    } catch (error) {
      console.error('Could not refresh email verification status.', error);
      this.errorMessage = 'Não foi possível verificar o status do e-mail. Tente sair e entrar novamente.';
    } finally {
      this.submitting = false;
    }
  }

  private getAuthErrorMessage(error: unknown): string {
    if (!(error instanceof FirebaseError)) {
      return 'Não foi possível entrar. Tente novamente.';
    }

    switch (error.code) {
      case 'auth/operation-not-allowed':
        return 'O provedor E-mail/senha está desativado. Habilite-o em Firebase Console → Authentication → Sign-in method.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'E-mail ou senha incorretos. Confira se a conta existe no projeto Firebase app-explorar.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas de acesso. Aguarde um pouco e tente novamente.';
      case 'auth/invalid-email':
        return 'O endereço de e-mail informado não é válido.';
      case 'auth/unauthorized-domain':
        return 'Este domínio não está autorizado no Firebase. Em Authentication → Settings → Authorized domains, adicione localhost (sem protocolo ou porta).';
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
      case 'auth/app-not-authorized':
      case 'auth/configuration-not-found':
        return 'O Firebase rejeitou a chave da API. A configuração do app está correta; no Google Cloud Console, confira se a chave de API do projeto app-explorar está ativa, sem restrição que bloqueie localhost, e se Identity Toolkit API está habilitada.';
      case 'auth/network-request-failed':
        return 'Não foi possível conectar ao Firebase Authentication. Confira sua conexão, VPN ou bloqueadores de rede.';
      case 'auth/user-disabled':
        return 'Esta conta está desativada no Firebase Authentication. Reative-a em Authentication → Users.';
      default:
        return `Não foi possível entrar (Firebase: ${error.code}). Confira o código do erro no Firebase Console.`;
    }
  }
}
