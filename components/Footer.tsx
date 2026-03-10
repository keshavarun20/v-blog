export function Footer() {
  return (
    <footer className="max-w-2xl mx-auto px-4 sm:px-6 py-8 mt-8 border-t border-gray-100 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 dark:text-gray-500">
        <span>© {new Date().getFullYear()} Keshav Arunesar</span>
        <div className="flex items-center gap-5">
          <a
            href="https://www.keshavarunesar.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Portfolio
          </a>
          <a
            href="https://www.threads.com/@imposter.av"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Threads
          </a>
        </div>
      </div>
    </footer>
  );
}