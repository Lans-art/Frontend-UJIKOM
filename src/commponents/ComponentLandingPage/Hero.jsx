import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // sesuaikan path-nya

function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading } = useUser();

  const handleStart = () => {
    if (isLoading) return; // tunggu data selesai loading

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "user") {
      navigate("/home");
    } else {
      console.warn("Role tidak dikenali:", role);
    }
  };

  return (
    <section id="beranda" className="bg-blue-900 text-white py-20 top-0 h-fit">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Beli Akun Game Hoyoverse Terpercaya
            </h1>
            <p className="text-xl mb-8">
              Dapatkan akun Genshin Impact, Honkai: Star Rail, dan game
              Hoyoverse lainnya dengan aman dan terpercaya.
            </p>
            <button
              onClick={handleStart}
              className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Mulai Sekarang
            </button>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            {/* Bisa tambah gambar/banner */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
