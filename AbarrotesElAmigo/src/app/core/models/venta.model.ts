import { Producto } from './producto.model';

export interface ItemVenta {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export interface Venta {
  id: string;
  items: ItemVenta[];
  total: number;
  montoPagado: number;
  cambio: number;
  fecha: Date;
}