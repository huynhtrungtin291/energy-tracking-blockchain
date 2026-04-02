export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f172a] px-4">
      <div className="absolute -left-16 -top-24 h-[38vh] w-[38vh] rounded-full bg-indigo-600/15 blur-[110px]" />
      <div className="absolute -right-24 -bottom-20 h-[42vh] w-[42vh] rounded-full bg-purple-600/15 blur-[130px]" />
      <div className="absolute left-1/4 top-1/3 h-44 w-44 rotate-6 rounded-[32px] bg-gradient-to-br from-white/6 via-white/2 to-white/0 blur-2xl" />

      <div className="loader">
        <div className="load-inner load-one"></div>
        <div className="load-inner load-two"></div>
        <div className="load-inner load-three"></div>
      </div>

      <style jsx>{`
        .loader {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          margin: 130px 0;
          perspective: 780px;
        }

        .text {
          font-size: 20px;
          font-weight: 700;
          color: #cecece;
          z-index: 10;
        }

        .load-inner {
          position: absolute;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border-radius: 50%;
        }

        .load-inner.load-one {
          left: 0%;
          top: 0%;
          border-bottom: 6px solid #5c5edc;
          animation: rotate1 1.15s linear infinite;
        }

        .load-inner.load-two {
          right: 0%;
          top: 0%;
          border-right: 6px solid #9147ff;
          animation: rotate2 1.15s 0.1s linear infinite;
        }

        .load-inner.load-three {
          right: 0%;
          bottom: 0%;
          border-top: 6px solid #3b82f6;
          animation: rotate3 1.15s 0.15s linear infinite;
        }

        @keyframes rotate1 {
          0% {
            transform: rotateX(45deg) rotateY(-45deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(45deg) rotateY(-45deg) rotateZ(360deg);
          }
        }
        @keyframes rotate2 {
          0% {
            transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg);
          }
        }
        @keyframes rotate3 {
          0% {
            transform: rotateX(-60deg) rotateY(0deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(-60deg) rotateY(0deg) rotateZ(360deg);
          }
        }
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </main>
  );
}
