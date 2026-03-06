const API_BASE_URL = "http://localhost:3000/api";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao enviar imagem");
  }

  return response.json();
}

export async function createTribute(payload) {
  const response = await fetch(`${API_BASE_URL}/tributes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao criar homenagem");
  }

  return data;
}

export async function getTributeBySlug(slug) {
  const response = await fetch(`${API_BASE_URL}/tributes/${slug}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao buscar homenagem");
  }

  return data;
}