import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { formatDate } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class DatatablesService {

  table: any = $('table');

  constructor() { }

  destroy_table() {
    $('#table1').dataTable().fnDestroy();
    $('#myTable').DataTable().draw(false);
  }

  destroy_table2() {
    $('#table2').dataTable().fnDestroy();
  }

  init_tables() {

    $('#table1').DataTable({
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

  init_tables2() {

    $('#table2').DataTable({
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

  init_datePicker( defaultdate: string ) {
    flatpickr('#flatpickr', {
      locale: Spanish,
      enableTime: false,
      dateFormat: 'd/m/Y',
      defaultDate: defaultdate
    });
  }

  init_datePicker2() {
    flatpickr('#flatpickr02', {
      locale: Spanish
    });
  }

  fromJsonDate(jDate): string {

    const bDate: Date = new Date(jDate);
    const formattedDate = moment(bDate).format('DD/MM/YYYY');
    return formattedDate.toString().substring(0, 10);  // Ignore time

  }

  fromJsonHour(jDate): string {

    const bDate: Date = new Date(jDate);
    const formattedDate = moment(bDate).format('HH:mm');
    return formattedDate.toString();  // Ignore time

  }

}
