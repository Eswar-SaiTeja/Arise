import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GooeyMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex?: number;
}

export const GooeyMenuOverlay: React.FC<GooeyMenuOverlayProps> = ({
  isOpen,
  onClose,
  zIndex = 40,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm select-none"
          style={{ zIndex }}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
};
