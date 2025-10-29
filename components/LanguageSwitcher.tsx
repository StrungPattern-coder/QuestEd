"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "de" : "en");
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="border-[#FF991C]/30 hover:border-[#FF991C] hover:bg-[#FF991C]/10 text-[#F5F5F5] gap-2 bg-transparent hover:text-[#FF991C] transition-all"
    >
      <Languages className="h-4 w-4 text-[#F5F5F5]" />
      <span className="font-semibold text-[#F5F5F5]">{language === "en" ? "DE" : "EN"}</span>
    </Button>
  );
}
