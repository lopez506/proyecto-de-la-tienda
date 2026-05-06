import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private datos: { [key: string]: any } = {};

  async guardar(clave: string, valor: any): Promise<void> {
    this.datos[clave] = valor;
    localStorage.setItem(clave, JSON.stringify(valor));
  }

  async obtener(clave: string): Promise<any> {
    if (this.datos[clave]) {
      return this.datos[clave];
    }
    const item = localStorage.getItem(clave);
    return item ? JSON.parse(item) : null;
  }

  async eliminar(clave: string): Promise<void> {
    delete this.datos[clave];
    localStorage.removeItem(clave);
  }
}