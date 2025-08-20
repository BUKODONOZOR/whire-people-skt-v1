/**
 * Process Detail Page
 * Path: src/app/processes/[id]/page.tsx
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { authService } from "@/features/auth/services/auth.service";
import { httpClient } from "@/infrastructure/http/http-client";
import { 
  getProcessAction, 
  updateProcessAction, 
  deleteProcessAction,
  changeProcessStatusAction 
} from "@/features/processes/presentation/actions/process.actions";
import { ProcessStatus, ProcessStatusVO } from "@/features/processes/domain/value-objects/process-status.vo";
import { ProcessPriority, ProcessPriorityVO } from "@/features/processes/domain/value-objects/process-priority.vo";

export default function ProcessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const processId = params.id as string;
  
  const [process, setProcess] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Ensure token is set
    const token = authService.getToken();
    if (token) {
      httpClient.setAuthToken(token);
      if (processId) {
        loadProcess();
      }
    } else {
      window.location.href = "/token";
    }
  }, [processId]);

  const loadProcess = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getProcessAction(processId);
      if (result.success && result.data) {
        setProcess(result.data);
      } else {
        setError(result.error || "Failed to load process");
      }
    } catch (err) {
      console.error("Error loading process:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: ProcessStatus) => {
    try {
      const result = await changeProcessStatusAction(processId, newStatus);
      if (result.success) {
        setProcess(result.data);
      } else {
        alert(result.error || "Failed to change status");
      }
    } catch (err) {
      console.error("Error changing status:", err);
      alert("Failed to change process status");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this process? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteProcessAction(processId);
      if (result.success) {
        router.push("/processes");
      } else {
        alert(result.error || "Failed to delete process");
      }
    } catch (err) {
      console.error("Error deleting process:", err);
      alert("Failed to delete process");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !process) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Process not found"}</p>
          <button
            onClick={() => router.push("/processes")}
            className="text-[#0b5d5b] hover:underline"
          >
            Back to Processes
          </button>
        </div>
      </div>
    );
  }

  const statusVO = new ProcessStatusVO(process.status);
  const priorityVO = new ProcessPriorityVO(process.priority || ProcessPriority.MEDIUM);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafb" }}>
      {/* Header */}
      <div style={{ 
        background: "linear-gradient(135deg, rgba(11,93,91,0.03) 0%, rgba(11,93,91,0.07) 50%, rgba(252,126,0,0.03) 100%)",
        borderBottom: "1px solid #e5e7eb",
        padding: "2rem 0"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="flex justify-between items-start">
            <div>
              <button
                onClick={() => router.push("/processes")}
                className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
              >
                ← Back to Processes
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {process.name}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-3 py-1 rounded-full font-medium bg-${statusVO.color}-100 text-${statusVO.color}-800`}>
                  {statusVO.icon} {statusVO.label}
                </span>
                <span className="text-gray-600">
                  Priority: {priorityVO.icon} {priorityVO.label}
                </span>
                <span className="text-gray-600">
                  {process.vacancies} vacancies
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {process.description || "No description provided"}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3">Requirements</h2>
              
              {process.requiredSkills && process.requiredSkills.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {process.requiredSkills.map((skill: any, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#0b5d5b]/10 text-[#0b5d5b] rounded-full text-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {process.requiredLanguages && process.requiredLanguages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {process.requiredLanguages.map((lang: any, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {lang.name} ({lang.level})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(process.minExperience || process.maxExperience) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Experience</h3>
                  <p className="text-gray-600">
                    {process.minExperience && `Min: ${process.minExperience} years`}
                    {process.minExperience && process.maxExperience && " - "}
                    {process.maxExperience && `Max: ${process.maxExperience} years`}
                  </p>
                </div>
              )}
            </div>

            {/* Candidates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Candidates</h2>
                <button
                  onClick={() => alert("Candidates management coming soon!")}
                  className="px-4 py-2 bg-[#0b5d5b] text-white rounded-md hover:bg-[#094a48]"
                >
                  Manage Candidates
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {process.totalCandidates || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {process.activeCandidates || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {process.hiredCandidates || 0}
                  </div>
                  <div className="text-sm text-gray-600">Hired</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {process.rejectedCandidates || 0}
                  </div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Process Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Details</h2>
              
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="text-gray-900">
                    {process.companyName || "Wired People Inc."}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="text-gray-900">
                    {process.location || "Not specified"}
                    {process.remote && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Remote
                      </span>
                    )}
                  </dd>
                </div>

                {(process.salaryMin || process.salaryMax) && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Salary Range</dt>
                    <dd className="text-gray-900">
                      {process.currency} {process.salaryMin?.toLocaleString() || "0"} - {process.salaryMax?.toLocaleString() || "0"}
                    </dd>
                  </div>
                )}

                {process.deadline && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                    <dd className="text-gray-900">
                      {new Date(process.deadline).toLocaleDateString()}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-gray-900">
                    {new Date(process.createdAt).toLocaleDateString()}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-gray-900">
                    {new Date(process.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Status Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Status Management</h2>
              
              <div className="space-y-2">
                {ProcessStatusVO.all().map((status) => {
                  const vo = new ProcessStatusVO(status);
                  const isCurrent = status === process.status;
                  const canTransition = statusVO.canTransitionTo(status);
                  
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={isCurrent || !canTransition}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        isCurrent
                          ? "bg-gray-100 text-gray-900 font-medium cursor-default"
                          : canTransition
                          ? "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <span className="mr-2">{vo.icon}</span>
                      {vo.label}
                      {isCurrent && " (Current)"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            {process.tags && process.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {process.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}