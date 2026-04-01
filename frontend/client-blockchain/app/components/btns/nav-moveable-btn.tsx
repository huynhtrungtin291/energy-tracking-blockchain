"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import {
  Pencil,
  UserRoundPlus,
  Menu,
  X,
  ReceiptText,
  LogOut,
  RotateCcwKey,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/UserAuth";

const actions: {
  id: string;
  icon: React.ReactNode;
  to: string;
  label: string;
  onlyAdmin: boolean;
}[] = [
  {
    id: "create-report",
    icon: <Pencil size={20} />,
    to: "create-report",
    label: "Tạo 1 báo cáo",
    onlyAdmin: true,
  },
  {
    id: "create-account",
    icon: <UserRoundPlus size={20} />,
    to: "create-account",
    label: "Tạo 1 tài khoản",
    onlyAdmin: true,
  },
  {
    id: "report-list",
    icon: <ReceiptText size={20} />,
    to: "/",
    label: "Danh sách báo cáo",
    onlyAdmin: false,
  },
  {
    id: "change-password",
    icon: <RotateCcwKey size={20} />,
    to: "/change-password",
    label: "Đổi mật khẩu",
    onlyAdmin: false,
  },
  {
    id: "logout",
    icon: <LogOut size={20} />,
    to: "/login",
    label: "Đăng xuất",
    onlyAdmin: false,
  },
];

export default function NavMoveableBtn() {
  const { userAuth } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [quadrant, setQuadrant] = useState({ x: "left", y: "bottom" });

  const nodeRef = useRef<HTMLDivElement | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const updateQuadrant = useCallback(() => {
    if (!nodeRef.current) return;

    const rect = nodeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setQuadrant({
      x: centerX < window.innerWidth / 2 ? "left" : "right",
      y: centerY < window.innerHeight / 2 ? "top" : "bottom",
    });
  }, []);

  const handleStart = (e: DraggableEvent, data: DraggableData) => {
    dragStartPos.current = { x: data.x, y: data.y };
    setIsDragging(false);
  };

  const handleDrag = () => {
    setIsDragging(true);
    if (isOpen) setIsOpen(false);
  };

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    setTimeout(() => {
      updateQuadrant();
    }, 10);

    const moveX = Math.abs(data.x - dragStartPos.current.x);
    const moveY = Math.abs(data.y - dragStartPos.current.y);

    if (moveX < 3 && moveY < 3) {
      setIsOpen((prev) => !prev);
    }

    setTimeout(() => {
      setIsDragging(false);
    }, 50);
  };

  const getDefaultCoords = () => {
    const btnWidth = 56; // w-14 = 56px
    const btnHeight = 56;
    const padding = 20;
    const coords = {
      x: window.innerWidth / 2 - btnWidth / 2,
      y: btnHeight - padding,
    };
    return coords;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateQuadrant();
    window.addEventListener("resize", updateQuadrant);
    return () => window.removeEventListener("resize", updateQuadrant);
  }, [updateQuadrant]);

  if (!userAuth) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      handle=".drag-handle"
      cancel=".action-item"
      defaultPosition={getDefaultCoords()}
      bounds="parent" // Giữ nút luôn nằm trong màn hình
    >
      {/* Container chính đổi thành relative để làm gốc tọa độ cho menu absolute */}
      <div ref={nodeRef} className="fixed z-[100]">
        {/* === WRAPPER MENU (Sử dụng Absolute) === */}
        <div
          className={`absolute flex flex-col gap-2 transition-all w-max duration-200 ease-out ${
            quadrant.y === "bottom" ? "bottom-full mb-3" : "top-full mt-3"
          } ${
            quadrant.x === "left" ? "left-0 items-start" : "right-0 items-end"
          } ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : `opacity-0 scale-95 pointer-events-none ${
                  quadrant.y === "bottom" ? "translate-y-2" : "-translate-y-2"
                }`
          }`}
        >
          {actions
            .filter((action) => {
              if (!userAuth) return false;
              // nếu nút chỉ cho admin, check user có role admin không?
              return action.onlyAdmin ? userAuth.role === "admin" : true;
            })
            .map((action, index) => (
              <div
                key={index}
                // Đảo chiều flex nếu nằm bên phải để label không bị che
                className={`action-item flex items-center gap-2 cursor-pointer group active:scale-95 transition-all duration-200 ${
                  quadrant.x === "right" ? "flex-row-reverse" : "flex-row"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={() => {
                  if (action.id === "logout") {
                    localStorage.removeItem("auth_token");
                    window.location.href = action.to;
                  } else {
                    router.push(action.to);
                  }
                  setIsOpen(false);
                }}
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 shadow-xl border border-slate-700 hover:bg-slate-700">
                  {action.icon}
                </div>
                <span className="flex-shrink-0 bg-slate-900 text-slate-200 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold border border-slate-700">
                  {action.label}
                </span>
              </div>
            ))}
        </div>

        {/* Nút chính (Menu / X) */}
        <button
          className={`drag-handle flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white cursor-grab active:cursor-grabbing transition-all ring-2 ring-slate-700/50 ${
            isOpen
              ? "scale-90 bg-slate-800 border border-white/10"
              : "bg-slate-800 hover:bg-slate-900 shadow-xl"
          }`}
        >
          <div className="pointer-events-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </button>
      </div>
    </Draggable>
  );
}
