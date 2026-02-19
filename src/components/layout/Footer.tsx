import { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from("settings").select("name,github,linkedin,email").limit(1).single().then(({ data }) => setSettings(data));
  }, []);

  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {settings?.name || "Mohd Irfan"}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {settings?.github && (
            <a href={settings.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
              <Github size={18} />
            </a>
          )}
          {settings?.linkedin && (
            <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={18} />
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} aria-label="Email" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
