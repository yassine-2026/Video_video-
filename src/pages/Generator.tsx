import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeft, Upload, Loader2, Play, Download, RefreshCw, AlertCircle, Sparkles, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { VideoJob } from '../types';

export default function Generator() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [duration, setDuration] = useState('5');
  const [quality, setQuality] = useState('high');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [style, setStyle] = useState('cinematic');
  const [motionSpeed, setMotionSpeed] = useState('normal');
  const [cameraMotion, setCameraMotion] = useState('pan_right');
  const [mode, setMode] = useState<'text' | 'image'>('text');
  
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeJobId) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      setTimeElapsed(0);
    }
    return () => clearInterval(interval);
  }, [activeJobId]);

  const generateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axios.post('/api/videos/generate', formData);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        setActiveJobId(data.data.jobId);
      }
    }
  });

  const { data: jobStatus, refetch } = useQuery({
    queryKey: ['job', activeJobId],
    queryFn: async () => {
      if (!activeJobId) return null;
      const { data } = await axios.get(`/api/videos/status/${activeJobId}`);
      return data.data as VideoJob;
    },
    enabled: !!activeJobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'completed' || data.status === 'failed')) {
        return false; // Stop polling
      }
      return 2000; // Poll every 2s
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setMode('image');
    }
  };

  const handleGenerate = () => {
    if (!prompt) return;
    
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('duration', duration);
    formData.append('quality', quality);
    formData.append('aspectRatio', aspectRatio);
    formData.append('style', style);
    formData.append('motionSpeed', motionSpeed);
    formData.append('cameraMotion', cameraMotion);
    if (mode === 'image' && image) {
      formData.append('image', image);
    }
    
    generateMutation.mutate(formData);
  };

  const resetForm = () => {
    setActiveJobId(null);
    setPrompt('');
    setImage(null);
    setImagePreview(null);
    setMode('text');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center text-neutral-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-5 flex flex-col space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-fit">
            <h2 className="text-2xl font-medium tracking-tight">Generation Settings</h2>
            
            {/* Mode Switch */}
            <div className="flex bg-neutral-900 rounded-lg p-1">
              <button
                onClick={() => setMode('text')}
                className={cn("flex-1 text-sm font-medium py-2 rounded-md transition-all", mode === 'text' ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-white")}
              >
                Text to Video
              </button>
              <button
                onClick={() => setMode('image')}
                className={cn("flex-1 text-sm font-medium py-2 rounded-md transition-all", mode === 'image' ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-white")}
              >
                Image to Video
              </button>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A cinematic shot of a futuristic city in the rain, neon lights reflecting on wet streets..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all h-32"
              />
            </div>

            {/* Image Upload (Conditional) */}
            <AnimatePresence>
              {mode === 'image' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-sm font-medium text-neutral-300">Source Image</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 hover:border-white/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden bg-black/20"
                  >
                    {imagePreview ? (
                      <div className="absolute inset-0">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-neutral-500 mb-3" />
                        <p className="text-sm text-neutral-400">Click to upload or drag & drop</p>
                        <p className="text-xs text-neutral-600 mt-1">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Parameters Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Duration</label>
                <select 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-indigo-500/50"
                >
                  <option value="5">5 Seconds</option>
                  <option value="10">10 Seconds</option>
                  <option value="15">15 Seconds</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Aspect Ratio</label>
                <select 
                  value={aspectRatio} 
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-indigo-500/50"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="21:9">21:9 (Cinematic)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Quality</label>
                <select 
                  value={quality} 
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-indigo-500/50"
                >
                  <option value="standard">Standard (1080p)</option>
                  <option value="high">High (4K)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Style</label>
                <select 
                  value={style} 
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-indigo-500/50"
                >
                  <option value="cinematic">Cinematic</option>
                  <option value="anime">Anime</option>
                  <option value="3d_render">3D Render</option>
                  <option value="photorealistic">Photorealistic</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Motion Speed</label>
                <select 
                  value={motionSpeed} 
                  onChange={(e) => setMotionSpeed(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-indigo-500/50"
                >
                  <option value="slow">Slow Motion</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Camera Motion</label>
                <select 
                  value={cameraMotion} 
                  onChange={(e) => setCameraMotion(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-indigo-500/50"
                >
                  <option value="static">Static</option>
                  <option value="pan_left">Pan Left</option>
                  <option value="pan_right">Pan Right</option>
                  <option value="zoom_in">Zoom In</option>
                  <option value="zoom_out">Zoom Out</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt || generateMutation.isPending || (activeJobId && (!jobStatus || jobStatus.status !== 'completed' && jobStatus.status !== 'failed'))}
              className="w-full py-4 rounded-xl font-medium flex items-center justify-center transition-all bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {generateMutation.isPending ? (
                <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Initializing...</>
              ) : (
                <><Sparkles className="h-5 w-5 mr-2" /> Generate Video</>
              )}
            </button>
          </div>

          {/* Right Panel: Preview & Status */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="bg-neutral-900 border border-white/5 rounded-2xl aspect-video w-full flex flex-col items-center justify-center overflow-hidden relative shadow-2xl">
              
              {!activeJobId ? (
                <div className="text-center p-8 flex flex-col items-center">
                  <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Video className="h-8 w-8 text-neutral-500" />
                  </div>
                  <h3 className="text-xl font-medium text-neutral-300">No active generation</h3>
                  <p className="text-neutral-500 mt-2 text-sm max-w-sm">
                    Configure your settings on the left and hit generate to start creating your masterpiece.
                  </p>
                </div>
              ) : jobStatus?.status === 'failed' ? (
                <div className="text-center p-8 flex flex-col items-center z-10">
                  <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Generation Failed</h3>
                  <p className="text-neutral-400 mt-2 text-sm">{jobStatus.error || "An unknown error occurred."}</p>
                  <button onClick={resetForm} className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                    Try Again
                  </button>
                </div>
              ) : jobStatus?.status === 'completed' && jobStatus.result?.videoUrl ? (
                <div className="w-full h-full relative group">
                  <video 
                    src={jobStatus.result.videoUrl} 
                    controls 
                    autoPlay 
                    loop 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={jobStatus.result.videoUrl}
                      download="generated-video.mp4"
                      className="bg-black/60 backdrop-blur-md p-2 rounded-lg text-white hover:bg-white hover:text-black transition-colors"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full p-8 flex flex-col items-center justify-center bg-black/40 z-10">
                  {/* Processing UI */}
                  <div className="w-full max-w-md flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-6" />
                    
                    <h3 className="text-xl font-medium text-white mb-2">
                      {jobStatus?.status === 'waiting' ? 'Queued...' : 'Rendering Video...'}
                    </h3>
                    
                    {jobStatus?.activeProviderName && (
                      <div className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full px-3 py-1 text-xs font-medium flex items-center mt-2">
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        Powered by {jobStatus.activeProviderName}
                      </div>
                    )}
                    
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4 mt-6">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${jobStatus?.progress || 0}%` }}
                        transition={{ ease: "linear", duration: 0.5 }}
                      />
                    </div>
                    
                    <div className="flex justify-between w-full text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      <span>{jobStatus?.progress || 0}% Complete</span>
                      <span>{formatTime(timeElapsed)}</span>
                    </div>

                    <div className="mt-8 bg-black/50 border border-white/10 rounded-lg p-4 w-full text-left font-mono text-xs text-neutral-500 space-y-1">
                      <p className="text-neutral-300">Logs:</p>
                      <p>&gt; Job created: {activeJobId.substring(0, 8)}...</p>
                      {jobStatus?.activeProviderName && <p>&gt; Initializing {jobStatus.activeProviderName} API...</p>}
                      {jobStatus?.status === 'active' && <p>&gt; Assigned to rendering node...</p>}
                      {jobStatus?.progress && jobStatus.progress > 10 && <p>&gt; Preparing assets...</p>}
                      {jobStatus?.progress && jobStatus.progress > 30 && <p>&gt; Running inference model...</p>}
                      {jobStatus?.progress && jobStatus.progress > 80 && <p>&gt; Finalizing output...</p>}
                    </div>

                    <button 
                      onClick={() => {
                        axios.post(`/api/videos/cancel/${activeJobId}`);
                        resetForm();
                      }}
                      className="mt-6 px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel Generation
                    </button>
                  </div>
                </div>
              )}

              {/* Background effect for processing */}
              {activeJobId && jobStatus?.status !== 'completed' && jobStatus?.status !== 'failed' && (
                <div className="absolute inset-0 z-0 opacity-20">
                  <img src={imagePreview || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} alt="" className="w-full h-full object-cover blur-2xl" />
                </div>
              )}
            </div>

            {/* Post-generation actions */}
            <AnimatePresence>
              {jobStatus?.status === 'completed' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-4"
                >
                  <button 
                    onClick={handleGenerate}
                    className="flex-1 bg-white/10 hover:bg-white/15 border border-white/5 py-4 rounded-xl font-medium flex items-center justify-center transition-all text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </button>
                  <button 
                    onClick={resetForm}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-4 rounded-xl font-medium flex items-center justify-center transition-all text-white"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Create New
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
