import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { MARKETING_MODAL_CONFIG } from "../config/marketing";

const DISMISS_KEY = "marketing_modal_dismissed_at";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function getShouldShowModal() {
  try {
    const storedValue = window.localStorage.getItem(DISMISS_KEY);
    if (!storedValue) return true;

    const dismissedAt = Number(storedValue);
    if (!Number.isFinite(dismissedAt)) return true;

    return Date.now() - dismissedAt > DISMISS_DURATION_MS;
  } catch {
    return true;
  }
}

function persistDismissal() {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // Ignore storage errors and close modal for this session.
  }
}

export function MarketingModal() {
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the image in the background immediately so it's
    // ready (or nearly ready) by the time the modal opens.
    const img = new Image();
    img.src = MARKETING_MODAL_CONFIG.promoImageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // show modal even if image fails

    setOpen(getShouldShowModal());
  }, []);

  const handleClose = () => {
    persistDismissal();
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      handleClose();
      return;
    }

    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl bg-black text-white border border-yellow-400/40 p-0 overflow-hidden">
        <AnimatePresence>
          {open && (
            <>
              {/* Image block — slides up first */}
              <motion.div
                key="promo-image"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                {/* Shimmer skeleton shown while image is still loading */}
                {!imageLoaded && (
                  <div className="w-full aspect-[4/3] bg-white/5 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>
                )}
                <img
                  src={MARKETING_MODAL_CONFIG.promoImageUrl}
                  alt={MARKETING_MODAL_CONFIG.headline}
                  fetchPriority="high"
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-auto object-cover transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
                />
              </motion.div>

              {/* Button row — fades in slightly after the image */}
              <motion.div
                key="promo-actions"
                className="px-6 pb-6 pt-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
              >
                <DialogFooter className="gap-3 sm:justify-start">
                  <Button asChild className="bg-yellow-400 text-black hover:bg-yellow-500">
                    <Link to={MARKETING_MODAL_CONFIG.ctaRoute} onClick={handleClose}>
                      {MARKETING_MODAL_CONFIG.ctaLabel}
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    onClick={handleClose}
                  >
                    Maybe Later
                  </Button>
                </DialogFooter>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}