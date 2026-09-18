export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
      <p className="font-semibold text-slate-800">LifeFix AI</p>
      <p className="mx-auto mt-2 max-w-xl">Helpful AI guidance for everyday problems and scam awareness. AI responses are informational and are not a substitute for qualified professional or emergency advice.</p>
      <nav className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2" aria-label="Legal and support links">
        <a className="hover:text-indigo-600" href="/privacy">Privacy Policy</a>
        <a className="hover:text-indigo-600" href="/terms">Terms of Service</a>
        <a className="hover:text-indigo-600" href="/contact">Contact</a>
      </nav>
    </footer>
  );
}
