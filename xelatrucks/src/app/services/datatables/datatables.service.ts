import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class DatatablesService {

  table: any = $('table');

  constructor() { }

  destroy_table() {
    $('table').dataTable().fnDestroy();
  }

  init_tables() {

    $('table').DataTable({
      order: [],
      responsive: true,
      columnDefs: [{
          targets: 'no-sort',
          orderable: false,
      }],
      dom: '<lf<Btip>>',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print',
        ],
      paging: true,
      lengthChange: true,
      aLengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, 'Todos']
      ],
      searching: true,
      ordering: true,
      info: true,
      autoWidth: true,
      language: {
          paginate: {
              previous: '<i class="fa fa-lg fa-angle-left"></i>',
              next: '<i class="fa fa-lg fa-angle-right"></i>',
              first: 'Primero',
              last: 'Último'
          },
          info: 'Mostrando _START_-_END_ de _TOTAL_ registros',
          empyTable: 'No hay registros',
          infoEmpty: '0 registros',
          lengthChange: 'Mostrar ',
          infoFiltered: '(Filtrado de _MAX_ total de registros)',
          lengthMenu: 'Mostrar _MENU_ registros',
          loadingRecords: 'Cargando...',
          processing: 'Procesando...',
          search: 'Buscar:',
          zeroRecords: 'Sin resultados encontrados'
      }
    });
  }
}
