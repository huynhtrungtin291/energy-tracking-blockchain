"use client";

import { changePassword, } from "@/app/apis/api";
import { useAuth } from "@/app/context/UserAuth";
import { Suspense, useEffect, useState } from "react";
import Loading from "../loading";
import { useRouter } from "next/navigation";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (!formData.oldPassword || !formData.newPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    const response = await changePassword(
      userAuth?.username || "unknown_user",
      formData.oldPassword,
      formData.newPassword,
    );

    if (response) {
      alert("Password changed successfully!");
      setFormData({ oldPassword: "", newPassword: "" });
    } else {
      alert("Failed to change password. Please try again.");
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
              Change Password
            </h1>
          </div>

          <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
            <div className="group relative w-full border-b-2 border-gray-700 bg-transparent text-lg transition-all duration-500 focus-within:border-indigo-500">
              <input
                type="text"
                name="oldPassword"
                placeholder="Old Password"
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
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                className="peer w-full border-none bg-transparent py-2 outline-none placeholder:text-gray-600 focus:outline-none"
              />
              <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-focus-within:w-full" />
            </div>

            {/* Submit Button với Glow Effect */}
            <button
              type="submit"
              className="relative mt-6 group overflow-hidden rounded-lg bg-indigo-600 py-3 font-bold transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.6)] active:scale-95"
            >
              <span className="relative z-10 uppercase tracking-[0.2em]">
                Change Password
              </span>
              {/* Hiệu ứng tia sáng quét ngang khi hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>
          </form>
        </section>

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
