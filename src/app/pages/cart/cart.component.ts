import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../../services/cart.service';
import { HeroesService } from '../../../services/heroes.service';
import { AuthService } from '../../../services/auth.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartService = inject(CartService);
  private heroesService = inject(HeroesService);
  private authService = inject(AuthService);
  private notify = inject(NotifyService);
  private router = inject(Router);

  get items(): CartItem[] {
    return this.cartService.cartItems();
  }

  get total(): number {
    return this.cartService.getTotalPrice();
  }

  get count(): number {
    return this.cartService.getTotalCount();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  incrementQty(item: CartItem) {
    const success = this.cartService.updateQuantity(item.id, item.cantidad + 1);
    if (!success) {
      this.notify.show(`¡Límite de stock alcanzado para ${item.nombre}! ⚠️`, 'info');
    }
  }

  decrementQty(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.cantidad - 1);
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.notify.show('Artículo removido del carrito 🗑️', 'info');
  }

  checkout() {
    if (!this.isLoggedIn) {
      this.notify.show('¡ALTO AHÍ! Inicia sesión para finalizar tu compra 🔒', 'info');
      this.router.navigate(['/login']);
      return;
    }

    const payload = this.items.map(item => ({
      mechaId: item.id,
      cantidad: item.cantidad
    }));

    this.heroesService.placeOrder(payload).subscribe({
      next: (res) => {
        this.notify.show('💥 ¡Compra realizada con éxito! Tus Mechas están en camino 🤖🚚', 'success');
        this.cartService.clearCart();
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        const errorMsg = err?.error?.error || 'Error al procesar el pedido';
        this.notify.show(`❌ ${errorMsg}`, 'error');
        console.error('Error en checkout:', err);
      }
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/Placeholder.png';
  }
}
