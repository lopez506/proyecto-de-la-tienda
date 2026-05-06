import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';
import { Venta, ItemVenta } from '../models/venta.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private itemsActuales: ItemVenta[] = [];

  constructor(private storage: StorageService) {}

  agregarProducto(producto: Producto): void {
    const item = this.itemsActuales.find(i => i.producto.id === producto.id);
    if (item) {
      item.cantidad++;
      item.subtotal = item.cantidad * producto.precio;
    } else {
      this.itemsActuales.push({
        producto,
        cantidad: 1,
        subtotal: producto.precio
      });
    }
  }

  obtenerItems(): ItemVenta[] {
    return this.itemsActuales;
  }

  obtenerTotal(): number {
    return this.itemsActuales.reduce((acc, item) => acc + item.subtotal, 0);
  }

  calcularCambio(montoPagado: number): number {
    return montoPagado - this.obtenerTotal();
  }

  async finalizarVenta(montoPagado: number): Promise<Venta> {
    const venta: Venta = {
      id: Date.now().toString(),
      items: this.itemsActuales,
      total: this.obtenerTotal(),
      montoPagado,
      cambio: this.calcularCambio(montoPagado),
      fecha: new Date()
    };
    await this.storage.guardar('ultima_venta', venta);
    this.itemsActuales = [];
    return venta;
  }

  limpiarVenta(): void {
    this.itemsActuales = [];
  }
}