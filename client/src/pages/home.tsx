import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Gift, Star, Crown, Cake, Sun, Moon, Flower2, Music, Camera, Coffee, Plane, Home as HomeIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Confetti, FloatingHearts, FloatingSparkles } from "@/components/confetti";
import { MusicPlayer } from "@/components/music-player";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { SectionDivider } from "@/components/section-divider";
import { apiRequest } from "@/lib/queryClient";

import heroBackground from "@assets/generated_images/cute_kawaii_sunset_background.png";
import celebrationBackground from "@assets/generated_images/cute_celebration_sparkles_background.png";
import { SurprisesSection } from "@/components/surprises-section";
import { AdminContentEditor } from "@/components/admin-content-editor";

interface SiteContent {
  hero_title: string;
  hero_name: string;
  hero_subtitle: string;
  hero_signature: string;
  message_greeting: string;
  message_para1: string;
  message_para2: string;
  message_quote: string;
  message_quote_attribution: string;
  memories_title: string;
  memories_subtitle: string;
  things_title: string;
  things_subtitle: string;
  surprises_title: string;
  surprises_subtitle: string;
  proposal_title: string;
  proposal_message: string;
  footer_signature: string;
}

const defaultLoveMessages = [
  "You light up my world in ways you'll never know",
  "Every moment with you is a treasure I hold dear",
  "Your smile is my favorite sight in the whole world",
  "Thank you for being you - perfectly, wonderfully you",
  "I fall in love with you more every single day",
];

function HeroSection({ content }: { content: Partial<SiteContent> }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 text-white/80 font-body text-sm tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            A Special Day
            <Sparkles className="w-4 h-4" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          data-testid="text-hero-title"
        >
          {content.hero_title || "Happy Birthday"}
          <span className="block text-primary mt-2">{content.hero_name || "Aradhya"}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-display text-xl sm:text-2xl md:text-3xl text-white/90 italic font-light mb-8"
          data-testid="text-hero-subtitle"
        >
          {content.hero_subtitle || "From someone who thinks you're absolutely wonderful"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex items-center justify-center gap-2 text-white/70 font-body"
        >
          <Heart className="w-5 h-5 fill-primary text-primary" />
          <span>{content.hero_signature || "With all my love, Jeet"}</span>
          <Heart className="w-5 h-5 fill-primary text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16"
        >
          <ScrollIndicator targetId="message-section" />
        </motion.div>
      </div>

      <FloatingHearts />
    </section>
  );
}

function MessageSection({ content }: { content: Partial<SiteContent> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      id="message-section"
      ref={ref}
      className="py-24 px-4 bg-background"
    >
      <motion.div
        style={{ opacity }}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-8">
            {content.message_greeting || "Dear Aradhya,"}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <p className="font-body text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {content.message_para1 || "On this beautiful day, I wanted to create something special just for you. A place where I could express how much you mean to me and celebrate the incredible person you are."}
          </p>
          <p className="font-body text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {content.message_para2 || "Every day with you is a blessing, and today, on your birthday, I want the whole world to know how lucky I am to have you in my life."}
          </p>
        </motion.div>

        <SectionDivider />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <blockquote className="font-display text-2xl sm:text-3xl italic text-foreground/80 leading-relaxed">
            "{content.message_quote || "You are my today and all of my tomorrows."}"
          </blockquote>
          <p className="mt-4 text-muted-foreground font-body">
            - {content.message_quote_attribution || "For my dearest Aradhya"}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

function LoveMessagesSection({ content }: { content: Record<string, string> }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const loveMessages = [
    content.love_message_1 || defaultLoveMessages[0],
    content.love_message_2 || defaultLoveMessages[1],
    content.love_message_3 || defaultLoveMessages[2],
    content.love_message_4 || defaultLoveMessages[3],
    content.love_message_5 || defaultLoveMessages[4],
  ].filter(msg => msg && msg.trim() !== "");

  useEffect(() => {
    if (loveMessages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loveMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [loveMessages.length]);

  if (loveMessages.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-card">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
            {content.things_title || "Things I Want You to Know"}
          </h2>
          <p className="font-body text-muted-foreground">
            {content.things_subtitle || "Just a few of the countless reasons why you're so special"}
          </p>
        </motion.div>

        <div className="relative h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="font-display text-2xl sm:text-3xl md:text-4xl italic text-foreground/80 leading-relaxed absolute"
              data-testid="text-love-message"
            >
              "{loveMessages[currentIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {loveMessages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-primary/30 hover:bg-primary/50"
              }`}
              data-testid={`button-message-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const defaultReasons = [
  { icon: Sun, reason: "Your smile brightens even my darkest days" },
  { icon: Heart, reason: "The way you care about everyone around you" },
  { icon: Sparkles, reason: "Your laugh is the most beautiful sound" },
  { icon: Crown, reason: "You're my queen, my everything" },
  { icon: Flower2, reason: "You make every moment magical" },
  { icon: Star, reason: "Your kindness knows no bounds" },
  { icon: Moon, reason: "Even in the night, you're my guiding light" },
  { icon: Music, reason: "The rhythm of your heart matches mine" },
];

const reasonIcons = [Sun, Heart, Sparkles, Crown, Flower2, Star, Moon, Music];

function ReasonsSection({ content }: { content: Record<string, string> }) {
  const [revealedCount, setRevealedCount] = useState(0);
  
  const reasonsILoveYou = [
    { icon: reasonIcons[0], reason: content.reason_1 || defaultReasons[0].reason },
    { icon: reasonIcons[1], reason: content.reason_2 || defaultReasons[1].reason },
    { icon: reasonIcons[2], reason: content.reason_3 || defaultReasons[2].reason },
    { icon: reasonIcons[3], reason: content.reason_4 || defaultReasons[3].reason },
    { icon: reasonIcons[4], reason: content.reason_5 || defaultReasons[4].reason },
    { icon: reasonIcons[5], reason: content.reason_6 || defaultReasons[5].reason },
    { icon: reasonIcons[6], reason: content.reason_7 || defaultReasons[6].reason },
    { icon: reasonIcons[7], reason: content.reason_8 || defaultReasons[7].reason },
  ].filter(item => item.reason && item.reason.trim() !== "");

  const revealNext = () => {
    if (revealedCount < reasonsILoveYou.length) {
      setRevealedCount((prev) => prev + 1);
    }
  };

  const revealAll = () => {
    setRevealedCount(reasonsILoveYou.length);
  };

  if (reasonsILoveYou.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-card to-background" id="reasons-section">
      <div className="max-w-5xl mx-auto">
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
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4" data-testid="text-reasons-title">
            {content.reasons_title || "Why I Love You"}
          </h2>
          <p className="font-body text-muted-foreground">
            {content.reasons_subtitle || "Click to reveal each reason, one by one"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {reasonsILoveYou.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={index < revealedCount ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.95 }}
              transition={{ duration: 0.5, delay: index < revealedCount ? 0.1 : 0 }}
            >
              <Card
                className={`p-5 h-full text-center transition-all duration-500 ${
                  index < revealedCount
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card/50"
                }`}
                data-testid={`card-reason-${index}`}
              >
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-3 ${
                  index < revealedCount ? "bg-primary/20" : "bg-muted"
                }`}>
                  <item.icon className={`w-5 h-5 ${index < revealedCount ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <p className={`font-body text-sm ${index < revealedCount ? "text-foreground" : "text-muted-foreground/50"}`}>
                  {index < revealedCount ? item.reason : "???"}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {revealedCount < reasonsILoveYou.length && (
            <>
              <Button onClick={revealNext} className="gap-2" data-testid="button-reveal-reason">
                <Heart className="w-4 h-4" />
                Reveal Next Reason ({revealedCount}/{reasonsILoveYou.length})
              </Button>
              <Button variant="outline" onClick={revealAll} data-testid="button-reveal-all-reasons">
                Reveal All
              </Button>
            </>
          )}
          {revealedCount === reasonsILoveYou.length && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display text-xl italic text-primary"
              data-testid="text-all-reasons-revealed"
            >
              And there are countless more reasons... you're simply amazing!
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}

const defaultBirthdayWishes = [
  { icon: Cake, wish: "May this year bring you endless happiness and beautiful surprises", title: "Happiness" },
  { icon: Star, wish: "May all your dreams come true and your heart be filled with joy", title: "Dreams" },
  { icon: Heart, wish: "May our love grow stronger with each passing day", title: "Love" },
  { icon: Crown, wish: "May you always know how truly special and precious you are", title: "Confidence" },
  { icon: Sparkles, wish: "May every moment be as magical as your smile", title: "Magic" },
  { icon: Sun, wish: "May your days be bright and your spirit always shine", title: "Joy" },
];

const wishIcons = [Cake, Star, Heart, Crown, Sparkles, Sun];

function Surprise2WishesSection({ content }: { content: Record<string, string> }) {
  const [activeWish, setActiveWish] = useState<number | null>(null);
  
  const birthdayWishes = [
    { icon: wishIcons[0], title: content.wish_1_title || defaultBirthdayWishes[0].title, wish: content.wish_1_text || defaultBirthdayWishes[0].wish },
    { icon: wishIcons[1], title: content.wish_2_title || defaultBirthdayWishes[1].title, wish: content.wish_2_text || defaultBirthdayWishes[1].wish },
    { icon: wishIcons[2], title: content.wish_3_title || defaultBirthdayWishes[2].title, wish: content.wish_3_text || defaultBirthdayWishes[2].wish },
    { icon: wishIcons[3], title: content.wish_4_title || defaultBirthdayWishes[3].title, wish: content.wish_4_text || defaultBirthdayWishes[3].wish },
    { icon: wishIcons[4], title: content.wish_5_title || defaultBirthdayWishes[4].title, wish: content.wish_5_text || defaultBirthdayWishes[4].wish },
    { icon: wishIcons[5], title: content.wish_6_title || defaultBirthdayWishes[5].title, wish: content.wish_6_text || defaultBirthdayWishes[5].wish },
  ].filter(item => item.title && item.title.trim() !== "" && item.wish && item.wish.trim() !== "");

  if (birthdayWishes.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-background" id="surprise-2">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-primary font-body text-sm tracking-widest uppercase mb-4">
            <Cake className="w-4 h-4" />
            Surprise 2
            <Cake className="w-4 h-4" />
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4" data-testid="text-surprise2-title">
            {content.wishes_title || "Birthday Wishes For You"}
          </h2>
          <p className="font-body text-muted-foreground">
            {content.wishes_subtitle || "Tap on each card to reveal my heartfelt wishes"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {birthdayWishes.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveWish(activeWish === index ? null : index)}
              className="cursor-pointer"
            >
              <Card
                className={`p-6 h-full text-center transition-all duration-500 hover-elevate ${
                  activeWish === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
                data-testid={`card-wish-${index}`}
              >
                <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  activeWish === index ? "bg-white/20" : "bg-primary/10"
                }`}>
                  <item.icon className={`w-7 h-7 ${activeWish === index ? "text-white" : "text-primary"}`} />
                </div>
                <h3 className={`font-display text-lg font-semibold mb-2 ${
                  activeWish === index ? "text-white" : "text-foreground"
                }`}>
                  {item.title}
                </h3>
                <AnimatePresence mode="wait">
                  {activeWish === index ? (
                    <motion.p
                      key="wish"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="font-body text-sm text-white/90"
                    >
                      {item.wish}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="tap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-body text-sm text-muted-foreground"
                    >
                      Tap to reveal
                    </motion.p>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const defaultFutureDreams = [
  { icon: HomeIcon, title: "Our Dream Home", description: "A cozy place filled with love, laughter, and endless memories together" },
  { icon: Plane, title: "Adventures Together", description: "Exploring the world hand in hand, creating stories to tell" },
  { icon: Coffee, title: "Lazy Mornings", description: "Waking up next to you, coffee in hand, with nowhere to rush" },
  { icon: Camera, title: "Captured Moments", description: "A lifetime of photos documenting our beautiful journey" },
  { icon: Heart, title: "Growing Old Together", description: "Still holding hands and making each other smile, decades from now" },
];

const dreamIcons = [HomeIcon, Plane, Coffee, Camera, Heart];

function Surprise3DreamsSection({ content }: { content: Record<string, string> }) {
  const futureDreams = [
    { icon: dreamIcons[0], title: content.dream_1_title || defaultFutureDreams[0].title, description: content.dream_1_text || defaultFutureDreams[0].description },
    { icon: dreamIcons[1], title: content.dream_2_title || defaultFutureDreams[1].title, description: content.dream_2_text || defaultFutureDreams[1].description },
    { icon: dreamIcons[2], title: content.dream_3_title || defaultFutureDreams[2].title, description: content.dream_3_text || defaultFutureDreams[2].description },
    { icon: dreamIcons[3], title: content.dream_4_title || defaultFutureDreams[3].title, description: content.dream_4_text || defaultFutureDreams[3].description },
    { icon: dreamIcons[4], title: content.dream_5_title || defaultFutureDreams[4].title, description: content.dream_5_text || defaultFutureDreams[4].description },
  ].filter(item => item.title && item.title.trim() !== "" && item.description && item.description.trim() !== "");

  if (futureDreams.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-card" id="surprise-3">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-primary font-body text-sm tracking-widest uppercase mb-4">
            <Sparkles className="w-4 h-4" />
            Surprise 3
            <Sparkles className="w-4 h-4" />
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4" data-testid="text-surprise3-title">
            {content.dreams_title || "Our Dreams Together"}
          </h2>
          <p className="font-body text-muted-foreground">
            {content.dreams_subtitle || "Things I dream of sharing with you in our future"}
          </p>
        </motion.div>

        <div className="space-y-6">
          {futureDreams.map((dream, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`p-6 flex flex-col sm:flex-row items-center gap-6 ${
                  index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
                data-testid={`card-dream-${index}`}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <dream.icon className="w-8 h-8 text-primary" />
                </div>
                <div className={`text-center ${index % 2 === 0 ? "sm:text-left" : "sm:text-right"}`}>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {dream.title}
                  </h3>
                  <p className="font-body text-muted-foreground">
                    {dream.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="font-display text-2xl italic text-foreground/80" data-testid="text-dreams-conclusion">
            "With you, every dream feels possible..."
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingRomanticElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 1, 0],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        >
          {i % 3 === 0 ? (
            <Heart className="w-4 h-4 text-pink-300/60 fill-pink-300/60" />
          ) : i % 3 === 1 ? (
            <Sparkles className="w-3 h-3 text-yellow-200/50" />
          ) : (
            <Star className="w-3 h-3 text-white/40 fill-white/40" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function ProposalSection() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [hoverNo, setHoverNo] = useState(false);

  const { data: proposalStatus } = useQuery<{ hasResponded: boolean }>({
    queryKey: ["/api/proposal/status"],
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/proposal/accept", { accepted: true });
    },
  });

  useEffect(() => {
    if (proposalStatus?.hasResponded) {
      setHasAccepted(true);
      setIsRevealed(true);
    }
  }, [proposalStatus]);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync();
      setHasAccepted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    } catch (error) {
      console.error("Failed to save response:", error);
      setHasAccepted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 px-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${celebrationBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-pink-900/70 via-purple-900/60 to-rose-900/70" />
      
      <FloatingRomanticElements />

      <Confetti isActive={showConfetti} />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="pre-reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8"
            >
              <motion.div 
                className="relative w-32 h-32 mx-auto"
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400/30 via-rose-300/20 to-purple-400/30 blur-xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                  className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-pink-500/40 to-rose-600/40 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl"
                  animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Gift className="w-16 h-16 text-white drop-shadow-lg" />
                </motion.div>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos(i * 60 * Math.PI / 180) * 60],
                      y: [0, Math.sin(i * 60 * Math.PI / 180) * 60],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.h2 
                className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white"
                animate={{ textShadow: ['0 0 20px rgba(255,182,193,0.5)', '0 0 40px rgba(255,182,193,0.8)', '0 0 20px rgba(255,182,193,0.5)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Wait... One Last Surprise!
              </motion.h2>
              
              <motion.p 
                className="font-body text-xl text-white/90 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                I saved the most special one for the end...
                <br />
                <span className="text-pink-200 italic">Are you ready, my love?</span>
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  size="lg"
                  onClick={handleReveal}
                  className="text-xl px-10 py-7 gap-3 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 hover:from-pink-600 hover:via-rose-600 hover:to-pink-600 shadow-2xl shadow-pink-500/30 border border-white/20"
                  data-testid="button-reveal"
                >
                  <Heart className="w-6 h-6 fill-current" />
                  Open My Heart
                  <Sparkles className="w-5 h-5" />
                </Button>
              </motion.div>
              
              <motion.div
                className="flex justify-center gap-2 pt-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className="w-4 h-4 text-pink-300 fill-pink-300" />
                ))}
              </motion.div>
            </motion.div>
          ) : !hasAccepted ? (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        transform: `rotate(${i * 45}deg) translateY(-70px)`,
                      }}
                    >
                      <Star className="w-4 h-4 text-yellow-200/70 fill-yellow-200/70" />
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="w-32 h-32 mx-auto text-primary fill-primary drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 30px rgba(244,114,182,0.6))' }} />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
                data-testid="text-proposal"
              >
                My Dearest <span className="text-pink-300">Aradhya</span>,
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-xl mx-auto border border-white/20 shadow-xl"
              >
                <p className="font-body text-lg sm:text-xl text-white/95 leading-relaxed">
                  You're not just my love, you're my <span className="text-pink-300 font-semibold">best friend</span>, 
                  my <span className="text-pink-300 font-semibold">comfort</span>, my <span className="text-pink-300 font-semibold">everything</span>.
                </p>
                <p className="font-body text-lg sm:text-xl text-white/95 leading-relaxed mt-3">
                  Every single day with you feels like a gift I never want to stop unwrapping.
                  You make my world complete in ways words can never describe.
                </p>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="font-display text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300 font-bold pt-4"
                style={{ textShadow: '0 0 40px rgba(244,114,182,0.4)' }}
              >
                Will you be my forever?
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={handleAccept}
                    disabled={acceptMutation.isPending}
                    className="text-xl px-12 py-8 gap-3 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 hover:from-pink-600 hover:via-rose-600 hover:to-pink-600 shadow-2xl shadow-pink-500/40 border border-white/20"
                    data-testid="button-accept-yes"
                  >
                    <Heart className="w-7 h-7 fill-current" />
                    {acceptMutation.isPending ? "Saving..." : "Yes, Forever!"}
                    <Sparkles className="w-5 h-5" />
                  </Button>
                </motion.div>
                
                <motion.div
                  animate={hoverNo ? { x: [0, -30, 30, -30, 30, 0], y: [0, -15, 15, -15, 0] } : {}}
                  transition={{ duration: 0.6 }}
                  onMouseEnter={() => setHoverNo(true)}
                  onMouseLeave={() => setHoverNo(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={handleAccept}
                    className="text-xl px-12 py-8 gap-3 bg-white/15 backdrop-blur-md border-2 border-pink-300/50 text-white hover:bg-white/25 shadow-xl"
                    data-testid="button-accept-definitely"
                  >
                    <Star className="w-6 h-6 fill-current" />
                    Absolutely Yes!
                  </Button>
                </motion.div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-pink-200/70 font-body text-sm italic pt-4"
              >
                (There's no escape, you're stuck with me forever!)
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <motion.div className="relative">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        transform: `rotate(${i * 30}deg) translateY(-100px)`,
                      }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                    >
                      {i % 2 === 0 ? (
                        <Heart className="w-5 h-5 text-pink-300 fill-pink-300" />
                      ) : (
                        <Star className="w-4 h-4 text-yellow-200 fill-yellow-200" />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Heart className="w-40 h-40 mx-auto text-primary fill-primary" style={{ filter: 'drop-shadow(0 0 50px rgba(244,114,182,0.7))' }} />
                </motion.div>
              </motion.div>

              <motion.h2 
                className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white" 
                data-testid="text-celebration"
                animate={{ textShadow: ['0 0 30px rgba(255,182,193,0.5)', '0 0 60px rgba(255,182,193,0.8)', '0 0 30px rgba(255,182,193,0.5)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                I Knew You'd Say Yes!
              </motion.h2>

              <motion.p 
                className="font-body text-2xl sm:text-3xl text-white/95"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                You just made me the <span className="text-pink-300 font-semibold">happiest person</span> in the world!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-8 max-w-lg mx-auto border border-pink-300/30 shadow-2xl"
              >
                <Sparkles className="w-8 h-8 text-yellow-200 mx-auto mb-4" />
                <p className="font-display text-xl sm:text-2xl text-white italic leading-relaxed">
                  "From this moment on, every birthday, every sunrise, every heartbeat - they're all <span className="text-pink-300">ours to share</span>."
                </p>
              </motion.div>

              <motion.div 
                className="flex items-center justify-center gap-4 text-white font-display text-xl pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  <Heart className="w-6 h-6 fill-pink-400 text-pink-400" />
                </motion.div>
                <span className="bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent font-bold">Forever & Always Yours, Jeet</span>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}>
                  <Heart className="w-6 h-6 fill-pink-400 text-pink-400" />
                </motion.div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-pink-200/80 font-body text-lg mt-8"
              >
                Happy Birthday, my love. This is just the beginning of our beautiful forever.
              </motion.p>
              
              <motion.div
                className="flex justify-center gap-3 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <Heart className="w-5 h-5 text-pink-300 fill-pink-300" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Footer({ content }: { content: Partial<SiteContent> }) {
  const sig = content.footer_signature || "Made with love by Jeet for Aradhya";
  const parts = sig.split("by ");
  
  return (
    <footer className="py-12 px-4 bg-card text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-muted-foreground font-body mb-4 flex-wrap">
          <span>{parts[0]?.replace(" with love ", "") || "Made with"}</span>
          <Heart className="w-4 h-4 fill-primary text-primary" />
          <span>by {parts[1] || "Jeet for Aradhya"}</span>
        </div>
        <p className="text-sm text-muted-foreground/60">
          A birthday surprise filled with love and endless memories
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  const visitTracked = useRef(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const { data: contentData } = useQuery<Partial<SiteContent>>({
    queryKey: ["/api/content"],
  });
  const content = contentData || {};

  const visitMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/visits", {});
    },
  });

  const resetProposalMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/reset-proposal", { password: adminPassword });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposal/status"] });
      window.location.reload();
    },
  });

  useEffect(() => {
    if (!visitTracked.current) {
      visitTracked.current = true;
      visitMutation.mutate();
    }
  }, []);

  const handleAdminLogin = (password: string) => {
    setAdminPassword(password);
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    setAdminPassword(null);
    setIsAdmin(false);
  };

  const handleResetProposal = () => {
    if (confirm("Reset the proposal section? This will allow viewing the full experience again.")) {
      resetProposalMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MusicPlayer 
        onAdminLogin={handleAdminLogin}
        isAdmin={isAdmin}
        onAdminLogout={handleAdminLogout}
      />
      <AdminContentEditor isAdmin={isAdmin} adminPassword={adminPassword} />
      <FloatingSparkles />
      
      {isAdmin && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleResetProposal}
          disabled={resetProposalMutation.isPending}
          className="fixed left-4 bottom-4 z-50 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          {resetProposalMutation.isPending ? "Resetting..." : "Reset Proposal"}
        </motion.button>
      )}
      <HeroSection content={content} />
      <MessageSection content={content} />
      <SurprisesSection isAdmin={isAdmin} adminPassword={adminPassword} content={content} />
      <LoveMessagesSection content={content} />
      <ProposalSection />
      <Footer content={content} />
    </div>
  );
}
