import { useState, useEffect } from "react";
import { useContent } from "../../hooks/useContent";
import { FiSave, FiAlertCircle } from "react-icons/fi";

const ContactEditor = () => {
  const { contactInfo, updateContactInfo, loading, error } = useContent();
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "",
    map_embed_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (contactInfo && contactInfo.length > 0) {
      const info = contactInfo[0];
      setFormData({
        phone: info.phone || "",
        email: info.email || "",
        address: info.address || "",
        city: info.city || "",
        country: info.country || "",
        map_embed_url: info.map_embed_url || "",
      });
    }
  }, [contactInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");

    try {
      await updateContactInfo(formData);
      setSuccessMessage("Contact information updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating contact info:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <FiAlertCircle className="text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
            placeholder="contact@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
          placeholder="Street address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
            placeholder="City"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
            placeholder="Country"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Map Embed URL (Google Maps Embed)
        </label>
        <textarea
          name="map_embed_url"
          value={formData.map_embed_url}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none resize-none text-xs"
          placeholder="Paste Google Maps iframe embed code here"
        />
        <p className="text-xs text-gray-500 mt-1">
          Get embed code from Google Maps by clicking "Share" &gt; "Embed a map"
        </p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 bg-heroBg text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
      >
        <FiSave />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default ContactEditor;
