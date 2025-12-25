import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock, Clock, Pencil, X, Check, Unlock, LockKeyhole, Sparkles, Gift, Key, ExternalLink, HelpCircle, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SurpriseConfig {
  id: number;
  name: string;
  url: string;
  content: string;
  timerText?: string;
  unlockDate: string;
  imagePath: string;
  password: string;
}

interface SurprisesSectionProps {
  isAdmin: boolean;
  adminPassword: string | null;
  content?: {
    surprises_title?: string;
    surprises_subtitle?: string;
    surprises_rules?: string;
  };
}

interface FloatingKeyState {
  [surpriseId: number]: boolean;
}

function CountdownTimer({ unlockDate, onClick }: { unlockDate: string; onClick?: (e: React.MouseEvent) => void }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(unlockDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [unlockDate]);

  return (
    <div 
      className="flex gap-1 justify-center mt-2 cursor-pointer" 
      onClick={onClick}
      data-testid="countdown-timer"
    >
      <div className="bg-white/90 dark:bg-black/70 rounded-md px-2 py-1 min-w-[40px] text-center">
        <div className="text-sm font-bold text-primary">{timeLeft.days}</div>
        <div className="text-[8px] text-muted-foreground">days</div>
      </div>
      <div className="bg-white/90 dark:bg-black/70 rounded-md px-1.5 py-1 min-w-[32px] text-center">
        <div className="text-sm font-bold text-primary">{timeLeft.hours}</div>
        <div className="text-[8px] text-muted-foreground">hrs</div>
      </div>
      <div className="bg-white/90 dark:bg-black/70 rounded-md px-1.5 py-1 min-w-[32px] text-center">
        <div className="text-sm font-bold text-primary">{timeLeft.minutes}</div>
        <div className="text-[8px] text-muted-foreground">min</div>
      </div>
      <div className="bg-white/90 dark:bg-black/70 rounded-md px-1.5 py-1 min-w-[32px] text-center">
        <div className="text-sm font-bold text-primary">{timeLeft.seconds}</div>
        <div className="text-[8px] text-muted-foreground">sec</div>
      </div>
    </div>
  );
}

function SurprisePopup({
  surprise,
  isOpen,
  onClose,
  isAdmin,
  onReveal,
  rules
}: {
  surprise: SurpriseConfig;
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onReveal: (id: number, content: string, url: string) => void;
  rules?: string;
}) {
  const { toast } = useToast();
  const [enteredKey, setEnteredKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showRulesPopup, setShowRulesPopup] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(surprise.unlockDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsUnlocked(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsUnlocked(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [surprise.unlockDate]);

  const handleVerify = async () => {
    if (isAdmin) {
      onReveal(surprise.id, surprise.content || "", surprise.url || "");
      if (surprise.url) {
        const url = surprise.url.startsWith('http') ? surprise.url : `https://${surprise.url}`;
        try {
          window.open(url, "_blank", "noopener,noreferrer");
        } catch {
          window.location.assign(url);
        }
      }
      onClose();
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(`/api/surprises/${surprise.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: enteredKey })
      });
      
      if (res.ok) {
        const data = await res.json();
        toast({
          title: "Unlocked!",
          description: "The surprise has been revealed!",
        });
        onReveal(surprise.id, data.content || "", data.url || "");
        if (data.url) {
          const url = data.url.startsWith('http') ? data.url : `https://${data.url}`;
          try {
            window.open(url, "_blank", "noopener,noreferrer");
          } catch {
            window.location.assign(url);
          }
        }
        onClose();
      } else {
        toast({
          title: "Oops!",
          description: "That's not the right key. Try again, cutie!",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
    setIsVerifying(false);
  };

  const hasPassword = surprise.password && surprise.password.length > 0 && surprise.password !== "";

  return (
    <>
    {/* Magical Rules Popup inside SurprisePopup */}
    <Dialog open={showRulesPopup} onOpenChange={setShowRulesPopup}>
      <DialogContent className="sm:max-w-md overflow-visible bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-pink-950/40 dark:via-purple-950/40 dark:to-rose-950/40 border-2 border-pink-200/50 dark:border-pink-700/50 shadow-2xl z-[100]">
        {/* Floating sparkle decorations */}
        <div className="absolute -top-3 -left-3 pointer-events-none">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-pink-400 drop-shadow-lg" />
          </motion.div>
        </div>
        <div className="absolute -top-2 -right-2 pointer-events-none">
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.3, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-rose-400 drop-shadow-lg" />
          </motion.div>
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
          <motion.div
            animate={{ y: [-2, 2, -2], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
          </motion.div>
        </div>
        
        <DialogHeader className="text-center relative">
          {/* Magical floating key with pink starburst effect */}
          <motion.div 
            className="mx-auto mb-4 relative"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Pink starburst rays */}
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-12 bg-gradient-to-t from-pink-400/0 via-pink-300/50 to-rose-200/0"
                  style={{ rotate: `${i * 30}deg`, transformOrigin: 'center' }}
                  animate={{ 
                    scale: [0.5, 1, 0.5], 
                    opacity: [0.2, 0.6, 0.2] 
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    delay: i * 0.08 
                  }}
                />
              ))}
            </motion.div>
            {/* Outer pink glow */}
            <motion.div 
              className="absolute inset-0 w-20 h-20 -m-2 rounded-full bg-gradient-to-br from-pink-300/50 via-rose-200/40 to-pink-300/50 blur-lg"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Star particles */}
            <motion.div className="absolute -top-3 -left-3 pointer-events-none">
              <motion.div
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                <Star className="w-4 h-4 text-pink-300 fill-pink-300" />
              </motion.div>
            </motion.div>
            <motion.div className="absolute -bottom-2 -right-3 pointer-events-none">
              <motion.div
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, -180, -360] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                <Star className="w-3 h-3 text-rose-300 fill-rose-300" />
              </motion.div>
            </motion.div>
            <motion.div className="absolute top-0 -right-4 pointer-events-none">
              <motion.div
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
              >
                <Star className="w-2 h-2 text-pink-400 fill-pink-400" />
              </motion.div>
            </motion.div>
            {/* Main key circle */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 flex items-center justify-center shadow-xl border-2 border-white/60 shadow-pink-300/50">
              <motion.div
                animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Key className="w-8 h-8 text-white drop-shadow-md" />
              </motion.div>
            </div>
            {/* Inner sparkles */}
            <motion.div 
              className="absolute -top-1 -right-1"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
          
          <DialogTitle className="font-display text-2xl text-center bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 bg-clip-text text-transparent">
            The Secret Key
          </DialogTitle>
          <DialogDescription className="sr-only">
            Magical game rules explaining how to obtain keys for surprises
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Rules content with magical styling */}
          <motion.div 
            className="relative text-center p-5 bg-white/70 dark:bg-black/40 rounded-xl border border-pink-200/50 dark:border-pink-800/50 shadow-inner"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute top-2 left-2">
              <motion.span 
                className="text-pink-400"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-3 h-3 fill-current" />
              </motion.span>
            </div>
            <div className="absolute top-2 right-2">
              <motion.span 
                className="text-rose-400"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <Heart className="w-3 h-3 fill-current" />
              </motion.span>
            </div>
            {rules ? (
              <p className="text-foreground font-body leading-relaxed whitespace-pre-wrap text-sm">
                {rules}
              </p>
            ) : (
              <p className="text-muted-foreground font-body italic text-sm">
                The secret key will be revealed in a special way... Stay tuned for magical hints!
              </p>
            )}
          </motion.div>
          
          {/* Cute hint box */}
          <motion.div 
            className="p-3 bg-gradient-to-r from-pink-100/80 to-rose-100/80 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl border border-pink-200/50 dark:border-pink-800/50"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-pink-700 dark:text-pink-300 text-center flex items-center justify-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Lock className="w-4 h-4" />
              </motion.span>
              This surprise needs a secret key!
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.span>
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            onClick={() => setShowRulesPopup(false)}
            className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 hover:from-pink-600 hover:via-rose-600 hover:to-pink-600 shadow-lg"
            data-testid="button-close-popup-rules"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Got it, cutie!
              <Sparkles className="w-4 h-4" />
            </span>
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>

    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-200 dark:border-pink-800 overflow-visible">
        <DialogHeader className="text-center">
          {/* Header with Lock and Floating Key side by side */}
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Main lock/heart icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
              {isUnlocked ? (
                <Heart className="w-8 h-8 text-white fill-white" />
              ) : (
                <Lock className="w-8 h-8 text-white" />
              )}
            </div>
            
            {/* Floating key button - always shows to display rules */}
            <motion.div
              className="cursor-pointer relative"
              onClick={() => setShowRulesPopup(true)}
              data-testid={`popup-floating-key-${surprise.id}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.3 }}
            >
              {/* Pink starburst rays effect */}
              <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-8 bg-gradient-to-t from-pink-400/0 via-pink-300/60 to-rose-200/0"
                    style={{ rotate: `${i * 45}deg`, transformOrigin: 'center' }}
                    animate={{ 
                      scale: [0.6, 1, 0.6], 
                      opacity: [0.3, 0.7, 0.3] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.1 
                    }}
                  />
                ))}
              </motion.div>
              {/* Outer pink glow */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-pink-300/50 via-rose-200/40 to-pink-300/50 rounded-full blur-lg"
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              {/* Star particles */}
              <motion.div className="absolute -top-2 -left-2 pointer-events-none">
                <motion.div
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  <Star className="w-3 h-3 text-pink-300 fill-pink-300" />
                </motion.div>
              </motion.div>
              <motion.div className="absolute -bottom-1 -right-2 pointer-events-none">
                <motion.div
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, -180, -360] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                >
                  <Star className="w-2 h-2 text-rose-300 fill-rose-300" />
                </motion.div>
              </motion.div>
              <motion.div className="absolute top-0 -right-3 pointer-events-none">
                <motion.div
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
                >
                  <Star className="w-2 h-2 text-pink-400 fill-pink-400" />
                </motion.div>
              </motion.div>
              {/* Main floating key button */}
              <motion.div
                className="relative bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 rounded-full p-3 shadow-lg border-2 border-white/70 shadow-pink-300/50"
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Key className="w-5 h-5 text-white drop-shadow-md" />
                </motion.div>
                {/* Sparkle decoration */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          <DialogTitle className="font-display text-xl text-center text-foreground">
            {surprise.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Surprise popup with timer and unlock options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Show teaser while locked, real content after unlock */}
          {!isUnlocked ? (
            <div className="text-center p-4 bg-white/60 dark:bg-black/30 rounded-lg border border-pink-100 dark:border-pink-900">
              <p className="text-foreground font-body leading-relaxed whitespace-pre-wrap">
                {(surprise as any).timerText && (surprise as any).timerText.length > 0
                  ? (surprise as any).timerText
                  : "Patience, sweetie — this surprise will be ready soon!"}
              </p>
            </div>
          ) : (
            surprise.content && surprise.content.length > 0 ? (
              <div className="text-center p-4 bg-white/60 dark:bg-black/30 rounded-lg border border-pink-100 dark:border-pink-900">
                <p className="text-foreground font-body leading-relaxed whitespace-pre-wrap">
                  {surprise.content}
                </p>
              </div>
            ) : null
          )}

          {/* Always show the timer */}
          <div className="flex gap-2 justify-center">
            <div className="bg-white/80 dark:bg-black/40 rounded-lg px-3 py-2 min-w-[50px] text-center border border-pink-200 dark:border-pink-800">
              <div className="text-lg font-bold text-pink-600 dark:text-pink-400">{timeLeft.days}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">days</div>
            </div>
            <div className="bg-white/80 dark:bg-black/40 rounded-lg px-3 py-2 min-w-[50px] text-center border border-pink-200 dark:border-pink-800">
              <div className="text-lg font-bold text-pink-600 dark:text-pink-400">{timeLeft.hours}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">hrs</div>
            </div>
            <div className="bg-white/80 dark:bg-black/40 rounded-lg px-3 py-2 min-w-[50px] text-center border border-pink-200 dark:border-pink-800">
              <div className="text-lg font-bold text-pink-600 dark:text-pink-400">{timeLeft.minutes}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">min</div>
            </div>
            <div className="bg-white/80 dark:bg-black/40 rounded-lg px-3 py-2 min-w-[50px] text-center border border-pink-200 dark:border-pink-800">
              <div className="text-lg font-bold text-pink-600 dark:text-pink-400">{timeLeft.seconds}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">sec</div>
            </div>
          </div>

          {/* Timer expired and has password - show key input */}
          {isUnlocked && hasPassword && (
            <div className="space-y-3">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                <Input
                  type="password"
                  placeholder="Enter the secret key..."
                  value={enteredKey}
                  onChange={(e) => setEnteredKey(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  className="pl-10 border-pink-200 dark:border-pink-800 focus:ring-pink-500"
                  data-testid={`input-key-surprise-${surprise.id}`}
                />
              </div>
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying || !enteredKey}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                data-testid={`button-unlock-surprise-${surprise.id}`}
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Checking...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Unlock My Surprise
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* Timer expired and no password - show reveal button */}
          {isUnlocked && !hasPassword && (
            <Button 
              onClick={handleVerify}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              data-testid={`button-reveal-surprise-${surprise.id}`}
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Reveal My Surprise
              </span>
            </Button>
          )}

          {/* Timer NOT expired - show waiting message with disabled key input if password exists */}
          {!isUnlocked && (
            <div className="space-y-3">
              <div className="text-center text-sm text-muted-foreground bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-pink-100 dark:border-pink-900">
                <>
                  <Sparkles className="w-4 h-4 inline mr-1 text-pink-500" />
                  Patience, sweetie! This surprise will be ready on{" "}
                  <span className="font-medium text-pink-600 dark:text-pink-400">
                    {new Date(surprise.unlockDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </>
              </div>
              {/* Show disabled key input when timer is still running (so user knows they need a key) */}
              {hasPassword && (
                <div className="space-y-3 opacity-50">
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                    <Input
                      type="password"
                      placeholder="Key needed when timer ends..."
                      disabled
                      className="pl-10 border-pink-200 dark:border-pink-800 cursor-not-allowed"
                      data-testid={`input-key-surprise-${surprise.id}-disabled`}
                    />
                  </div>
                  <Button 
                    disabled
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Wait for Timer
                    </span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}

function SurpriseCard({ 
  surprise, 
  isAdmin,
  isRevealed,
  onReveal,
  onEdit,
  rules,
  onShowFloatingKey 
}: { 
  surprise: SurpriseConfig; 
  isAdmin: boolean;
  isRevealed: boolean;
  onReveal: (id: number, content?: string, url?: string) => void;
  onEdit: (id: number, data: { url?: string; name?: string; content?: string; timerText?: string; imagePath?: string; surprisePassword?: string; unlockNow?: boolean; relockNow?: boolean }) => void;
  rules?: string;
  onShowFloatingKey?: (surpriseId: number) => void;
}) {
  const [editData, setEditData] = useState({
    url: surprise.url,
    name: surprise.name,
    content: surprise.content || "",
    timerText: (surprise as any).timerText || "",
    imagePath: surprise.imagePath || "",
    password: surprise.password || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showRulesPopup, setShowRulesPopup] = useState(false);
    const isUnlocked = new Date(surprise.unlockDate).getTime() <= new Date().getTime();
  const hasContent = surprise.content && surprise.content.length > 0;
  const hasPassword = surprise.password && surprise.password.length > 0;

  const handleSave = () => {
    onEdit(surprise.id, { 
      url: editData.url,
      name: editData.name,
      content: editData.content,
      timerText: editData.timerText,
      imagePath: editData.imagePath,
      surprisePassword: editData.password,
    });
    setIsEditing(false);
  };

  const handleUnlockNow = () => {
    onEdit(surprise.id, { unlockNow: true });
  };

  const handleRelockNow = () => {
    onEdit(surprise.id, { relockNow: true });
  };

  const handleClick = () => {
    if (isEditing) return;
    setShowPopup(true);
  };
  
  const handlePopupReveal = (id: number, content: string, url: string) => {
    onReveal(id, content, url);
  };

  return (
    <>
      <SurprisePopup
        surprise={surprise}
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        isAdmin={isAdmin}
        onReveal={handlePopupReveal}
        rules={rules}
      />
      {/* Magical Rules Popup - shows when clicking the floating key */}
      <Dialog open={showRulesPopup} onOpenChange={setShowRulesPopup}>
        <DialogContent className="sm:max-w-md overflow-visible bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 dark:from-pink-950/40 dark:via-purple-950/40 dark:to-amber-950/40 border-2 border-pink-200/50 dark:border-pink-700/50 shadow-2xl">
          {/* Floating sparkle decorations */}
          <div className="absolute -top-3 -left-3 pointer-events-none">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-pink-400 drop-shadow-lg" />
            </motion.div>
          </div>
          <div className="absolute -top-2 -right-2 pointer-events-none">
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-amber-400 drop-shadow-lg" />
            </motion.div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
            <motion.div
              animate={{ y: [-2, 2, -2], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            </motion.div>
          </div>
          
          <DialogHeader className="text-center relative">
            {/* Magical floating key with golden starburst effect */}
            <motion.div 
              className="mx-auto mb-4 relative"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Golden starburst rays */}
              <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-12 bg-gradient-to-t from-amber-400/0 via-amber-300/50 to-yellow-200/0"
                    style={{ rotate: `${i * 30}deg`, transformOrigin: 'center' }}
                    animate={{ 
                      scale: [0.5, 1, 0.5], 
                      opacity: [0.2, 0.6, 0.2] 
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      delay: i * 0.08 
                    }}
                  />
                ))}
              </motion.div>
              {/* Outer golden glow */}
              <motion.div 
                className="absolute inset-0 w-20 h-20 -m-2 rounded-full bg-gradient-to-br from-amber-300/50 via-yellow-200/40 to-orange-300/50 blur-lg"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Star particles */}
              <motion.div className="absolute -top-3 -left-3 pointer-events-none">
                <motion.div
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                </motion.div>
              </motion.div>
              <motion.div className="absolute -bottom-2 -right-3 pointer-events-none">
                <motion.div
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, -180, -360] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                >
                  <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                </motion.div>
              </motion.div>
              <motion.div className="absolute top-0 -right-4 pointer-events-none">
                <motion.div
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
                >
                  <Star className="w-2 h-2 text-orange-300 fill-orange-300" />
                </motion.div>
              </motion.div>
              {/* Main key circle */}
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 flex items-center justify-center shadow-xl border-2 border-white/60 shadow-amber-300/50">
                <motion.div
                  animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Key className="w-8 h-8 text-white drop-shadow-md" />
                </motion.div>
              </div>
              {/* Inner sparkles */}
              <motion.div 
                className="absolute -top-1 -right-1"
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>
            
            <DialogTitle className="font-display text-2xl text-center bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              The Secret Key
            </DialogTitle>
            <DialogDescription className="sr-only">
              Magical game rules explaining how to obtain keys for surprises
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* Rules content with magical styling */}
            <motion.div 
              className="relative text-center p-5 bg-white/70 dark:bg-black/40 rounded-xl border border-pink-200/50 dark:border-pink-800/50 shadow-inner"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute top-2 left-2">
                <motion.span 
                  className="text-pink-400"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-3 h-3 fill-current" />
                </motion.span>
              </div>
              <div className="absolute top-2 right-2">
                <motion.span 
                  className="text-amber-400"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Heart className="w-3 h-3 fill-current" />
                </motion.span>
              </div>
              {rules ? (
                <p className="text-foreground font-body leading-relaxed whitespace-pre-wrap text-sm">
                  {rules}
                </p>
              ) : (
                <p className="text-muted-foreground font-body italic text-sm">
                  The secret key will be revealed in a special way... Stay tuned for magical hints!
                </p>
              )}
            </motion.div>
            
            {/* Cute hint box */}
            <motion.div 
              className="p-3 bg-gradient-to-r from-pink-100/80 to-amber-100/80 dark:from-pink-900/30 dark:to-amber-900/30 rounded-xl border border-pink-200/50 dark:border-pink-800/50"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-pink-700 dark:text-pink-300 text-center flex items-center justify-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Lock className="w-4 h-4" />
                </motion.span>
                This surprise needs a secret key!
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.span>
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              onClick={() => setShowRulesPopup(false)}
              className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 shadow-lg"
              data-testid="button-close-rules"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Got it, cutie!
                <Sparkles className="w-4 h-4" />
              </span>
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: surprise.id * 0.08 }}
        layout
      >
        <Card 
          className={`overflow-visible transition-all duration-500 hover:scale-[1.02] cursor-pointer hover:shadow-lg ${isRevealed ? "bg-primary/10 border-primary/30" : ""}`}
          onClick={handleClick}
          data-testid={`card-surprise-${surprise.id}`}
        >
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img 
            src={surprise.imagePath} 
            alt={surprise.name}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            style={{ willChange: 'transform, opacity' }}
            className={`w-full h-full object-cover object-center transition-all duration-500 ${
              !isUnlocked && !isAdmin ? "blur-[2px] opacity-70" : ""
            }`}
          />
          {!isUnlocked && !isAdmin && (
            <div 
              className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer"
              onClick={handleClick}
            >
              <div className="text-center p-3">
                <Lock className="w-8 h-8 text-white/90 mx-auto mb-1 drop-shadow-md" />
                <CountdownTimer unlockDate={surprise.unlockDate} />
                <p className="text-[10px] text-white/70 mt-1">
                  Tap to open
                </p>
              </div>
            </div>
          )}
          {isAdmin && (
            <div 
              className="absolute top-2 left-2 bg-white/90 dark:bg-black/80 rounded-full p-2 shadow-md cursor-pointer hover:bg-white dark:hover:bg-black transition-colors"
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              data-testid={`button-edit-surprise-${surprise.id}`}
            >
              <Pencil className="w-4 h-4 text-primary" />
            </div>
          )}
          {isAdmin && !isUnlocked && (
            <div 
              className="absolute top-2 right-2 bg-green-500/90 rounded-full p-2 shadow-md cursor-pointer hover:bg-green-600 transition-colors"
              onClick={(e) => { e.stopPropagation(); handleUnlockNow(); }}
              data-testid={`button-unlock-surprise-${surprise.id}`}
            >
              <Unlock className="w-4 h-4 text-white" />
            </div>
          )}
          {isAdmin && isUnlocked && (
            <div 
              className="absolute top-2 right-2 bg-red-500/90 rounded-full p-2 shadow-md cursor-pointer hover:bg-red-600 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); handleRelockNow(); }}
              data-testid={`button-relock-surprise-${surprise.id}`}
            >
              <LockKeyhole className="w-4 h-4 text-white" />
            </div>
          )}
          {isRevealed && !isEditing && !isAdmin && (
            <div className="absolute top-2 right-2 bg-primary rounded-full p-2 shadow-md">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
          )}
        </div>
        <div className="p-3 text-center">
          <h3 className="font-display text-sm sm:text-base font-semibold text-foreground">
            {surprise.name}
          </h3>
          
          <AnimatePresence mode="wait">
            {isRevealed && !isEditing && !isUnlocked && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="font-body text-sm text-muted-foreground mt-2 leading-relaxed"
              >
                {(surprise as any).timerText || "Coming soon..."}
              </motion.p>
            )}
            {isRevealed && !isEditing && hasContent && isUnlocked && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="font-body text-sm text-muted-foreground mt-2 leading-relaxed"
              >
                {surprise.content}
              </motion.p>
            )}
            {isRevealed && !isEditing && !hasContent && isUnlocked && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="font-body text-xs text-muted-foreground/70 mt-2 italic"
              >
                {isAdmin ? "No content yet. Click edit to add." : "A special surprise for you..."}
              </motion.p>
            )}
            {!isRevealed && !isEditing && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-body text-xs text-primary mt-2 flex items-center justify-center gap-1"
              >
                <Gift className="w-3 h-3" />
                Click to reveal
              </motion.p>
            )}
          </AnimatePresence>

          {isAdmin && isEditing && (
            <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
              <Input 
                value={editData.name} 
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="1. Name..."
                className="text-xs"
                data-testid={`input-name-surprise-${surprise.id}`}
              />
              <Textarea 
                value={editData.timerText} 
                onChange={(e) => setEditData(prev => ({ ...prev, timerText: e.target.value }))}
                placeholder="5. Teaser text (shows while timer running)..."
                className="text-xs min-h-[60px]"
                data-testid={`input-timerText-surprise-${surprise.id}`}
              />
              <Textarea 
                value={editData.content} 
                onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="2. Real surprise text (shows after timer ends)..."
                className="text-xs min-h-[60px]"
                data-testid={`input-content-surprise-${surprise.id}`}
              />
              <Input 
                value={editData.imagePath} 
                onChange={(e) => setEditData(prev => ({ ...prev, imagePath: e.target.value }))}
                placeholder="Image path (e.g., /surprises/photo.jpg)..."
                className="text-xs"
                data-testid={`input-imagePath-surprise-${surprise.id}`}
              />
              <Input 
                value={editData.url} 
                onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="3. Optional external URL..."
                className="text-xs"
                data-testid={`input-url-surprise-${surprise.id}`}
              />
              <div className="relative bg-gradient-to-r from-pink-100 to-amber-100 dark:from-pink-900/50 dark:to-amber-900/50 rounded-md p-2 border-2 border-pink-300 dark:border-pink-600">
                <label className="text-xs font-medium text-pink-600 dark:text-pink-400 flex items-center gap-1 mb-1">
                  <Key className="w-3 h-3" />
                  Secret Key (Required to unlock)
                </label>
                <Input 
                  value={editData.password} 
                  onChange={(e) => setEditData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter the secret key users need..."
                  className="text-sm bg-white dark:bg-black border-pink-200 dark:border-pink-700"
                  type="text"
                  data-testid={`input-password-surprise-${surprise.id}`}
                />
              </div>
              <div className="flex gap-2 justify-center">
                <Button size="sm" onClick={handleSave} data-testid={`button-save-surprise-${surprise.id}`}>
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {!isAdmin && !isUnlocked && !isEditing && (
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {new Date(surprise.unlockDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
    </>
  );
}

function RulesPopup({ rules, isAdmin, adminPassword, onSaveRules }: { 
  rules: string; 
  isAdmin: boolean; 
  adminPassword: string | null;
  onSaveRules: (newRules: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRules, setEditRules] = useState(rules);
  const { toast } = useToast();

  const handleSave = () => {
    onSaveRules(editRules);
    setIsEditing(false);
    toast({
      title: "Saved!",
      description: "Key rules have been updated.",
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="mt-4 gap-2 border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400"
        data-testid="button-show-rules"
      >
        <Key className="w-4 h-4" />
        {isAdmin ? "Edit Key Rules" : "How to Get Keys"}
      </Button>
      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setIsEditing(false); }}>
        <DialogContent className="sm:max-w-md overflow-visible bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 dark:from-pink-950/40 dark:via-purple-950/40 dark:to-amber-950/40 border-2 border-pink-200/50 dark:border-pink-700/50 shadow-2xl">
          <DialogHeader className="text-center relative">
            {/* Key icon */}
            <div className="mx-auto mb-4 relative">
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-amber-400 flex items-center justify-center shadow-xl border-2 border-white/50">
                <Key className="w-8 h-8 text-white drop-shadow-md" />
              </div>
            </div>
            
            <DialogTitle className="font-display text-2xl text-center bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              {isAdmin ? "Edit Key Rules" : "The Secret Key"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {isAdmin ? "Edit the rules for obtaining keys" : "Rules explaining how to obtain keys for surprises"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* Rules content - editable for admin */}
            <div className="relative text-center p-5 bg-white/70 dark:bg-black/40 rounded-xl border border-pink-200/50 dark:border-pink-800/50 shadow-inner">
              {isAdmin && isEditing ? (
                <Textarea
                  value={editRules}
                  onChange={(e) => setEditRules(e.target.value)}
                  placeholder="Enter the rules for how users can get keys..."
                  className="min-h-[120px] text-sm bg-white dark:bg-black border-pink-200 dark:border-pink-700"
                  data-testid="textarea-edit-rules"
                />
              ) : (
                <p className="text-foreground font-body leading-relaxed whitespace-pre-wrap text-sm">
                  {rules || "No rules set yet. Click Edit to add rules."}
                </p>
              )}
            </div>
            
            {/* Hint box - only show when not editing */}
            {!isEditing && (
              <div className="p-3 bg-gradient-to-r from-pink-100/80 to-amber-100/80 dark:from-pink-900/30 dark:to-amber-900/30 rounded-xl border border-pink-200/50 dark:border-pink-800/50">
                <p className="text-sm text-pink-700 dark:text-pink-300 text-center flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Keys unlock special surprises!
                  <Sparkles className="w-4 h-4" />
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {isAdmin ? (
              isEditing ? (
                <>
                  <Button 
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    data-testid="button-save-rules"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save Rules
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => { setIsEditing(false); setEditRules(rules); }}
                    data-testid="button-cancel-edit-rules"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600"
                    data-testid="button-start-edit-rules"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit Rules
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </>
              )
            ) : (
              <Button 
                onClick={() => setIsOpen(false)}
                className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 shadow-lg"
                data-testid="button-close-main-rules"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Got it, cutie!
                  <Sparkles className="w-4 h-4" />
                </span>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SurprisesSection({ isAdmin, adminPassword, content = {} }: SurprisesSectionProps) {
  const queryClient = useQueryClient();
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());

  const { data: surprises = [] } = useQuery<SurpriseConfig[]>({
    queryKey: ["/api/surprises", adminPassword],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (adminPassword) {
        headers["x-admin-password"] = adminPassword;
      }
      const res = await fetch("/api/surprises", { headers });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, password }: { 
      id: number; 
      data: { url?: string; name?: string; content?: string; timerText?: string; imagePath?: string; surprisePassword?: string; unlockNow?: boolean; relockNow?: boolean };
      password: string;
    }) => {
      const res = await apiRequest("PUT", `/api/surprises/${id}`, { 
        ...data, 
        adminPassword: password 
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/surprises"] });
    },
  });

  const updateRulesMutation = useMutation({
    mutationFn: async ({ newRules, password }: { newRules: string; password: string }) => {
      const res = await apiRequest("PUT", `/api/content/surprises_rules`, { 
        value: newRules,
        adminPassword: password 
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    },
  });

  const handleSaveRules = (newRules: string) => {
    if (adminPassword) {
      updateRulesMutation.mutate({ newRules, password: adminPassword });
    }
  };

  const handleReveal = (id: number, content?: string, url?: string) => {
    setRevealedIds(prev => new Set(Array.from(prev).concat([id])));
  };

  const handleEdit = (id: number, data: { url?: string; name?: string; content?: string; timerText?: string; imagePath?: string; surprisePassword?: string; unlockNow?: boolean; relockNow?: boolean }) => {
    if (adminPassword) {
      updateMutation.mutate({ id, data, password: adminPassword });
    }
  };

  const first8Surprises = surprises.slice(0, 8);
  const surprise9 = surprises.find(s => s.id === 9);
  const allFirst8Revealed = first8Surprises.every(s => revealedIds.has(s.id));
  const allFirst8Unlocked = first8Surprises.every(s => new Date(s.unlockDate).getTime() <= new Date().getTime());

  const revealedCount = first8Surprises.filter(s => revealedIds.has(s.id)).length;

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-card to-background" id="surprises">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-primary font-body text-sm tracking-widest uppercase mb-4">
            <Heart className="w-4 h-4 fill-current" />
            Special For You
            <Heart className="w-4 h-4 fill-current" />
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
            {content.surprises_title || "A Little Love Archive"}
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto mb-4">
            {content.surprises_subtitle || "Click to reveal each surprise. Each one unlocks on a special day."}
          </p>
          {revealedCount > 0 && revealedCount < 8 && (
            <p className="font-body text-sm text-primary">
              {revealedCount} of 8 revealed
            </p>
          )}
          {/* Game Rules Button - visible for everyone, editable for admin */}
          <RulesPopup 
            rules={content.surprises_rules || ""} 
            isAdmin={isAdmin}
            adminPassword={adminPassword}
            onSaveRules={handleSaveRules}
          />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {first8Surprises.map((surprise) => (
            <SurpriseCard 
              key={surprise.id} 
              surprise={surprise} 
              isAdmin={isAdmin}
              isRevealed={revealedIds.has(surprise.id)}
              onReveal={handleReveal}
              onEdit={handleEdit}
              rules={content.surprises_rules}
            />
          ))}
        </div>

        {surprise9 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <div className="text-center mb-6">
              <h3 className="font-display text-2xl font-semibold text-foreground">
                The Final Surprise
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                {(allFirst8Revealed && allFirst8Unlocked) || isAdmin 
                  ? "All surprises revealed! This one is always open for you."
                  : "Reveal all 8 surprises to unlock this special one."}
              </p>
            </div>
            <div className="max-w-sm mx-auto">
              <SurpriseCard 
                surprise={surprise9} 
                isAdmin={isAdmin}
                isRevealed={revealedIds.has(surprise9.id)}
                onReveal={handleReveal}
                onEdit={handleEdit}
                rules={content.surprises_rules}
              />
            </div>
          </motion.div>
        )}

        {allFirst8Revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <p className="font-display text-xl italic text-primary flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              All surprises revealed! You are so loved!
              <Sparkles className="w-5 h-5" />
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
