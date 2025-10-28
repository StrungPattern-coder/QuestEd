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
      className="border-[#FFA266]/30 hover:border-[#FFA266] hover:bg-[#FFA266]/10 text-[#F5F5F5] gap-2"
    >
      <Languages className="h-4 w-4" />
      <span className="font-semibold">{language === "en" ? "DE" : "EN"}</span>
    </Button>
  );
}
