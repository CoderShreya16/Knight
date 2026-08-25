import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Filter,
  Tag,
  MessageCircle,
  Zap,
  Pencil,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  function handleScrollToHowItWorks(e) {
    e.preventDefault();
    const target = document.getElementById('how-it-works');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const features = [
    {
      icon: <Mic className="feature-icon" />,
      title: "Speak, get structured notes",
      desc: "Talk naturally, get organized study or meeting notes with headers, lists, and bold terms instantly."
    },
    {
      icon: <Filter className="feature-icon" />,
      title: "Lecture Mode",
      desc: "Automatically filters out small talk, administration chat, and tangents, capturing only what is academic or substantive."
    },
    {
      icon: <Tag className="feature-icon" />,
      title: "Auto-tagged & searchable",
      desc: "Your speech is analyzed and tagged by subject and chapter automatically, ready to search on the dashboard."
    },
    {
      icon: <MessageCircle className="feature-icon" />,
      title: "Ask Knight anything",
      desc: "Get explanations and answers grounded entirely inside your own recorded notes, behaving like a personal study companion."
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Live notes while you listen",
      desc: "Supports long sessions up to an hour or more by streaming chunks in real time so nothing gets lost."
    },
    {
      icon: <Pencil className="feature-icon" />,
      title: "Edit anything",
      desc: "Full manual control to update content, subjects, and chapter tags directly from note cards or fullscreen overlays."
    }
  ];

  return (
    <div className="landing-container">
      {/* Top Navbar */}
      <header className="landing-header">
        <div className="landing-brand">
          <span className="brand-logo"></span>
          <h1>Knight</h1>
        </div>
        <button className="btn-workspace-nav" onClick={() => navigate('/workspace')}>
          Go to Workspace <ArrowRight className="inline-arrow" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <span className="hero-eyebrow">Voice-first AI notes</span>
        <h2 className="hero-title">
          Knight
        </h2>
        <h3 className="hero-tagline">
          We don't just listen — we understand you.
        </h3>
        <p className="hero-description">
          Speak naturally and let AI transcribe, clean, structure, and tag your thoughts. Focus entirely on the lecture or meeting, and let Knight do the organization.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('/workspace')}>
            Go to Workspace
          </button>
          <a href="#how-it-works" className="btn-secondary" onClick={handleScrollToHowItWorks}>
            See how it works
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing-features">
        <h3 className="section-title">Designed for premium note-taking</h3>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon-wrapper">
                {f.icon}
              </div>
              <h4 className="feature-card-title">{f.title}</h4>
              <p className="feature-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="landing-how" id="how-it-works">
        <h3 className="section-title">How it works</h3>
        <div className="steps-row">
          <div className="step-item">
            <div className="step-circle">1</div>
            <h4 className="step-title">Speak</h4>
            <p className="step-desc">Record or explain concepts aloud naturally.</p>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-circle">2</div>
            <h4 className="step-title">Transcribe</h4>
            <p className="step-desc">Whisper processes your audio stream in chunks.</p>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-circle">3</div>
            <h4 className="step-title">Filter & Struct</h4>
            <p className="step-desc">AI strips tangents and creates markdown notes.</p>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-circle">4</div>
            <h4 className="step-title">Save & Tag</h4>
            <p className="step-desc">Notes are stored in Supabase with subject tags.</p>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-circle">5</div>
            <h4 className="step-title">Ask / Combine</h4>
            <p className="step-desc">Query notes or synthesize summaries instantly.</p>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="landing-cta">
        <h3>Ready to take better notes?</h3>
        <p>Start organizing your knowledge base with the voice-first AI assistant today.</p>
        <button className="btn-primary" onClick={() => navigate('/workspace')}>
          Go to Workspace
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <h4 className="footer-logo">Knight</h4>
        <p className="footer-tagline">We don't just listen — we understand you.</p>
      </footer>
    </div>
  );
}
