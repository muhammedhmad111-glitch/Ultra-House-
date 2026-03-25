import { useState, useEffect } from 'react';
import { X, Gift, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

export default function ExitIntent() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ultrahouse_exit_intent_shown');
    if (saved) setHasShown(true);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        localStorage.setItem('ultrahouse_exit_intent_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white z-[110] rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-black p-12 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                  <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:20px_20px]" />
                </div>
                <Gift size={48} className="mb-6 text-yellow-400 relative z-10" />
                <h3 className="text-4xl font-bold mb-2 relative z-10">15% OFF</h3>
                <p className="text-sm text-gray-400 relative z-10 uppercase tracking-widest font-bold">Your First Order</p>
              </div>
              
              <div className="md:w-1/2 p-12 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-4 tracking-tight">Wait! Don't go empty-handed.</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  Join our newsletter and get an exclusive discount code for your first purchase.
                </p>
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsVisible(false); }}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-black outline-none transition-all text-sm"
                    required
                  />
                  <Button className="w-full py-4">
                    Get My Discount
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </form>
                
                <button 
                  onClick={() => setIsVisible(false)}
                  className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold hover:text-black transition-colors"
                >
                  No thanks, I'll pay full price
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
