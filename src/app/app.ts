import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NotifyService } from '../services/notify.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('MechaStore App');
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);
  public notify = inject(NotifyService);
  private platformId = inject(PLATFORM_ID);

  isLoggedIn: boolean = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('token');
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.isLoggedIn = false;
    this.authService.logout();
    this.cartService.clearCart(); // Limpiar el carrito al cerrar sesión para seguridad
    this.router.navigate(['/login']);
  }
}