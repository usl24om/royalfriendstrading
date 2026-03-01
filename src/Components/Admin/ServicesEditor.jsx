import { useState, useEffect } from "react";
import { useContent } from "../../hooks/useContent";
import { FiTrash2, FiPlus, FiSave, FiAlertCircle } from "react-icons/fi";

const ServicesEditor = () => {
  const { services, addService, updateService, deleteService, loading, error } = useContent();
  const [servicesList, setServicesList] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    icon_url: "",
    image_url: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (services) {
      setServicesList(services);
    }
  }, [services]);

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.title.trim()) return;

    setSaving(true);
    try {
      await addService(newService);
      setNewService({ title: "", description: "", icon_url: "", image_url: "" });
      setSuccessMessage("Service added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding service:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateService = async (id, updatedData) => {
    setSaving(true);
    try {
      await updateService(id, updatedData);
      setEditingId(null);
      setSuccessMessage("Service updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating service:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setSaving(true);
      try {
        await deleteService(id);
        setSuccessMessage("Service deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Error deleting service:", err);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
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

      {/* Add New Service Form */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiPlus /> Add New Service
        </h3>
        <form onSubmit={handleAddService} className="space-y-4">
          <input
            type="text"
            placeholder="Service Title"
            value={newService.title}
            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
            required
          />
          <textarea
            placeholder="Service Description"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none resize-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Icon URL"
              value={newService.icon_url}
              onChange={(e) => setNewService({ ...newService, icon_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newService.image_url}
              onChange={(e) => setNewService({ ...newService, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving || !newService.title.trim()}
            className="flex items-center gap-2 bg-Primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <FiPlus />
            Add Service
          </button>
        </form>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Existing Services</h3>
        {servicesList && servicesList.length > 0 ? (
          servicesList.map((service) => (
            <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-4">
              {editingId === service.id ? (
                <ServiceEditForm
                  service={service}
                  onSave={(data) => handleUpdateService(service.id, data)}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-800">{service.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                    {service.icon_url && (
                      <p className="text-gray-500 text-xs mt-2">Icon: {service.icon_url}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(service.id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      disabled={saving}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <FiTrash2 className="size-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No services yet</p>
        )}
      </div>
    </div>
  );
};

const ServiceEditForm = ({ service, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    title: service.title,
    description: service.description || "",
    icon_url: service.icon_url || "",
    image_url: service.image_url || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
        required
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows="3"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none resize-none"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={formData.icon_url}
          onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
          placeholder="Icon URL"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
        />
        <input
          type="text"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="Image URL"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-heroBg text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <FiSave />
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ServicesEditor;
