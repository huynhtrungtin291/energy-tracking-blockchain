import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { IReport } from "../definations/report-details";

export const exportToExcel = async (reports: IReport[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reports");

  // 1. Chuẩn bị dữ liệu phẳng (dạng mảng của mảng cho Table)
  const rows = reports.map((item) => [
    item.username,
    item.name,
    item.ELECTRIC.amount_electric,
    item.WATER.amount_water,
    item.carbon,
    item.invoice,
    item.dataHash,
    item.address_transtraction,
    new Date(item.date).toLocaleString(),
  ]);

  // 2. Thêm Table vào Worksheet
  worksheet.addTable({
    name: "ReportTable",
    ref: "A1", // Bắt đầu từ ô A1
    headerRow: true,
    totalsRow: false,
    style: {
      theme: "TableStyleMedium9", // Màu xanh chuyên nghiệp
      showRowStripes: true,
    },
    columns: [
      { name: "Nhân viên", filterButton: true },
      { name: "Họ và tên", filterButton: true },
      { name: "Số điện (kWh)" },
      { name: "Nước (m3)" },
      { name: "Chân trời Carbon" },
      { name: "ID Hóa đơn" },
      { name: "Data Hash" },
      { name: "Blockchain TX" },
      { name: "Thời gian" },
    ],
    rows: rows,
  });

  // 3. Tự động điều chỉnh độ rộng cột (Auto-fit)
  worksheet.columns.forEach((column) => {
    column.width = 20; // Độ rộng mặc định
  });

  // 4. Xuất file và tải về trình duyệt
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
};
