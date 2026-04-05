"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { getYearlyUsage } from "../apis/api";
import ExportXLSXButton from "./btns/export-xlsx-btn";
import Loading from "./loading";
import { useAuth } from "../context/UserAuth";
import { useRouter } from "next/navigation";
import {
  MonthYearRangeQueryDto,
  ResponseResourceUsageDto,
} from "../definations/report-details";

const PAGE_SIZE = 5;

export default function ReportTable() {
  const { userAuth, isAuthLoading } = useAuth();
  const router = useRouter();

  const [reports, setReports] = useState<ResponseResourceUsageDto[]>([]);

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userSelected, setUserSelected] = useState<string | null | "All">("All");

  const [page, setPage] = useState(1);

  const [usernameOptions, setUsernameOptions] = useState<string[]>([]);

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const translateStartRef = useRef({ x: 0, y: 0 });
  const closeTimerRef = useRef<number | null>(null);

  const closePreview = () => {
    if (!previewSrc) return;
    setIsClosing(true);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setPreviewSrc(null);
      setIsClosing(false);
    }, 180);
  };

  const clampTranslate = (
    nextX: number,
    nextY: number,
    nextZoom: number = zoom,
  ) => {
    const container = containerRef.current;
    const { width, height } = naturalSize;
    if (!container || !width || !height) return { x: 0, y: 0 };

    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const scaledW = width * nextZoom;
    const scaledH = height * nextZoom;

    const maxX = Math.max(0, (scaledW - containerW) / 2);
    const maxY = Math.max(0, (scaledH - containerH) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, nextX)),
      y: Math.min(maxY, Math.max(-maxY, nextY)),
    };
  };

  const totalPages = Math.max(1, Math.ceil(reports.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return reports.slice(start, start + PAGE_SIZE);
  }, [reports, currentPage]);

  const formatDate = (value: string | Date) =>
    new Intl.DateTimeFormat("vi-VN").format(new Date(value));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClosing(false);
    if (previewSrc) {
      setZoom(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [previewSrc]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [startDate, endDate]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const rawX = translateStartRef.current.x + dx;
      const rawY = translateStartRef.current.y + dy;
      setTranslate(clampTranslate(rawX, rawY));
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const fetchReports = async () => {
      if (isAuthLoading || !userAuth) return;

      setIsDataLoading(true);
      setFetchError(null);

      let fromValue = startDate;
      let toValue = endDate;

      if (startDate && !endDate) {
        toValue = new Date().toISOString().split("T")[0];
        setEndDate(toValue);
      }

      if (endDate && !startDate) {
        const d = new Date(endDate);
        d.setMonth(d.getMonth() - 12);
        fromValue = d.toISOString().split("T")[0];
        setStartDate(fromValue);
      }

      if (fromValue && toValue) {
        const fromDate = new Date(fromValue);
        const toDate = new Date(toValue);
        if (fromDate > toDate) {
          setFetchError("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
          setIsDataLoading(false);
          return;
        }
      }

      const payload: MonthYearRangeQueryDto = {};

      console.log("userSelected:", userSelected);

      if (fromValue) payload.from = new Date(`${fromValue}T00:00:00.000Z`);
      if (toValue) payload.to = new Date(`${toValue}T00:00:00.000Z`);
      if (userSelected && userSelected !== "All") payload.username = userSelected;

      console.log("filter payload:", payload);

      try {
        const apiData = await getYearlyUsage(payload);

        console.log("Fetched reports:", apiData);
        setReports(apiData);

        const usernames = apiData.map((item) => item.username).filter(Boolean);
        setUsernameOptions((prev) =>
          Array.from(new Set([...prev, ...usernames, "All"])).filter(Boolean),
        );
        
      } catch (error) {
        console.error("Failed to fetch reports", error);
        setFetchError("Không thể tải báo cáo. Vui lòng thử lại.");
        setReports([]);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchReports();
  }, [startDate, endDate, userSelected, isAuthLoading, userAuth]);

  useEffect(() => {
    // Only redirect once auth finished loading; prevents false negatives on first render
    // isAuthLoading được khởi tạo là true, userAuth được khởi tạo là null,
    if (!isAuthLoading && !userAuth) {
      console.log("User is not authenticated, redirecting to login...");
      router.push("/login");
    }
  }, [router, userAuth, isAuthLoading]);

  if (isAuthLoading || !userAuth || isDataLoading) return <Loading />;
  
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative mx-auto flex h-screen w-full flex-col overflow-hidden bg-[#0f172a] p-6 text-slate-200">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

        <section className="relative z-10 flex w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          {/* Table Header Section */}
          {/* Đã thêm flex-col, md:flex-row, items-start, md:items-center */}
          <div className="flex flex-col p-0 lg:flex-row lg:justify-between lg:items-center items-start gap-4 border-b border-white/10 p-6">
            <div>
              <div className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-lg sm:text-2xl font-bold text-transparent">
                Báo cáo năng lượng tiêu thụ
              </div>
              {fetchError && (
                <p className="text-sm text-red-300 mt-2">{fetchError}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={userSelected || "All"}
                onChange={(e) => setUserSelected(e.target.value)}
                className="w-[80px] sm:w-auto rounded-t-lg border-l border-r border-t border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400 appearance-none cursor-pointer"
              >
                <option value="All" disabled hidden>
                  All
                </option>
                {usernameOptions.map((username) => (
                  <option
                    key={username}
                    value={username}
                    className="bg-slate-800"
                  >
                    {username}
                  </option>
                ))}
              </select>

              <span className="text-sm text-slate-300">Từ:</span>
              <input
                type="date"
                value={startDate}
                max={endDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[56px] sm:w-auto rounded-t-lg border-l border-r border-t border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
                placeholder="Từ"
              />

              <span className="text-sm text-slate-300">Đến:</span>
              <input
                type="date"
                value={endDate}
                min={startDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[56px] sm:w-auto rounded-t-lg border-l border-r border-t border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
                placeholder="Đến"
              />
            </div>
          </div>

          {/* Table Wrapper */}
          <div className="flex-1 min-h-0 overflow-x-auto pb-4">
            <div className="h-full overflow-y-auto report-scroll">
              <table className="min-w-[1024px] w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-[#0f172a] text-indigo-300 uppercase text-xs tracking-widest sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Nhân viên</th>
                    <th className="px-6 py-4 font-semibold">Thời gian</th>
                    <th className="px-6 py-4 font-semibold">Số điện (kWh)</th>
                    <th className="px-6 py-4 font-semibold">Hóa đơn Điện</th>
                    <th className="px-6 py-4 font-semibold">Nước (m³)</th>
                    <th className="px-6 py-4 font-semibold">Hóa đơn Nước</th>
                    <th className="px-6 py-4 font-semibold">Carbon</th>
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
                        </div>
                      </td>

                      {/* Electric */}
                      <td className="px-6 py-4 align-top">
                        <span className="font-mono text-yellow-400">
                          {report.electric.amount_electric}
                        </span>
                      </td>

                      {/* Electric Invoice */}
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewSrc(report.electric.invoice_electric)
                            }
                            className="h-12 w-12 overflow-hidden rounded-md border border-white/10 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
                          >
                            <img
                              src={report.electric.invoice_electric}
                              alt="Electric invoice"
                              className="h-full w-full object-cover"
                            />
                          </button>
                        </div>
                      </td>

                      {/* Water */}
                      <td className="px-6 py-4 align-top">
                        <span className="font-mono text-cyan-400">
                          {report.water.amount_water}
                        </span>
                      </td>

                      {/* Water Invoice */}
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewSrc(report.water.invoice_water)
                            }
                            className="h-12 w-12 overflow-hidden rounded-md border border-white/10 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
                          >
                            <img
                              src={report.water.invoice_water}
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
                        <div className="flex flex-col space-y-1 max-w-[311px]">
                          <div className="flex items-center space-x-1 text-[10px]">
                            <span className="text-slate-500">HASH:</span>
                            <span className="text-indigo-400 truncate font-mono">
                              {report.dataHash}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-[10px]">
                            <span className="text-slate-500">TX:</span>
                            <a
                              href={`https://coston2-explorer.flare.network/tx/${report.address_transaction}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:underline truncate font-mono"
                            >
                              {report.address_transaction}
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
            onClick={closePreview}
          >
            <button
              type="button"
              className="border border-white/10 fixed top-4 right-4 rounded-full px-4 py-2 text-sm text-white hover:bg-black/90 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                closePreview();
              }}
            >
              Close
            </button>
            <div
              ref={containerRef}
              className={`relative overflow-hidden rounded-2xl shadow-2xl p-2 preview-animate ${
                isClosing ? "preview-animate-out" : "preview-animate-in"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                ref={imgRef}
                src={previewSrc}
                alt="Invoice preview"
                className={`max-w-[80vw] max-h-[80vh] w-auto h-auto select-none ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                draggable={false}
                onLoad={(e) =>
                  setNaturalSize({
                    width: e.currentTarget.naturalWidth,
                    height: e.currentTarget.naturalHeight,
                  })
                }
                style={{
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
                  transition: isDragging ? "none" : "transform 80ms ease-out",
                }}
                onWheel={(e) => {
                  e.preventDefault();
                  const direction = e.deltaY < 0 ? 1 : -1;
                  const nextZoom = Math.min(
                    5,
                    Math.max(0.5, zoom + direction * 0.1),
                  );
                  setZoom(nextZoom);
                  setTranslate((prev) =>
                    clampTranslate(prev.x, prev.y, nextZoom),
                  );
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                  dragStartRef.current = { x: e.clientX, y: e.clientY };
                  translateStartRef.current = { ...translate };
                }}
                onMouseLeave={() => setIsDragging(false)}
              />
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
    </Suspense>
  );
}
