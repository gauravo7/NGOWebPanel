
import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  generateExcel(data: any[][], headers: string[], title: any, filters: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title || 'Sheet1');

    // ====== Title Section ======
    const titleRow = worksheet.addRow([title || 'Report']);
    titleRow.font = { bold: true, size: 14 };
    worksheet.mergeCells(`A1:${String.fromCharCode(64 + headers.length)}1`);
    titleRow.alignment = { horizontal: 'center' };

    // ====== Date Section ======
    worksheet.addRow([`Date: ${new Date().toISOString().split('T')[0]}`]);

    // ====== Filters Section ======
    if (filters && Object.keys(filters).length > 0) {
      const filterEntries = Object.entries(filters);
      const maxPerRow = Math.floor(headers.length / 2); // Max filters per row
      let currentRow = worksheet.addRow([]);
      let colIndex = 1;

      // "Filter By =>" label
      currentRow.getCell(colIndex).value = "Filter By =>";
      currentRow.getCell(colIndex).font = { bold: true };
      worksheet.mergeCells(currentRow.number, colIndex, currentRow.number, colIndex + 1);
      colIndex += 2;

      // Loop through filters
      filterEntries.forEach(([key, value], index) => {
        const display = `${key}: ${value}`;
        const cell = currentRow.getCell(colIndex);
        cell.value = display;
        cell.font = { bold: false };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.mergeCells(currentRow.number, colIndex, currentRow.number, colIndex + 1);
        colIndex += 2;
        if ((index + 2) % maxPerRow === 0 && index !== filterEntries.length - 1) {
          currentRow = worksheet.addRow([]);
          colIndex = 1;
        }
      });

      worksheet.addRow([]); // Spacer row
    }

    // ====== Header Section ======
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003E53' },
      };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // ====== Data Section ======
    data.forEach(row => {
      const excelRow = worksheet.addRow(row);
      excelRow.eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // ====== Auto Column Width ======
    headers.forEach((_, i) => {
      let maxLength = headers[i].length;
      data.forEach(row => {
        if (row[i] && row[i].toString().length > maxLength) {
          maxLength = row[i].toString().length;
        }
      });
      worksheet.getColumn(i + 1).width = maxLength + 2;
    });

    // ====== Save File ======
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `${title || 'Report'}.xlsx`);
    });
  }


}




