import type { Dictionary } from "@/i18n/types";
import { getVersion } from "@/lib/version";

export function Footer({ dict }: { dict: Dictionary }) {
  const version = getVersion();
  return (
    <footer className="border-t-4 border-black py-8 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center text-sm text-black font-bold uppercase tracking-widest">
        <div>&copy; {new Date().getFullYear()} {dict.metadata.title}. {dict.footer.rights}</div>
        {version !== "dev" && (
          <div className="mt-2 text-xs text-muted" data-site-version>
            {version}
          </div>
        )}
      </div>
    </footer>
  );
}
