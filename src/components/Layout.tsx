import { Link, Outlet } from 'react-router-dom';
import { Video } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Video className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">AI Video Engine</span>
          </Link>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-neutral-400">
            <Link to="/create" className="hover:text-white transition-colors">Generator</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 bg-black/40 py-12 text-center text-sm text-neutral-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} AI Video Engine. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
