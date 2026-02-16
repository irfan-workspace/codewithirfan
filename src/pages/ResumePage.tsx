import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { FileText, ExternalLink } from "lucide-react";

export default function ResumePage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from("settings").select("*").limit(1).single().then(({ data }) => setSettings(data));
  }, []);

  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FileText size={48} className="mx-auto text-primary mb-6" />
          <h1 className="text-4xl font-bold mb-4">Resume</h1>
          <p className="text-muted-foreground mb-8">Download or view my resume to learn more about my qualifications and experience.</p>
          {settings?.resume_url ? (
            <a href={settings.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              <ExternalLink size={16} /> View Resume
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">Resume will be available soon.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
