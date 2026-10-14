import Image from "next/image";

const PEOPLE = [
  {
    name: "Dylan Walt",
    role: "Co-founder · Electrical and Information Engineering",
    bio: "Dylan’s work at ClevaCado focuses on classifier development and exploring ways to interpret motion events recorded as avocados move through the supply chain.",
  },
  {
    name: "Dylan Simpson",
    role: "Co-founder · Electrical and Information Engineering",
    bio: "Dylan’s work at ClevaCado focuses on prototype logging, data handling, and supporting repeatable tests as the team develops its post-harvest diagnostic approach.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B7FF5A]">About ClevaCado</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <h2 data-display="true" className="text-balance text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.96] tracking-[-0.06em]">Built to make the journey visible.</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-white/58">We are developing a practical way to understand how handling conditions change across the avocado supply chain, and where better evidence can support better decisions.</p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-3 sm:p-5">
          <Image src="/images/clevacado-company-journey.svg" alt="ClevaCado development timeline" width={1600} height={900} className="h-auto w-full rounded-2xl" />
          <p className="px-2 pb-1 pt-4 text-xs leading-relaxed text-white/45">ClevaCado’s development timeline. Prototype work and validation are ongoing.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {PEOPLE.map((person) => (
            <article key={person.name} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#B7FF5A]">{person.role}</p>
              <h3 data-display="true" className="mt-4 text-3xl font-semibold tracking-[-0.05em]">{person.name}</h3>
              <p className="mt-4 text-base leading-relaxed text-white/58">{person.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
