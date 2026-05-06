import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Producto } from '../../core/models/producto.model';
import { InventarioService } from '../../core/services/inventario.service';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductosPage implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  textoBusqueda: string = '';

  constructor(
    private inventarioService: InventarioService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.cargarProductos();
  }

  async cargarProductos() {
    this.productos = await this.inventarioService.obtenerProductos();
    this.productosFiltrados = this.productos;
  }

  buscar() {
    const texto = this.textoBusqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
  }

  editarProducto(producto: Producto) {
  this.abrirFormulario(producto);
}

async eliminarProducto(producto: Producto) {
  const alert = await this.alertController.create({
    header: 'Eliminar producto',
    message: `¿Seguro que querés eliminar "${producto.nombre}"?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        handler: async () => {
          await this.inventarioService.eliminarProducto(producto.id);
          await this.cargarProductos();
        }
      }
    ]
  });
  await alert.present();
}

  async abrirFormulario(productoEditar?: Producto) {
  const alert = await this.alertController.create({
    header: productoEditar ? 'Editar producto' : 'Nuevo producto',
    inputs: [
      {
        name: 'nombre',
        type: 'text',
        placeholder: 'Nombre del producto',
        value: productoEditar?.nombre || ''
      },
      {
        name: 'precio',
        type: 'number',
        placeholder: 'Precio (₡)',
        value: productoEditar?.precio || ''
      },
      {
        name: 'cantidad',
        type: 'number',
        placeholder: 'Cantidad inicial',
        value: productoEditar?.cantidad || ''
      },
      {
        name: 'categoria',
        type: 'text',
        placeholder: 'Categoría',
        value: productoEditar?.categoria || ''
      },
      {
        name: 'umbralAmarillo',
        type: 'number',
        placeholder: 'Umbral amarillo (default 10)',
        value: productoEditar?.umbralAmarillo || ''
      },
      {
        name: 'codigoBarras',
        type: 'text',
        placeholder: 'Código de barras (opcional)',
        value: productoEditar?.codigoBarras || ''
      }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: '📷 Escanear código',
        handler: async () => {
          const result = await CapacitorBarcodeScanner.scanBarcode({
            hint: CapacitorBarcodeScannerTypeHint.ALL
          });
          if (result.ScanResult) {
            await this.abrirFormularioConCodigo(productoEditar, result.ScanResult);
          }
          return false;
        }
      },
      {
        text: productoEditar ? 'Guardar' : 'Agregar',
        handler: async (data) => {
          if (!data.nombre || !data.precio) return;
          const producto: Producto = {
            id: productoEditar?.id || Date.now().toString(),
            nombre: data.nombre,
            precio: Number(data.precio),
            cantidad: Number(data.cantidad) || 0,
            categoria: data.categoria || 'General',
            umbralAmarillo: Number(data.umbralAmarillo) || 10,
            codigoBarras: data.codigoBarras || ''
          };
          await this.inventarioService.guardarProducto(producto);
          await this.cargarProductos();
        }
      }
    ]
  });
  await alert.present();
}

async abrirFormularioConCodigo(productoEditar?: Producto, codigo?: string) {
  const alert = await this.alertController.create({
    header: productoEditar ? 'Editar producto' : 'Nuevo producto',
    inputs: [
      {
        name: 'nombre',
        type: 'text',
        placeholder: 'Nombre del producto',
        value: productoEditar?.nombre || ''
      },
      {
        name: 'precio',
        type: 'number',
        placeholder: 'Precio (₡)',
        value: productoEditar?.precio || ''
      },
      {
        name: 'cantidad',
        type: 'number',
        placeholder: 'Cantidad inicial',
        value: productoEditar?.cantidad || ''
      },
      {
        name: 'categoria',
        type: 'text',
        placeholder: 'Categoría',
        value: productoEditar?.categoria || ''
      },
      {
        name: 'umbralAmarillo',
        type: 'number',
        placeholder: 'Umbral amarillo (default 10)',
        value: productoEditar?.umbralAmarillo || ''
      },
      {
        name: 'codigoBarras',
        type: 'text',
        placeholder: 'Código de barras',
        value: codigo || productoEditar?.codigoBarras || ''
      }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: productoEditar ? 'Guardar' : 'Agregar',
        handler: async (data) => {
          if (!data.nombre || !data.precio) return;
          const producto: Producto = {
            id: productoEditar?.id || Date.now().toString(),
            nombre: data.nombre,
            precio: Number(data.precio),
            cantidad: Number(data.cantidad) || 0,
            categoria: data.categoria || 'General',
            umbralAmarillo: Number(data.umbralAmarillo) || 10,
            codigoBarras: data.codigoBarras || ''
          };
          await this.inventarioService.guardarProducto(producto);
          await this.cargarProductos();
        }
      }
    ]
  });
  await alert.present();
}
}