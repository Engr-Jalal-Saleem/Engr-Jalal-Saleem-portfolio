"use client";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type T = { msg: string; err?: boolean } | null;
const Ctx = createContext<(msg: string, err?: boolean) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState<T>(null);
  const show = useCallback((msg: string, err?: boolean) => { setT({ msg, err }); setTimeout(() => setT(null), 3500); }, []);
  return (
    <Ctx.Provider value={show}>
      {children}
      <AnimatePresence>{t && (
        <motion.div role="status" className={`toast${t.err ? " err" : ""}`} initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}>{t.msg}</motion.div>
      )}</AnimatePresence>
    </Ctx.Provider>
  );
}
