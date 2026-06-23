"use server";

import {
  getCustomSectionItems as getCustomSectionItemsService,
  getCustomSectionItem as getCustomSectionItemService,
  createCustomSectionItem as createCustomSectionItemService,
  updateCustomSectionItem as updateCustomSectionItemService,
  deleteCustomSectionItem as deleteCustomSectionItemService,
} from "@/services/custom-section-item";

// Error
function handleCustomSectionItemServerError(error: any, fallbackMessage: string) {
  console.error("Custom Section Item Service Server Action Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (
    errorMessage.includes("Prisma") ||
    errorMessage.includes("database") ||
    errorMessage.includes("Mongo")
  ) {
    return {
      success: false,
      error:
        "The custom item storage engine is temporarily performing maintenance. Please try again.",
    };
  }
  if (errorMessage.includes("customSectionId") || errorMessage.includes("parent")) {
    return {
      success: false,
      error: "Target layout container mapping is missing. Unable to position custom data item.",
    };
  }

  return { success: false, error: fallbackMessage };
}

export async function getCustomSectionItems(customSectionId: string) {
  try {
    if (!customSectionId) {
      return {
        success: false,
        error: "Custom section group scope reference is required to retrieve list elements.",
        data: [],
      };
    }

    const data = await getCustomSectionItemsService(customSectionId);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to compile custom elements data feed registry:", error);
    return {
      success: false,
      error: "Failed to assemble the requested custom portfolio content list.",
      data: [],
    };
  }
}

export async function getCustomSectionItemById(id: string) {
  try {
    if (!id) return { success: true, data: null };

    const data = await getCustomSectionItemService(id);
    return { success: true, data };
  } catch (error) {
    return handleCustomSectionItemServerError(
      error,
      "Failed to cross-reference structural tracking metrics for this custom block."
    );
  }
}

export async function createCustomSectionItem(
  customSectionId: string,
  data: {
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    iconUrl?: string;
    attachmentUrl?: string;
    externalUrl?: string;
  }
) {
  try {
    if (!customSectionId) {
      return { success: false, error: "Custom category parent reference token is required." };
    }

    if (!data.title) {
      return {
        success: false,
        error: "Item title or label naming parameter cannot be left blank.",
      };
    }

    const result = await createCustomSectionItemService(customSectionId, data);
    return { success: true, data: result };
  } catch (error) {
    return handleCustomSectionItemServerError(
      error,
      "Failed to instantiate new custom content entity block."
    );
  }
}

export async function updateCustomSectionItem(
  id: string,
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    iconUrl?: string;
    attachmentUrl?: string;
    externalUrl?: string;
  }
) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Missing distinct track parameters identification index key context.",
      };
    }

    const result = await updateCustomSectionItemService(id, data);
    return { success: true, data: result };
  } catch (error) {
    return handleCustomSectionItemServerError(
      error,
      "Failed to commit updated properties onto custom layout fields."
    );
  }
}

export async function deleteCustomSectionItem(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Identification key reference missing. Deletion sequence aborted.",
      };
    }

    const result = await deleteCustomSectionItemService(id);
    return { success: true, data: result };
  } catch (error) {
    return handleCustomSectionItemServerError(
      error,
      "The specified custom section content grid row could not be successfully cleared."
    );
  }
}
