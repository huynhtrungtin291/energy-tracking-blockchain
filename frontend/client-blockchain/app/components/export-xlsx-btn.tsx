import { exportToExcel } from "@/app/utils/export-xlsx";
import { IReport } from "../definations/report-details";

export default function ExportXLSXButton({ reports }: { reports: IReport[] }) {
  return (
    <button
      onClick={() => exportToExcel(reports, "Environmental_Report")} // temp name
      className="relative group flex items-center space-x-0 md:space-x-2 overflow-hidden rounded-lg bg-emerald-600 p-2.5 md:px-6 md:py-2.5 font-bold transition-all duration-300 hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="hidden md:inline text-sm uppercase tracking-wider">
        Xuất file xlsx
      </span>

      {/* Hiệu ứng tia sáng quét ngang tương tự nút Create Account */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
    </button>
    // <div className="fixed bottom-10 left-10 z-50">
    // <button...>...</button>
    // </div>
  );
}
