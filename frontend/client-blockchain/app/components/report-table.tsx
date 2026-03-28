"use client";

import { useEffect, useMemo, useState } from "react";
import { reports } from "@/app/test-data/reports";
import ExportXLSXButton from "./export-xlsx-btn";

const PAGE_SIZE = 5;

export default function ReportTable() {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const yearOptions = useMemo(() => {
    const years = Array.from(
      new Set(reports.map((report) => new Date(report.date).getFullYear())),
    );
    return years.sort((a, b) => b - a).map(String);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [selectedYear]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewSrc(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filteredReports = useMemo(() => {
    if (selectedYear === "all") return reports;
    return reports.filter(
      (report) =>
        new Date(report.date).getFullYear().toString() === selectedYear,
    );
  }, [selectedYear]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [filteredReports, currentPage]);

  const formatDate = (value: string | Date) =>
    new Intl.DateTimeFormat("vi-VN").format(new Date(value));

  return (
    <div className="relative mx-auto flex h-screen w-full flex-col overflow-hidden bg-[#0f172a] p-6 text-slate-200">
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      <section className="relative z-10 flex w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        {/* Table Header Section */}
        {/* Đã thêm flex-col, md:flex-row, items-start, md:items-center */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-4 border-b border-white/10 p-6">
          <div>
            <h2 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-lg sm:text-2xl font-bold text-transparent">
              Báo cáo năng lượng tiêu thụ
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded-t-lg border-l border-r border-t border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
            >
              <option value="all">Tất cả năm</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="flex-1 min-h-0 overflow-x-auto pb-4">
          <div className="h-full overflow-y-auto report-scroll">
            <table className="min-w-[1024px] w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-white/5 text-indigo-300 uppercase text-xs tracking-widest sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nhân viên</th>
                  <th className="px-6 py-4 font-semibold">Thời gian</th>
                  <th className="px-6 py-4 font-semibold">Số điện (kWh)</th>
                  <th className="px-6 py-4 font-semibold">Hóa đơn Điện</th>
                  <th className="px-6 py-4 font-semibold">Nước (m³)</th>
                  <th className="px-6 py-4 font-semibold">Hóa đơn Nước</th>
                  <th className="px-6 py-4 font-semibold">Chân trời Carbon</th>
                  <th className="px-6 py-4 font-semibold">
                    Trạng thái Blockchain
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedReports.map((report, index) => (
                  <tr
                    key={`${report.username}-${index}`}
                    className="group transition-all duration-300 hover:bg-white/10 cursor-default"
                  >
                    {/* User */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {report.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          @{report.username}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col text-sm text-slate-200">
                        <span>{formatDate(report.date)}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(report.date).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Electric */}
                    <td className="px-6 py-4 align-top">
                      <span className="font-mono text-yellow-400">
                        {report.ELECTRIC.amount_electric}
                      </span>
                    </td>

                    {/* Electric Invoice */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewSrc(report.ELECTRIC.invoice_electric)
                          }
                          className="h-12 w-12 overflow-hidden rounded-md border border-white/10 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
                        >
                          <img
                            src={report.ELECTRIC.invoice_electric}
                            alt="Electric invoice"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      </div>
                    </td>

                    {/* Water */}
                    <td className="px-6 py-4 align-top">
                      <span className="font-mono text-cyan-400">
                        {report.WATER.amount_water}
                      </span>
                    </td>

                    {/* Water Invoice */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewSrc(report.WATER.invoice_water)
                          }
                          className="h-12 w-12 overflow-hidden rounded-md border border-white/10 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
                        >
                          <img
                            src={report.WATER.invoice_water}
                            alt="Water invoice"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      </div>
                    </td>

                    {/* Carbon */}
                    <td className="px-6 py-4 align-top">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                        <span className="text-sm font-bold">
                          {report.carbon} kgCO2
                        </span>
                      </div>
                    </td>

                    {/* Blockchain Info */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col space-y-1 max-w-[200px]">
                        <div className="flex items-center space-x-1 text-[10px]">
                          <span className="text-slate-500">HASH:</span>
                          <span className="text-indigo-400 truncate font-mono">
                            {report.dataHash}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-[10px]">
                          <span className="text-slate-500">TX:</span>
                          <a
                            href="#"
                            className="text-purple-400 hover:underline truncate font-mono"
                          >
                            {report.address_transtraction}
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full border-t border-white/10">
          <div className="flex ml-auto items-center justify-between px-6 py-4 ">
            {/* Cột 1: left */}
            <ExportXLSXButton reports={reports} />

            {/* Cột 2: center */}
            <div className="text-center">
              <span className="text-xs text-slate-500">
                {currentPage} / {totalPages}
              </span>
            </div>

            {/* Cột 3: right */}
            <div className="flex justify-end gap-3">
              <button
                className="px-3 sm:px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <div className="flex justify-between items-center gap-1">
                  {/** icon mũi tên trái */}
                  <svg
                    style={{ width: 16, height: 16 }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                  <span className="hidden md:inline">Trước</span>
                </div>
              </button>
              <button
                className="px-3 sm:px-4 py-3 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-sm text-indigo-100 hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <div className="flex justify-center items-center">
                  <span className="hidden md:inline">Sau</span>
                  {/** icon mũi tên phải */}
                  <svg
                    style={{ width: 16, height: 16 }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* <ExportXLSXButton reports={reports} /> */}

      {previewSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setPreviewSrc(null)}
        >
          <div
            className="relative max-h-[95vh] max-w-[95vw] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl p-2" // Giảm p-4 xuống p-2 để ảnh to hơn nữa
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewSrc}
              alt="Invoice preview"
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              type="button"
              className="absolute top-3 right-3 rounded-full bg-black/70 px-4 py-2 text-sm text-white hover:bg-black/80 shadow-lg"
              onClick={() => setPreviewSrc(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .report-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(79, 70, 229, 0.6) transparent;
        }
        .report-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .report-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .report-scroll::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.6);
          border-radius: 9999px;
        }
        .report-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.8);
        }
      `}</style>
    </div>
  );
}
