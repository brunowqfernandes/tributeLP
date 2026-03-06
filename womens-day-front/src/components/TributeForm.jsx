import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { createTribute } from "../services/api";

export default function TributeForm({ onCreated }) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    subtitle: "",
    message: "",
    signature: ""
  });

  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.name) {
      setError("Preencha pelo menos email e nome.");
      return;
    }

    if (photos.length < 1) {
      setError("Envie pelo menos 1 foto.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        photos
      };

      const result = await createTribute(payload);
      onCreated(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="tribute-form" onSubmit={handleSubmit}>
      <h2>Criar homenagem</h2>

      <div className="form-group">
        <label htmlFor="email">Seu email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="voce@email.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Nome da homenageada</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Maria"
        />
      </div>

      <div className="form-group">
        <label htmlFor="subtitle">Subtítulo</label>
        <input
          id="subtitle"
          name="subtitle"
          type="text"
          value={formData.subtitle}
          onChange={handleChange}
          placeholder="Uma mulher incrível que merece ser celebrada todos os dias."
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Mensagem</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          placeholder="Escreva sua homenagem..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="signature">Assinatura</label>
        <input
          id="signature"
          name="signature"
          type="text"
          value={formData.signature}
          onChange={handleChange}
          placeholder="Com carinho, Bruno"
        />
      </div>

      <ImageUploader photos={photos} setPhotos={setPhotos} />

      {error && <p className="error-message">{error}</p>}

      <button type="submit" disabled={submitting} className="primary-button">
        {submitting ? "Gerando preview..." : "Gerar preview"}
      </button>
    </form>
  );
}