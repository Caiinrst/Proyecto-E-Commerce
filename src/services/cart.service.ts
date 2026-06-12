import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  id: number;
  nombre: string;
  imagen_url: string;
  precio: number;
  stock: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  
  // Signal para guardar la lista de artículos
  cartItems = signal<CartItem[]>([]);

  constructor() {
    this.loadCart();
  }

  private saveCart() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    }
  }

  private loadCart() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          this.cartItems.set(JSON.parse(saved));
        } catch (e) {
          console.error('Error al cargar el carrito:', e);
          this.cartItems.set([]);
        }
      }
    }
  }

  addToCart(mecha: any, quantity: number = 1): boolean {
    if (!mecha.id) return false;
    
    const currentItems = [...this.cartItems()];
    const existingIndex = currentItems.findIndex(item => item.id === mecha.id);

    if (existingIndex > -1) {
      const newQty = currentItems[existingIndex].cantidad + quantity;
      if (newQty > mecha.stock) {
        // No superar el stock disponible
        currentItems[existingIndex].cantidad = mecha.stock;
        this.cartItems.set(currentItems);
        this.saveCart();
        return false; // indica que llegó al límite de stock
      }
      currentItems[existingIndex].cantidad = newQty;
    } else {
      // Validar si la cantidad pedida no supera el stock
      const qtyToAdd = Math.min(quantity, mecha.stock);
      if (qtyToAdd <= 0) return false;

      currentItems.push({
        id: mecha.id,
        nombre: mecha.nombre,
        imagen_url: mecha.imagen_url,
        precio: mecha.precio,
        stock: mecha.stock,
        cantidad: qtyToAdd
      });
    }

    this.cartItems.set(currentItems);
    this.saveCart();
    return true;
  }

  removeFromCart(mechaId: number) {
    const updated = this.cartItems().filter(item => item.id !== mechaId);
    this.cartItems.set(updated);
    this.saveCart();
  }

  updateQuantity(mechaId: number, quantity: number): boolean {
    const currentItems = [...this.cartItems()];
    const index = currentItems.findIndex(item => item.id === mechaId);

    if (index > -1) {
      if (quantity <= 0) {
        this.removeFromCart(mechaId);
        return true;
      }

      if (quantity > currentItems[index].stock) {
        currentItems[index].cantidad = currentItems[index].stock;
        this.cartItems.set(currentItems);
        this.saveCart();
        return false; // supera el stock
      }

      currentItems[index].cantidad = quantity;
      this.cartItems.set(currentItems);
      this.saveCart();
      return true;
    }
    return false;
  }

  clearCart() {
    this.cartItems.set([]);
    this.saveCart();
  }

  getTotalCount(): number {
    return this.cartItems().reduce((acc, item) => acc + item.cantidad, 0);
  }

  getTotalPrice(): number {
    return this.cartItems().reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }
}
