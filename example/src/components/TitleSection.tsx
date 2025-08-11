import { motion } from 'framer-motion'
import React from 'react'

export const TitleSection: React.FC = () => (
  <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
    <motion.h1 className="font-bold mb-6" style={{ fontSize: 'clamp(3rem,8vw,6rem)', background: 'linear-gradient(to right,#22d3ee,#60a5fa,#34d399)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Browser FingerPrint</motion.h1>
    <motion.p className="mx-auto" style={{ maxWidth: 900, color: '#d1d5db', fontSize: 20, lineHeight: 1.5 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
      Advanced fingerprinting technology that generates unique identifiers for browsers using <span style={{ color: '#22d3ee', fontWeight: 600 }}>Canvas ImagePrinting</span> and <span style={{ color: '#34d399', fontWeight: 600 }}>Audio FingerPrinting</span> algorithms.
    </motion.p>
  </motion.div>
)
