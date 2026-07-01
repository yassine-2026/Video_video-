import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Sparkles, Zap, Clapperboard } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[40%] left-[20%] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-center space-x-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4" />
          <span>Next-Generation AI Video Engine</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 font-sans text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
        >
          Create stunning <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            videos with AI.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 max-w-2xl text-lg text-neutral-400 md:text-xl"
        >
          Transform text prompts and images into high-quality cinematic videos in seconds. 
          Powered by state-of-the-art generative models.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
        >
          <Link
            to="/create"
            className="group relative flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
            <Video className="mr-2 h-5 w-5" />
            Start Generating
          </Link>
          <a
            href="https://render.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 font-medium text-white transition-colors hover:bg-white/10 active:scale-95"
          >
            Deploy on Render
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full border-t border-white/5 pt-12 text-left"
        >
          <div className="flex flex-col space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium text-white">Ultra-Fast</h3>
            <p className="text-neutral-500 text-sm">Our highly optimized queue system processes your videos at unprecedented speeds.</p>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Video className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium text-white">4K Quality</h3>
            <p className="text-neutral-500 text-sm">Generate crisp, high-resolution videos perfect for cinematic productions.</p>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
              <Clapperboard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium text-white">Advanced Control</h3>
            <p className="text-neutral-500 text-sm">Fine-tune motion speed, camera angles, and style with granular parameters.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
