import { useState } from "react";
import { uploadImage } from "../services/api";

export default function ImageUploader({ photos, setPhotos }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    if (photos.length + files.length > 8) {
      setError("Você pode enviar no máximo 8 fotos.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const result = await uploadImage(file);
        uploadedUrls.push(result.url);
      }

      setPhotos([...photos, ...uploadedUrls]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removePhoto(indexToRemove) {
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div className="form-group">
      <label htmlFor="photos">Fotos</label>
      <input
        id="photos"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={handleFileChange}
      />

      {uploading && <p>Enviando fotos...</p>}
      {error && <p className="error-message">{error}</p>}

      {!!photos.length && (
        <div className="photo-preview-grid">
          {photos.map((photo, index) => (
            <div key={photo} className="photo-preview-item">
              <img src={photo} alt={`Foto ${index + 1}`} />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="remove-photo-button"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}