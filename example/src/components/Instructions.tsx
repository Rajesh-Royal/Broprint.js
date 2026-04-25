import { motion } from 'framer-motion'
import React from 'react'

export const Instructions: React.FC = () => (
  <motion.div className="text-center mx-auto" style={{ maxWidth: 600, color: '#9ca3af' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }}>
    <p style={{ marginBottom: 8 }}>🔒 Test this in incognito mode with VPN to verify fingerprint consistency</p>
    <p style={{ fontSize: 12 }}>Advanced browser fingerprinting remains stable across sessions</p>
  </motion.div>
)
