import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SimplePage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen pt-8 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-neutral-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-xl"
        >
          <h1 className="text-3xl font-bold mb-8">{title}</h1>
          <div className="prose prose-invert prose-neutral max-w-none">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
