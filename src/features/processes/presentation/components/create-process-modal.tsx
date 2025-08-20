/**
 * Create Process Modal Component
 * Path: src/features/processes/presentation/components/create-process-modal.tsx
 */

"use client";

import { useState, FormEvent } from "react";
import { createProcessAction } from "../actions/process.actions";
import { CreateProcessDTO } from "../../shared/types/process.types";
import { ProcessPriority } from "../../domain/value-objects/process-priority.vo";
import { WIRED_PEOPLE_COMPANY_ID, WIRED_PEOPLE_COMPANY_NAME } from "../../shared/constants/process.constants";

interface CreateProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateProcessModal({ isOpen, onClose, onSuccess }: CreateProcessModalProps) {
  const [formData, setFormData] = useState<CreateProcessDTO>({
    name: "",
    description: "",
    vacancies: 1,
    priority: ProcessPriority.MEDIUM,
    location: "",
    remote: false,
    requiredSkills: [],
    requiredLanguages: [],
    minExperience: undefined,
    maxExperience: undefined,
    salaryMin: undefined,
    salaryMax: undefined,
    currency: "USD",
    deadline: undefined,
    tags: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const newSkill = {
        name: skillInput.trim(),
        level: 3, // Default to advanced
        required: true,
      };
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...(prev.requiredSkills || []), newSkill],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills?.filter((_, i) => i !== index),
    }));
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      const newLanguage = {
        code: languageInput.substring(0, 2).toUpperCase(),
        name: languageInput.trim(),
        level: "B2",
        required: false,
      };
      setFormData(prev => ({
        ...prev,
        requiredLanguages: [...(prev.requiredLanguages || []), newLanguage],
      }));
      setLanguageInput("");
    }
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredLanguages: prev.requiredLanguages?.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Process name is required");
      return;
    }

    if (formData.vacancies < 1) {
      setError("At least one vacancy is required");
      return;
    }

    if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
      setError("At least one skill is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createProcessAction(formData);
      
      if (result.success) {
        onSuccess?.();
        onClose();
        // Reset form
        setFormData({
          name: "",
          description: "",
          vacancies: 1,
          priority: ProcessPriority.MEDIUM,
          location: "",
          remote: false,
          requiredSkills: [],
          requiredLanguages: [],
          minExperience: undefined,
          maxExperience: undefined,
          salaryMin: undefined,
          salaryMax: undefined,
          currency: "USD",
          deadline: undefined,
          tags: [],
        });
      } else {
        setError(result.error || "Failed to create process");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Create New Process</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Company Info (Read-only) */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <div className="text-gray-900 font-medium">{WIRED_PEOPLE_COMPANY_NAME}</div>
            <div className="text-xs text-gray-500">ID: {WIRED_PEOPLE_COMPANY_ID}</div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Process Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
                placeholder="e.g., Senior Full Stack Developer"
                required
              />
            </div>

            <div>
              <label htmlFor="vacancies" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Vacancies <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="vacancies"
                name="vacancies"
                value={formData.vacancies}
                onChange={handleInputChange}
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
              placeholder="Describe the role, responsibilities, and ideal candidate..."
            />
          </div>

          {/* Priority and Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
              >
                <option value={ProcessPriority.LOW}>Low</option>
                <option value={ProcessPriority.MEDIUM}>Medium</option>
                <option value={ProcessPriority.HIGH}>High</option>
                <option value={ProcessPriority.URGENT}>Urgent</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
                placeholder="e.g., New York, NY"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remote"
                name="remote"
                checked={formData.remote}
                onChange={handleInputChange}
                className="mr-2 rounded border-gray-300 text-[#0b5d5b] focus:ring-[#0b5d5b]"
              />
              <label htmlFor="remote" className="text-sm font-medium text-gray-700">
                Remote Position
              </label>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Skills <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
                placeholder="Type a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-[#0b5d5b] text-white rounded-md hover:bg-[#094a48]"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills?.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#0b5d5b]/10 text-[#0b5d5b] rounded-full text-sm"
                >
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Languages
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
                placeholder="Type a language and press Enter"
              />
              <button
                type="button"
                onClick={addLanguage}
                className="px-4 py-2 bg-[#0b5d5b] text-white rounded-md hover:bg-[#094a48]"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requiredLanguages?.map((lang, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {lang.name} ({lang.level})
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="minExperience" className="block text-sm font-medium text-gray-700 mb-1">
                Min Experience (years)
              </label>
              <input
                type="number"
                id="minExperience"
                name="minExperience"
                value={formData.minExperience || ""}
                onChange={handleInputChange}
                min="0"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
              />
            </div>

            <div>
              <label htmlFor="maxExperience" className="block text-sm font-medium text-gray-700 mb-1">
                Max Experience (years)
              </label>
              <input
                type="number"
                id="maxExperience"
                name="maxExperience"
                value={formData.maxExperience || ""}
                onChange={handleInputChange}
                min="0"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
              />
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
                Min Salary
              </label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                value={formData.salaryMin || ""}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
              />
            </div>

            <div>
              <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
                Max Salary
              </label>
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                value={formData.salaryMax || ""}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="COP">COP</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline || ""}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b5d5b]"
                placeholder="Add tags for better organization"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#0b5d5b] text-white rounded-md hover:bg-[#094a48] disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Process"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}