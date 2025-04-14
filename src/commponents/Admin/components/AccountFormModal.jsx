import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createAccount, updateAccount, checkForDuplicates } from "../../../services/accountservice";
import { toast } from "react-toastify"; // Assuming you use react-toastify for notifications

const AccountFormModal = ({ account, gameConfigs, onSave, onClose, title }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    game: "Genshin Impact",
    server: "Asia",
    title: "",
    price: "",
    discount: "",
    level: "",
    stock: 1,
    game_email: "", // Changed from email to match backend
    game_password: "", // Changed from password to match backend
    images: [],
    features: [],
  });

  

  // Initialize form data if editing an existing account
  useEffect(() => {
    if (account) {
      // Map backend data to form fields
      setFormData({
        ...account,
        // Handle potential field name differences
        game_email: account.game_email || "",
        game_password: account.game_password || "",
        // Convert existing images to the format our form expects
        images: Array.isArray(account.images)
          ? account.images.map((img) => ({
              file: null, // We don't have the file object for existing images
              preview: img,
              isExisting: true, // Flag to indicate this is an existing image
            }))
          : [],
      });
    }
  }, [account]);

  const formatToIDR = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const unformatIDR = (value) => {
    return parseInt(value.replace(/[Rp.\s]/g, "")) || 0;
  };


 const handleInputChange = (e) => {
   const { name, value } = e.target;

   if (name === "price" || name === "discount") {
     const raw = unformatIDR(value);
     setFormData((prev) => ({
       ...prev,
       [name]: raw,
     }));
   } else if (name === "stock") {
     setFormData((prev) => ({
       ...prev,
       stock: parseInt(value) || 1,
     }));
   } else {
     setFormData((prev) => ({
       ...prev,
       [name]: value,
     }));
   }
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
    // Extract base feature name
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
    if (formData.image) {
      if (formData.image.size > 2 * 1024 * 1024) {
        toast.warning("Maximum image size is 2MB");
        return;
      }
      if (!formData.image.type.startsWith("image/")) {
        toast.warning("Only image files are allowed");
        return;
      }

      // Add the image
      const newImageUrl = URL.createObjectURL(formData.image);
      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          { file: formData.image, preview: newImageUrl, isNew: true },
        ],
        image: null,
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !formData.title ||
      !formData.level ||
      !formData.price ||
      !formData.stock ||
      !formData.game_email ||
      !formData.game_password
    ) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }


    try {
      // First check for duplicates
      const hasDuplicate = await checkForDuplicates(
        formData.game,
        formData.game_email,
        formData.game_password,
        account?.id,
      );

      if (hasDuplicate) {
        toast.error(
          "Akun dengan email dan password yang sama sudah terdaftar di game ini.",
        );
        setIsSubmitting(false);
        return;
      }

      const data = new FormData();

      // Add basic fields
      data.append("game", formData.game);
      data.append("server", formData.server);
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("level", formData.level);
      data.append("stock", formData.stock);
      data.append("game_email", formData.game_email);
      data.append("game_password", formData.game_password);

      // Add discount only if provided
      if (formData.discount) {
        data.append("discount", formData.discount);
      }

      // Process images
      const existingImageUrls = [];

      formData.images.forEach((img) => {
        if (img.isExisting) {
          // For existing images, collect URLs
          existingImageUrls.push(img.preview);
        } else if (img.file) {
          // For new image files
          data.append(`images[]`, img.file);
        }
      });

      // Add existing image URLs
      if (existingImageUrls.length > 0) {
        data.append("existing_images", JSON.stringify(existingImageUrls));
      }

      // Add features
      formData.features.forEach((feature) => {
        data.append(`features[]`, feature);
      });

      // Save the account (create or update)
      let result;
      if (account?.id) {
        // Update existing account
        result = await updateAccount(account.id, data);
      } else {
        // Create new account
        result = await createAccount(data);
      }

      // Notify success
      toast.success(`Account ${account ? "updated" : "created"} successfully!`);

      // Call onSave with the result
      onSave(result);
    } catch (error) {
      console.error("Error saving account:", error);

      // Display error message
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while saving the account";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
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
                      type="text"
                      name="price"
                      value={formatToIDR(formData.price)}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Original price"
                      
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Price (IDR)
                    </label>
                    <input
                      type="text"
                      name="discount"
                      value={formatToIDR(formData.discount)}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Sale price (optional)"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of accounts available"
                    
                    min="1"
                  />
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images ({formData.images.length}/5)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          image: e.target.files[0],
                        }))
                      }
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      disabled={!formData.image || formData.images.length >= 5}
                    >
                      Add
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {formData.images.map((imgObj, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imgObj.preview}
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
                      name="game_email"
                      value={formData.game_email}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email"
                      
                    />
                    <input
                      type="password"
                      name="game_password"
                      value={formData.game_password}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountFormModal;
