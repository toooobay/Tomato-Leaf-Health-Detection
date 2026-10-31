import './DiseaseSection.css';

interface DiseaseSectionProps {
  name: string;
  images: string[];
  cause: string;
  description: string;
  symptoms: string[];
  prevention: string[];
}

export function DiseaseSection({ name, images, cause, description, symptoms, prevention }: DiseaseSectionProps) {
  return (
    <article className="disease-section">
      <h3>{name}</h3>
      <div className="photo-slider" aria-label={`${name} leaf image slider`}>
        {images.map((image, index) => (
          <figure key={image} className="slider-item">
            <img src={image} alt={`${name} tomato leaf sample ${index + 1}`} loading="lazy" />
          </figure>
        ))}
      </div>
      <div className="disease-copy">
        <p><strong>Penyebab:</strong> {cause}</p>
        <p>{description}</p>
        <div className="disease-detail-grid">
          <div>
            <h4>Ciri-ciri</h4>
            <ul>
              {symptoms.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4>Cara mencegah</h4>
            <ul>
              {prevention.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
