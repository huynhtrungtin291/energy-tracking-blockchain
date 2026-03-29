"use client";

import React, { useMemo, useState } from "react";
import axiosClient from "@/app/utils/axios-client";
import { useAuth } from "@/app/context/UserAuth";
// Import icons từ lucide-react
import { Plus, Eye, Loader2 } from "lucide-react";

interface FormData {
  electricAmount: string;
  electricInvoice: string;
  waterAmount: string;
  waterInvoice: string;
  date: string;
}

const CreateReportForm: React.FC = () => {
  const { userAuth } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    electricAmount: "",
    electricInvoice: "",
    waterAmount: "",
    waterInvoice: "",
    date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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

  return (
    <main className="relative mx-auto flex min-h-screen w-full items-center justify-center bg-[#0f172a] overflow-hidden p-4 font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />

      <section className="relative z-10 flex w-full max-w-[32rem] flex-col space-y-8 rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur-xl border border-white/10">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Tạo báo cáo
          </h1>
        </div>

        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          {/* Row: Electric */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 items-end">
            {/* Input: chiếm 2 cột trên mobile, 4 cột trên sm */}
            <div className="col-span-2 sm:col-span-4 group relative border-b-2 border-gray-700 transition-all duration-500 focus-within:border-indigo-500 flex items-center">
              <input
                type="number"
                name="electricAmount"
                placeholder="Điện (kWh)"
                value={formData.electricAmount}
                onChange={handleChange}
                className="w-full bg-transparent py-2 text-lg text-white outline-none placeholder:text-gray-600"
              />
            </div>

            {/* Buttons: luôn chiếm 1 cột */}
            <div className="col-span-1 flex items-center justify-end gap-2">
              {formData.electricInvoice && (
                <button
                  title="Xem hóa đơn"
                  type="button"
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-purple-400 border border-white/10 transition-all active:scale-90 animate-in zoom-in"
                  onClick={() => window.open(formData.electricInvoice)}
                >
                  <Eye size={20} />
                </button>
              )}
              <label
                title="Thêm ảnh hóa đơn"
                className="cursor-pointer p-2 rounded-full bg-white/5 hover:bg-white/10 text-indigo-400 border border-white/10 transition-all active:scale-90"
              >
                <Plus size={20} />
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
                type="number"
                name="waterAmount"
                placeholder="Nước (m³)"
                value={formData.waterAmount}
                onChange={handleChange}
                className="w-full bg-transparent py-2 text-lg text-white outline-none placeholder:text-gray-600"
              />
            </div>

            <div className="col-span-1 flex items-center justify-end gap-2">
              {formData.waterInvoice && (
                <button
                  title="Xem hóa đơn"
                  type="button"
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-purple-400 border border-white/10 transition-all active:scale-90 animate-in zoom-in"
                  onClick={() => window.open(formData.waterInvoice)}
                >
                  <Eye size={20} />
                </button>
              )}
              <label
                title="Thêm ảnh hóa đơn"
                className="cursor-pointer p-2 rounded-full bg-white/5 hover:bg-white/10 text-indigo-400 border border-white/10 transition-all active:scale-90"
              >
                <Plus size={20} />
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
    </main>
  );
};

export default CreateReportForm;
