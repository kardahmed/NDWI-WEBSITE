'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { formatPrice } from './types';

interface AnimatedPriceProps {
  value: number;
  className?: string;
}

/** Compteur de prix animé avec spring physics — comme Tesla, Apple. */
export function AnimatedPrice({ value, className }: AnimatedPriceProps) {
  const motionVal = useMotionValue(value);
  const spring = useSpring(motionVal, { stiffness: 80, damping: 18, mass: 0.6 });
  const display = useTransform(spring, (v) => formatPrice(Math.round(v)));
  const [text, setText] = useState(formatPrice(value));

  useEffect(() => {
    motionVal.set(value);
    const unsub = display.on('change', (v) => setText(v));
    return () => unsub();
  }, [value, motionVal, display]);

  // Flash subtil au changement de valeur (highlight copper bref).
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 400);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <motion.span
      className={className}
      animate={{ color: flash ? '#b08d57' : '#f5f2ee' }}
      transition={{ duration: 0.4 }}
    >
      {text}
    </motion.span>
  );
}
