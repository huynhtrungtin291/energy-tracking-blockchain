import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ResponseResourceUsageDto } from "../definations/report-details";

export const exportToExcel = async (
  reports: ResponseResourceUsageDto[],
  fileName: string,
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reports");

  // 1. Chuẩn bị dữ liệu phẳng (dạng mảng của mảng cho Table)
  const rows = reports.map((r) => [
    r.username,
    r.name,
    r.electric.amount_electric,
    r.water.amount_water,
    r.carbon,
    r.dataHash,
    r.dataToHash,
    r.address_transaction,
    new Date(r.date).toLocaleString(),
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
      { name: "Dữ liệu đã Hash" },
      { name: "Dữ liệu chưa Hash" },
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
