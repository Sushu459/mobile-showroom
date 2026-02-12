import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

// Define the shape of your Tenant data matching your DB
export interface Tenant {
  tenant_id: string;
  name: string;
  domain: string;
  mobile_number: string;
  primary_color: string;
  secondary_color: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({ tenant: null, loading: true, error: null });

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTenant = async () => {
      try {
        // 1. Get the current domain (e.g., "localhost" or "myshop.vercel.app")
        const currentHostname = window.location.hostname;
        
        console.log("Detecting Tenant for:", currentHostname);

        let query = supabase.from('tenants').select('*');

        // 2. SMART LOCALHOST LOGIC:
        // If we are on localhost, we can't match a real domain. 
        // So we just grab the FIRST tenant in your DB to let you test.
        if (currentHostname === 'localhost' || currentHostname === '127.0.0.1') {
          console.log("Localhost detected: Loading first available tenant for testing...");
          query = query.limit(1); // Just get the first one
        } else {
          // In production, match the exact domain
          // We assume your DB stores full URLs like "https://..." or just "myshop.com"
          // It's safer to check if the DB column *contains* the hostname
          query = query.ilike('domain', `%${currentHostname}%`);
        }

        const { data, error } = await query.single();

        if (error) throw error;
        
        if (data) {
          console.log("Tenant Loaded:", data.name);
          setTenant(data);
          // Optional: Dynamically set the site title
          document.title = data.name; 
        } else {
          setError("Store not found");
        }
      } catch (err) {
        console.error("Failed to load tenant:", err);
        setError("Failed to load store configuration");
      } finally {
        setLoading(false);
      }
    };

    loadTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);