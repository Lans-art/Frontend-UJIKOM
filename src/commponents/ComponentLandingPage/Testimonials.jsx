import React from "react";
import { Star } from "lucide-react";

function Testimonials  ()  {

  const testimonials = [
    {
      name: "Andi Pratama",
      rating: 5,
      comment:
        "Proses cepat dan terpercaya. Akun Genshin Impact yang saya beli sesuai dengan deskripsi.",
      image:
        "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=150&h=150&fit=crop",
    },
    {
      name: "Sarah Wijaya",
      rating: 5,
      comment: "Pelayanan sangat baik dan responsif. Recommended!",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
    {
      name: "Budi Santoso",
      rating: 5,
      comment:
        "Sudah berkali-kali transaksi disini, selalu aman dan terpercaya.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
  ];

  return (
    <section id="ulasan" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">
          Ulasan Pengguna
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;



  