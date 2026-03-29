"use client";

import React, { useMemo, useState } from "react";
import axiosClient from "@/app/utils/axios-client";

interface FormData {
  username: string;
  electricAmount: string;
  electricInvoice: string; // base64 or data URL of image
  waterAmount: string;
  waterInvoice: string; // base64 or data URL of image
  date: string; // yyyy-MM-dd
}

const CreateReportForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
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
      !!formData.username.trim() &&
      !!formData.electricInvoice.trim() &&
      !!formData.waterInvoice.trim() &&
      !!formData.date &&
      Number.isFinite(electric) &&
      Number.isFinite(water)
    );
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
    setMessage(null);

    if (!isValid) {
      setMessage("Vui lòng điền đầy đủ và đúng định dạng.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        username: formData.username.trim(),
        electric: {
          amount: Number(formData.electricAmount),
          invoiceUrl: formData.electricInvoice.trim(), // base64 image
        },
        water: {
          amount: Number(formData.waterAmount),
          invoiceUrl: formData.waterInvoice.trim(), // base64 image
        },
        date: {
          date: formData.date, // ISO date string (yyyy-MM-dd)
        },
      };

      await axiosClient.post("/resource-usage", payload);
      setMessage("Tạo báo cáo thành công.");
      setFormData({
        username: "",
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
    <main className="relative mx-auto flex min-h-screen w-full items-center justify-center bg-[#0f172a] overflow-hidden p-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />

      <section className="relative z-10 flex w-full max-w-[36rem] flex-col space-y-8 rounded-2xl bg-white/5 p-10 shadow-2xl backdrop-blur-xl border border-white/10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Tạo báo cáo
          </h1>
        </div>

        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
            />
            <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
          </div>

          {/* Electric */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
              <input
                type="number"
                min="0"
                step="0.01"
                name="electricAmount"
                placeholder="Điện (kWh)"
                value={formData.electricAmount}
                onChange={handleChange}
                className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
              />
              <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
            </div>
            <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
              <label className="flex items-center justify-between py-2 text-sm text-slate-300 cursor-pointer">
                {/* <span className=" overflow-hidden max-w-[50px]">{formData.electricInvoice ? formData.electricInvoice : "Ảnh hóa đơn điện"}</span> */}
                <span className="underline">{!formData.electricInvoice ? "Ảnh hóa đơn điện" : "Thay đổi"}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "electricInvoice")}
                />
                {formData.electricInvoice && (
                  <button
                    className="px-3 sm:px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => {}}
                    //   disabled={!formData.electricInvoice}
                  >
                    Xem lại
                  </button>
                )}
              </label>
              <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
            </div>
          </div>

          {/* Water */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
              <input
                type="number"
                min="0"
                step="0.01"
                name="waterAmount"
                placeholder="Nước (m³)"
                value={formData.waterAmount}
                onChange={handleChange}
                className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
              />
              <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
            </div>
            <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
              <label className="flex items-center justify-between py-2 text-sm text-slate-300 cursor-pointer">
                <span>Ảnh hóa đơn nước</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "waterInvoice")}
                />
                <span className="text-indigo-300 text-xs">
                  {formData.waterInvoice ? "Xem lại" : "Chọn / Chụp"}
                </span>
              </label>
              <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
            </div>
          </div>

          {/* Date */}
          <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
            />
            <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
          </div>

          {message && (
            <div className="text-sm text-center text-slate-200 bg-white/5 border border-white/10 rounded-md px-3 py-2">
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="relative mt-2 group overflow-hidden rounded-lg bg-indigo-600 py-3 font-bold transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.6)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 uppercase tracking-[0.2em]">
              {submitting ? "Đang gửi..." : "Tạo"}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </form>
      </section>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </main>
  );
};

export default CreateReportForm;
