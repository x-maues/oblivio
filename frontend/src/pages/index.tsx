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
  AlertCircle,
  Users
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import { WIPBanner } from '../components/WIPBanner';
import Layout from '../components/Layout';

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
    title: 'Private Transactions',
    description: 'Send and receive tokens privately using our Poseidon-based shielded pool system.',
    icon: <Shield className="w-6 h-6" />,
    link: '/private-transaction',
  },
  {
    title: 'Private Payroll',
    description: 'Manage private salary payments for your employees with enhanced privacy.',
    icon: <Users className="w-6 h-6" />,
    link: '/private-payroll',
  },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-shield-text mb-4">
          Privacy-Preserving Token System
        </h1>
        <p className="text-xl text-shield-text-light max-w-2xl mx-auto">
          Built on Polkadot AssetHub with Poseidon hash function, providing efficient and secure privacy-preserving transactions.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.link}
            className="bg-white rounded-xl p-6 border border-shield-border shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-shield-primary">{feature.icon}</div>
              <h2 className="text-xl font-semibold text-shield-text">{feature.title}</h2>
            </div>
            <p className="text-shield-text-light mb-4">{feature.description}</p>
            <div className="flex items-center text-shield-primary">
              <span className="text-sm font-medium">Get Started</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 border border-shield-border shadow-lg">
          <h2 className="text-2xl font-bold text-shield-text mb-4">Why Choose Oblivio?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-shield-text-light">Built with privacy as the core principle.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Polkadot Native</h3>
              <p className="text-shield-text-light">Optimized for Polkadot AssetHub.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gas Efficient</h3>
              <p className="text-shield-text-light">Optimized for cost-effective transactions.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}