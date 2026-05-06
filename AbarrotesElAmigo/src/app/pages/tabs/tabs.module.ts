import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'cobro',
        loadComponent: () => import('../cobro/cobro.page').then(m => m.CobroPage)
      },
      {
        path: 'inventario',
        loadComponent: () => import('../inventario/inventario.page').then(m => m.InventarioPage)
      },
      {
        path: 'productos',
        loadComponent: () => import('../productos/productos.page').then(m => m.ProductosPage)
      },
      {
        path: '',
        redirectTo: 'cobro',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TabsPage],
  exports: [RouterModule]
})
export class TabsPageModule {}