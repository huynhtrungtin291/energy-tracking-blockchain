"use client";

import { login } from "@/app/apis/api";
import { useAuth } from "@/app/context/UserAuth";
import { Suspense, useEffect, useState } from "react";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { SnackbarType } from "@/app/definations/type";
import SnackbarWithAutoHide from "../snackbar";

interface UserFormData {
  username: string;
  password: string;
}

export default function LoginForm() {
  const { userAuth, isAuthLoading } = useAuth();

  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // chỉ cần set true, Snackbar sẽ tự động ẩn sau n(s) hoặc khi người dùng click nút đóng
  const [message, setMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [type, setType] = useState<SnackbarType>("info");

  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      if (!formData.username || !formData.password) {
        setSubmitting(false);
        return;
      }

      const token = await login(formData.username, formData.password);

      //#region Fake token for testing
      /**
      {
        "username": "admin_dev",
        "name": "Nguyen Van Admin",
        "role": "admin",
        "exp": 1800000000 
      }
      {
        "username": "hoang_user",
        "name": "Hoàng Nguyễn",
        "role": "user",
        "exp": 1800000000
      }
       */
      // const token =
      //   // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluX2RldiIsIm5hbWUiOiJOZ3V5ZW4gVmFuIEFkbWluIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxODAwMDAwMDAwfQ.signature_not_needed";
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhvYW5nX3VzZXIiLCJuYW1lIjoiSG_DoG5nIE5ndXnDqm4iLCJyb2xlIjoidXNlciIsImV4cCI6MTgwMDAwMDAwMH0.signature_not_needed";
      //#endregion

      if (!token) {
        setSubmitting(false);
        return;
      }

      setShowSnackbar(true);
      setType("success");
      setMessage("Đăng nhập thành công!");

      window.location.href = "/";
      localStorage.setItem("auth_token", token);
    } catch (error) {
      console.error("Login failed:", error);
      setShowSnackbar(true);
      setType("error");
      setMessage(
        error instanceof Error ? error.message : "Đăng nhập thất bại!",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  useEffect(() => {
    if (userAuth) {
      console.log("User is authenticated, redirecting...");
      router.push("/");
    }
  }, [router, userAuth]);

  if (isAuthLoading) return <Loading />;

  if (userAuth)
    return <h1>Bạn đã đăng nhập vào tài khoản {userAuth.username}!</h1>;

  return (
    <Suspense fallback={<Loading />}>
      <main className="relative mx-auto flex min-h-screen w-full items-center justify-center bg-[#0f172a] overflow-hidden p-4">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />

        <section className="relative z-10 flex w-full max-w-[30rem] flex-col space-y-10 rounded-2xl bg-white/5 p-10 shadow-2xl backdrop-blur-xl border border-white/10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight   bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Đăng nhập
            </h1>
          </div>

          <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
            <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
              />
              {/* Thanh bar chạy dưới chân khi focus */}
              <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
            </div>

            {/* Input Group: Password */}
            <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
            </div>

            {/* Submit Button với Glow Effect */}
            <button
              type="submit"
              className="relative mt-4 group flex items-center justify-center overflow-hidden rounded-xl bg-indigo-600 py-3.5 font-bold text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : null}
              <span className="relative z-10 uppercase tracking-widest text-sm">
                {submitting ? "Đang xử lý..." : "Đăng nhập"}
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
