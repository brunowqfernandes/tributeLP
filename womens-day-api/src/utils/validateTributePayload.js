export function validateTributePayload(data = {}) {
  const errors = [];

  if (!data.email || typeof data.email !== "string") {
    errors.push("email é obrigatório");
  }

  if (!data.name || typeof data.name !== "string") {
    errors.push("name é obrigatório");
  }

  if (data.subtitle && typeof data.subtitle !== "string") {
    errors.push("subtitle deve ser string");
  }

  if (data.message && typeof data.message !== "string") {
    errors.push("message deve ser string");
  }

  if (data.signature && typeof data.signature !== "string") {
    errors.push("signature deve ser string");
  }

  if (data.photos && !Array.isArray(data.photos)) {
    errors.push("photos deve ser um array");
  }

  if (Array.isArray(data.photos) && data.photos.length > 8) {
    errors.push("photos pode ter no máximo 8 imagens");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}