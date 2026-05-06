import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Producto } from '../../core/models/producto.model';
import { ItemVenta } from '../../core/models/venta.model';
import { VentaService } from '../../core/services/venta.service';
import { InventarioService } from '../../core/services/inventario.service';
import { Router } from '@angular/router';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-cobro',
  templateUrl: './cobro.page.html',
  styleUrls: ['./cobro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CobroPage implements OnInit {
  items: ItemVenta[] = [];
  total: number = 0;
  montoPagado: number = 0;
  cambio: number = 0;
  botonesRapidos: Producto[] = [];

constructor(
  private ventaService: VentaService,
  private inventarioService: InventarioService,
  private alertController: AlertController,
  private router: Router,
  private storage: StorageService
) {}

  async ngOnInit() {
    await this.cargarBotonesRapidos();
    this.actualizarVista();
  }

  async cargarBotonesRapidos() {
  // Carga los ids de los botones rápidos guardados
  const ids = await this.storage.obtener('botonesRapidos');
  const todos = await this.inventarioService.obtenerProductos();

  

  if (ids && ids.length > 0) {
    // Si hay botones configurados, los carga en orden
    this.botonesRapidos = ids
      .map((id: string) => todos.find(p => p.id === id))
      .filter((p: Producto | undefined) => p !== undefined);
  } else {
    // Si no hay configuración, toma los primeros 6
    this.botonesRapidos = todos.slice(0, 6);
  }
}

  agregarBotonRapido(producto: Producto) {
    this.ventaService.agregarProducto(producto);
    this.actualizarVista();
  }

  actualizarVista() {
    this.items = this.ventaService.obtenerItems();
    this.total = this.ventaService.obtenerTotal();
    this.calcularCambio();
  }

  calcularCambio() {
    this.cambio = this.montoPagado > 0
      ? this.ventaService.calcularCambio(this.montoPagado)
      : 0;
  }
  
  async finalizarVenta() {
  if (this.items.length === 0) {
    const alert = await this.alertController.create({
      header: 'Venta vacía',
      message: 'Agregá al menos un producto antes de finalizar.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }
  if (this.montoPagado < this.total) {
    const alert = await this.alertController.create({
      header: 'Monto insuficiente',
      message: 'El monto recibido es menor al total.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }
  await this.ventaService.finalizarVenta(this.montoPagado);
  this.montoPagado = 0;
  this.actualizarVista();
}

  paginaActual: string = 'cobro';

cambiarPagina() {
  if (this.paginaActual === 'inventario') {
    this.router.navigate(['/inventario']);
  } else if (this.paginaActual === 'productos') {
    this.router.navigate(['/productos']);
  }
}

async configurarBotonesRapidos() {
  const todos = await this.inventarioService.obtenerProductos();
  const ids = await this.storage.obtener('botonesRapidos') || [];

  const alert = await this.alertController.create({
    header: 'Accesos rápidos',
    message: 'Seleccioná hasta 6 productos',
    inputs: todos.map(p => ({
      type: 'checkbox',
      label: p.nombre,
      value: p.id,
      checked: ids.includes(p.id)
    })),
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Guardar',
        handler: async (seleccionados: string[]) => {
          const limite = seleccionados.slice(0, 6);
          await this.storage.guardar('botonesRapidos', limite);
          await this.cargarBotonesRapidos();
        }
      }
    ]
  });
  await alert.present();
}

async escanear() {
  const result = await CapacitorBarcodeScanner.scanBarcode({
    hint: CapacitorBarcodeScannerTypeHint.ALL
  });

  if (result.ScanResult) {
    const codigo = result.ScanResult;
    const productos = await this.inventarioService.obtenerProductos();
    const producto = productos.find(p => p.codigoBarras === codigo);

    if (producto) {
      this.ventaService.agregarProducto(producto);
      this.actualizarVista();
    } else {
      const alert = await this.alertController.create({
        header: 'Producto no encontrado',
        message: `No hay ningún producto con el código: ${codigo}`,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
}