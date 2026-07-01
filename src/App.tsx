/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Generator from './pages/Generator';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Generator />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
