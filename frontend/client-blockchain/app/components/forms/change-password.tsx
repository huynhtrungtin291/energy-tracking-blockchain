"use client";

import { changePassword } from "@/app/apis/api";
import { useAuth } from "@/app/context/UserAuth";
import { Suspense, useEffect, useState } from "react";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import SnackbarWithAutoHide from "../snackbar";
import { SnackbarType } from "@/app/definations/type";

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

  // chỉ cần set true, Snackbar sẽ tự động ẩn sau n(s) hoặc khi người dùng click nút đóng
  const [message, setMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [type, setType] = useState<SnackbarType>("info");

  const [submitting, setSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
        return;
      }

      const response = await changePassword(
        formData.oldPassword,
        formData.newPassword,
      );

      console.log("Change password response:", response);

      if (response && response.message) {
        setShowSnackbar(true);
        setMessage(response.message);
        if (response.message.includes("Mật khẩu cũ không đúng")) {
          setType("error");
        } else {
          setType("success");
          setFormData({ oldPassword: "", newPassword: "" });
        }
      }
    } catch (error) {
      console.error("Change password failed:", error);
      setShowSnackbar(true);
      setType("error");
      setMessage(error instanceof Error ? error.message : "Đổi mật khẩu thất bại!");
      
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
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                placeholder="Mật khẩu cũ"
                value={formData.oldPassword}
                onChange={handleChange}
                className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
              >
                {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {/* Thanh bar chạy dưới chân khi focus */}
              <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
            </div>

            {/* Input Group: Password */}
            <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Mật khẩu mới"
                value={formData.newPassword}
                onChange={handleChange}
                className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
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

        <SnackbarWithAutoHide
          message={message}
          showSnackbar={showSnackbar}
          setShowSnackbar={setShowSnackbar}
          type={type}
        />

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
