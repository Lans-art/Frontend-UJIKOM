import React from "react";
import { ShieldCheck, Users, Star } from "lucide-react";

function About() {
  return (
    <section id="tentang" className="bg-blue-50 py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 aspect-[16/9] object-cover">
            <img
              src="https://assetsio.gnwcdn.com/Honkai-Star-Rail-next-Banner-3.0-Aglaea.jpg?width=1200&height=1200&fit=bounds&quality=70&format=jpg&auto=webp"
              alt="Gaming Community"
              className="rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 "
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold mb-6">Tentang Kami</h2>
            <p className="text-gray-600 mb-6">
              Kami adalah marketplace terpercaya untuk jual beli akun game
              Hoyoverse. Dengan pengalaman lebih dari 5 tahun, kami telah
              membantu ribuan gamers mendapatkan akun impian mereka dengan aman
              dan terpercaya.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center transform hover:scale-105 transition-all duration-300">
                <span className="bg-blue-100 p-2 rounded-full mr-4">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                </span>
                <span>10.000+ Transaksi Sukses</span>
              </li>
              <li className="flex items-center transform hover:scale-105 transition-all duration-300">
                <span className="bg-blue-100 p-2 rounded-full mr-4">
                  <Users className="h-5 w-5 text-blue-600" />
                </span>
                <span>5.000+ Pengguna Aktif</span>
              </li>
              <li className="flex items-center transform hover:scale-105 transition-all duration-300">
                <span className="bg-blue-100 p-2 rounded-full mr-4">
                  <Star className="h-5 w-5 text-blue-600" />
                </span>
                <span>4.9/5 Rating Kepuasan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
