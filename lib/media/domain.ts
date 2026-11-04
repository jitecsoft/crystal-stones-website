export const MAX_MEDIA_BYTES = 15 * 1024 * 1024;
export const ALLOWED_MEDIA_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export function validateMediaUpload(file: { type: string; size: number }) {
  if (!ALLOWED_MEDIA_TYPES.has(file.type)) return "Choose a JPEG, PNG, WebP or AVIF image.";
  if (file.size <= 0) return "The selected file is empty.";
  if (file.size > MAX_MEDIA_BYTES) return "Each image must be 15 MB or smaller.";
  return null;
}

export const mediaRoles = ["uploader", "content_editor", "administrator"] as const;
export type MediaRole = (typeof mediaRoles)[number];

export function canReviewMedia(role: string) {
  return role === "content_editor" || role === "administrator";
}

export function canManageOwnMedia(role: string, userId: string, asset: { created_by: string; assigned_to: string | null }) {
  return canReviewMedia(role) || (role === "uploader" && (asset.created_by === userId || asset.assigned_to === userId));
}
