import React, { useState } from "react";
import { X, ChevronRight, Eye, EyeOff } from "lucide-react";

const DetailAccount = ({
  account,
  showPassword,
  togglePasswordVisibility,
  formatPrice,
  onClose,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < account.images.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {account.game} - {account.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={account.images[currentSlide]}
                  alt={`${account.title} preview ${currentSlide + 1}`}
                  className="w-full h-full object-cover"
                />

                {account.images.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 text-white ${
                        currentSlide === 0
                          ? "opacity-30 cursor-not-allowed"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      disabled={currentSlide === 0}
                    >
                      <ChevronRight className="w-5 h-5 transform rotate-180" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 text-white ${
                        currentSlide === account.images.length - 1
                          ? "opacity-30 cursor-not-allowed"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      disabled={currentSlide === account.images.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex mt-2 space-x-2 overflow-x-auto pb-2">
                {account.images.map((img, index) => (
                  <div
                    key={index}
                    className={`h-16 w-16 flex-shrink-0 rounded cursor-pointer border-2 ${
                      currentSlide === index
                        ? "border-indigo-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <div className="text-sm text-gray-500">Price</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {formatPrice(account.discount)}
                </div>
                {account.discount < account.price && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(account.price)}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Server</div>
                  <div className="text-base font-medium">{account.server}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Level</div>
                  <div className="text-base font-medium">{account.level}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Stock</div>
                  <div className="text-base font-medium">{account.stock}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      account.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {account.stock > 0 ? "Available" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Features</div>
                <div className="flex flex-wrap gap-2">
                  {account.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Created By</div>
                <div className="text-base font-medium">
                  {account.admin ? account.admin.name : "Unknown"}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">
                  Login Credentials
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm">{account.email}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Password</div>
                    <div className="flex items-center">
                      <div className="text-sm">
                        {showPassword[account.id]
                          ? account.password
                          : "••••••••"}
                      </div>
                      <button
                        onClick={() => togglePasswordVisibility(account.id)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword[account.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAccount;
