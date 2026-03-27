"use client";

import { reports } from "@/app/test-data/reports";
import { exportToExcel } from "@/app/utils/export-xlsx";

const ReportTable = () => {
  return (
    <div className="relative mx-auto w-full max-w-6xl p-6 bg-[#0f172a] min-h-screen text-slate-200">
      {/* Background Decor tương tự code mẫu */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      <section className="relative z-10 w-full overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Table Header Section */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Environmental Reports
          </h2>
          <span className="text-xs uppercase tracking-[0.2em] text-indigo-400/60 font-semibold">
            Blockchain Verified
          </span>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto report-scroll pb-4">
          <table className="min-w-[960px] w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white/5 text-indigo-300 uppercase text-xs tracking-widest">
                <th className="px-6 py-4 font-semibold">User / Date</th>
                <th className="px-6 py-4 font-semibold">Electric (kWh)</th>
                <th className="px-6 py-4 font-semibold">Water (m³)</th>
                <th className="px-6 py-4 font-semibold">Carbon Footprint</th>
                <th className="px-6 py-4 font-semibold">Blockchain Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.map((report, index) => (
                <tr
                  key={index}
                  className="group transition-all duration-300 hover:bg-white/10 cursor-default"
                >
                  {/* User & Date */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {report.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        @{report.username} •{" "}
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  {/* Electric */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden border border-white/10 bg-slate-800">
                        <img
                          src={report.ELECTRIC.img}
                          alt="Elec"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-mono text-yellow-400">
                        {report.ELECTRIC.amount_ELECTRIC}
                      </span>
                    </div>
                  </td>

                  {/* Water */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden border border-white/10 bg-slate-800">
                        <img
                          src={report.WATER.img}
                          alt="Water"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-mono text-cyan-400">
                        {report.WATER.amount_WATER}
                      </span>
                    </div>
                  </td>

                  {/* Carbon */}
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                      <span className="text-sm font-bold">
                        {report.carbon} kgCO2
                      </span>
                    </div>
                  </td>

                  {/* Blockchain Info */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1 max-w-[180px]">
                      <div className="flex items-center space-x-1 text-[10px]">
                        <span className="text-slate-500">HASH:</span>
                        <span className="text-indigo-400 truncate font-mono">
                          {report.dataHash}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-[10px]">
                        <span className="text-slate-500">TX:</span>
                        <a
                          href="#"
                          className="text-purple-400 hover:underline truncate font-mono"
                        >
                          {report.address_transtraction}
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => exportToExcel(reports)}
            className="relative group overflow-hidden rounded-lg bg-emerald-600 px-6 py-2.5 font-bold transition-all duration-300 hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="uppercase tracking-wider text-sm">
              Export Excel
            </span>

            {/* Hiệu ứng tia sáng quét ngang tương tự nút Create Account */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </div>
      </section>

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
  );
};

export default ReportTable;
