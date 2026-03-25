import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ExitIntent from '../ui/ExitIntent';
import WhatsAppButton from '../ui/WhatsAppButton';
import ChatAssistant from '../ui/ChatAssistant';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-black selection:text-white">
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <ExitIntent />
      <WhatsAppButton />
      <ChatAssistant />
    </div>
  );
}

