import { useState, useEffect } from "react";
import { useContent } from "../../hooks/useContent";
import { FiSave, FiAlertCircle } from "react-icons/fi";

const HeroEditor = () => {
  const { heroContent, updateHeroContent, loading, error } = useContent();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    button_text: "",
    button_link: "",
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (heroContent && heroContent.length > 0) {
      const content = heroContent[0];
      setFormData({
        title: content.title || "",
        subtitle: content.subtitle || "",
        button_text: content.button_text || "",
        button_link: content.button_link || "",
      });
    }
  }, [heroContent]);

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
      await updateHeroContent(formData);
      setSuccessMessage("Hero content updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating hero content:", err);
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
          placeholder="Enter hero title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtitle
        </label>
        <textarea
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none resize-none"
          placeholder="Enter hero subtitle"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Text
          </label>
          <input
            type="text"
            name="button_text"
            value={formData.button_text}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
            placeholder="e.g., Get Started"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Link
          </label>
          <input
            type="text"
            name="button_link"
            value={formData.button_link}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
            placeholder="e.g., #contact"
          />
        </div>
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

export default HeroEditor;
