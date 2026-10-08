import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { AdminAuthService, ADMIN_EMAIL } from '../admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.html',
})
export class AdminLogin {
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly adminEmail = ADMIN_EMAIL;
  protected errorMessage = '';
  protected submitting = false;

  protected async login(): Promise<void> {
    this.submitting = true;
    this.errorMessage = '';

    try {
      const user = await this.auth.signInWithGoogle();
      if (!this.auth.isAdmin(user)) {
        await this.auth.signOut();
        this.errorMessage = `Acesse com a conta Google ${this.adminEmail}.`;
        return;
      }

      await this.router.navigateByUrl('/admin/projetos');
    } catch (error) {
      console.error('Admin Google sign-in failed.', error);
      this.errorMessage = this.getAuthErrorMessage(error);
    } finally {
      this.submitting = false;
    }
  }

  private getAuthErrorMessage(error: unknown): string {
    if (!(error instanceof FirebaseError)) {
      return 'Não foi possível iniciar o login com Google. Tente novamente.';
    }

    switch (error.code) {
      case 'auth/unauthorized-domain':
        return 'Este domínio não está autorizado no Firebase. Em Authentication → Settings → Authorized domains, adicione localhost (sem protocolo ou porta).';
      case 'auth/operation-not-allowed':
        return 'O provedor Google está desativado. Habilite-o em Firebase Console → Authentication → Sign-in method.';
      case 'auth/popup-blocked':
        return 'O navegador bloqueou a janela de login. Permita pop-ups para localhost e tente novamente.';
      case 'auth/popup-closed-by-user':
        return 'A janela de login foi fechada antes da conclusão. Tente novamente.';
      case 'auth/cancelled-popup-request':
        return 'Já existe uma janela de login aberta. Conclua essa tentativa ou feche-a antes de tentar novamente.';
      case 'auth/account-exists-with-different-credential':
        return `Já existe uma conta Firebase para ${this.adminEmail} com outro método. Vincule Google à conta ou remova a conta antiga em Authentication → Users antes de entrar com Google.`;
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
      case 'auth/app-not-authorized':
      case 'auth/configuration-not-found':
        return 'O Firebase rejeitou a chave da API (API_KEY_INVALID). A configuração local coincide com a do app no Firebase; verifique ou substitua a chave em Google Cloud Console → APIs e serviços → Credenciais.';
      case 'auth/network-request-failed':
        return 'Não foi possível conectar ao Firebase Authentication. Confira sua conexão, VPN ou bloqueadores de rede.';
      case 'auth/sign-in-timeout':
        return 'O Firebase não concluiu o login após 15 segundos. O app recebeu API_KEY_INVALID; corrija ou substitua a chave de API do projeto app-explorar em Google Cloud Console → APIs e serviços → Credenciais.';
      default:
        return `Não foi possível entrar com Google (Firebase: ${error.code}).`;
    }
  }
}
