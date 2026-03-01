import { useState, useEffect } from "react";
import { useContent } from "../../hooks/useContent";
import { FiTrash2, FiPlus, FiSave, FiAlertCircle } from "react-icons/fi";

const TeamEditor = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, loading, error } = useContent();
  const [membersList, setMembersList] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    bio: "",
    image_url: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (teamMembers) {
      setMembersList(teamMembers);
    }
  }, [teamMembers]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    setSaving(true);
    try {
      await addTeamMember(newMember);
      setNewMember({ name: "", role: "", bio: "", image_url: "" });
      setSuccessMessage("Team member added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding team member:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMember = async (id, updatedData) => {
    setSaving(true);
    try {
      await updateTeamMember(id, updatedData);
      setEditingId(null);
      setSuccessMessage("Team member updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating team member:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      setSaving(true);
      try {
        await deleteTeamMember(id);
        setSuccessMessage("Team member deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Error deleting team member:", err);
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

      {/* Add New Team Member Form */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiPlus /> Add New Team Member
        </h3>
        <form onSubmit={handleAddMember} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
            required
          />
          <input
            type="text"
            placeholder="Role (e.g., CEO, Manager)"
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
          />
          <textarea
            placeholder="Bio"
            value={newMember.bio}
            onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none resize-none"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newMember.image_url}
            onChange={(e) => setNewMember({ ...newMember, image_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
          />
          <button
            type="submit"
            disabled={saving || !newMember.name.trim()}
            className="flex items-center gap-2 bg-Primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <FiPlus />
            Add Team Member
          </button>
        </form>
      </div>

      {/* Team Members List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
        {membersList && membersList.length > 0 ? (
          membersList.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4">
              {editingId === member.id ? (
                <TeamMemberEditForm
                  member={member}
                  onSave={(data) => handleUpdateMember(member.id, data)}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4 flex-grow">
                    {member.image_url && (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800">{member.name}</h4>
                      {member.role && (
                        <p className="text-Primary font-medium text-sm">{member.role}</p>
                      )}
                      {member.bio && (
                        <p className="text-gray-600 text-sm mt-1">{member.bio}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(member.id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
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
          <p className="text-gray-500 text-center py-8">No team members yet</p>
        )}
      </div>
    </div>
  );
};

const TeamMemberEditForm = ({ member, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    name: member.name,
    role: member.role || "",
    bio: member.bio || "",
    image_url: member.image_url || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
        required
      />
      <input
        type="text"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        placeholder="Role"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
      />
      <textarea
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        placeholder="Bio"
        rows="2"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none resize-none"
      />
      <input
        type="text"
        value={formData.image_url}
        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        placeholder="Image URL"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBg focus:border-transparent outline-none"
      />
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

export default TeamEditor;
