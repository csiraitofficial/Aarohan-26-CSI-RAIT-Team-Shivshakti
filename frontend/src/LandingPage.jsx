import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png';

const LandingPage = () => {
  return (
    // Added 'relative' and 'overflow-hidden' to contain our background effects
    <div className="relative min-h-screen bg-bgMain font-sans overflow-hidden">

      {/* ========================================= */}
      {/* ---> BACKGROUND EFFECTS (NO IMAGES NEEDED!) */}
      {/* 1. Subtle Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 opacity-60"></div>

      {/* 2. Glowing Ambient Smart City Blue Orb */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-secondary opacity-20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      {/* ========================================= */}


      {/* Navigation Bar (Added backdrop-blur for a frosted glass effect) */}
      <nav className="relative bg-white/80 backdrop-blur-md shadow-sm px-8 py-4 flex justify-between items-center z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src={logo} alt="TroubleFree AI" className="h-10 object-contain" />
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/login" className="text-primary font-bold hover:text-secondary transition">Login</Link>
          <Link to="/signup" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition shadow-md">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 z-10">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-secondary text-secondary font-bold text-xs tracking-widest uppercase shadow-sm">
          Smart City Infrastructure
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-primary mb-6 max-w-4xl leading-tight">
          Next-Generation Crowd <br /><span className="text-secondary">Risk Mitigation</span> System
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          Empowering citizens with real-time safety data and equipping authorities with AI-driven zone control to prevent disasters before they happen.
        </p>

        <div className="flex gap-4">
          <Link to="/signup" className="px-8 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition shadow-lg uppercase tracking-widest">
            Get Started Free
          </Link>
          <Link to="/signup-authority" className="px-8 py-4 bg-white text-primary border-2 border-primary font-bold rounded-lg hover:bg-gray-50 transition shadow-lg uppercase tracking-widest">
            Apply for Verification
          </Link>
        </div>
      </main>

      {/* Quick Features */}
      <section className="relative max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border-t-4 border-green-500 hover:-translate-y-1 transition duration-300">
          <h3 className="text-xl font-bold text-primary mb-2">Live Density Tracking</h3>
          <p className="text-gray-500 text-sm">Real-time occupancy metrics for critical zones and checkpoints.</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border-t-4 border-yellow-500 hover:-translate-y-1 transition duration-300">
          <h3 className="text-xl font-bold text-primary mb-2">Predictive Alerts</h3>
          <p className="text-gray-500 text-sm">Automated early warnings before crowd thresholds become critical.</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border-t-4 border-orange-500 hover:-translate-y-1 transition duration-300">
          <h3 className="text-xl font-bold text-primary mb-2">Authority Simulations</h3>
          <p className="text-gray-500 text-sm">Advanced bottleneck testing for event planning and rerouting.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;