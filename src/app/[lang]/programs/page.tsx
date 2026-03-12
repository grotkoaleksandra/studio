import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tight mb-4 leading-none">
          {dict.programs.title}
        </h1>
        <p className="text-lg text-black font-bold mb-12 uppercase tracking-wide">
          {dict.programs.description}
        </p>

        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {dict.programs.list.map((program, i) => (
            <div
              key={i}
              className="border-4 border-black p-8 hover:bg-black hover:text-white group"
            >
              <span className="text-sm font-bold text-accent group-hover:text-accent tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl font-black uppercase mt-2 mb-4">{program.title}</h3>
              <p className="text-base leading-relaxed">{program.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
