"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axiosClient from "@/app/utils/axios-client";
import { useAuth } from "@/app/context/UserAuth";
// Import icons từ lucide-react
import { Eye, Loader2, Upload } from "lucide-react";
import Loading from "../loading";
import { useRouter } from "next/navigation";

interface FormData {
  electricAmount: string;
  electricInvoice: string;
  waterAmount: string;
  waterInvoice: string;
  date: string;
}

const CreateReportForm: React.FC = () => {
  const { userAuth, isAuthLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    electricAmount: "",
    electricInvoice: "",
    waterAmount: "",
    waterInvoice: "",
    date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "electricAmount" || name === "waterAmount") {
      // Allow only non-negative decimals (empty string permitted for editing)
      const numericRegex = /^((\d+)(\.\d*)?|\.\d*)$/;
      if (value === "" || numericRegex.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "electricInvoice" | "waterInvoice",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setFormData((prev) => ({ ...prev, [key]: dataUrl }));
      setMessage(null);
    } catch (err) {
      console.error(err);
      setMessage("Không đọc được ảnh, thử lại.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setMessage(null);
    try {
      const payload = {
        username: userAuth?.username || "unknown_user",
        electric: {
          amount: Number(formData.electricAmount),
          invoiceUrl: formData.electricInvoice,
        },
        water: {
          amount: Number(formData.waterAmount),
          invoiceUrl: formData.waterInvoice,
        },
        date: {
          date: formData.date,
        },
      };

      await axiosClient.post("/resource-usage", payload);
      setMessage("Tạo báo cáo thành công.");
      setFormData({
        electricAmount: "",
        electricInvoice: "",
        waterAmount: "",
        waterInvoice: "",
        date: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setIsClosing(false);
    if (previewSrc) {
      setZoom(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [previewSrc]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

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

  const isValid = useMemo(() => {
    const electric = Number(formData.electricAmount);
    const water = Number(formData.waterAmount);
    return (
      !!formData.electricInvoice.trim() &&
      !!formData.waterInvoice.trim() &&
      !!formData.date &&
      Number.isFinite(electric) &&
      electric >= 0 &&
      Number.isFinite(water) &&
      water >= 0
    );
  }, [formData]);

  useEffect(() => {
    if (!userAuth && !isAuthLoading) {
      console.log("User is not authenticated, redirecting to login...");
      router.push("/login");
    }
  }, [router, userAuth, isAuthLoading]);

  if (isAuthLoading || !userAuth) return <Loading />;

  return (
    <main className="relative mx-auto flex min-h-screen w-full items-center justify-center bg-[#0f172a] overflow-hidden p-4 font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />

      <section className="relative z-10 flex w-full max-w-[32rem] flex-col space-y-8 rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur-xl border border-white/10">
        <div className="text-center">
          <h1 className="leading-normal text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Tạo Báo Cáo
          </h1>
        </div>

        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          {/* Row: Electric */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 items-end">
            {/* Input: chiếm 2 cột trên mobile, 4 cột trên sm */}
            <div className="col-span-2 sm:col-span-4 group relative border-b-2 border-gray-700 transition-all duration-500 focus-within:border-indigo-500 flex items-center">
              <input
                type="text"
                inputMode="decimal"
                pattern="^((\\d+)(\\.\\d*)?|\\.\\d*)$"
                name="electricAmount"
                placeholder="Điện (kWh)"
                value={formData.electricAmount}
                onChange={handleChange}
                className="w-full bg-transparent py-2 text-lg text-white outline-none placeholder:text-gray-600"
              />
            </div>

            {/* Buttons: luôn chiếm 1 cột */}
            <div className="col-span-1 flex items-center justify-end gap-2">
              <button
                title="Xem hóa đơn điện"
                type="button"
                className={`p-2 rounded-full bg-white/5 hover:bg-white/10 border-white/10 transition-all
                  ${formData.electricInvoice ? "text-purple-400 active:scale-90" : "text-gray-600 cursor-not-allowed"}`}
                onClick={() => setPreviewSrc(formData.electricInvoice)}
                disabled={!formData.electricInvoice}
              >
                <Eye size={20} />
              </button>
              <label
                title="Thêm ảnh hóa đơn điện"
                className="cursor-pointer p-2 rounded-full bg-white/5 hover:bg-white/10 border-white/10 transition-all active:scale-90 text-indigo-400"
              >
                <Upload size={20} />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "electricInvoice")}
                />
              </label>
            </div>
          </div>

          {/* Row: Water */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 items-end">
            <div className="col-span-2 sm:col-span-4 group relative border-b-2 border-gray-700 transition-all duration-500 focus-within:border-indigo-500 flex items-center">
              <input
                type="text"
                inputMode="decimal"
                pattern="^((\\d+)(\\.\\d*)?|\\.\\d*)$"
                name="waterAmount"
                placeholder="Nước (m³)"
                value={formData.waterAmount}
                onChange={handleChange}
                className="w-full bg-transparent py-2 text-lg text-white outline-none placeholder:text-gray-600"
              />
            </div>

            <div className="col-span-1 flex items-center justify-end gap-2">
              <button
                title="Xem hóa đơn nước"
                type="button"
                className={`p-2 rounded-full bg-white/5 hover:bg-white/10 border-white/10 transition-all
                  ${formData.waterInvoice ? "text-purple-400 active:scale-90" : "text-gray-600 cursor-not-allowed"}`}
                onClick={() => setPreviewSrc(formData.waterInvoice)}
                disabled={!formData.waterInvoice}
              >
                <Eye size={20} />
              </button>

              <label
                title="Thêm ảnh hóa đơn nước"
                className="cursor-pointer p-2 rounded-full bg-white/5 hover:bg-white/10 border-white/10 transition-all active:scale-90 text-indigo-400"
              >
                <Upload size={20} />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "waterInvoice")}
                />
              </label>
            </div>
          </div>

          {/* Row: Date */}
          <div className="group relative w-full border-b-2 border-gray-700 transition-all duration-500 focus-within:border-indigo-500">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-transparent py-2 text-lg text-white outline-none [color-scheme:dark]"
            />
          </div>

          {message && (
            <div className="text-sm text-center text-slate-200 bg-white/5 border border-white/10 rounded-md px-3 py-2 animate-in fade-in zoom-in duration-300">
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="relative mt-4 group flex items-center justify-center overflow-hidden rounded-xl bg-indigo-600 py-3.5 font-bold text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : null}
            <span className="relative z-10 uppercase tracking-widest text-sm">
              {submitting ? "Đang xử lý..." : "Gửi báo cáo"}
            </span>
          </button>
        </form>
      </section>

      <style jsx>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>

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
    </main>
  );
};

export default CreateReportForm;
