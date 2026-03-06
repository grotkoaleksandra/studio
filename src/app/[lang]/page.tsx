import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://dcxxyawykywszehghzyb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjeHh5YXd5a3l3c3plaGdoenliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTQxMTQsImV4cCI6MjA4ODM3MDExNH0.1UM0FtWflGWTVAu6KmjkOW9uBfzV5L6LGvFRXzv_aZY"
);

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  cover_image_url: string | null;
  featured: boolean;
  sort_order: number;
}

async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("id, title, slug, category, cover_image_url, featured, sort_order")
    .not("published_at", "is", null)
    .eq("is_archived", false)
    .order("sort_order", { ascending: true });
  return (data as Project[]) || [];
}

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

  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <>
      {/* Hero — compact, image background */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://picsum.photos/seed/hero-studio/1920/1080)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
            {dict.home.hero.title}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-white/50 max-w-lg">
            {dict.home.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Selected Work */}
      <section id="work" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
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

          {/* Featured projects — full width */}
          <div className="space-y-3">
            {featured.map((project, i) => (
              <Link
                key={project.id}
                id={`project-${project.slug}`}
                href={`/${lang}/programs`}
                className="group relative block overflow-hidden aspect-[2/1]"
              >
                {project.cover_image_url && (
                  <img
                    src={project.cover_image_url}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-light text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/40">
                    {project.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Remaining projects — 2-column grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {rest.map((project) => (
                <Link
                  key={project.id}
                  id={`project-${project.slug}`}
                  href={`/${lang}/programs`}
                  className="group relative block overflow-hidden aspect-video"
                >
                  {project.cover_image_url && (
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="text-lg sm:text-xl font-light text-white">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/40">
                      {project.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-white/10 pt-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted mb-6">
                {dict.home.philosophy.title}
              </h2>
              <p className="text-xl sm:text-2xl font-light leading-relaxed text-foreground/80">
                {dict.home.philosophy.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-surface py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-foreground">
            {dict.home.contact.heading}
          </h2>
          <Link
            href={`/${lang}/contact`}
            className="inline-block mt-8 px-8 py-3 text-sm border border-white/30 text-white hover:bg-white hover:text-black transition-all rounded"
          >
            {dict.home.contact.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
