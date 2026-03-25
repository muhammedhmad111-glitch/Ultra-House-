import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ExitIntent from '../ExitIntent';
import WhatsAppButton from '../WhatsAppButton';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <ExitIntent />
      <WhatsAppButton />
    </div>
  );
}

