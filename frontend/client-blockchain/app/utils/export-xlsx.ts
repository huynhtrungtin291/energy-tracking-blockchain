import * as XLSX from 'xlsx';
import { IReport } from '../definations/report-details';

export const exportToExcel = (reports: IReport[], fileName = "Environmental_Report") => {
  // 1. Chuyển đổi dữ liệu lồng nhau thành dạng phẳng (Flatten)
  const flattenData = reports.map(item => ({
    "Username": item.username,
    "Full Name": item.name,
    "Electric (kWh)": item.ELECTRIC.amount_ELECTRIC,
    "Water (m3)": item.WATER.amount_WATER,
    "Carbon Footprint": item.carbon,
    "Invoice ID": item.invoice,
    "Data Hash": item.dataHash,
    "Blockchain TX": item.address_transtraction,
    "Date": new Date(item.date).toLocaleString(),
  }));

  // 2. Tạo Worksheet từ dữ liệu đã phẳng
  const worksheet = XLSX.utils.json_to_sheet(flattenData);

  // 3. Tạo Workbook (file Excel) và thêm Worksheet vào
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

  // 4. Xuất file (Tải về trình duyệt)
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};