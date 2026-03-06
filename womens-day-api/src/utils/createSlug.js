export function createSlug(name = "") {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const random = Math.random().toString(36).slice(2, 8);

  return `${base || "homenagem"}-${random}`;
}