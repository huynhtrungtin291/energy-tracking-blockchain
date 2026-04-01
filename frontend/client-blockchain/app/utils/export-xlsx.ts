import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ResponseResourceUsageDto } from "../definations/report-details";

export const exportToExcel = async (
  reports: ResponseResourceUsageDto[],
  fileName: string,
) => {
  const workbook = new ExcelJS.Workbook();

  // --- SHEET 1: REPORTS ---
  const worksheet = workbook.addWorksheet("Reports", {
    views: [{ state: "frozen", ySplit: 6 }], // Cố định 6 dòng đầu để luôn thấy Tiêu đề & Tổng cộng
  });

  // 1. TIÊU ĐỀ CHÍNH (Dòng 1-2)
  worksheet.mergeCells("A1:I2");
  const mainTitle = worksheet.getCell("A1");
  mainTitle.value = "BÁO CÁO DẤU CHÂN CARBON";
  mainTitle.font = {
    bold: true,
    size: 20,
    color: { argb: "FF004B8D" },
    name: "Segoe UI",
  };
  mainTitle.alignment = { vertical: "middle", horizontal: "center" };

  // 2. DÒNG TỔNG HỢP (SUBTOTAL) - Dòng 4
  // Dữ liệu trong bảng bắt đầu từ dòng 7 (sau Header Table ở dòng 6)
  const startDataRow = 7;
  const endDataRow =
    startDataRow + (reports.length > 0 ? reports.length - 1 : 0);

  // Nhãn "Tổng cộng"
  const labelCell = worksheet.getCell("B4");
  labelCell.value = "TỔNG CỘNG:";
  labelCell.font = { bold: true, italic: true };
  labelCell.alignment = { horizontal: "right", vertical: "middle" };

  // Định dạng chung cho các ô chứa công thức Subtotal
  const applySubtotalStyle = (cell: ExcelJS.Cell, unitFmt: string) => {
    cell.font = { bold: true, color: { argb: "FFC53600" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFF2CC" }, // Nền vàng nhạt đặc trưng cho ô tính toán
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "medium" },
      right: { style: "thin" },
    };
    cell.numFmt = `#,##0.00 "${unitFmt}"`;
    cell.alignment = { horizontal: "center" };
  };

  // Cột C: Tổng Số điện (kWh)
  const cellElec = worksheet.getCell("C4");
  cellElec.value = {
    formula: `SUBTOTAL(9, C${startDataRow}:C${endDataRow + 1})`,
  };
  applySubtotalStyle(cellElec, "kWh");

  // Cột D: Tổng Nước (m3)
  const cellWater = worksheet.getCell("D4");
  cellWater.value = {
    formula: `SUBTOTAL(9, D${startDataRow}:D${endDataRow + 1})`,
  };
  applySubtotalStyle(cellWater, "m3");

  // Cột E: Tổng Carbon (kgCO2)
  const cellCarbon = worksheet.getCell("E4");
  cellCarbon.value = {
    formula: `SUBTOTAL(9, E${startDataRow}:E${endDataRow + 1})`,
  };
  applySubtotalStyle(cellCarbon, "kgCO2");

  // 3. CHUẨN BỊ DỮ LIỆU CHO BẢNG
  const tableRows = reports.map((r) => [
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

  // 4. TẠO BẢNG (TABLE) TRONG EXCEL
  worksheet.addTable({
    name: "ReportTable",
    ref: "A6", // Header của bảng nằm ở dòng 6
    headerRow: true,
    style: {
      theme: "TableStyleMedium9",
      showRowStripes: true,
    },
    columns: [
      { name: "Nhân viên", filterButton: true },
      { name: "Họ và tên", filterButton: true },
      { name: "Số điện (kWh)", filterButton: false },
      { name: "Nước (m3)", filterButton: false },
      { name: "Dấu chân Carbon", filterButton: false },
      { name: "Dữ liệu đã Hash", filterButton: false },
      { name: "Dữ liệu chưa Hash", filterButton: false },
      { name: "Blockchain TX", filterButton: false },
      { name: "Thời gian", filterButton: true },
    ],
    rows: tableRows,
  });

  // 5. ĐỊNH DẠNG CỘT (WIDTH)
  worksheet.columns.forEach((column, index) => {
    switch (index) {
      case 0:
        column.width = 15;
        break; // Username
      case 1:
        column.width = 25;
        break; // Name
      case 5: // Hash columns
      case 6:
      case 7:
        column.width = 40;
        break;
      case 8:
        column.width = 25;
        break; // Date
      default:
        column.width = 18;
        break;
    }
  });

  // --- SHEET 2: HƯỚNG DẪN (Tối ưu giao diện) ---
  const guideSheet = workbook.addWorksheet("Hướng dẫn", {
    views: [{ showGridLines: false }], // Ẩn đường lưới cho sạch
  });

  // Tạo khoảng cách lề bên trái (Cột A nhỏ)
  guideSheet.getColumn(1).width = 4;
  guideSheet.getColumn(2).width = 90; // Cột nội dung chính

  // 1. Tiêu đề (Merge B2 thay vì A1 để tạo "padding")
  guideSheet.mergeCells("B2:B2");
  const titleCell = guideSheet.getCell("B2");
  titleCell.value = "HƯỚNG DẪN KIỂM TRA TÍNH TOÀN VẸN DỮ LIỆU";
  titleCell.font = {
    bold: true,
    size: 18,
    color: { argb: "FFFFFFFF" },
    name: "Segoe UI",
  };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0070C0" },
  };

  // 2. Nội dung các bước (Bắt đầu từ hàng 4)
  const steps = [
    { text: "CÁC BƯỚC THỰC HIỆN", isHeader: true },
    {
      text: "1. Tại sheet 'Reports', sao chép giá trị trong cột 'Dữ liệu chưa Hash'.",
      isStep: true,
    },
    {
      text: "2. Truy cập công cụ SHA256 (VD: https://emn178.github.io/online-tools/sha256.html).",
      isStep: true,
    },
    {
      text: "3. Dán dữ liệu vào ô input và xem kết quả tính toán.",
      isStep: true,
    },
    {
      text: "4. So sánh mã vừa nhận được với cột 'Dữ liệu đã Hash' trong file này.",
      isStep: true,
    },
    { text: "KẾT QUẢ PHÂN TÍCH", isHeader: true },
    {
      text: "✔ Nếu trùng khớp: Dữ liệu an toàn, chưa bị can thiệp.",
      isResult: true,
    },
    {
      text: "✘ Nếu khác biệt: Dữ liệu đã bị chỉnh sửa trái phép.",
      isResult: true,
    },
  ];

  let currentRow = 4;
  steps.forEach((item) => {
    const row = guideSheet.getRow(currentRow);
    const cell = row.getCell(2); // Ghi vào cột B
    cell.value = item.text;

    // Styling dựa trên loại nội dung
    if (item.isHeader) {
      cell.font = { bold: true, size: 13, color: { argb: "FF004B8D" } };
      row.height = 30;
    } else if (item.isResult) {
      cell.font = {
        italic: true,
        size: 13,
        color: { argb: item.text.startsWith("✔") ? "FF008000" : "FFCC0000" },
      };
      cell.alignment = { indent: 4 };
      row.height = 25;
    } else {
      cell.font = { size: 13 };
      cell.alignment = { wrapText: true, indent: 2 };
      row.height = 35; // Tăng chiều cao dòng cho dễ đọc
    }

    // Border mỏng cho phần nội dung (không tính header)
    if (!item.isHeader) {
      cell.border = {
        bottom: { style: "hair", color: { argb: "FFD9D9D9" } },
      };
    }

    currentRow++;
  });

  // Đặt sheet Hướng dẫn làm sheet mặc định khi mở file
  // --- THIẾT LẬP VIEW CHO WORKBOOK ---
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 10000,
      firstSheet: 0,
      activeTab: 1, // Focus vào sheet Hướng dẫn (index 1)
      visibility: "visible", // <--- THÊM DÒNG NÀY ĐỂ HẾT LỖI TS
    },
  ];

  // --- XUẤT FILE ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
};
