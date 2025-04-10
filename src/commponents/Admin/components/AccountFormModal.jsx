import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AccountFormModal = ({ account, gameConfigs, onSave, onClose, title }) => {
  const [formData, setFormData] = useState({
    game: "Genshin Impact",
    server: "Asia",
    title: "",
    price: "",
    discount: "",
    level: "",
    stock: "",
    email: "",
    password: "",
    image: "",
    images: [],
    features: [],
  });

  // Initialize form data if editing an existing account
  useEffect(() => {
    if (account) {
      setFormData({
        ...account,
        images: account.images || [],
      });
    }
  }, [account]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discount" || name === "stock"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleFeatureChange = (feature, checked) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, feature],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        features: prev.features.filter((f) => !f.includes(feature)),
      }));
    }
  };

  const handleFeatureNumberChange = (feature, value) => {
    // Extract base feature name (e.g., "Character 5★" from "10 Character 5★")
    const baseFeature = feature;

    // Remove old version of this feature
    const filteredFeatures = formData.features.filter(
      (f) => !f.includes(baseFeature),
    );

    // Add new version with number
    if (value > 0) {
      filteredFeatures.push(`${value} ${baseFeature}`);
    }

    setFormData((prev) => ({
      ...prev,
      features: filteredFeatures,
    }));
  };

  const isFeatureSelected = (feature) => {
    return formData.features.some((f) => f.includes(feature));
  };

  const getFeatureCount = (feature) => {
    const matchingFeature = formData.features.find((f) => f.includes(feature));
    if (matchingFeature) {
      const match = matchingFeature.match(/^(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  };

  const handleAddImage = () => {
    if (formData.image && !formData.images.includes(formData.image)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, formData.image],
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
          <h2 className="text-2xl font-bold mb-4">{title}</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Game
                  </label>
                  <select
                    name="game"
                    value={formData.game}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.keys(gameConfigs).map((game) => (
                      <option key={game} value={game}>
                        {game}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Server
                  </label>
                  <select
                    name="server"
                    value={formData.server}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {formData.game &&
                      gameConfigs[formData.game]?.serverOptions.map(
                        (server) => (
                          <option key={server} value={server}>
                            {server}
                          </option>
                        ),
                      )}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Furina Account"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Level</option>
                    {formData.game &&
                      gameConfigs[formData.game]?.levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (IDR)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Original price"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Price (IDR)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Sale price"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Number of accounts available"
                  />
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Image URL"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt="Account preview"
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Login Details
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Email"
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-md">
                    {formData.game &&
                      gameConfigs[formData.game]?.features.map(
                        (feature, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`feature-${index}`}
                              checked={isFeatureSelected(feature)}
                              onChange={(e) =>
                                handleFeatureChange(feature, e.target.checked)
                              }
                              className="mr-2"
                            />
                            <label
                              htmlFor={`feature-${index}`}
                              className="mr-2"
                            >
                              {feature}
                            </label>

                            {isFeatureSelected(feature) && (
                              <input
                                type="number"
                                min="1"
                                value={getFeatureCount(feature) || ""}
                                onChange={(e) =>
                                  handleFeatureNumberChange(
                                    feature,
                                    e.target.value,
                                  )
                                }
                                className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                              />
                            )}
                          </div>
                        ),
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountFormModal;