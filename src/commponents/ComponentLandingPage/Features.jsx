import React from "react";
import { ShieldCheck, Users, CreditCard } from "lucide-react";

function Features  () {
  return (
    <section id="fitur" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">
          Keunggulan Kami
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-blue-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">100% Aman</h3>
            <p className="text-gray-600">
              Transaksi dijamin aman dengan sistem escrow dan verifikasi
              berlapis
            </p>
          </div>
          <div className="text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-blue-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Seller Terverifikasi</h3>
            <p className="text-gray-600">
              Semua penjual telah melalui proses verifikasi ketat
            </p>
          </div>
          <div className="text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-blue-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Pembayaran Mudah</h3>
            <p className="text-gray-600">
              Mendukung berbagai metode pembayaran populer
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
