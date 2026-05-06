export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  umbralAmarillo: number;
  categoria: string;
  codigoBarras?: string;
  foto?: string;
}