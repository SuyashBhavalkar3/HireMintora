/**
 * @file drives.ts
 * @description Client-side localStorage cache for Hiring Drive metadata.
 * The dashboard reads from this cache for instant rendering, avoiding an API
 * round-trip on every visit. The cache is updated when a drive is created.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoredDrive {
  id: string;
  role: string;
  description?: string;
  createdAt: string;
  organisationId?: string;
}

// ─── Storage Key ──────────────────────────────────────────────────────────────

const KEY = "hm_drives";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns all current hiring drives from the localStorage cache. Returns [] during SSR or on parse error. */
export const getStoredDrives = (): StoredDrive[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

/**
 * Upserts a drive into the localStorage cache.
 * If the drive already exists (by id), it is updated in-place; otherwise prepended (newest first).
 */
export const storeDrive = (drive: StoredDrive): void => {
  const drives = getStoredDrives();
  const idx = drives.findIndex((d) => d.id === drive.id);
  if (idx >= 0) {
    drives[idx] = drive;
  } else {
    drives.unshift(drive); // newest first
  }
  localStorage.setItem(KEY, JSON.stringify(drives));
};

/** Removes a drive from the localStorage cache by id. */
export const removeDrive = (id: string): void => {
  const drives = getStoredDrives().filter((d) => d.id !== id);
  localStorage.setItem(KEY, JSON.stringify(drives));
};
