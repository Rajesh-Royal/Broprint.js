import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Zap, Copy, CheckCircle } from 'lucide-react'
import { Card } from './ui/card'
import React from 'react'

interface FingerprintPanelProps {
  fingerprint?: string
  isGenerating: boolean
  copied: boolean
  onCopy(): void
}

export const FingerprintPanel: React.FC<FingerprintPanelProps> = ({ fingerprint, isGenerating, copied, onCopy }) => (
  <motion.div className="mx-auto mb-8" style={{ maxWidth: 900 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.8 }}>
    <Card>
      <div style={{ padding: 32 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2" style={{ fontSize: 24, fontWeight: 700, color: '#22d3ee' }}>
            <Activity className="w-6 h-6" />
            Generated Fingerprint
          </h2>
          <motion.button onClick={onCopy} whileHover={{ scale: fingerprint ? 1.05 : 1 }} whileTap={{ scale: 0.95 }} disabled={!fingerprint} style={{ cursor: fingerprint ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee' }}>
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </motion.button>
        </div>
        <motion.div className="relative font-mono text-center overflow-hidden" style={{ padding: 24, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 12, fontSize: 24, minHeight: 72 }} animate={{ boxShadow: ['0 0 20px rgba(0,255,255,0.2)', '0 0 40px rgba(0,255,255,0.4)', '0 0 20px rgba(0,255,255,0.2)'] }} transition={{ duration: 2, repeat: Infinity }}>
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-4" style={{ color: '#22d3ee' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Zap className="w-8 h-8" />
                </motion.div>
                <span>Analyzing Browser Signature...</span>
              </motion.div>
            ) : (
              <motion.div key="fp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ color: '#4ade80', wordBreak: 'break-all' }}>
                {fingerprint ? fingerprint?.split('').map((c, i) => (
                  <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="inline-block">{c}</motion.span>
                )) : <span style={{ color: '#64748b', fontSize: 16 }}>Click Generate to produce this browser fingerprint</span>}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Card>
  </motion.div>
)
