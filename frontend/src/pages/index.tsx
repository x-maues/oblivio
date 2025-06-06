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
              <Image src="/o2.png" alt="Oblivio Logo" width={64} height={64} className="w-16 h-16 object-contain" />
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
          <p className="text-xl text-shield-text mb-8 animate-fade-in">Privacy-preserving token system built on Polkadot AssetHub</p>
          <div className="flex items-center justify-center space-x-2 text-yellow-700 bg-yellow-100/50 px-4 py-2 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Currently in beta. Testnet only.</span>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-12 relative z-10">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Why Oblivio?</h2>
          <p className="text-shield-text">Built on Polkadot AssetHub with Poseidon hash function, providing efficient and secure privacy-preserving transactions.</p>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">How it Works</h2>
          <p className="text-shield-text">Transactions are shielded using the Poseidon hash function, ensuring privacy while maintaining compatibility with Polkadot.</p>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">PolkaVM Optimized</h2>
          <p className="text-shield-text">Leverages PolkaVM&apos;s enhanced capabilities for efficient execution of privacy-preserving operations.</p>
        </div>
      </section>

      {/* How Oblivio Works */}
      <section className="py-16 bg-shield-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-shield-text text-center mb-12">How Oblivio Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <span className="text-4xl mb-4 block">🔒</span>
              <h3 className="text-xl font-bold mb-2">Connect Wallet</h3>
              <p className="text-shield-text">Connect your wallet to the Polkadot AssetHub network.</p>
            </div>
            <div className="card text-center">
              <span className="text-4xl mb-4 block">🛡️</span>
              <h3 className="text-xl font-bold mb-2">Shield Tokens</h3>
              <p className="text-shield-text">Deposit tokens into the shielded pool using Poseidon commitments.</p>
            </div>
            <div className="card text-center">
              <span className="text-4xl mb-4 block">👁️‍🗨️</span>
              <h3 className="text-xl font-bold mb-2">Private Transfers</h3>
              <p className="text-shield-text">Send and receive tokens privately through the shielded pool.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-[#edead7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <span className="text-4xl mb-4 block">⚡</span>
              <h3 className="text-xl font-bold mb-2">Poseidon Hash</h3>
              <p className="text-shield-text">Efficient implementation of the Poseidon hash function for privacy operations.</p>
            </div>
            <div className="text-center">
              <span className="text-4xl mb-4 block">🔗</span>
              <h3 className="text-xl font-bold mb-2">Polkadot Native</h3>
              <p className="text-shield-text">Built specifically for Polkadot AssetHub using PolkaVM.</p>
            </div>
            <div className="text-center">
              <span className="text-4xl mb-4 block">🧩</span>
              <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
              <p className="text-shield-text">Simple interface for managing private transactions and shielded tokens.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Use Oblivio?</h2>
            <p className="text-shield-text mb-8">Get started with private token transfers on Polkadot AssetHub today.</p>
            <div className="flex flex-col items-center space-y-4">
              <Link href="/dashboard" className="btn-primary">
                Get Started →
              </Link>
              <div className="flex items-center space-x-2 text-sm text-yellow-700">
                <AlertCircle className="w-4 h-4" />
                <span>Testnet only. No real funds required.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-shield-accent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-shield-text text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-bold mb-2">What is the Poseidon hash function?</h3>
              <p className="text-shield-text">Poseidon is a cryptographic hash function designed specifically for zero-knowledge proof systems, making it perfect for privacy-preserving operations.</p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">Is Oblivio open source?</h3>
              <p className="text-shield-text">Yes! Oblivio is open source and built for the Polkadot AssetHub Hackathon 2025.</p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">How do I get started?</h3>
              <p className="text-shield-text">Connect your wallet to Polkadot AssetHub testnet and start using the shielded pool for private transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-shield-accent border-t-2 border-shield-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <span className="text-shield-text">© {new Date().getFullYear()} Oblivio. All rights reserved.</span>
            <Link href="/settings" className="text-shield-text hover:text-shield-dark">Privacy Settings</Link>
          </div>
        </div>
      </footer>

      {/* Floating action button */}
      <Link href="/dashboard" className="fixed bottom-10 right-10 bg-shield-text text-shield-bg w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 border-shield-border hover:bg-shield-dark hover:border-shield-text transition-all duration-300 animate-bounce-slow">
        →
      </Link>
    </div>
  );
}