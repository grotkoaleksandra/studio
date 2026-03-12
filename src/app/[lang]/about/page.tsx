import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tight mb-6 leading-none">
          {dict.about.title}
        </h1>
        <div className="border-t-4 border-black pt-8">
          <p className="text-xl text-black font-bold mb-16 uppercase tracking-wide">
            {dict.about.description}
          </p>
        </div>

        <section className="border-t-4 border-black pt-8">
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-6">
            {dict.about.history.title}
          </h2>
          <p className="text-lg leading-relaxed text-black">
            {dict.about.history.content}
          </p>
        </section>
      </div>
    </div>
  );
}
