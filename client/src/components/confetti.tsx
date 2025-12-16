import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  type: "heart" | "sparkle" | "circle";
}

const colors = [
  "hsl(350, 90%, 75%)",
  "hsl(340, 85%, 80%)",
  "hsl(355, 80%, 70%)",
  "hsl(320, 75%, 75%)",
  "hsl(30, 85%, 80%)",
  "hsl(280, 60%, 80%)",
  "hsl(200, 70%, 80%)",
  "hsl(45, 100%, 85%)",
];

function Heart({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function Sparkle({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
    </svg>
  );
}

export function Confetti({ isActive }: { isActive: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 80; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 3,
          size: 12 + Math.random() * 16,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: ["heart", "sparkle", "circle"][Math.floor(Math.random() * 3)] as "heart" | "sparkle" | "circle",
        });
      }
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ y: -50, x: `${piece.x}vw`, opacity: 1, rotate: 0 }}
            animate={{
              y: "110vh",
              rotate: 720,
              opacity: [1, 1, 0.8, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: "linear",
            }}
            className="absolute"
            style={{ left: 0, top: 0 }}
          >
            {piece.type === "heart" && <Heart size={piece.size} color={piece.color} />}
            {piece.type === "sparkle" && <Sparkle size={piece.size} color={piece.color} />}
            {piece.type === "circle" && (
              <div
                className="rounded-full"
                style={{
                  width: piece.size,
                  height: piece.size,
                  backgroundColor: piece.color,
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Star({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const types: Array<"heart" | "sparkle" | "circle"> = ["heart", "sparkle", "heart"];
      const newHeart: ConfettiPiece = {
        id: Date.now(),
        x: 10 + Math.random() * 80,
        delay: 0,
        duration: 5 + Math.random() * 4,
        size: 14 + Math.random() * 14,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * types.length)],
      };
      setHearts((prev) => [...prev.slice(-20), newHeart]);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: "100vh", x: `${heart.x}vw`, opacity: 0.8, scale: 0.3 }}
            animate={{
              y: "-10vh",
              opacity: [0.8, 1, 0.7, 0],
              scale: [0.3, 1.1, 0.9],
              x: `${heart.x + (Math.random() - 0.5) * 15}vw`,
              rotate: [0, 15, -15, 10, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: heart.duration,
              ease: "easeOut",
            }}
            className="absolute"
          >
            {heart.type === "heart" && <Heart size={heart.size} color={heart.color} />}
            {heart.type === "sparkle" && <Sparkle size={heart.size} color={heart.color} />}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function FloatingSparkles() {
  const [sparkles, setSparkles] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const initialSparkles: ConfettiPiece[] = [];
    for (let i = 0; i < 15; i++) {
      initialSparkles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "sparkle",
      });
    }
    setSparkles(initialSparkles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{ left: `${sparkle.x}%`, top: `${20 + Math.random() * 60}%` }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkle size={sparkle.size} color={sparkle.color} />
        </motion.div>
      ))}
    </div>
  );
}
