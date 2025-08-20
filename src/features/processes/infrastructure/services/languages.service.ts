/**
 * Languages Service
 * Path: src/features/processes/infrastructure/services/languages.service.ts
 */

import { httpClient } from "@/infrastructure/http/http-client";

export interface Language {
  id: string;
  code: string;
  name: string;
}

class LanguagesService {
  private baseEndpoint = "/v1/languages";
  private cachedLanguages: Language[] | null = null;

  /**
   * Get all available languages
   */
  async getAllLanguages(): Promise<Language[]> {
    try {
      if (this.cachedLanguages) {
        return this.cachedLanguages;
      }

      const response = await httpClient.get<any[]>(this.baseEndpoint);
      
      // Map response to our Language interface
      const languages = (response || []).map(lang => ({
        id: lang.id || lang.languageId,
        code: lang.code || lang.languageCode || this.getLanguageCode(lang.name),
        name: lang.name || lang.languageName || "",
      }));

      // If no languages from API, provide defaults
      if (languages.length === 0) {
        languages.push(
          { id: "1", code: "EN", name: "English" },
          { id: "2", code: "ES", name: "Spanish" },
          { id: "3", code: "FR", name: "French" },
          { id: "4", code: "DE", name: "German" },
          { id: "5", code: "PT", name: "Portuguese" },
          { id: "6", code: "IT", name: "Italian" },
          { id: "7", code: "ZH", name: "Chinese" },
          { id: "8", code: "JA", name: "Japanese" },
        );
      }

      this.cachedLanguages = languages;
      return languages;
    } catch (error) {
      console.error("Error fetching languages:", error);
      
      // Return default languages on error
      return [
        { id: "1", code: "EN", name: "English" },
        { id: "2", code: "ES", name: "Spanish" },
        { id: "3", code: "FR", name: "French" },
        { id: "4", code: "DE", name: "German" },
        { id: "5", code: "PT", name: "Portuguese" },
      ];
    }
  }

  /**
   * Get language code from name
   */
  private getLanguageCode(name: string): string {
    const codeMap: Record<string, string> = {
      "English": "EN",
      "Spanish": "ES",
      "French": "FR",
      "German": "DE",
      "Portuguese": "PT",
      "Italian": "IT",
      "Chinese": "ZH",
      "Japanese": "JA",
      "Korean": "KO",
      "Russian": "RU",
    };
    
    return codeMap[name] || "EN";
  }
}

export const languagesService = new LanguagesService();