'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  LineChart, 
  ArrowRight,
  Wallet,
  Lock,
  Globe,
  HandCoins,
  AlertCircle
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import { WIPBanner } from '../components/WIPBanner';

function Scene() {
  return (
    <>
      <color attach="background" args={['#000']} />
      <ambientLight intensity={0.5} />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
      </Float>
    </>
  );
}

const features = [
  {
    name: 'Private Transactions',
    description: 'Send and receive tokens privately using our Poseidon-based shielded pool system.',
    icon: <Zap className="w-6 h-6" />,
    path: '/create',
  },
  {
    name: 'View Transactions',
    description: 'Monitor your private transactions and shielded pool activity in real-time.',
    icon: <LineChart className="w-6 h-6" />,
    path: '/dashboard',
  },
  {
    name: 'Poseidon Hash',
    description: 'Leverages the Poseidon hash function for efficient and secure privacy-preserving operations.',
    icon: <Shield className="w-6 h-6" />,
    path: '/about',
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-shield-bg relative overflow-hidden">
      <WIPBanner />
      
      {/* SVG grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-13" />
      
      {/* Animated blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-shield-accent rounded-full mix-blend-multiply filter blur-[40px] opacity-28 animate-blob" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-[#edead7] rounded-full mix-blend-multiply filter blur-[40px] opacity-28 animate-blob animation-delay-4000" />

      <Head>
        <title>Oblivio: Privacy-Preserving Token System</title>
        <meta name="description" content="Privacy-preserving token system built on Polkadot AssetHub using Poseidon hash function." />
        <link rel="icon" href="/o2.png" />
      </Head>

      {/* Sticky navigation bar */}
      <nav className="sticky top-8 z-50 bg-shield-accent border-b-2 border-shield-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Image src="/o2.png" alt="Oblivio Logo" width={64} height={64} className="w-20 h-20 object-contain" />
              <div className="flex space-x-8">
                <Link href="/" className="nav-link active">Home</Link>
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
                <Link href="/settings" className="nav-link">Settings</Link>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="w-full min-h-[320px] bg-shield-accent border-b-2 border-shield-border py-14 px-6 flex flex-col items-center justify-center animate-fade-in-up">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-shield-text mb-4 tracking-wider animate-fade-in">Oblivio</h1>
          <p className="text-xl text-shield-text-light mb-8 animate-fade-in">Privacy-preserving token system built on Polkadot AssetHub</p>
          <div className="flex items-center justify-center space-x-2 text-shield-warning bg-shield-accent-dark px-4 py-2 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Currently in beta. Testnet only.</span>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-12 relative z-10">
        <div className="bg-white rounded-xl p-6 border border-shield-border shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 text-shield-text">Why Oblivio?</h2>
          <p className="text-shield-text-light">Built on Polkadot AssetHub with Poseidon hash function, providing efficient and secure privacy-preserving transactions.</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-shield-border shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 text-shield-text">How it Works</h2>
          <p className="text-shield-text-light">Transactions are shielded using the Poseidon hash function, ensuring privacy while maintaining compatibility with Polkadot.</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-shield-border shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 text-shield-text">PolkaVM Optimized</h2>
          <p className="text-shield-text-light">Leverages PolkaVM&apos;s enhanced capabilities for efficient execution of privacy-preserving operations.</p>
        </div>
      </section>

      {/* How Oblivio Works */}
      <section className="py-16 bg-shield-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-shield-text text-center mb-12">How Oblivio Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-shield-border shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <span className="text-4xl mb-4 block">🔒</span>
              <h3 className="text-xl font-bold mb-2 text-shield-text">Connect Wallet</h3>
              <p className="text-shield-text-light">Connect your wallet to the Polkadot AssetHub network.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-shield-border shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <span className="text-4xl mb-4 block">🛡️</span>
              <h3 className="text-xl font-bold mb-2 text-shield-text">Shield Tokens</h3>
              <p className="text-shield-text-light">Deposit tokens into the shielded pool using Poseidon commitments.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-shield-border shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <span className="text-4xl mb-4 block">👁️‍🗨️</span>
              <h3 className="text-xl font-bold mb-2 text-shield-text">Private Transfers</h3>
              <p className="text-shield-text-light">Send and receive tokens privately through the shielded pool.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <span className="text-4xl mb-4 block">⚡</span>
              <h3 className="text-xl font-bold mb-2 text-shield-text">Poseidon Hash</h3>
              <p className="text-shield-text-light">Efficient implementation of the Poseidon hash function for privacy operations.</p>
            </div>
            <div className="text-center">
              <span className="text-4xl mb-4 block">🔗</span>
              <h3 className="text-xl font-bold mb-2 text-shield-text">Polkadot Native</h3>
              <p className="text-shield-text-light">Built specifically for Polkadot AssetHub using PolkaVM.</p>
            </div>
            <div className="text-center">
              <span className="text-4xl mb-4 block">🧩</span>
              <h3 className="text-xl font-bold mb-2 text-shield-text">Easy to Use</h3>
              <p className="text-shield-text-light">Simple interface for managing private transactions and shielded tokens.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="py-16 bg-shield-accent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 border border-shield-border shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4 text-shield-text">Ready to Use Oblivio?</h2>
            <p className="text-shield-text-light mb-8">Get started with private token transfers on Polkadot AssetHub today.</p>
            <div className="flex flex-col items-center space-y-4">
              <Link href="/dashboard" className="px-6 py-3 bg-shield-primary text-white rounded-lg font-medium shadow-md hover:bg-shield-primary-light transition-all duration-200">
                Get Started →
              </Link>
              <div className="flex items-center space-x-2 text-sm text-shield-warning">
                <AlertCircle className="w-4 h-4" />
                <span>Testnet only. No real funds required.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-shield-text text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-shield-accent rounded-xl p-6 border border-shield-border">
              <h3 className="font-bold mb-2 text-shield-text">What is the Poseidon hash function?</h3>
              <p className="text-shield-text-light">Poseidon is a cryptographic hash function designed specifically for zero-knowledge proof systems, making it perfect for privacy-preserving operations.</p>
            </div>
            <div className="bg-shield-accent rounded-xl p-6 border border-shield-border">
              <h3 className="font-bold mb-2 text-shield-text">Is Oblivio open source?</h3>
              <p className="text-shield-text-light">Yes! Oblivio is open source and built for the Polkadot AssetHub Hackathon 2025.</p>
            </div>
            <div className="bg-shield-accent rounded-xl p-6 border border-shield-border">
              <h3 className="font-bold mb-2 text-shield-text">How do I get started?</h3>
              <p className="text-shield-text-light">Connect your wallet to Polkadot AssetHub testnet and start using the shielded pool for private transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-shield-accent border-t-2 border-shield-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <span className="text-shield-text-light">© {new Date().getFullYear()} Oblivio. All rights reserved.</span>
            <Link href="/settings" className="text-shield-text-light hover:text-shield-text">Privacy Settings</Link>
          </div>
        </div>
      </footer>

      {/* Floating action button */}
      <Link href="/dashboard" className="fixed bottom-10 right-10 bg-shield-primary text-white w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 border-shield-border hover:bg-shield-primary-light transition-all duration-300 animate-bounce-slow">
        →
      </Link>
    </div>
  );
}