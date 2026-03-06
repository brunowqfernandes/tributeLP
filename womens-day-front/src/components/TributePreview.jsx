export default function TributePreview({ data }) {
  if (!data) return null;

  return (
    <section className="tribute-preview">
      <div className="preview-hero">
        <p className="preview-kicker">Feliz Dia das Mulheres</p>
        <h1>{data.name}</h1>
        {data.subtitle && <p className="preview-subtitle">{data.subtitle}</p>}
      </div>

      {data.message && (
        <div className="preview-message">
          <p>{data.message}</p>
        </div>
      )}

      {!!data.photos?.length && (
        <div className="preview-gallery">
          {data.photos.map((photo, index) => (
            <img key={photo} src={photo} alt={`${data.name} ${index + 1}`} />
          ))}
        </div>
      )}

      {data.signature && (
        <p className="preview-signature">{data.signature}</p>
      )}
    </section>
  );
}