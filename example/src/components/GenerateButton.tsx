import { motion } from 'framer-motion'
import { Fingerprint } from 'lucide-react'
import { Button } from './ui/button'
import React from 'react'

interface GenerateButtonProps {
  isGenerating: boolean
  onClick(): void
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ isGenerating, onClick }) => (
  <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}>
    <Button disabled={isGenerating} onClick={onClick}>
      <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Fingerprint className="w-5 h-5" />
        {isGenerating ? 'Generating...' : 'Generate New FingerPrint'}
      </motion.div>
    </Button>
  </motion.div>
)
