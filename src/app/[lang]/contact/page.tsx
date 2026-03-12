import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tight mb-4 leading-none">
          {dict.contact.title}
        </h1>
        <p className="text-lg text-black font-bold mb-10 uppercase tracking-wide">
          {dict.contact.description}
        </p>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-black text-black uppercase tracking-widest mb-2"
            >
              {dict.contact.form.name}
            </label>
            <input
              id="name"
              type="text"
              className="w-full border-4 border-black px-4 py-3 text-black bg-white focus:outline-none focus:border-accent text-lg"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-black text-black uppercase tracking-widest mb-2"
            >
              {dict.contact.form.email}
            </label>
            <input
              id="email"
              type="email"
              className="w-full border-4 border-black px-4 py-3 text-black bg-white focus:outline-none focus:border-accent text-lg"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-black text-black uppercase tracking-widest mb-2"
            >
              {dict.contact.form.message}
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full border-4 border-black px-4 py-3 text-black bg-white focus:outline-none focus:border-accent text-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 bg-black text-white text-lg font-black uppercase tracking-widest hover:bg-accent border-4 border-black hover:border-accent"
          >
            {dict.contact.form.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
