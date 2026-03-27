/**
 * Interface cho chi tiết từng loại dịch vụ (Điện/Nước)
 */
interface ServiceDetail {
  amount: number; // amount_ELECTRIC hoặc amount_WATER
  img: string;    // URL hình ảnh minh chứng (hóa đơn, chỉ số đồng hồ)
}

/**
 * Interface chính cho một Bản báo cáo (Report)
 * Phản ánh chính xác cấu trúc dữ liệu bạn đã cung cấp
 */
export interface IReport {
  username: string;
  name: string;
  
  // Dữ liệu Điện
  ELECTRIC: {
    amount_ELECTRIC: number;
    img: string;
  };
  
  // Dữ liệu Nước
  WATER: {
    amount_WATER: number;
    img: string;
  };
  
  carbon: number;           // Lượng khí thải tính toán được
  invoice: string;          // Mã số hóa đơn
  dataHash: string;         // Mã SHA-256 để kiểm tra toàn vẹn dữ liệu
  address_transtraction: string; // Hash giao dịch trên Blockchain
  date: string | Date;      // Thời gian tạo báo cáo
}

/**
 * Props dành cho Component Table mà chúng ta đã thiết kế
 */
export interface ReportTableProps {
  reports: IReport[];
  onRowClick?: (report: IReport) => void; // Optional: Thêm sự kiện khi click vào dòng
}