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
      {/* Hero — brutalist, hard black bar over image */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://picsum.photos/seed/hero-studio/1920/1080)`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tight text-white leading-none">
              {dict.home.hero.title}
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-white font-bold uppercase tracking-widest">
              {dict.home.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Selected Work */}
      <section id="work" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10 border-b-4 border-black pb-4">
            <h2 className="text-xl uppercase tracking-[0.3em] text-black font-black">
              {dict.home.projects.title}
            </h2>
            <Link
              href={`/${lang}/programs`}
              className="text-base uppercase tracking-[0.2em] text-black hover:text-accent font-bold border-b-2 border-black hover:border-accent"
            >
              {dict.home.projects.viewAll} &rarr;
            </Link>
          </div>

          {/* Featured projects — full width, thick borders */}
          <div className="space-y-0">
            {featured.map((project, i) => (
              <Link
                key={project.id}
                id={`project-${project.slug}`}
                href={`/${lang}/programs`}
                className="group relative block overflow-hidden aspect-[2/1] border-4 border-black"
              >
                {project.cover_image_url && (
                  <img
                    src={project.cover_image_url}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-50"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black p-4 sm:p-6">
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-accent font-bold uppercase tracking-widest">
                    {project.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Remaining projects — tight grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {rest.map((project) => (
                <Link
                  key={project.id}
                  id={`project-${project.slug}`}
                  href={`/${lang}/programs`}
                  className="group relative block overflow-hidden aspect-video border-4 border-black"
                >
                  {project.cover_image_url && (
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:opacity-50"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black p-4">
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-accent font-bold uppercase tracking-widest">
                      {project.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Philosophy — black bg contrast block */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="border-t-4 border-white pt-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl uppercase tracking-[0.3em] text-accent font-black mb-8">
                {dict.home.philosophy.title}
              </h2>
              <p className="text-3xl sm:text-4xl font-black leading-tight text-white uppercase">
                {dict.home.philosophy.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA — red accent block */}
      <section className="border-t-4 border-black py-20 px-6 bg-accent text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            {dict.home.contact.heading}
          </h2>
          <Link
            href={`/${lang}/contact`}
            className="inline-block mt-8 px-12 py-4 text-lg font-black uppercase tracking-widest border-4 border-white text-white bg-transparent hover:bg-white hover:text-accent"
          >
            {dict.home.contact.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
