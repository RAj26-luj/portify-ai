"use server";

import {
  createProjectMetric as createProjectMetricService,
  getProjectMetrics as getProjectMetricsService,
  getProjectMetric as getProjectMetricService,
  updateProjectMetric as updateProjectMetricService,
  deleteProjectMetric as deleteProjectMetricService,
  reorderProjectMetrics as reorderProjectMetricsService,
} from "@/services/project-metric";

import { getPortfolioId } from "@/lib/get-portfolio-id";

// Error
function handleMetricServerError(error: any, fallbackMessage: string) {
  console.error("Project Metric Core Service Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error:
        "The metrics storage engine is temporarily performing analytical syncs. Please try again shortly.",
    };
  }
  if (errorMessage.includes("projectId") || errorMessage.includes("parent")) {
    return {
      success: false,
      error: "Target project layout context mapping is missing. Unable to assign metric values.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function createProjectMetric(
  projectId: string,
  data: {
    label: string;
    value: string;
    description?: string;
    displayOrder?: number;
  }
) {
  try {
    if (!projectId) {
      return {
        success: false,
        error: "Parent project unique identifier context is required to attach key metrics.",
      };
    }

    if (!data.label) {
      return {
        success: false,
        error: "Metric label is required (e.g., 'Performance Boost', 'Active Users').",
      };
    }

    if (!data.value) {
      return {
        success: false,
        error: "Metric numerical or textual value is required (e.g., '99.9%', '40ms').",
      };
    }

    const result = await createProjectMetricService(projectId, data);
    return { success: true, data: result };
  } catch (error) {
    return handleMetricServerError(
      error,
      "Failed to instantiate new quantitative project highlight metric details."
    );
  }
}

export async function getProjectMetrics(projectId: string) {
  try {
    if (!projectId) {
      return {
        success: false,
        error: "Project specification criteria is missing from request arguments.",
        data: [],
      };
    }

    const data = await getProjectMetricsService(projectId);
    return { success: true, data };
  } catch (error) {
    console.error(
      "Failed to compile statistical analytical index listings for this project case study:",
      error
    );
    return {
      success: false,
      error: "Failed to assemble individual project statistical performance dashboards.",
      data: [],
    };
  }
}

export async function getProjectMetricById(metricId: string) {
  try {
    if (!metricId) return { success: true, data: null };

    const data = await getProjectMetricService(metricId);
    return { success: true, data };
  } catch (error) {
    return handleMetricServerError(
      error,
      "Failed to cross-reference system parameter attributes for this metric block."
    );
  }
}

export async function updateProjectMetric(
  metricId: string,
  data: {
    label?: string;
    value?: string;
    description?: string;
    displayOrder?: number;
  }
) {
  try {
    if (!metricId) {
      return {
        success: false,
        error: "Missing quantitative project tracking unique row identity marker string key.",
      };
    }

    const result = await updateProjectMetricService(metricId, data);
    return { success: true, data: result };
  } catch (error) {
    return handleMetricServerError(
      error,
      "Failed to commit updated quantitative parameter parameters onto analytics record."
    );
  }
}

export async function deleteProjectMetric(metricId: string) {
  try {
    if (!metricId) {
      return {
        success: false,
        error: "Identification key trace signature missing. Deletion sequence aborted.",
      };
    }

    const result = await deleteProjectMetricService(metricId);
    return { success: true, data: result };
  } catch (error) {
    return handleMetricServerError(
      error,
      "The specified performance milestone index row could not be successfully cleared."
    );
  }
}

export async function reorderProjectMetrics(projectId: string, metricIds: string[]) {
  try {
    if (!projectId) {
      return {
        success: false,
        error: "Target parent framework specification ID map is missing or expired.",
      };
    }

    if (!metricIds || metricIds.length === 0) {
      return {
        success: true,
        message: "Empty metric timeline sequence list stack provided. Grid layout unchanged.",
      };
    }

    const result = await reorderProjectMetricsService(projectId, metricIds);
    return { success: true, data: result };
  } catch (error) {
    return handleMetricServerError(
      error,
      "Failed to save customized layout horizontal alignment layout rules logic."
    );
  }
}
