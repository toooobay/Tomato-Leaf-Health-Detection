import { ArrowRight, Clock3, FileImage, Layers3, Sparkles } from 'lucide-react';
import leafPreview from '../assets/good-photo.jpg';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { DiseaseSection } from '../components/DiseaseSection';
import type { Page, PredictionResult } from '../types/app';
import './LandingPage.css';

const diseaseImageModules = import.meta.glob('../assets/tomato_*/*.{jpg,JPG,jpeg,JPEG,png,PNG}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const getDiseaseImages = (folder: string) =>
  Object.entries(diseaseImageModules)
    .filter(([path]) => path.includes(`/assets/${folder}/`))
    .map(([, src]) => src);

const diseaseSections = [
  {
    name: 'Bacterial Spot (Bercak Bakteri)',
    folder: 'tomato_bacterial',
    cause: 'Bakteri Xanthomonas spp.',
    description: 'Penyakit bakteri yang menyerang daun, batang, dan buah tomat. Penyebarannya lebih mudah terjadi pada lingkungan hangat dan basah.',
    symptoms: [
      'Bercak kecil gelap berwarna cokelat hingga hitam dan tampak basah pada daun.',
      'Bercak dapat dikelilingi lingkaran kuning.',
      'Bagian tengah bercak lama-kelamaan mengering dan dapat berlubang.',
    ],
    prevention: [
      'Gunakan benih atau bibit bersertifikat bebas penyakit.',
      'Hindari penyiraman dari atas yang membasahi daun.',
      'Lakukan rotasi tanaman dan jaga sanitasi lahan.',
    ],
  },
  {
    name: 'Early Blight (Busuk Dini)',
    folder: 'tomato_early',
    cause: 'Jamur Alternaria solani.',
    description: 'Penyakit jamur umum pada tomat yang biasanya menyerang daun tua di bagian bawah terlebih dahulu.',
    symptoms: [
      'Bercak cokelat atau hitam berbentuk bulat pada daun tua.',
      'Bercak memiliki pola lingkaran sepusat seperti papan target.',
      'Jaringan sekitar bercak menguning dan daun dapat rontok.',
    ],
    prevention: [
      'Pangkas daun bagian bawah untuk memperbaiki sirkulasi udara.',
      'Gunakan mulsa untuk mengurangi percikan spora dari tanah.',
      'Rotasi tanaman minimal 2-3 tahun.',
    ],
  },
  {
    name: 'Late Blight (Busuk Batang/Daun)',
    folder: 'tomato_late',
    cause: 'Oomycete Phytophthora infestans.',
    description: 'Penyakit destruktif yang dapat berkembang cepat pada kondisi dingin dan sangat basah.',
    symptoms: [
      'Bercak besar hijau pucat hingga abu-abu gelap dan tampak basah.',
      'Pada kondisi lembap dapat muncul lapisan putih tipis di sisi bawah daun.',
      'Bercak dapat menyebar cepat ke tangkai dan buah.',
    ],
    prevention: [
      'Gunakan varietas yang memiliki ketahanan terhadap Late Blight.',
      'Atur jarak tanam agar daun cepat kering setelah terkena air.',
      'Cabut dan musnahkan tanaman yang terinfeksi berat.',
    ],
  },
  {
    name: 'Leaf Mold (Kapang Daun)',
    folder: 'tomato_leaf_mold',
    cause: 'Jamur Passalora fulva.',
    description: 'Sering muncul pada lingkungan sangat lembap dengan sirkulasi udara buruk, terutama greenhouse.',
    symptoms: [
      'Sisi atas daun menunjukkan bercak kuning pucat dengan batas tidak tegas.',
      'Sisi bawah daun tertutup lapisan spora hijau zaitun hingga cokelat keabu-abuan.',
      'Permukaan bawah daun dapat terlihat seperti beludru.',
    ],
    prevention: [
      'Tingkatkan ventilasi dan sirkulasi udara.',
      'Jaga kelembapan udara agar tidak terlalu tinggi.',
      'Gunakan varietas yang resisten jika tersedia.',
    ],
  },
  {
    name: 'Septoria Leaf Spot (Bercak Daun Septoria)',
    folder: 'tomato_septoria_leaf_spot',
    cause: 'Jamur Septoria lycopersici.',
    description: 'Penyakit jamur yang umumnya menyerang daun bagian bawah dan dapat menyebabkan kerontokan daun.',
    symptoms: [
      'Bercak sirkular kecil dalam jumlah banyak.',
      'Pusat bercak abu-abu keputihan dengan tepian cokelat tua.',
      'Terdapat titik hitam kecil di tengah bercak pada pengamatan dekat.',
    ],
    prevention: [
      'Bersihkan sisa tanaman setelah panen.',
      'Gunakan mulsa dan hindari menyiram daun secara langsung.',
      'Kendalikan gulma di sekitar pertanaman.',
    ],
  },
  {
    name: 'Spider Mites / Two-Spotted Spider Mite',
    folder: 'tomato_spider_mites',
    cause: 'Hama Tetranychus urticae.',
    description: 'Hama kecil yang mengisap cairan sel daun dan berkembang cepat pada kondisi panas serta kering.',
    symptoms: [
      'Bintik putih atau kuning halus pada permukaan daun.',
      'Daun tampak kusam, menguning, atau seperti perunggu.',
      'Serangan parah dapat disertai jaring halus di sela daun dan batang.',
    ],
    prevention: [
      'Jaga kelembapan tanaman dan media tanam.',
      'Semprot daun dengan aliran air untuk merontokkan hama secara fisik.',
      'Gunakan predator alami atau pengendalian hama yang sesuai jika populasi meningkat.',
    ],
  },
  {
    name: 'Target Spot',
    folder: 'tomato_target_spot',
    cause: 'Jamur Corynespora cassiicola.',
    description: 'Penyakit jamur yang menyukai cuaca hangat dan kelembapan tinggi, dengan gejala yang dapat mirip Early Blight.',
    symptoms: [
      'Bercak sirkular cokelat muda hingga cokelat tua pada daun.',
      'Bercak memiliki lingkaran sepusat yang jelas.',
      'Bercak cenderung lebih kecil, banyak, dan tersebar merata.',
    ],
    prevention: [
      'Jaga sanitasi lahan dan lakukan rotasi tanaman.',
      'Atur jarak tanam agar tajuk tidak terlalu rapat.',
      'Gunakan perlindungan tanaman yang sesuai bila area memiliki riwayat tinggi.',
    ],
  },
  {
    name: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    folder: 'tomato_yellow_leaf',
    cause: 'Begomovirus yang ditularkan kutu kebul.',
    description: 'Penyakit virus serius yang dapat menghambat pertumbuhan tanaman, terutama jika infeksi terjadi saat tanaman muda.',
    symptoms: [
      'Daun muda mengecil, menguning di tepi, dan melengkung ke atas.',
      'Pertumbuhan tanaman dapat menjadi kerdil.',
      'Bunga mudah rontok sebelum menjadi buah.',
    ],
    prevention: [
      'Kendalikan kutu kebul dengan monitoring dan perangkap kuning.',
      'Gunakan insect net pada greenhouse bila memungkinkan.',
      'Cabut tanaman bergejala agar tidak menjadi sumber penularan.',
    ],
  },
  {
    name: 'Tomato Mosaic Virus (ToMV)',
    folder: 'tomato_mosaic',
    cause: 'Tobamovirus.',
    description: 'Virus stabil yang dapat menular secara mekanis melalui benih, sisa tanaman, alat, atau kontak yang terkontaminasi.',
    symptoms: [
      'Daun menunjukkan pola mosaik hijau tua dan hijau muda atau kuning.',
      'Daun dapat menyempit, berubah bentuk, atau tampak melepuh.',
      'Tanaman dapat tampak kerdil dan kualitas buah menurun.',
    ],
    prevention: [
      'Gunakan benih bersertifikat bebas virus.',
      'Sanitasi tangan dan alat kerja sebelum berpindah antar tanaman.',
      'Gunakan varietas dengan ketahanan terhadap ToMV bila tersedia.',
    ],
  },
];

interface LandingPageProps {
  navigate: (page: Page) => void;
  result: PredictionResult | null;
  preview: string | null;
}

export function LandingPage({ navigate, result, preview }: LandingPageProps) {
  return (
    <div className="page-stack">
      <section className="hero-grid">
        <div className="hero-copy">
          <Badge tone="info"><Sparkles size={14} /> Computer vision inspection</Badge>
          <h1>Tomato Leaf Health Detection</h1>
          <p>
            An AI-assisted binary leaf health checker for university-level computer vision work. Upload a tomato leaf image and review a simple Healthy or Unhealthy prediction.
          </p>
          <div className="button-row">
            <Button onClick={() => navigate('scan')}>
              Start Scan <ArrowRight size={17} />
            </Button>
            <Button variant="secondary" onClick={() => navigate('model')}>
              View Model Info
            </Button>
          </div>
        </div>
        <Card className="inspection-panel">
          <div className="panel-topline">
            <span>Inspection preview</span>
            <Badge tone={result?.prediction === 'Unhealthy' ? 'unhealthy' : 'healthy'}>
              {result?.prediction || 'Healthy'}
            </Badge>
          </div>
          <div className="leaf-preview-frame">
            {preview ? (
              <img src={preview} alt="Last uploaded tomato leaf" />
            ) : (
              <img src={leafPreview} alt="Sample tomato leaf" className="leaf-sample" />
            )}
          </div>
          <ConfidenceBar label="Confidence" value={result?.confidence_percentage || 91.4} tone={result?.prediction === 'Unhealthy' ? 'unhealthy' : 'healthy'} />
          <div className="mini-metadata">
            <span>Input</span><strong>JPG / PNG</strong>
            <span>Classes</span><strong>2</strong>
            <span>Explainability</span><strong>Coming soon</strong>
          </div>
        </Card>
      </section>

      <section className="feature-grid">
        <Card>
          <FileImage className="feature-icon" />
          <h3>Fast image-based prediction</h3>
          <p>Upload a clear tomato leaf photo and send it to the deployed prediction API.</p>
        </Card>
        <Card>
          <Layers3 className="feature-icon" />
          <h3>Binary classification</h3>
          <p>The interface stays aligned with the model: Healthy or Unhealthy only.</p>
        </Card>
        <Card>
          <Clock3 className="feature-icon" />
          <h3>Scan history tracking</h3>
          <p>Recent scans are kept in the session for comparison and quick review.</p>
        </Card>
      </section>

      <section className="disease-education">
        <div className="section-heading">
          <h2>Referensi visual daun tomat</h2>
          <p>
            Berikut adalah penjelasan, ciri-ciri, dan cara mencegah 9 penyakit serta hama pada daun tomat tersebut:
          </p>
        </div>
        <div className="disease-list">
          {diseaseSections.map((disease) => (
            <DiseaseSection
              key={disease.folder}
              name={disease.name}
              images={getDiseaseImages(disease.folder)}
              cause={disease.cause}
              description={disease.description}
              symptoms={disease.symptoms}
              prevention={disease.prevention}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
