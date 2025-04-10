import React from "react";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">GachaHub</h3>
            <p className="text-gray-400">
              Platform jual beli akun game terpercaya di Indonesia.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Game Yang Tersedia</h4>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <a className="text-gray-400 hover:text-white">
                  Honkai Impact 3rd
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-white">
                  Honkai Star Rail
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-white">Genshin Impact</a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-white">
                  Zenless Zone Zero
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <HiMail className="h-5 w-5 mr-2" />
                <span className="text-gray-400">info@GachaHub.com</span>
              </li>
              <li className="flex items-center">
                <HiPhone className="h-5 w-5 mr-2" />
                <span className="text-gray-400">+62 123 4567 890</span>
              </li>
              <li className="flex items-center">
                <HiLocationMarker className="h-5 w-5 mr-2" />
                <span className="text-gray-400">Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Dapatkan info terbaru dari kami.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email Anda"
                className="px-4 py-2 bg-blue-900 rounded-l-lg w-full focus:outline-none text-white"
              />
              <button className="bg-blue-600 hover:bg-blue-900 px-4 py-2 rounded-r-lg hover:bg-secondary transition">
                Kirim
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-white">
            © {new Date().getFullYear()} GachaHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
