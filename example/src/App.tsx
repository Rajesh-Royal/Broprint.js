import { useState } from 'react'
import { motion } from 'framer-motion'
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js'
import { Header } from './components/Header'
import { TitleSection } from './components/TitleSection'
import { FeatureIcons } from './components/FeatureIcons'
import { FingerprintPanel } from './components/FingerprintPanel'
import { GenerateButton } from './components/GenerateButton'
import { Instructions } from './components/Instructions'
import './App.css'

function App() {
  const [fingerprint, setFingerprint] = useState<string | undefined>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)


  const generateFingerprint = async () => {
    setIsGenerating(true)
    try {
      const fp = await getCurrentBrowserFingerPrint()
      // simulate delay
      await new Promise((resolve) => {
        setTimeout(() => {
          setFingerprint(String(fp));
          resolve(fp);
        }, 1500);
      })
    } catch (e: any) {
      setFingerprint('ERROR:' + (e?.message || 'failed'))
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!fingerprint) return
    try {
      await navigator.clipboard.writeText(fingerprint)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) { /* noop */ }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden App">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-emerald-500/10" />
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
          animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 4, height: 4, background: '#22d3ee' }}
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          animate={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, repeatType: 'reverse' }}
        />
      ))}
      <div className="relative z-10 container mx-auto px-4 py-8" style={{ maxWidth: 1400 }}>
        <Header />
        <TitleSection />
        <FeatureIcons />
        <FingerprintPanel fingerprint={fingerprint} isGenerating={isGenerating} copied={copied} onCopy={copyToClipboard} />
        <GenerateButton isGenerating={isGenerating} onClick={generateFingerprint} />
        <Instructions />
      </div>
    </div>
  )
}

export default App
