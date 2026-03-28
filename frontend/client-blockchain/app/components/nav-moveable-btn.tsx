"use client";

import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import { Pencil, UserRoundPlus, Menu, X, ReceiptText } from "lucide-react";
import { useRouter } from "next/navigation";

const actions = [
  {
    icon: <Pencil size={20} />,
    page: "create-report",
    label: "Tạo 1 report",
  },
  {
    icon: <UserRoundPlus size={20} />,
    page: "create-account",
    label: "Tạo 1 account",
  },
    {
    icon: <ReceiptText size={20} />,
    page: "/",
    label: "Danh sách báo cáo",
  },
];

export default function NavMoveableBtn() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  // tạo ref để gắn vào node của Draggable, giúp tránh lỗi khi sử dụng với React 18 Strict Mode và Next.js 13
  const nodeRef = useRef(null);

  const handleDrag = () => {
    setIsDragging(true);
  };

  // Thả chuột
  const handleStop = () => {
    // Đợi một khoảng thời gian cực ngắn để sự kiện click trôi qua
    // trước khi reset trạng thái kéo
    setTimeout(() => {
      setIsDragging(false);
    }, 20);
  };

  const toggleMenu = () => {
    // Chỉ cho phép mở menu nếu KHÔNG phải là đang kéo
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      onDrag={handleDrag}
      onStop={handleStop}
      cancel=".action-item"
    >
      <div
        ref={nodeRef}
        className="fixed z-[100] flex flex-col items-start gap-3"
        style={{
          bottom: 36,
          left: 276,
        }}
      >
        <div
          className={`flex flex-col items-start gap-2 mb-1 transition-all duration-200 ease-out ${
            isOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-95 pointer-events-none"
          }`}
        >
          {actions.map((action, index) => (
            <div
              key={index}
              className="action-item flex items-center gap-2 cursor-pointer group active:scale-95 transition-all duration-200"
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => {
                console.log("Action clicked:", action.label);
                router.push(`/${action.page}`);
                setIsOpen(false); 
              }}
            >
              <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-indigo-100 shadow-[0_10px_40px_rgba(0,0,0,0.25)] border border-white/15 hover:bg-white/15 hover:text-white transition-transform backdrop-blur">
                {action.icon}
              </div>
              <span className="bg-white/10 text-slate-100 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold border border-white/10 backdrop-blur">
                {action.label}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={toggleMenu}
          className={`flex-shrink-0 w-13 h-13 rounded-full flex items-center justify-center text-white shadow-[0_12px_45px_rgba(79,70,229,0.35)] cursor-grab active:cursor-grabbing transition-all ring-2 ring-white/10 ${
            isOpen
              ? "scale-90 bg-slate-800 border border-white/10"
              : "bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 hover:from-indigo-500 hover:to-purple-400"
          }`}
        >
          <div className="pointer-events-none">
            {/* Ngăn icon nhận sự kiện click riêng lẻ */}
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </button>
      </div>
    </Draggable>
  );
}
