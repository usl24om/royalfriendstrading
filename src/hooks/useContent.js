import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useContent = () => {
  const [heroContent, setHeroContent] = useState([]);
  const [services, setServices] = useState([]);
  const [aboutContent, setAboutContent] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const [heroRes, servicesRes, aboutRes, contactRes, teamRes] = await Promise.all([
        supabase.from("hero_content").select("*").limit(1),
        supabase.from("services").select("*").order("order_index", { ascending: true }),
        supabase.from("about_section").select("*").limit(1),
        supabase.from("contact_info").select("*").limit(1),
        supabase.from("team_members").select("*").order("order_index", { ascending: true }),
      ]);

      if (heroRes.error) throw heroRes.error;
      if (servicesRes.error) throw servicesRes.error;
      if (aboutRes.error) throw aboutRes.error;
      if (contactRes.error) throw contactRes.error;
      if (teamRes.error) throw teamRes.error;

      setHeroContent(heroRes.data || []);
      setServices(servicesRes.data || []);
      setAboutContent(aboutRes.data || []);
      setContactInfo(contactRes.data || []);
      setTeamMembers(teamRes.data || []);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateHeroContent = async (data) => {
    try {
      const { data: existingContent } = await supabase.from("hero_content").select("id").limit(1);
      
      if (existingContent && existingContent.length > 0) {
        const { error: err } = await supabase
          .from("hero_content")
          .update({ ...data, updated_at: new Date() })
          .eq("id", existingContent[0].id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("hero_content").insert([data]);
        if (err) throw err;
      }
      await fetchAllContent();
    } catch (err) {
      console.error("Error updating hero content:", err);
      throw err;
    }
  };

  const addService = async (serviceData) => {
    try {
      const { error: err } = await supabase
        .from("services")
        .insert([{ ...serviceData, order_index: services.length }]);
      if (err) throw err;
      await fetchAllContent();
    } catch (err) {
      console.error("Error adding service:", err);
      throw err;
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      const { error: err } = await supabase
        .from("services")
        .update({ ...serviceData, updated_at: new Date() })
        .eq("id", id);
      if (err) throw err;
      await fetchAllContent();
    } catch (err) {
      console.error("Error updating service:", err);
      throw err;
    }
  };

  const deleteService = async (id) => {
    try {
      const { error: err } = await supabase.from("services").delete().eq("id", id);
      if (err) throw err;
      await fetchAllContent();
    } catch (err) {
      console.error("Error deleting service:", err);
      throw err;
    }
  };

  const updateAboutContent = async (data) => {
    try {
      const { data: existingContent } = await supabase.from("about_section").select("id").limit(1);
      
      if (existingContent && existingContent.length > 0) {
        const { error: err } = await supabase
          .from("about_section")
          .update({ ...data, updated_at: new Date() })
          .eq("id", existingContent[0].id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("about_section").insert([data]);
        if (err) throw err;
      }
      await fetchAllContent();
    } catch (err) {
      console.error("Error updating about content:", err);
      throw err;
    }
  };

  const updateContactInfo = async (data) => {
    try {
      const { data: existingInfo } = await supabase.from("contact_info").select("id").limit(1);
      
      if (existingInfo && existingInfo.length > 0) {
        const { error: err } = await supabase
          .from("contact_info")
          .update({ ...data, updated_at: new Date() })
          .eq("id", existingInfo[0].id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("contact_info").insert([data]);
        if (err) throw err;
      }
      await fetchAllContent();
    } catch (err) {
      console.error("Error updating contact info:", err);
      throw err;
    }
  };

  const addTeamMember = async (memberData) => {
    try {
      const { error: err } = await supabase
        .from("team_members")
        .insert([{ ...memberData, order_index: teamMembers.length }]);
      if (err) throw err;
      await fetchAllContent();
    } catch (err) {
      console.error("Error adding team member:", err);
      throw err;
    }
  };

  const updateTeamMember = async (id, memberData) => {
    try {
      const { error: err } = await supabase
        .from("team_members")
        .update({ ...memberData, updated_at: new Date() })
        .eq("id", id);
      if (err) throw err;
      await fetchAllContent();
    } catch (err) {
      console.error("Error updating team member:", err);
      throw err;
    }
  };

  const deleteTeamMember = async (id) => {
    try {
      const { error: err } = await supabase.from("team_members").delete().eq("id", id);
      if (err) throw err;
      await fetchAllContent();
    } catch (err) {
      console.error("Error deleting team member:", err);
      throw err;
    }
  };

  return {
    heroContent,
    services,
    aboutContent,
    contactInfo,
    teamMembers,
    loading,
    error,
    refetch: fetchAllContent,
    updateHeroContent,
    addService,
    updateService,
    deleteService,
    updateAboutContent,
    updateContactInfo,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
};
