import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private CLAVE = 'productos';

  constructor(private storage: StorageService) {}

  async obtenerProductos(): Promise<Producto[]> {
    const productos = await this.storage.obtener(this.CLAVE);
    return productos || [];
  }

  async guardarProducto(producto: Producto): Promise<void> {
    const productos = await this.obtenerProductos();
    const index = productos.findIndex(p => p.id === producto.id);
    if (index >= 0) {
      productos[index] = producto;
    } else {
      productos.push(producto);
    }
    await this.storage.guardar(this.CLAVE, productos);
  }

  async eliminarProducto(id: string): Promise<void> {
    const productos = await this.obtenerProductos();
    const filtrados = productos.filter(p => p.id !== id);
    await this.storage.guardar(this.CLAVE, filtrados);
  }

  async agregarStock(id: string, cantidad: number): Promise<void> {
    const productos = await this.obtenerProductos();
    const producto = productos.find(p => p.id === id);
    if (producto) {
      producto.cantidad += cantidad;
      await this.storage.guardar(this.CLAVE, productos);
    }
  }

  obtenerEstadoSemaforo(producto: Producto): 'rojo' | 'amarillo' | 'verde' {
    if (producto.cantidad === 0) return 'rojo';
    if (producto.cantidad < producto.umbralAmarillo) return 'amarillo';
    return 'verde';
  }
}