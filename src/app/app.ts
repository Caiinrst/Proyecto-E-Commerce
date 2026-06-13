import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NotifyService } from '../services/notify.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('MechaStore App');
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);
  public notify = inject(NotifyService);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.cartService.clearCart(); // Limpiar el carrito al cerrar sesión para seguridad
    this.router.navigate(['/login']);
  }
}