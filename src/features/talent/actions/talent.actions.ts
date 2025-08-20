"use server";

import { revalidatePath } from "next/cache";
import { talentRepository } from "@/features/talent/repositories/talent.repository";
import type {
  CreateTalentDTO,
  UpdateTalentDTO,
  TalentFilters,
} from "@/features/talent/types/talent.types";

/**
 * Server action to create a new talent
 */
export async function createTalentAction(data: CreateTalentDTO) {
  try {
    const newTalent = await talentRepository.create(data);
    
    // Revalidate the talent list page
    revalidatePath("/talent");
    
    return {
      success: true,
      data: newTalent,
      message: "Talent created successfully",
    };
  } catch (error) {
    console.error("Error creating talent:", error);
    return {
      success: false,
      error: "Failed to create talent. Please try again.",
    };
  }
}

/**
 * Server action to update a talent
 */
export async function updateTalentAction(id: string, data: UpdateTalentDTO) {
  try {
    const updatedTalent = await talentRepository.update(id, data);
    
    // Revalidate both the list and detail pages
    revalidatePath("/talent");
    revalidatePath(`/talent/${id}`);
    
    return {
      success: true,
      data: updatedTalent,
      message: "Talent updated successfully",
    };
  } catch (error) {
    console.error("Error updating talent:", error);
    return {
      success: false,
      error: "Failed to update talent. Please try again.",
    };
  }
}

/**
 * Server action to delete a talent
 */
export async function deleteTalentAction(id: string) {
  try {
    await talentRepository.delete(id);
    
    // Revalidate the talent list page
    revalidatePath("/talent");
    
    return {
      success: true,
      message: "Talent deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting talent:", error);
    return {
      success: false,
      error: "Failed to delete talent. Please try again.",
    };
  }
}

/**
 * Server action to export talents to CSV
 */
export async function exportTalentsAction(filters?: TalentFilters) {
  try {
    // Fetch all talents with filters
    const response = await talentRepository.findAll({
      ...filters,
      pageSize: 1000, // Get max results for export
    });
    
    // Convert to CSV format
    const csv = convertToCSV(response.data);
    
    return {
      success: true,
      data: csv,
      filename: `talents-export-${new Date().toISOString().split('T')[0]}.csv`,
    };
  } catch (error) {
    console.error("Error exporting talents:", error);
    return {
      success: false,
      error: "Failed to export talents. Please try again.",
    };
  }
}

/**
 * Server action to bulk update talent status
 */
export async function bulkUpdateStatusAction(
  talentIds: string[],
  status: number
) {
  try {
    const results = await Promise.allSettled(
      talentIds.map(id => talentRepository.update(id, { status }))
    );
    
    const successful = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;
    
    // Revalidate the talent list page
    revalidatePath("/talent");
    
    return {
      success: true,
      message: `Updated ${successful} talent(s) successfully${
        failed > 0 ? `, ${failed} failed` : ""
      }`,
      successful,
      failed,
    };
  } catch (error) {
    console.error("Error bulk updating talents:", error);
    return {
      success: false,
      error: "Failed to update talents. Please try again.",
    };
  }
}

/**
 * Server action to add talent to shortlist
 */
export async function addToShortlistAction(talentId: string, projectId?: string) {
  try {
    // This would typically add to a shortlist/favorites table
    // For now, we'll just update a field or add a tag
    const talent = await talentRepository.findById(talentId);
    
    if (!talent) {
      return {
        success: false,
        error: "Talent not found",
      };
    }
    
    // Add to shortlist (mock implementation)
    const updated = await talentRepository.update(talentId, {
      tags: [...(talent.tags || []), "shortlisted"],
    });
    
    // Revalidate
    revalidatePath("/talent");
    revalidatePath(`/talent/${talentId}`);
    
    return {
      success: true,
      data: updated,
      message: "Added to shortlist successfully",
    };
  } catch (error) {
    console.error("Error adding to shortlist:", error);
    return {
      success: false,
      error: "Failed to add to shortlist. Please try again.",
    };
  }
}

/**
 * Server action to send message to talent
 */
export async function sendMessageToTalentAction(
  talentId: string,
  message: {
    subject: string;
    body: string;
    senderEmail: string;
    senderName: string;
  }
) {
  try {
    const talent = await talentRepository.findById(talentId);
    
    if (!talent) {
      return {
        success: false,
        error: "Talent not found",
      };
    }
    
    // Here you would integrate with an email service
    // For now, we'll just log it
    console.log("Sending message to talent:", {
      to: talent.email,
      ...message,
    });
    
    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: "Failed to send message. Please try again.",
    };
  }
}

/**
 * Helper function to convert talents to CSV
 */
function convertToCSV(talents: any[]): string {
  if (talents.length === 0) return "";
  
  // Define CSV headers
  const headers = [
    "ID",
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Title",
    "Location",
    "Years of Experience",
    "Status",
    "Score",
    "Skills",
    "Languages",
    "Created At",
  ];
  
  // Create CSV rows
  const rows = talents.map(talent => [
    talent.id,
    talent.firstName,
    talent.lastName,
    talent.email,
    talent.phone || "",
    talent.title,
    talent.location || "",
    talent.yearsOfExperience || "",
    getStatusLabel(talent.status),
    talent.score || "",
    talent.skills?.map((s: any) => s.name).join("; ") || "",
    talent.languages?.map((l: any) => `${l.name} (${l.level})`).join("; ") || "",
    talent.createdAt,
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(escapeCSV).join(","))
  ].join("\n");
  
  return csvContent;
}

/**
 * Helper to escape CSV values
 */
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Helper to get status label
 */
function getStatusLabel(status: number): string {
  const labels: Record<number, string> = {
    1: "Available",
    2: "In Process",
    3: "Hired",
    4: "Not Available",
    5: "Rejected",
  };
  return labels[status] || "Unknown";
}