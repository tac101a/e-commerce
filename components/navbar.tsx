'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Database, User, UserCircle, Sparkles } from 'lucide-react';
import { logEvent } from '@/lib/tracking';

interface NavbarProps {
  onLoginClick?: () => void;
  onGuestClick?: () => void;
}

export function Navbar({ onLoginClick, onGuestClick }: NavbarProps) {
  const handleLoginClick = () => {
    logEvent('login_click', {
      action: 'login_button_pressed',
      location: 'navbar',
      buttonText: 'Login',
    });
    onLoginClick?.();
  };

  const handleGuestClick = () => {
    logEvent('guest_click', {
      action: 'guest_button_pressed',
      location: 'navbar',
      buttonText: 'Continue as Guest',
    });
    onGuestClick?.();
  };

  const handleLogoClick = () => {
    logEvent('navbar_click', {
      action: 'logo_clicked',
      location: 'navbar',
      target: 'home',
    });
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <motion.button
          onClick={handleLogoClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 text-foreground"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <Database className="relative h-7 w-7 text-primary" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-bold tracking-tight">DataLakehouse</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Enterprise Analytics
            </span>
          </div>
        </motion.button>

        {/* Center Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-chart-1" />
          <span className="text-xs font-medium text-muted-foreground">Real-time Telemetry Active</span>
        </motion.div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGuestClick}
              className="text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Guest
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="sm"
              onClick={handleLoginClick}
              className="bg-primary/90 hover:bg-primary backdrop-blur-sm"
            >
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
