import { useState, useEffect } from "react";

const DELHI_IMAGES = [
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Magnificent_Red_Fort.jpg/1280px-Magnificent_Red_Fort.jpg",
    name: "Red Fort",
    area: "Old Delhi"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/India_Gate_in_New_Delhi_03-2016.jpg/1280px-India_Gate_in_New_Delhi_03-2016.jpg",
    name: "India Gate",
    area: "Central Delhi"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Lotus_temple_in_India.jpg/1280px-Lotus_temple_in_India.jpg",
    name: "Lotus Temple",
    area: "South Delhi"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Qutb_Minar_2012.jpg/800px-Qutb_Minar_2012.jpg",
    name: "Qutb Minar",
    area: "South Delhi"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Humayun%27s_Tomb_-_Agha_Khan_Trust_for_Culture.jpg/1280px-Humayun%27s_Tomb_-_Agha_Khan_Trust_for_Culture.jpg",
    name: "Humayun's Tomb",
    area: "South Delhi"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Cannaught_place.jpg/1280px-Above_Cannaught_place.jpg",
    name: "Connaught Place",
    area: "Central Delhi"
  },
];

const PLACE_TYPES = [
  { id: "monuments", label: "Monuments", icon: "🏛" },
  { id: "museums", label: "Museums", icon: "🖼" },
  { id: "adventure", label: "Adventure", icon: "🎢" },
  { id: "temples", label: "Temples", icon: "🪔" },
  { id: "churches", label: "Churches", icon: "⛪" },
  { id: "mosques", label: "Mosques", icon: "🕌" },
  { id: "shopping", label: "Shopping", icon: "🛍" },
  { id: "food", label: "Food & Dining", icon: "🍜" },
  { id: "parks", label: "Parks", icon: "🌳" },
  { id: "nightlife", label: "Nightlife", icon: "🎭" },
];

const BUDGET_OPTIONS = [
  { id: "budget", label: "Budget", range: "₹500–1,500/day", color: "#22c55e" },
  { id: "moderate", label: "Moderate", range: "₹1,500–4,000/day", color: "#f59e0b" },
  { id: "premium", label: "Premium", range: "₹4,000–10,000/day", color: "#a78bfa" },
  { id: "luxury", label: "Luxury", range: "₹10,000+/day", color: "#fb7185" },
];

const DELHI_AREAS = [
  "Old Delhi / Chandni Chowk", "Connaught Place", "South Delhi", "Lajpat Nagar",
  "Karol Bagh", "Saket", "Dwarka", "Rohini", "Nehru Place", "Hauz Khas",
  "Vasant Kunj", "Noida", "Gurgaon",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080810; color: #fff; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.2); border-radius: 3px; }

  @keyframes fadeup { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes panelin { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }

  .fu1{animation:fadeup .6s .1s ease both}
  .fu2{animation:fadeup .6s .25s ease both}
  .fu3{animation:fadeup .6s .4s ease both}
  .fu4{animation:fadeup .6s .55s ease both}
  .panel{animation:panelin .3s ease}

  .searchbar {
    display:flex; align-items:center;
    background:rgba(255,255,255,.07);
    border:1.5px solid rgba(255,255,255,.15);
    border-radius:18px;
    transition:border-color .2s,box-shadow .2s;
  }
  .searchbar:focus-within {
    border-color:rgba(251,191,36,.65);
    box-shadow:0 0 0 4px rgba(251,191,36,.1);
  }
  .sinput {
    flex:1; background:transparent; border:none; outline:none;
    color:#fff; font-size:15px; font-family:'DM Sans',sans-serif;
    padding:15px 16px;
  }
  .sinput::placeholder { color:rgba(255,255,255,.38); }

  .pbtn {
    margin:6px; padding:10px 22px; border-radius:12px; border:none;
    background:linear-gradient(135deg,#f59e0b,#ef4444);
    color:#fff; font-size:14px; font-weight:600;
    font-family:'DM Sans',sans-serif; cursor:pointer;
    white-space:nowrap; transition:opacity .2s,transform .15s;
  }
  .pbtn:hover { opacity:.9; transform:translateY(-1px); }
  .pbtn:active { transform:scale(.97); }
  .pbtn:disabled { opacity:.35; cursor:not-allowed; transform:none; }

  .imgcard {
    position:relative; overflow:hidden; border-radius:14px; cursor:pointer;
    border:1px solid rgba(255,255,255,.07);
    transition:transform .3s cubic-bezier(.34,1.4,.64,1),box-shadow .3s;
  }
  .imgcard:hover { transform:translateY(-6px) scale(1.01); box-shadow:0 24px 48px rgba(0,0,0,.7); }
  .imgcard img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s; }
  .imgcard:hover img { transform:scale(1.07); }
  .imgoverlay {
    position:absolute; inset:0;
    background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.05) 55%,transparent 100%);
    display:flex; flex-direction:column; justify-content:flex-end; padding:14px;
  }

  .featcard {
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
    border-radius:16px; padding:24px 20px;
    transition:transform .2s,border-color .2s;
  }
  .featcard:hover { transform:translateY(-4px); border-color:rgba(251,191,36,.25); }

  .budgetopt {
    padding:16px; border-radius:13px; cursor:pointer; text-align:center;
    border:1.5px solid rgba(255,255,255,.1);
    background:rgba(255,255,255,.04); transition:all .2s;
  }
  .pill {
    display:inline-flex; align-items:center; gap:6px;
    padding:9px 14px; border-radius:28px; cursor:pointer;
    border:1.5px solid rgba(255,255,255,.1);
    background:rgba(255,255,255,.04); font-size:13px;
    transition:all .2s; user-select:none;
  }
  .pill:hover { background:rgba(255,255,255,.09); }
  .countbtn {
    width:40px; height:40px; border-radius:50%; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14);
    color:#fff; font-size:20px; transition:background .2s;
  }
  .countbtn:hover { background:rgba(255,255,255,.16); }
  .fsel {
    width:100%; padding:12px 14px;
    background:rgba(255,255,255,.06);
    border:1.5px solid rgba(255,255,255,.12);
    border-radius:12px; color:#fff; font-size:14px;
    font-family:'DM Sans',sans-serif; outline:none;
    transition:border-color .2s; appearance:none; cursor:pointer;
  }
  .fsel:focus { border-color:rgba(251,191,36,.55); }
  .fsel option { background:#14141e; }
  textarea.fsel { resize:vertical; min-height:80px; }
  .backbtn {
    padding:10px 20px; background:rgba(255,255,255,.07);
    border:1px solid rgba(255,255,255,.13); border-radius:11px;
    color:rgba(255,255,255,.7); cursor:pointer; font-size:13px;
    font-family:'DM Sans',sans-serif; transition:background .2s;
  }
  .backbtn:hover { background:rgba(255,255,255,.12); }
  .stopcard {
    border-radius:14px; padding:16px 18px; margin-bottom:10px;
    border:1px solid rgba(255,255,255,.07);
    background:rgba(255,255,255,.03);
    transition:transform .2s,border-color .2s;
  }
  .stopcard:hover { transform:translateX(4px); border-color:rgba(255,255,255,.13); }
  .daybtn {
    padding:8px 20px; border-radius:28px; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
    border:1.5px solid; transition:all .2s;
  }
`;

/* ══════════════════════════════
   MAIN APP
══════════════════════════════ */
export default function App() {
  const [view, setView] = useState("home");
  const [form, setForm] = useState({
    budget: "", days: 2, groupSize: 2,
    startLocation: "", endLocation: "",
    placeTypes: [], description: ""
  });
  const [planStep, setPlanStep] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleType = id => upd("placeTypes",
    form.placeTypes.includes(id)
      ? form.placeTypes.filter(x => x !== id)
      : [...form.placeTypes, id]
  );
  const startPlan = () => { setPlanStep(0); setView("planner"); };
  const submitPlan = async () => {
    setView("result"); setLoading(true); setResult(null);
    await generatePlan(form, setResult);
    setLoading(false);
  };
  const canNext = () => {
    if (planStep === 0) return !!form.budget;
    if (planStep === 2) return !!form.startLocation;
    if (planStep === 3) return form.placeTypes.length > 0;
    return true;
  };

  return (
    <>
      <style>{css}</style>
      {view === "home" && <HomeView onStart={startPlan} />}
      {view === "planner" && (
        <PlannerView
          form={form} upd={upd} toggleType={toggleType}
          step={planStep} setStep={setPlanStep}
          canNext={canNext} onBack={() => setView("home")}
          onSubmit={submitPlan}
        />
      )}
      {view === "result" && (
        <ResultView
          result={result} loading={loading}
          onReset={() => { setView("home"); setResult(null); }}
        />
      )}
    </>
  );
}

/* ══════════════════════════════
   HOME VIEW
══════════════════════════════ */
function HomeView({ onStart }) {
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % DELHI_IMAGES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#080810" }}>

      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>

        {/* Background Images */}
        {DELHI_IMAGES.map((img, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            opacity: i === heroIdx ? 1 : 0,
            transition: "opacity 1.4s ease", zIndex: 0
          }}>
            <img src={img.url} alt={img.name} style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              filter: "brightness(.38) saturate(1.2)"
            }} />
          </div>
        ))}

        {/* Dark overlays */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom,rgba(8,8,16,.5) 0%,rgba(8,8,16,.2) 30%,rgba(8,8,16,.6) 70%,#080810 100%)",
          zIndex: 1
        }} />

        {/* Navbar */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "22px 36px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <span style={{ fontSize: "24px" }}>🏯</span>
            <span style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "22px", fontWeight: 700,
              color: "#fbbf24", letterSpacing: "1px"
            }}>Delhi Trip Planner</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["Heritage", "Food", "Shopping", "Explore"].map(t => (
              <button key={t} onClick={onStart} style={{
                padding: "8px 16px",
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.15)",
                borderRadius: "20px", color: "rgba(255,255,255,.8)",
                cursor: "pointer", fontSize: "13px",
                fontFamily: "'DM Sans',sans-serif"
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* CENTER CONTENT */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          minHeight: "calc(100vh - 80px)",
          padding: "40px 24px"
        }}>

          {/* Badge */}
          <div className="fu1" style={{
            display: "inline-block",
            background: "rgba(251,191,36,.15)",
            border: "1px solid rgba(251,191,36,.4)",
            borderRadius: "20px", padding: "6px 18px",
            fontSize: "11px", color: "#fbbf24",
            letterSpacing: "2px", marginBottom: "20px", fontWeight: 600
          }}>
            ✦ AI-POWERED DELHI TRIP PLANNER
          </div>

          {/* Heading */}
          <h1 className="fu2" style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(42px,7vw,80px)",
            fontWeight: 700, lineHeight: 1.08,
            marginBottom: "20px", maxWidth: "800px"
          }}>
            Discover Delhi<br />
            <span style={{
              background: "linear-gradient(135deg,#fbbf24,#f43f5e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Like Never Before</span>
          </h1>

          {/* Subtitle */}
          <p className="fu3" style={{
            color: "rgba(255,255,255,.65)",
            fontSize: "17px", lineHeight: 1.75,
            marginBottom: "40px", maxWidth: "560px"
          }}>
            Tell our AI your budget, interests & travel style — get a personalized
            day-by-day roadmap through Delhi's iconic landmarks, hidden alleys,
            and culinary treasures.
          </p>

          {/* Search Bar — CENTERED & BIG */}
          <div className="fu4" style={{ width: "100%", maxWidth: "680px", marginBottom: "20px" }}>
            <div className="searchbar" style={{
              width: "100%",
              boxShadow: "0 8px 32px rgba(0,0,0,.4)"
            }}>
              <span style={{ padding: "0 8px 0 20px", fontSize: "22px" }}>🗺</span>
              <input
                className="sinput"
                style={{ fontSize: "16px", padding: "18px 16px" }}
                placeholder="What kind of Delhi adventure? e.g. 2-day food & heritage tour..."
                onKeyDown={e => e.key === "Enter" && onStart()}
              />
              <button className="pbtn"
                onClick={onStart}
                style={{ padding: "14px 28px", fontSize: "15px", margin: "8px" }}>
                Plan My Trip →
              </button>
            </div>
          </div>

          {/* Quick Tags */}
          <div className="fu4" style={{
            display: "flex", gap: "10px",
            flexWrap: "wrap", justifyContent: "center"
          }}>
            {["🏛 Heritage Walk", "🍜 Street Food Safari", "🛍 Shopping Spree", "🌿 Garden Tour", "🌙 Night Out"].map(t => (
              <span key={t} onClick={onStart} style={{
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.15)",
                borderRadius: "20px", padding: "8px 16px",
                fontSize: "13px", color: "rgba(255,255,255,.75)",
                cursor: "pointer", transition: "background .2s"
              }}>{t}</span>
            ))}
          </div>

          {/* Current Location Badge — bottom center */}
          <div style={{
            marginTop: "48px",
            background: "rgba(0,0,0,.5)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: "28px", padding: "8px 18px",
            display: "inline-flex", alignItems: "center", gap: "8px"
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
              animation: "blink 1.6s infinite"
            }} />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,.85)", fontWeight: 500 }}>
              {DELHI_IMAGES[heroIdx].name}
            </span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,.45)" }}>
              · {DELHI_IMAGES[heroIdx].area}
            </span>
          </div>

          {/* Slide dots */}
          <div style={{
            display: "flex", gap: "8px",
            marginTop: "24px"
          }}>
            {DELHI_IMAGES.map((_, i) => (
              <div key={i} onClick={() => setHeroIdx(i)} style={{
                width: i === heroIdx ? 24 : 6,
                height: 6, borderRadius: 3,
                background: i === heroIdx ? "#fbbf24" : "rgba(255,255,255,.3)",
                cursor: "pointer", transition: "all .4s"
              }} />
            ))}
          </div>

        </div>
      </div>

      {/* TICKER */}
      <div style={{
        overflow: "hidden", whiteSpace: "nowrap",
        padding: "13px 0",
        background: "rgba(255,255,255,.02)",
        borderTop: "1px solid rgba(255,255,255,.06)",
        borderBottom: "1px solid rgba(255,255,255,.06)"
      }}>
        <div style={{ display: "inline-block", animation: "ticker 28s linear infinite" }}>
          {[...Array(2)].flatMap((_, r) =>
            ["🏯 RED FORT", "🌸 LOTUS TEMPLE", "🕌 JAMA MASJID", "🛍 CHANDNI CHOWK",
              "🗼 INDIA GATE", "🎨 NATIONAL MUSEUM", "🌿 LODHI GARDEN",
              "🍜 PARANTHE WALI GALI", "🛕 AKSHARDHAM", "🎡 WORLDS OF WONDER",
              "🎭 KINGDOM OF DREAMS"].map((s, i) => (
              <span key={`${r}-${i}`} style={{
                marginRight: "52px",
                color: "rgba(255,255,255,.3)",
                fontSize: "12px", fontWeight: 500, letterSpacing: "1px"
              }}>{s}</span>
            ))
          )}
        </div>
      </div>

      {/* MOSAIC GRID */}
      <div style={{ padding: "70px 36px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: "40px",
          flexWrap: "wrap", gap: "16px"
        }}>
          <div>
            <p style={{
              color: "#fbbf24", fontSize: "11px",
              fontWeight: 600, letterSpacing: "2.5px", marginBottom: "8px"
            }}>ICONIC DESTINATIONS</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "clamp(26px,4vw,40px)",
              fontWeight: 700, lineHeight: 1.15
            }}>
              Delhi's Most Beloved<br />Landmarks
            </h2>
          </div>
          <button className="pbtn" onClick={onStart}
            style={{ padding: "13px 28px" }}>
            Plan a Visit →
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,1fr)",
          gridTemplateRows: "240px 200px",
          gap: "12px"
        }}>
          {[{ s: 3 }, { s: 2 }, { s: 1 }, { s: 2 }, { s: 2 }, { s: 2 }].map((g, i) => (
            <div key={i} className="imgcard"
              onClick={onStart}
              style={{ gridColumn: `span ${g.s}` }}>
              <img src={DELHI_IMAGES[i].url} alt={DELHI_IMAGES[i].name} loading="lazy" />
              <div className="imgoverlay">
                <span style={{
                  fontSize: "10px", color: "rgba(255,255,255,.6)",
                  fontWeight: 600, letterSpacing: "1.5px", marginBottom: "4px"
                }}>{DELHI_IMAGES[i].area.toUpperCase()}</span>
                <span style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "18px", fontWeight: 600
                }}>{DELHI_IMAGES[i].name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{
        background: "rgba(255,255,255,.02)",
        borderTop: "1px solid rgba(255,255,255,.05)",
        padding: "70px 36px"
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{
            color: "#fbbf24", fontSize: "11px", fontWeight: 600,
            letterSpacing: "2.5px", textAlign: "center", marginBottom: "10px"
          }}>WHY DELHI TRIP PLANNER</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(24px,4vw,38px)",
            textAlign: "center", fontWeight: 700, marginBottom: "48px"
          }}>Smart Travel, Simplified</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: "20px"
          }}>
            {[
              { icon: "🤖", title: "AI-Powered Itineraries", desc: "Personalized day-by-day plans tailored to your budget, interests & travel style." },
              { icon: "💰", title: "Budget-Smart Routes", desc: "Every suggestion fits your budget — from street food to luxury experiences." },
              { icon: "🗺", title: "Local Expertise", desc: "Insider tips, best visit times, hidden gems & transport advice baked in." },
              { icon: "⚡", title: "Instant Results", desc: "Your complete trip itinerary generated in seconds, not hours of research." },
            ].map(c => (
              <div key={c.title} className="featcard">
                <div style={{ fontSize: "30px", marginBottom: "14px" }}>{c.icon}</div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "19px", fontWeight: 600, marginBottom: "9px"
                }}>{c.title}</h3>
                <p style={{ color: "rgba(255,255,255,.5)", fontSize: "14px", lineHeight: 1.72 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "80px 28px" }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(26px,4vw,44px)",
          fontWeight: 700, marginBottom: "14px"
        }}>Ready to Explore Delhi?</h2>
        <p style={{ color: "rgba(255,255,255,.45)", fontSize: "15px", marginBottom: "30px" }}>
          Your perfect itinerary is just a few clicks away.
        </p>
        <button className="pbtn" onClick={onStart}
          style={{ padding: "17px 52px", fontSize: "17px", borderRadius: "14px" }}>
          🚀 Start Planning Now
        </button>
        <p style={{ color: "rgba(255,255,255,.22)", fontSize: "11px", marginTop: "12px" }}>
          Free · No sign-up needed · Powered by Groq AI
        </p>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,.06)",
        padding: "20px 36px",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: "8px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ fontSize: "16px" }}>🏯</span>
          <span style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "14px", color: "#fbbf24"
          }}>Delhi Trip Planner</span>
        </div>
        <span style={{ color: "rgba(255,255,255,.22)", fontSize: "11px" }}>
          Powered by Groq AI · Free to use
        </span>
      </div>
    </div>
  );
}
/* ══════════════════════════════
   PLANNER FORM
══════════════════════════════ */
function PlannerView({ form, upd, toggleType, step, setStep, canNext, onBack, onSubmit }) {
  const STEPS = ["Budget", "Duration & Group", "Route", "Interests", "Extra Details"];
  const next = () => step < STEPS.length - 1 ? setStep(s => s + 1) : onSubmit();

  return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 16px 52px" }}>
      <div style={{ width: "100%", maxWidth: 580, marginBottom: "24px" }}>
        <button className="backbtn" onClick={onBack} style={{ marginBottom: "18px" }}>← Back to Home</button>
        <div style={{ display: "flex", gap: "5px", marginBottom: "7px" }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? "#fbbf24" : "rgba(255,255,255,.1)", transition: "background .3s" }} />
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,.3)", fontSize: "11px", fontWeight: 500, letterSpacing: ".5px" }}>
          STEP {step + 1} OF {STEPS.length} — {STEPS[step].toUpperCase()}
        </p>
      </div>

      <div key={step} className="panel" style={{ width: "100%", maxWidth: 580, flex: 1 }}>

        {step === 0 && <>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", fontWeight: 700, marginBottom: "7px" }}>What's your travel budget?</h2>
          <p style={{ color: "rgba(255,255,255,.42)", marginBottom: "24px", fontSize: "14px" }}>Per person, per day in Delhi</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {BUDGET_OPTIONS.map(b => (
              <div key={b.id} className="budgetopt" onClick={() => upd("budget", b.id)}
                style={{ borderColor: form.budget === b.id ? b.color : "rgba(255,255,255,.1)", background: form.budget === b.id ? `${b.color}18` : "rgba(255,255,255,.04)" }}>
                <div style={{ fontSize: "16px", fontWeight: 700, color: b.color, marginBottom: "5px" }}>{b.label}</div>
                <div style={{ color: "rgba(255,255,255,.42)", fontSize: "12px" }}>{b.range}</div>
              </div>
            ))}
          </div>
        </>}

        {step === 1 && <>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", fontWeight: 700, marginBottom: "7px" }}>Duration & group size</h2>
          <p style={{ color: "rgba(255,255,255,.42)", marginBottom: "28px", fontSize: "14px" }}>How long & who's coming?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
            {[{ label: "Number of Days", key: "days", max: 30 }, { label: "Group Size", key: "groupSize", max: 20 }].map(({ label, key, max }) => (
              <div key={key}>
                <p style={{ color: "rgba(255,255,255,.5)", fontSize: "13px", marginBottom: "12px", fontWeight: 500 }}>{label}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <button className="countbtn" onClick={() => upd(key, Math.max(1, form[key] - 1))}>−</button>
                  <span style={{ fontSize: "34px", fontWeight: 700, minWidth: "44px", textAlign: "center", fontFamily: "'Cormorant Garamond',serif" }}>{form[key]}</span>
                  <button className="countbtn" onClick={() => upd(key, Math.min(max, form[key] + 1))}>+</button>
                  <span style={{ color: "rgba(255,255,255,.32)", fontSize: "13px" }}>
                    {key === "days" ? `day${form[key] > 1 ? "s" : ""}` : `person${form[key] > 1 ? "s" : ""}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>}

        {step === 2 && <>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", fontWeight: 700, marginBottom: "7px" }}>Plan your route</h2>
          <p style={{ color: "rgba(255,255,255,.42)", marginBottom: "24px", fontSize: "14px" }}>Where are you starting and ending?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,.45)", marginBottom: "8px", fontWeight: 600, letterSpacing: "1px" }}>🟢 STARTING LOCATION</label>
              <select className="fsel" value={form.startLocation} onChange={e => upd("startLocation", e.target.value)}>
                <option value="">Choose your starting area...</option>
                {DELHI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,.45)", marginBottom: "8px", fontWeight: 600, letterSpacing: "1px" }}>🔴 END DESTINATION <span style={{ color: "rgba(255,255,255,.28)", fontWeight: 400 }}>(optional)</span></label>
              <select className="fsel" value={form.endLocation} onChange={e => upd("endLocation", e.target.value)}>
                <option value="">Choose your ending area...</option>
                {DELHI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </>}

        {step === 3 && <>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", fontWeight: 700, marginBottom: "7px" }}>What do you want to explore?</h2>
          <p style={{ color: "rgba(255,255,255,.42)", marginBottom: "20px", fontSize: "14px" }}>Pick all the types of places that interest you</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "9px" }}>
            {PLACE_TYPES.map(t => (
              <div key={t.id} className="pill" onClick={() => toggleType(t.id)}
                style={{ borderColor: form.placeTypes.includes(t.id) ? "#fbbf24" : "rgba(255,255,255,.1)", background: form.placeTypes.includes(t.id) ? "rgba(251,191,36,.14)" : "rgba(255,255,255,.04)", color: form.placeTypes.includes(t.id) ? "#fbbf24" : "rgba(255,255,255,.7)" }}>
                <span style={{ fontSize: "15px" }}>{t.icon}</span>{t.label}
              </div>
            ))}
          </div>
        </>}

        {step === 4 && <>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", fontWeight: 700, marginBottom: "7px" }}>Any special requests?</h2>
          <p style={{ color: "rgba(255,255,255,.42)", marginBottom: "20px", fontSize: "14px" }}>Help us personalize your itinerary further</p>
          <textarea className="fsel"
            placeholder="e.g. Vegetarian only, elderly parents, prefer early mornings, avoid crowds..."
            value={form.description} onChange={e => upd("description", e.target.value)} />
          <div style={{ marginTop: "20px", background: "rgba(251,191,36,.05)", border: "1px solid rgba(251,191,36,.14)", borderRadius: "13px", padding: "18px 20px" }}>
            <p style={{ color: "#fbbf24", fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", marginBottom: "12px" }}>YOUR TRIP SUMMARY</p>
            {[
              ["Budget", BUDGET_OPTIONS.find(b => b.id === form.budget)?.label || "—"],
              ["Duration", `${form.days} day${form.days > 1 ? "s" : ""} · ${form.groupSize} person${form.groupSize > 1 ? "s" : ""}`],
              ["Route", `${form.startLocation || "—"} → ${form.endLocation || "Flexible"}`],
              ["Interests", form.placeTypes.length > 0 ? form.placeTypes.join(", ") : "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: "10px", fontSize: "13px", marginBottom: "7px" }}>
                <span style={{ color: "rgba(255,255,255,.38)", minWidth: "70px" }}>{k}</span>
                <span style={{ color: "rgba(255,255,255,.8)", textTransform: "capitalize" }}>{v}</span>
              </div>
            ))}
          </div>
        </>}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 580, marginTop: "28px" }}>
        {step > 0 ? <button className="backbtn" onClick={() => setStep(s => s - 1)}>← Back</button> : <div />}
        <button className="pbtn" onClick={next} disabled={!canNext()}>
          {step === STEPS.length - 1 ? "🚀 Generate My Itinerary" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   RESULT VIEW
══════════════════════════════ */
function ResultView({ result, loading, onReset }) {
  const [activeDay, setActiveDay] = useState(0);

  const typeColor = (type = "") => {
    const t = type.toLowerCase();
    if (t.includes("monument") || t.includes("fort") || t.includes("tomb") || t.includes("heritage")) return "#f59e0b";
    if (t.includes("museum")) return "#a78bfa";
    if (t.includes("food") || t.includes("restaurant") || t.includes("street") || t.includes("dining")) return "#ef4444";
    if (t.includes("shop") || t.includes("market") || t.includes("bazar")) return "#22c55e";
    if (t.includes("temple") || t.includes("church") || t.includes("mosque") || t.includes("religious")) return "#fb923c";
    if (t.includes("park") || t.includes("garden")) return "#16a34a";
    if (t.includes("adventure")) return "#e11d48";
    return "#64748b";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#fff" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,8,16,.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "13px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ fontSize: "18px" }}>🏯</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "17px", fontWeight: 700, color: "#fbbf24" }}>Delhi Trip Planner</span>
        </div>
        <button className="backbtn" onClick={onReset}>+ New Plan</button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", gap: "24px" }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <div style={{ position: "absolute", inset: 0, border: "3px solid rgba(251,191,36,.15)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", inset: 0, border: "3px solid transparent", borderTopColor: "#fbbf24", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ position: "absolute", inset: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>🗺</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", marginBottom: "8px" }}>Crafting your perfect Delhi itinerary...</p>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: "13px", animation: "blink 2s infinite" }}>Powered by Google Gemini AI</p>
          </div>
        </div>
      ) : result?.error ? (
        <div style={{ textAlign: "center", padding: "70px 24px" }}>
          <p style={{ fontSize: "44px", marginBottom: "14px" }}>😔</p>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>{result.message}</p>
          {result.detail && <p style={{ fontSize: "13px", color: "rgba(255,255,255,.4)", marginBottom: "22px" }}>{result.detail}</p>}
          <button className="pbtn" onClick={onReset} style={{ padding: "13px 32px" }}>Try Again</button>
        </div>
      ) : result ? (
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px", animation: "fadeup .6s ease" }}>
          <div style={{ marginBottom: "36px" }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,5vw,44px)", fontWeight: 700, lineHeight: 1.12, marginBottom: "12px" }}>{result.title}</h1>
            <p style={{ color: "rgba(255,255,255,.58)", fontSize: "15px", lineHeight: 1.75, marginBottom: "22px", maxWidth: 640 }}>{result.summary}</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.2)", borderRadius: "11px", padding: "11px 18px" }}>
                <div style={{ color: "rgba(255,255,255,.4)", fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", marginBottom: "3px" }}>BUDGET ESTIMATE</div>
                <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: "15px" }}>{result.totalBudgetEstimate}</div>
              </div>
              <div style={{ background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)", borderRadius: "11px", padding: "11px 18px" }}>
                <div style={{ color: "rgba(255,255,255,.4)", fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", marginBottom: "3px" }}>DURATION</div>
                <div style={{ color: "#818cf8", fontWeight: 700, fontSize: "15px" }}>{result.days?.length} Day{result.days?.length > 1 ? "s" : ""}</div>
              </div>
            </div>
          </div>

          {result.tips?.length > 0 && (
            <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "14px", padding: "20px 22px", marginBottom: "36px" }}>
              <p style={{ color: "#fbbf24", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", marginBottom: "12px" }}>💡 INSIDER TIPS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.tips.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: "9px", alignItems: "flex-start" }}>
                    <span style={{ color: "#fbbf24", fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>→</span>
                    <span style={{ color: "rgba(255,255,255,.65)", fontSize: "13px", lineHeight: 1.65 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "9px", flexWrap: "wrap", marginBottom: "24px" }}>
            {result.days?.map((d, i) => (
              <button key={i} className="daybtn" onClick={() => setActiveDay(i)}
                style={{ background: activeDay === i ? "rgba(251,191,36,.18)" : "transparent", borderColor: activeDay === i ? "#fbbf24" : "rgba(255,255,255,.13)", color: activeDay === i ? "#fbbf24" : "rgba(255,255,255,.5)" }}>
                Day {d.day}
              </button>
            ))}
          </div>

          {result.days?.[activeDay] && (() => {
            const day = result.days[activeDay];
            return (
              <div key={activeDay} className="panel">
                <div style={{ marginBottom: "22px", paddingBottom: "18px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "26px", fontWeight: 700, marginBottom: "8px" }}>
                    Day {day.day}: {day.theme}
                  </h2>
                  <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
                    <span style={{ color: "rgba(255,255,255,.42)", fontSize: "12px" }}>🚌 {day.transport}</span>
                    <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: 600 }}>💰 {day.dayBudget}</span>
                  </div>
                </div>
                <div style={{ position: "relative", paddingLeft: "24px" }}>
                  <div style={{ position: "absolute", left: "6px", top: 0, bottom: 0, width: "2px", background: "rgba(255,255,255,.05)", borderRadius: "1px" }} />
                  {day.stops?.map((stop, si) => (
                    <div key={si} style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "-20px", top: "18px", width: "14px", height: "14px", borderRadius: "50%", background: typeColor(stop.type), border: "3px solid #080810", zIndex: 1, boxShadow: `0 0 7px ${typeColor(stop.type)}66` }} />
                      <div className="stopcard">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "7px", marginBottom: "7px" }}>
                          <div style={{ display: "flex", gap: "9px", alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ color: "rgba(255,255,255,.35)", fontSize: "11px" }}>{stop.time}</span>
                            <span style={{ background: `${typeColor(stop.type)}22`, color: typeColor(stop.type), fontSize: "10px", padding: "2px 9px", borderRadius: "18px", fontWeight: 700, letterSpacing: ".5px" }}>{stop.type}</span>
                          </div>
                          <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: 700 }}>{stop.cost}</span>
                        </div>
                        <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "19px", fontWeight: 600, margin: "0 0 6px" }}>{stop.name}</h4>
                        <p style={{ color: "rgba(255,255,255,.52)", fontSize: "13px", lineHeight: 1.65, margin: "0 0 9px" }}>{stop.description}</p>
                        <div style={{ display: "flex", gap: "16px", fontSize: "12px", flexWrap: "wrap" }}>
                          <span style={{ color: "rgba(255,255,255,.32)" }}>⏱ {stop.duration}</span>
                          {stop.tip && <span style={{ color: "#fbbf24" }}>💡 {stop.tip}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <div style={{ textAlign: "center", marginTop: "56px", paddingTop: "36px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
            <p style={{ color: "rgba(255,255,255,.3)", marginBottom: "16px", fontSize: "13px" }}>Want to explore a different part of Delhi?</p>
            <button className="pbtn" onClick={onReset} style={{ padding: "13px 34px" }}>← Plan Another Trip</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ══════════════════════════════
   GEMINI AI GENERATOR (FREE)
══════════════════════════════ */
async function generatePlan(form, setResult) {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const budgetMap = {
    budget: "Budget (₹500–1,500/day)",
    moderate: "Moderate (₹1,500–4,000/day)",
    premium: "Premium (₹4,000–10,000/day)",
    luxury: "Luxury (₹10,000+/day)"
  };

  const prompt = `You are an expert Delhi travel guide. Create a detailed ${form.days}-day trip itinerary for ${form.groupSize} person(s).
Trip details:
- Budget: ${budgetMap[form.budget] || "Moderate"}
- Start: ${form.startLocation || "Central Delhi"}
- End: ${form.endLocation || "flexible"}
- Interests: ${form.placeTypes.join(", ") || "general sightseeing"}
- Notes: ${form.description || "none"}

IMPORTANT: Respond ONLY with a raw JSON object. No markdown, no backticks, no code blocks, no explanation, no extra text before or after. Just the JSON.

Use this exact structure:
{"title":"creative trip title","summary":"2-3 sentence overview","totalBudgetEstimate":"e.g. ₹3,000–4,500 per person total","tips":["tip1","tip2","tip3"],"days":[{"day":1,"theme":"Day theme","transport":"Recommended transport","dayBudget":"₹X–Y per person","stops":[{"time":"9:00 AM","name":"Place name","type":"Monument","description":"1-2 sentence description","duration":"1.5 hours","cost":"₹X per person or Free","tip":"one insider tip"}]}]}`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a Delhi travel expert. You must respond with valid raw JSON only. No markdown formatting, no code blocks, no backticks, no explanations. Just pure JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResult({
        error: true,
        message: "API Error",
        detail: data?.error?.message || "Check your Groq API key"
      });
      return;
    }

    const text = data.choices?.[0]?.message?.content || "";

    // Clean any possible markdown wrapping
    const clean = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON if there's extra text around it
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      setResult({ error: true, message: "Could not parse response. Please try again." });
      return;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    setResult(parsed);

  } catch (e) {
    setResult({
      error: true,
      message: "Could not generate plan. Please try again.",
      detail: e.message
    });
  }
}