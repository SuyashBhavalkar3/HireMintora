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

export const getStoredDrives = (): StoredDrive[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

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

export const removeDrive = (id: string): void => {
  const drives = getStoredDrives().filter((d) => d.id !== id);
  localStorage.setItem(KEY, JSON.stringify(drives));
};
