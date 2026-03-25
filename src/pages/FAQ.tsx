import Layout from '../components/layout/Layout';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Where do you deliver?',
      answer: 'We currently deliver across the entire GCC region, including the United Arab Emirates, Saudi Arabia, Kuwait, Qatar, Oman, and Bahrain. Delivery times vary by location but typically range from 3-7 business days.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day hassle-free return policy. If you are not completely satisfied with your purchase, you can return it for a full refund or exchange, provided the item is in its original condition and packaging.'
    },
    {
      question: 'Do you offer assembly services?',
      answer: 'Yes, we offer professional assembly services for furniture items in selected cities across the UAE and Saudi Arabia. You can select this option during the checkout process for an additional fee.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you will receive an email and SMS with a tracking number and a link to our tracking portal. You can also track your order directly from your account dashboard.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and Cash on Delivery (COD) for orders up to a certain limit depending on the country.'
    },
    {
      question: 'Are your products sustainable?',
      answer: 'Sustainability is one of our core values. We prioritize materials from sustainable sources and work with manufacturers who follow ethical labor practices. Many of our wood products are FSC certified.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-gray-50 py-20 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">Frequently Asked Questions</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl border-0 shadow-sm focus:ring-2 focus:ring-black outline-none text-lg"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-24 max-w-3xl">
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <div key={i} className="border rounded-2xl overflow-hidden bg-white shadow-sm">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-lg">{faq.question}</span>
                  {openIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-gray-500 leading-relaxed border-t border-gray-50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        <div className="mt-20 p-12 bg-black text-white rounded-[2rem] text-center">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-gray-400 mb-8">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">Contact Us</a>
            <a href="https://wa.me/1234567890" className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors">WhatsApp Support</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
