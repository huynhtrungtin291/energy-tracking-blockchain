import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ResponseResourceUsageDto } from "../definations/report-details";

/**
 * Hàm hỗ trợ tải ảnh từ URL và chuyển thành ArrayBuffer
 */
const loadImageAsBuffer = async (url: string): Promise<ArrayBuffer | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.arrayBuffer();
  } catch (error) {
    console.error("Không thể tải ảnh từ URL:", url, error);
    return null;
  }
};

export const exportToExcel = async (
  reports: ResponseResourceUsageDto[],
  fileName: string,
) => {
  const workbook = new ExcelJS.Workbook();

  // --- SHEET 1: REPORTS ---
  const worksheet = workbook.addWorksheet("Reports", {
    views: [{ state: "frozen", ySplit: 6 }],
  });

  // 1. TIÊU ĐỀ CHÍNH (Dòng 1-2)
  worksheet.mergeCells("A1:K2"); // Mở rộng merge đến cột K vì thêm cột
  const mainTitle = worksheet.getCell("A1");
  mainTitle.value = "Báo cáo năng lượng tiêu thụ";
  mainTitle.font = {
    bold: true,
    size: 20,
    color: { argb: "FF004B8D" },
    name: "Segoe UI",
  };
  mainTitle.alignment = { vertical: "middle", horizontal: "center" };

  // 2. DÒNG TỔNG HỢP (SUBTOTAL) - Dòng 4
  const startDataRow = 7;
  const endDataRow =
    startDataRow + (reports.length > 0 ? reports.length - 1 : 0);

  const labelCell = worksheet.getCell("B4");
  labelCell.value = "TỔNG CỘNG:";
  labelCell.font = { bold: true, italic: true };
  labelCell.alignment = { horizontal: "right", vertical: "middle" };

  const applySubtotalStyle = (cell: ExcelJS.Cell, unitFmt: string) => {
    cell.font = { bold: true, color: { argb: "FFC53600" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFF2CC" },
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

  // Cột C: Tổng Số điện
  const cellElec = worksheet.getCell("C4");
  cellElec.value = {
    formula: `SUBTOTAL(9, C${startDataRow}:C${endDataRow + 1})`,
  };
  applySubtotalStyle(cellElec, "kWh");

  // Cột E: Tổng Nước (Lưu ý cột E vì cột D là ảnh)
  const cellWater = worksheet.getCell("E4");
  cellWater.value = {
    formula: `SUBTOTAL(9, E${startDataRow}:E${endDataRow + 1})`,
  };
  applySubtotalStyle(cellWater, "m3");

  // 3. CHUẨN BỊ DỮ LIỆU CHO BẢNG (Để trống các cột chứa ảnh)
  const tableRows = reports.map((r) => [
    r.username,
    r.name,
    r.electric.amount_electric,
    "", // Cột D: Placeholder cho Ảnh hóa đơn điện
    r.water.amount_water,
    "", // Cột F: Placeholder cho Ảnh hóa đơn nước
    r.carbon,
    r.dataHash,
    r.dataToHash,
    r.address_transaction,
    new Date(r.date).toLocaleString(),
  ]);

  // 4. TẠO BẢNG (TABLE)
  worksheet.addTable({
    name: "ReportTable",
    ref: "A6",
    headerRow: true,
    style: {
      theme: "TableStyleMedium9",
      showRowStripes: true,
    },
    columns: [
      { name: "Nhân viên", filterButton: true },
      { name: "Họ và tên", filterButton: true },
      { name: "Số điện (kWh)", filterButton: false },
      { name: "Hóa đơn điện", filterButton: false }, // Cột D
      { name: "Nước (m3)", filterButton: false },
      { name: "Hóa đơn nước", filterButton: false }, // Cột F
      { name: "Dấu chân Carbon", filterButton: false },
      { name: "Dữ liệu đã Hash", filterButton: false },
      { name: "Dữ liệu chưa Hash", filterButton: false },
      { name: "Blockchain TX", filterButton: false },
      { name: "Thời gian", filterButton: true },
    ],
    rows: tableRows,
  });

  // 5. XỬ LÝ CHÈN ẢNH VÀO TỪNG DÒNG
  for (let i = 0; i < reports.length; i++) {
    const report = reports[i];
    const currentRowIndex = startDataRow + i;
    const row = worksheet.getRow(currentRowIndex);

    // Tăng chiều cao dòng để ảnh hiển thị rõ (ví dụ: 80pt)
    row.height = 80;
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true, // Tự động xuống dòng nếu text quá dài (như mã Hash)
      };
    });

    // Chèn ảnh hóa đơn điện (Cột D - index 3)
    if (report.electric.invoice_electric) {
      const imgBuf = await loadImageAsBuffer(report.electric.invoice_electric);
      if (imgBuf) {
        const imgId = workbook.addImage({
          buffer: imgBuf,
          extension: "png",
        });
        worksheet.addImage(imgId, {
          tl: { col: 3, row: currentRowIndex - 1 },
          ext: { width: 100, height: 100 },
          editAs: "oneCell",
        });
      }
    }

    // Chèn ảnh hóa đơn nước (Cột F - index 5)
    if (report.water.invoice_water) {
      const imgBuf = await loadImageAsBuffer(report.water.invoice_water);
      if (imgBuf) {
        const imgId = workbook.addImage({
          buffer: imgBuf,
          extension: "png",
        });
        worksheet.addImage(imgId, {
          tl: { col: 5, row: currentRowIndex - 1 },
          ext: { width: 100, height: 100 },
          editAs: "oneCell",
        });
      }
    }
  }

  // 6. ĐỊNH DẠNG CỘT (WIDTH)
  worksheet.columns.forEach((column, index) => {
    switch (index) {
      case 0:
        column.width = 15;
        break; // Username
      case 1:
        column.width = 25;
        break; // Name
      case 3: // Ảnh điện
      case 5: // Ảnh nước
        column.width = 20;
        break;
      case 7: // Hash
      case 8: // Raw data
      case 9: // TX
        column.width = 40;
        break;
      case 10:
        column.width = 25;
        break; // Date
      default:
        column.width = 15;
        break;
    }
  });

  // --- SHEET 2: HƯỚNG DẪN ---
  const guideSheet = workbook.addWorksheet("Hướng dẫn", {
    views: [{ showGridLines: false }],
  });

  guideSheet.getColumn(1).width = 4;
  guideSheet.getColumn(2).width = 90;

  guideSheet.mergeCells("B2:B2");
  const titleCell = guideSheet.getCell("B2");
  titleCell.value = "HƯỚNG DẪN KIỂM TRA TÍNH TOÀN VẸN DỮ LIỆU";
  titleCell.font = { bold: true, size: 18, color: { argb: "FFFFFFFF" } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0070C0" },
  };

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

  let currentGuideRow = 4;
  steps.forEach((item) => {
    const cell = guideSheet.getCell(`B${currentGuideRow}`);
    cell.value = item.text;
    if (item.isHeader) {
      cell.font = { bold: true, size: 13, color: { argb: "FF004B8D" } };
    } else if (item.isResult) {
      cell.font = {
        italic: true,
        size: 13,
        color: { argb: item.text.startsWith("✔") ? "FF008000" : "FFCC0000" },
      };
    } else {
      cell.font = { size: 13 };
    }
    currentGuideRow++;
  });

  // Đặt sheet Hướng dẫn làm mặc định
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 10000,
      firstSheet: 0,
      activeTab: 1,
      visibility: "visible",
    },
  ];

  // --- XUẤT FILE ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
};
