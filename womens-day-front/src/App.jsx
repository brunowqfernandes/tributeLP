import { useState } from "react";
import TributeForm from "./components/TributeForm";
import TributePreview from "./components/TributePreview";
import "./styles.css";

export default function App() {
  const [createdTribute, setCreatedTribute] = useState(null);

  return (
    <main className="app-container">
      <section className="form-column">
        <TributeForm onCreated={setCreatedTribute} />
      </section>

      <section className="preview-column">
        <h2>Preview</h2>
        {createdTribute ? (
          <TributePreview data={createdTribute.tribute} />
        ) : (
          <div className="empty-preview">
            <p>Preencha o formulário para visualizar a homenagem.</p>
          </div>
        )}
      </section>
    </main>
  );
}