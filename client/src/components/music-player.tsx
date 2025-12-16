import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, Heart, Sparkles, X, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface MusicPlayerProps {
  autoPlay?: boolean;
  onAdminLogin?: (password: string) => void;
  isAdmin?: boolean;
  onAdminLogout?: () => void;
}

// Cute star outline component - like emoji stars ✧
function CuteStar({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      <path 
        d="M12 2L14.09 8.26L20.18 9.27L15.54 13.14L16.82 19.02L12 16.28L7.18 19.02L8.46 13.14L3.82 9.27L9.91 8.26L12 2Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function MusicPlayer({ autoPlay = false, onAdminLogin, isAdmin = false, onAdminLogout }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [heartLink, setHeartLink] = useState("https://example.com/gallery");
  const [editLinkDialogOpen, setEditLinkDialogOpen] = useState(false);
  const [tempLink, setTempLink] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (pwd: string) => {
      const res = await apiRequest("POST", "/api/admin/login", { password: pwd });
      return res.json();
    },
    onSuccess: () => {
      const pwd = password;
      setLoginDialogOpen(false);
      setPassword("");
      setError("");
      if (onAdminLogin) onAdminLogin(pwd);
    },
    onError: () => {
      setError("Wrong password");
    },
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(password);
  };

  useEffect(() => {
    audioRef.current = new Audio("/background-music.webm");
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        console.log("Audio autoplay blocked");
      });
    }
    setIsPlaying(!isPlaying);
    setShowPrompt(false);
  };

  const handleStartWithMusic = () => {
    setShowPrompt(false);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        console.log("Audio autoplay blocked");
      });
      setIsPlaying(true);
    }
  };

  const handleStartWithoutMusic = () => {
    setShowPrompt(false);
  };

  const handleHeartClick = () => {
    if (isAdmin) {
      setTempLink(heartLink);
      setEditLinkDialogOpen(true);
    } else {
      window.open(heartLink, "_blank");
    }
  };

  const handleSaveLinkEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setHeartLink(tempLink);
    setEditLinkDialogOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-pink-950/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
              className="bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-900 border-2 border-pink-200 dark:border-pink-700 rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl shadow-pink-200/50 dark:shadow-pink-900/50"
            >
              <motion.div 
                className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 dark:from-pink-600 dark:to-rose-500 flex items-center justify-center shadow-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-10 h-10 text-white fill-white" />
              </motion.div>
              <div className="flex justify-center gap-1 mb-3">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <Sparkles className="w-4 h-4 text-rose-400" />
                <Sparkles className="w-4 h-4 text-pink-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-pink-700 dark:text-pink-200 mb-3" data-testid="text-music-prompt-title">
                Welcome, Cutie!
              </h2>
              <p className="text-pink-600/80 dark:text-pink-300/80 font-body mb-6 text-sm" data-testid="text-music-prompt-description">
                This magical experience is best with music! Want to hear a special song?
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  onClick={handleStartWithMusic}
                  className="gap-2 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white border-0 rounded-full px-6 py-2 shadow-lg shadow-pink-300/50 transition-all hover:scale-105"
                  data-testid="button-start-with-music"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  Yes please!
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStartWithoutMusic}
                  className="rounded-full border-pink-300 dark:border-pink-600 text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/50 px-6"
                  data-testid="button-start-without-music"
                >
                  Maybe later
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <motion.div 
          className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/90 dark:to-rose-900/90 backdrop-blur-md border-2 border-pink-200 dark:border-pink-700 rounded-full px-4 py-2 shadow-xl shadow-pink-200/40 dark:shadow-pink-900/40"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {/* Heart button - opens link or edit dialog for admin */}
          <motion.div
            animate={isPlaying ? { 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ 
              duration: 1.5,
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={handleHeartClick}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white shadow-md"
              data-testid="button-heart-link"
            >
              <Heart className="w-5 h-5 fill-current animate-pulse" />
            </Button>
          </motion.div>

          {/* Volume slider */}
          <div className="hidden sm:flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1.5 accent-pink-400 rounded-full"
              aria-label="Volume control"
              data-testid="input-volume-slider"
            />
            {/* Speaker icon - now works as play/pause */}
            <motion.button
              onClick={togglePlay}
              className="cursor-pointer p-1 rounded-full"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <Volume2 className="w-4 h-4 text-pink-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-pink-400" />
              )}
            </motion.button>
          </div>
          
          {isAdmin ? (
            <motion.div 
              className="flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <span className="text-xs font-medium text-pink-600 dark:text-pink-300">Edit Mode</span>
              <Button 
                size="icon"
                variant="ghost"
                className="w-6 h-6 rounded-full text-pink-500 hover:text-pink-700 hover:bg-pink-200/50"
                onClick={onAdminLogout}
                data-testid="button-exit-admin"
              >
                <X className="w-3 h-3" />
              </Button>
            </motion.div>
          ) : (
            /* Cute two-star design - one big, one small */
            <motion.button
              onClick={() => setLoginDialogOpen(true)}
              className="cursor-pointer flex items-end gap-0.5"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              data-testid="button-admin-login"
            >
              {/* Big star */}
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <CuteStar size={18} className="text-pink-400 drop-shadow-sm" />
              </motion.div>
              {/* Small star */}
              <motion.div
                animate={{ 
                  rotate: [0, -15, 15, 0],
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              >
                <CuteStar size={12} className="text-pink-300 drop-shadow-sm" />
              </motion.div>
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      {/* Admin Login Dialog - JK room - Super Cute Style */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-900 border-2 border-pink-200 dark:border-pink-700 rounded-3xl shadow-2xl shadow-pink-200/50 dark:shadow-pink-900/50">
          <DialogHeader>
            <motion.div 
              className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 dark:from-pink-600 dark:to-rose-500 flex items-center justify-center shadow-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="flex items-end gap-0.5">
                <CuteStar size={20} className="text-white" />
                <CuteStar size={14} className="text-pink-100" />
              </div>
            </motion.div>
            <div className="flex justify-center gap-1 mb-2">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <Sparkles className="w-3 h-3 text-rose-400" />
              <Sparkles className="w-3 h-3 text-pink-400" />
            </div>
            <DialogTitle className="text-center font-display text-xl font-bold text-pink-700 dark:text-pink-200">
              JK Room
            </DialogTitle>
            <p className="text-pink-600/80 dark:text-pink-300/80 text-center text-sm mt-1">
              Shhh... this is our secret place
            </p>
          </DialogHeader>
          <form onSubmit={handleLoginSubmit} className="space-y-4 mt-2">
            <Input
              type="password"
              placeholder="Enter secret password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="rounded-full border-pink-300 dark:border-pink-600 bg-white/80 dark:bg-black/30 text-center"
              data-testid="input-admin-password"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button 
              type="submit" 
              className="w-full gap-2 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white border-0 rounded-full shadow-lg shadow-pink-300/50 transition-all hover:scale-105" 
              disabled={loginMutation.isPending} 
              data-testid="button-admin-login-submit"
            >
              <Heart className="w-4 h-4 fill-current" />
              {loginMutation.isPending ? "Opening..." : "Enter"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Link Dialog for Admin */}
      <Dialog open={editLinkDialogOpen} onOpenChange={setEditLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
              Edit Heart Link
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveLinkEdit} className="space-y-4">
            <Input
              type="url"
              placeholder="Enter link URL..."
              value={tempLink}
              onChange={(e) => setTempLink(e.target.value)}
              autoFocus
              data-testid="input-edit-link"
            />
            <Button type="submit" className="w-full" data-testid="button-save-link">
              Save Link
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
