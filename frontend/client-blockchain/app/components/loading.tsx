export default function Loading() {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f172a] px-4">
			<div className="absolute -left-16 -top-24 h-[38vh] w-[38vh] rounded-full bg-indigo-600/15 blur-[110px]" />
			<div className="absolute -right-24 -bottom-20 h-[42vh] w-[42vh] rounded-full bg-purple-600/15 blur-[130px]" />
			<div className="absolute left-1/4 top-1/3 h-44 w-44 rotate-6 rounded-[32px] bg-gradient-to-br from-white/6 via-white/2 to-white/0 blur-2xl" />

			<section className="relative z-10 flex w-full flex-col items-center">
				<div className="relative flex h-20 w-20 items-center justify-center">
					<span className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-400 via-purple-400 to-cyan-300 opacity-70 blur-md animate-pulse" />
					<span className="absolute inset-0 animate-spin rounded-full border-[6px] border-white/10 border-t-transparent" />
				</div>

			</section>

			<style jsx>{`
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
