import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener el rol requerido de las rutas
  const requiredRole = route.data['role'];

  if (authService.isAuthenticated()) {


    if (requiredRole && authService.getUserRole() === requiredRole) {
      return true;
    } else if (!requiredRole) {
      // Si no se especifica un rol, permitir acceso para todos los usuarios autenticados
      return true;
    } else {
      // Si el rol no es el correcto, redirigir a la página de acceso denegado o login
      router.navigate(['/login']);
      return false;
    }
  } else {
    // Si el usuario no está autenticado, redirigir al login
    router.navigate(['/login']);
    return false;
  }
};
