import Link from "next/link";

export default function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-semibold text-indigo-600">
              AutoRep
            </span>
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a
            href="#multi-step-form"
            className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            Get Started
          </a>
        </div>
        <div className="flex lg:hidden">
          <a
            href="#multi-step-form"
            className="text-sm font-semibold text-indigo-600"
          >
            Get Started
          </a>
        </div>
      </nav>
    </header>
  );
}
