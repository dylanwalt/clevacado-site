export default function JourneyFilm() {
  return (
    <section className="px-6 py-20 sm:py-28" aria-labelledby="journey-film-title">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B7FF5A]">From harvest to market</p>
            <h2 id="journey-film-title" data-display="true" className="mt-4 text-balance text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">A journey through the chain.</h2>
          </div>
          <a href="/mobile-app-walkthrough/" className="text-sm font-semibold text-[#B7FF5A] underline decoration-white/20 underline-offset-4 hover:decoration-[#B7FF5A]">Explore the app walkthrough</a>
        </div>
        <video className="w-full rounded-[28px] border border-white/10 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.35)]" controls preload="metadata" playsInline aria-label="ClevaCado journey animation">
          <source src="/media/clevacado-journey-film.mp4" type="video/mp4" />
          Your browser does not support embedded video.
        </video>
        <p className="mt-4 text-sm leading-relaxed text-white/45">Concept animation for illustration; it is not footage of a completed commercial trial.</p>
      </div>
    </section>
  );
}
