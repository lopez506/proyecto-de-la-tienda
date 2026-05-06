import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Producto } from '../../core/models/producto.model';
import { InventarioService } from '../../core/services/inventario.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InventarioPage implements OnInit {

  productos: Producto[] = [];
  textoBusqueda: string = '';
  productosFiltrados: Producto[] = [];

  constructor(
    private inventarioService: InventarioService,
    private alertController: AlertController
  ) {}


buscar() {
  const texto = this.textoBusqueda.toLowerCase();
  this.productosFiltrados = this.productos.filter(p =>
    p.nombre.toLowerCase().includes(texto)
  );
}


  obtenerColorSemaforo(producto: Producto): string {
  const estado = this.inventarioService.obtenerEstadoSemaforo(producto);
  if (estado === 'rojo') return '#e53935';
  if (estado === 'amarillo') return '#fdd835';
  return '#43a047';
}

obtenerColorFondo(producto: Producto): string {
  const estado = this.inventarioService.obtenerEstadoSemaforo(producto);
  if (estado === 'rojo') return '#ff4848';      // rojo suave
  if (estado === 'amarillo') return '#fced67';  // amarillo suave
  return '#9afc9e';                             // verde suave
}

    async ngOnInit() {
    await this.cargarProductos();
  }

  async cargarProductos() {
  this.productos = await this.inventarioService.obtenerProductos();
  this.productosFiltrados = this.productos;
}

  async agregarStock(producto: Producto) {
    const alert = await this.alertController.create({
      header: 'Agregar Stock',
      message: `¿Cuántas unidades llegaron de ${producto.nombre}?`,
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Cantidad',
          min: 1
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: async (data) => {
            if (data.cantidad && data.cantidad > 0) {
              await this.inventarioService.agregarStock(producto.id, Number(data.cantidad));
              await this.cargarProductos();
            }
          }
        }
      ]
    });
    await alert.present();
  }
}