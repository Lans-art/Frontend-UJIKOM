import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";

function Faq() {
  const [activeFaq, setActiveFaq] = useState(null);
  const faqs = [
    {
      question: "Apakah transaksi di platform ini aman?",
      answer:
        "Ya, kami menggunakan sistem escrow dan verifikasi untuk menjamin keamanan setiap transaksi.",
    },
    {
      question: "Bagaimana proses pembelian akun?",
      answer:
        "Pilih akun yang diinginkan, lakukan pembayaran, dan tunggu verifikasi. Setelah terverifikasi, detail akun akan dikirimkan.",
    },
    {
      question: "Berapa lama proses transfer akun?",
      answer:
        "Proses transfer akun biasanya memakan waktu 1-24 jam setelah pembayaran terverifikasi.",
    },
    {
      question: "Apakah ada garansi untuk akun yang dibeli?",
      answer:
        "Ya, kami memberikan garansi 24 jam untuk memastikan akun berfungsi sesuai deskripsi.",
    },
  ];

  return (
    <motion.div layout>
      <motion.section id="faq" className="bg-blue-50 py-20" layout>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">FAQ</h2>
          <motion.div layout className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                layout
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  className="w-full bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                >
                  <span className="font-semibold">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scaleY: 0.8 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0.8 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="bg-white px-6 pb-6 rounded-b-lg shadow-md mt-px overflow-hidden"
                    >
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-gray-600"
                      >
                        {faq.answer}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      <motion.div layout>
        <Footer />
      </motion.div>
    </motion.div>
  );
}

export default Faq;
