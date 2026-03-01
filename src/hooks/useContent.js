import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * Hook to fetch and manage content from Supabase tables
 * @param {string} table - Table name (hero_content, services, about_section, contact_info, team_members)
 * @param {object} options - Query options (filter, order, limit)
 */
export const useContent = (table, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [table]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from(table).select("*");

      // Apply filters if provided
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply ordering
      if (options.order) {
        const { column, ascending = true } = options.order;
        query = query.order(column, { ascending });
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: err } = await query;

      if (err) throw err;
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${table}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchContent };
};

/**
 * Hook for admin operations (create, update, delete)
 */
export const useContentAdmin = (table) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: err } = await supabase
        .from(table)
        .insert([payload])
        .select();

      if (err) throw err;
      return data[0];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, payload) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: err } = await supabase
        .from(table)
        .update(payload)
        .eq("id", id)
        .select();

      if (err) throw err;
      return data[0];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const delete_ = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: err } = await supabase
        .from(table)
        .delete()
        .eq("id", id);

      if (err) throw err;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, delete: delete_, loading, error };
};
