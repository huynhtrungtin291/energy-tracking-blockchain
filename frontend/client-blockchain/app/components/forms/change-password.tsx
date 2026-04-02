"use client";

import { changePassword } from "@/app/apis/api";
import { useAuth } from "@/app/context/UserAuth";
import { Suspense, useEffect, useState } from "react";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Data {
  oldPassword: string;
  newPassword: string;
}

export default function ChangePasswordForm() {
  const { userAuth, isAuthLoading } = useAuth();

  const router = useRouter();

  const [formData, setFormData] = useState<Data>({
    oldPassword: "",
    newPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    setSubmitting(true);
    try {
      if (!formData.oldPassword || !formData.newPassword) {
        setMessage("Vui lòng điền đầy đủ thông tin.");
        setShowSnackbar(true);
        return;
      }

      const response = await changePassword(
        formData.oldPassword,
        formData.newPassword,
      );
      
      if (response) {
        alert(response.message || "Đổi mật khẩu thành công!");
        setFormData({ oldPassword: "", newPassword: "" });
        // setMessage("Đổi mật khẩu thành công!");
        // setShowSnackbar(true);
      }
    } catch (error) {
      console.error("Change password failed:", error);
      setMessage("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.");
      setShowSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleChangePassword();
  };

  useEffect(() => {
    if (!userAuth && !isAuthLoading) {
      console.log("User is not authenticated, redirecting to login...");
      router.push("/login");
    }
  }, [router, userAuth, isAuthLoading]);

  if (isAuthLoading || !userAuth) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <main className="relative mx-auto flex min-h-screen w-full items-center justify-center bg-[#0f172a] overflow-hidden p-4">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />

        <section className="relative z-10 flex w-full max-w-[30rem] flex-col space-y-10 rounded-2xl bg-white/5 p-10 shadow-2xl backdrop-blur-xl border border-white/10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight   bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Đổi mật khẩu
            </h1>
          </div>

          <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
            <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
              <input
                type="text"
                name="oldPassword"
                placeholder="Mật khẩu cũ"
                value={formData.oldPassword}
                onChange={handleChange}
                className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
              />
              {/* Thanh bar chạy dưới chân khi focus */}
              <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
            </div>

            {/* Input Group: Password */}
            <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
              <input
                type="password"
                name="newPassword"
                placeholder="Mật khẩu mới"
                value={formData.newPassword}
                onChange={handleChange}
                className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
              />
              <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
            </div>

            {/* Submit Button với Glow Effect */}
            <button
              type="submit"
              className="relative mt-4 group flex items-center justify-center overflow-hidden rounded-xl bg-indigo-600 py-3.5 font-bold text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {/* <span className="relative z-10 uppercase tracking-[0.2em]">
                Xác nhận
              </span> */}
              {submitting ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : null}
              <span className="relative z-10 uppercase tracking-widest text-sm">
                {submitting ? "Đang xử lý..." : "Xác nhận"}
              </span>
              {/* Hiệu ứng tia sáng quét ngang khi hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>
          </form>
        </section>

        {/* {message && (
          <div
            id="snackbar"
            className={`fixed bottom-14 left-1/2 -translate-x-1/2 text-3xl font-bold transition-all duration-300 ease-in-out ${
              showSnackbar
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
          >
            {message}
          </div>
        )} */}

        {/* Tailwind Keyframes (Thêm vào file CSS hoặc dùng style tag) */}
        <style jsx>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </main>
    </Suspense>
  );
}
