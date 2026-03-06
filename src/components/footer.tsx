import type { Dictionary } from "@/i18n/types";
import { getVersion } from "@/lib/version";

export function Footer({ dict }: { dict: Dictionary }) {
  const version = getVersion();
  return (
    <footer className="border-t border-white/10 py-8 px-6">
      <div className="max-w-7xl mx-auto text-center text-sm text-white/40">
        <div>&copy; {new Date().getFullYear()} {dict.metadata.title}. {dict.footer.rights}</div>
        {version !== "dev" && (
          <div className="mt-2 text-xs text-white/20" data-site-version>
            {version}
          </div>
        )}
      </div>
    </footer>
  );
}
