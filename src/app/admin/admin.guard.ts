import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

export const adminGuard: CanActivateChildFn = async () => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);
  const user = await auth.waitForUser();

  return auth.isAdmin(user) ? true : router.parseUrl('/admin/login');
};
