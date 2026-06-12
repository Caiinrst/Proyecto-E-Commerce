import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

export interface Heroe {
  id?: number;
  nombre: string;
  poder: string;
  fortaleza: string;
  resistencia: string;
  debilidad: string;
  imagen_url: string;
  precio: number;
  stock: number;
  esFavorito?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private readonly API_URL = '/api';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    
    const token = localStorage.getItem('token');
    if (!token || token === '') {
      return null;
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCatalog(): Observable<Heroe[]> {
    const headers = this.getAuthHeaders();
    if (headers) {
      return this.http.get<Heroe[]>(`${this.API_URL}/mechas/catalog`, { headers });
    }
    return this.http.get<Heroe[]>(`${this.API_URL}/mechas/catalog`);
  }

  addFavorite(heroId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.post(`${this.API_URL}/mechas/favorites`, { heroId }, { headers });
  }

  createHero(hero: Omit<Heroe, 'id' | 'esFavorito'>): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.post(`${this.API_URL}/mechas`, hero, { headers });
  }

  updateHero(id: number, hero: Omit<Heroe, 'id' | 'esFavorito'>): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.put(`${this.API_URL}/mechas/${id}`, hero, { headers });
  }

  deleteHero(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.delete(`${this.API_URL}/mechas/${id}`, { headers });
  }

  // ── Métodos de Pedidos (Orders) ──

  placeOrder(items: { mechaId: number, cantidad: number }[]): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.post(`${this.API_URL}/orders`, { items }, { headers });
  }

  getOrderHistory(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.get<any[]>(`${this.API_URL}/orders`, { headers });
  }
}