import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Link from "next/link";
import { ProjectIndex } from "@/components/project-index";

const PROJECT_IMAGES: string[] = [
  "https://picsum.photos/seed/meridian/1200/675",
  "https://picsum.photos/seed/undertow/1200/675",
  "https://picsum.photos/seed/glassfauna/800/450",
  "https://picsum.photos/seed/silentfreq/800/450",
  "https://picsum.photos/seed/vessel/800/450",
  "https://picsum.photos/seed/nocturne/800/450",
];

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  const projects = dict.home.projects.items;

  return (
    <>
      {/* Hero — full viewport, image background, content bottom-left */}
      <section className="relative min-h-screen flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://picsum.photos/seed/hero-studio/1920/1080)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-24">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white">
            {dict.home.hero.title}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/50 max-w-xl">
            {dict.home.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Selected Work */}
      <section id="work" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
              {dict.home.projects.title}
            </h2>
            <Link
              href={`/${lang}/programs`}
              className="text-xs uppercase tracking-[0.2em] text-muted hover:text-foreground transition-colors"
            >
              {dict.home.projects.viewAll} &rarr;
            </Link>
          </div>

          {/* Featured projects — first 2 full width */}
          <div className="space-y-4">
            {projects.slice(0, 2).map((project, i) => (
              <Link
                key={project.title}
                id={`project-${slugify(project.title)}`}
                href={`/${lang}/programs`}
                className="group relative block overflow-hidden aspect-[21/9]"
              >
                <img
                  src={PROJECT_IMAGES[i]}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                  <h3 className="text-2xl sm:text-3xl font-light text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/40">
                    {project.category} &middot; {project.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Remaining projects — 2-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {projects.slice(2).map((project, i) => (
              <Link
                key={project.title}
                id={`project-${slugify(project.title)}`}
                href={`/${lang}/programs`}
                className="group relative block overflow-hidden aspect-video"
              >
                <img
                  src={PROJECT_IMAGES[i + 2]}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl sm:text-2xl font-light text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/40">
                    {project.category} &middot; {project.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-white/10 pt-24">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted mb-8">
                {dict.home.philosophy.title}
              </h2>
              <p className="text-2xl sm:text-3xl font-light leading-relaxed text-foreground/80">
                {dict.home.philosophy.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-surface py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground">
            {dict.home.contact.heading}
          </h2>
          <Link
            href={`/${lang}/contact`}
            className="inline-block mt-10 px-8 py-3 text-sm border border-white/30 text-white hover:bg-white hover:text-black transition-all rounded"
          >
            {dict.home.contact.cta}
          </Link>
        </div>
      </section>

      {/* Floating project index */}
      <ProjectIndex projects={projects} />
    </>
  );
}
