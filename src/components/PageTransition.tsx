import React from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.99,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1], // cinematic easeOut
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  out: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1], // easeIn
    },
  },
};

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className={`w-full h-full min-h-screen origin-top ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
