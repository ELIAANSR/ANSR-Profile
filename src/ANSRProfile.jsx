import { useState, useEffect, useMemo, useRef, useCallback } from "react";
 
/* ═══════════════════════════════════════════
   ANSR PROFILE — Landing Page
   ELIA · Beauty That Heals
 
   URL: ansr-profile.vercel.app?p=velvetblade&u=heartwood
   p = primary profile key
   u = undertone profile key
 
   Meta Pixel events:
   - PageView on load
   - ViewContent when CTA scrolls into view
   - InitiateCheckout when CTA clicked
 
   March 28, 2026 — FINAL
   ═══════════════════════════════════════════ */
 
/* ── Checkout ── */
const CHECKOUT_URL = "https://beauty.eliaheals.com/resource_redirect/offers/dchhozm7";
 
/* ── Profiles ── */
const PROFILES = {
  sunfire: {
    name: "Sunfire",
    color: "#D4845A",
    colorSoft: "rgba(212,132,90,0.08)",
    colorBorder: "rgba(212,132,90,0.20)",
    headline: "The pace you keep has a price the Pulse couldn't reach.",
    hook: "Your Pulse result caught the intensity. The pace that built your career and now runs without an off switch. What it couldn't show you is exactly where it's burning through your reserves, which dimension is paying the highest price, and why the strategies you've tried to slow down haven't worked.",
  },
  velvetblade: {
    name: "Velvet Blade",
    color: "#9B7A8F",
    colorSoft: "rgba(155,122,143,0.08)",
    colorBorder: "rgba(155,122,143,0.20)",
    headline: "The composure carried a cost the Pulse couldn't map.",
    hook: "Your Pulse result identified the composure. The control that impresses everyone and costs you everything it touches. What it couldn't show you is where that cost is concentrated, how your sensitivity interacts with your performance, and why the things that used to restore you have stopped reaching your body.",
  },
  eclipse: {
    name: "Eclipse",
    color: "#6B7A8B",
    colorSoft: "rgba(107,122,139,0.08)",
    colorBorder: "rgba(107,122,139,0.20)",
    headline: "What went quiet in you runs deeper than the Pulse could show.",
    hook: "Your Pulse result registered the dimming. The flatness you've normalised so completely you forgot what colour felt like. What it couldn't show you is which dimensions your nervous system shut down first, where capacity still exists, and the specific pattern keeping you in conservation mode.",
  },
  summerstorm: {
    name: "Summer Storm",
    color: "#8B6B5C",
    colorSoft: "rgba(139,107,92,0.08)",
    colorBorder: "rgba(139,107,92,0.20)",
    headline: "The sensitivity that defines you has a structure the Pulse couldn't map.",
    hook: "Your Pulse result measured the sensitivity. The system that absorbs everything in the room before you've finished walking through the door. What it couldn't show you is where the overwhelm concentrates, which dimensions have been quieted to manage the flood, and what kind of container your nervous system actually needs.",
  },
  heartwood: {
    name: "Heartwood",
    color: "#7A8B5B",
    colorSoft: "rgba(122,139,91,0.08)",
    colorBorder: "rgba(122,139,91,0.20)",
    headline: "What you carry for others comes at a cost the Pulse couldn't see.",
    hook: "Your Pulse result named the giving. The way you hold space so naturally that nobody thinks to hold space for you. What it couldn't show you is where your own signal has gone quiet, how your connection scores relate to your aliveness, and the specific imbalance between what you give and what reaches you.",
  },
  newmoon: {
    name: "New Moon",
    color: "#5B7A7A",
    colorSoft: "rgba(91,122,122,0.08)",
    colorBorder: "rgba(91,122,122,0.20)",
    headline: "What's shifting in you is more precise than the Pulse could measure.",
    hook: "Your Pulse result detected the shift. Something stirring beneath a surface that has been still for longer than you realised. What it couldn't show you is which dimensions are reactivating, where old patterns still hold, and what your nervous system needs to complete the transition it has already started.",
  },
};
 
/* ── FAQ ── */
const FAQ_DATA = [
  { q: "How is this different from the Pulse?",
    a: "The Pulse measures 11 data points. The Profile measures 42, including your secondary pattern, sensory regulation channels, bracing patterns, and the interaction between your two profiles." },
  { q: "How long does it take?",
    a: "12 minutes. Your progress saves automatically." },
  { q: "What do I receive?",
    a: "A 14-page personalised PDF. Dual-profile analysis, six dimension deep-dives, sensory signature, matched practices. Generated instantly, sent to your email." },
  { q: "Is this therapy?",
    a: "No. This is a nervous system assessment based on neuroaesthetics and polyvagal theory. It does not diagnose medical conditions." },
  { q: "Is my data confidential?",
    a: "Completely. Not shared with anyone. Ever." },
];
 
/* ── Noise texture ── */
const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
 
/* ── Pixel ── */
function pixel(event, data) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, data || {});
  }
}
 
/* ── FAQ Item ── */
function FAQ({ item, open: initOpen }) {
  const [open, setOpen] = useState(initOpen);
  return (
    <div onClick={() => setOpen(!open)} style={{
      cursor: "pointer", userSelect: "none", padding: "20px 0",
      borderBottom: "1px solid rgba(44,44,44,0.07)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#2C2C2C",
          lineHeight: 1.5, paddingRight: 20,
        }}>{item.q}</span>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#B07D62",
          transition: "transform 0.3s ease",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          flexShrink: 0, lineHeight: 1,
        }}>+</span>
      </div>
      <div style={{
        maxHeight: open ? 300 : 0, overflow: "hidden",
        transition: "max-height 0.4s ease, opacity 0.3s ease",
        opacity: open ? 1 : 0,
      }}>
        <p style={{
          fontFamily: "'EB Garamond', serif", fontSize: 15, color: "#6B6560",
          lineHeight: 1.8, margin: 0, paddingTop: 12,
        }}>{item.a}</p>
      </div>
    </div>
  );
}
 
/* ── CTA Button ── */
function CTA({ color, onClick }) {
  return (
    <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" onClick={onClick} style={{
      display: "inline-block", fontFamily: "'Cormorant Garamond', serif",
      fontSize: 16, letterSpacing: "0.12em", textTransform: "uppercase",
      background: "#C4896A", color: "#FFFFFF", padding: "18px 48px",
      textDecoration: "none", cursor: "pointer", transition: "all 0.3s ease",
      borderRadius: 2,
      boxShadow: `0 4px 20px ${color || "rgba(176,125,98,0.10)"}, 0 2px 12px rgba(176,125,98,0.15)`,
    }}
      onMouseEnter={(e) => {
        e.target.style.boxShadow = `0 8px 32px ${color || "rgba(176,125,98,0.15)"}, 0 4px 20px rgba(176,125,98,0.25)`;
        e.target.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = `0 4px 20px ${color || "rgba(176,125,98,0.10)"}, 0 2px 12px rgba(176,125,98,0.15)`;
        e.target.style.transform = "translateY(0)";
      }}>
      Your full ANSR Profile — €97
    </a>
  );
}
 
/* ── Orbit Motif ── */
function Orbit({ color, size = 80 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
        border: `1px solid ${color}`, opacity: 0.2 }} />
      <div style={{ position: "absolute", inset: size * 0.15, borderRadius: "50%",
        border: `1px solid ${color}`, opacity: 0.35 }} />
      <div style={{ position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: 6, height: 6,
        borderRadius: "50%", background: color, opacity: 0.5 }} />
    </div>
  );
}
 
 
/* ════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════ */
 
export default function ANSRProfileLP() {
  const [vis, setVis] = useState(false);
  const [ctaSeen, setCtaSeen] = useState(false);
  const ctaRef = useRef(null);
 
  /* Fade in + PageView */
  useEffect(() => {
    setTimeout(() => setVis(true), 100);
    pixel("PageView");
  }, []);
 
  /* ViewContent when CTA enters viewport */
  useEffect(() => {
    if (!ctaRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ctaSeen) {
        setCtaSeen(true);
        pixel("ViewContent", { content_name: "ANSR Profile LP", value: 97, currency: "EUR" });
      }
    }, { threshold: 0.5 });
    obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, [ctaSeen]);
 
  /* InitiateCheckout on click */
  const onCTA = useCallback(() => {
    pixel("InitiateCheckout", { content_name: "ANSR Profile", value: 97, currency: "EUR" });
  }, []);
 
  /* Read URL params */
  const primary = useMemo(() => {
    if (typeof window === "undefined") return null;
    const k = new URLSearchParams(window.location.search).get("p");
    return k && PROFILES[k] ? PROFILES[k] : null;
  }, []);
 
  const undertone = useMemo(() => {
    if (typeof window === "undefined") return null;
    const k = new URLSearchParams(window.location.search).get("u");
    return k && PROFILES[k] ? PROFILES[k] : null;
  }, []);
 
  /* Fallback colour */
  const c = primary ? primary.color : "#B07D62";
  const cSoft = primary ? primary.colorSoft : "rgba(176,125,98,0.06)";
  const cBorder = primary ? primary.colorBorder : "rgba(176,125,98,0.20)";
 
  /* Video — paste embed URL after shooting */
  const VIDEO = "https://iframe.mediadelivery.net/embed/628520/f621c508-64ba-4374-b7a3-d4461bc5dcda";
 
  return (
    <div style={{ minHeight: "100vh", color: "#2C2C2C", position: "relative" }}>
 
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet" />
 
      {/* ── Background ── */}
      <div style={{ position: "fixed", inset: 0, background: "#FAF5EE", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: NOISE,
        backgroundSize: "200px 200px", opacity: 0.018, zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        background: `radial-gradient(ellipse at 50% 15%, ${cSoft} 0%, transparent 55%),
                     radial-gradient(ellipse at 30% 80%, rgba(176,125,98,0.03) 0%, transparent 50%)` }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120,
        background: "linear-gradient(to bottom, rgba(26,23,20,0.06) 0%, transparent 100%)",
        zIndex: 1, pointerEvents: "none" }} />
 
      {/* ── Page ── */}
      <div style={{
        position: "relative", zIndex: 2,
        opacity: vis ? 1 : 0, transition: "opacity 0.9s ease",
        maxWidth: 600, margin: "0 auto", padding: "0 28px",
      }}>
 
        {/* ────────────────────────
            HERO
            ──────────────────────── */}
        <div style={{ textAlign: "center", paddingTop: 80, paddingBottom: 72 }}>
 
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400,
            color: "#2C2C2C", letterSpacing: "0.4em", marginBottom: 14 }}>ELIA</p>
          <div style={{ width: 32, height: 1, background: c, margin: "0 auto 48px", opacity: 0.5 }} />
 
          {primary ? (
            <>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590",
                letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
                Your ANSR Pulse Signature</p>
 
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(38px, 9vw, 56px)", fontWeight: 300,
                color: c, letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: 12 }}>
                {primary.name}</h1>
 
              {undertone && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18,
                  fontWeight: 300, color: "#6B6560", marginBottom: 20 }}>
                  with <span style={{ color: undertone.color, fontStyle: "italic" }}>{undertone.name}</span> undertone</p>
              )}
 
              <div style={{ width: 40, height: 1, background: c, margin: "0 auto 36px", opacity: 0.3 }} />
 
              <p style={{ fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 300,
                color: "#2C2C2C", letterSpacing: "0.015em", lineHeight: 1.5 }}>
                {primary.headline}</p>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 6vw, 42px)", fontWeight: 300,
                color: "#2C2C2C", letterSpacing: "0.015em", lineHeight: 1.35, marginBottom: 10 }}>
                Your Pulse showed the pattern.</h1>
              <p style={{ fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 6vw, 42px)", fontWeight: 300,
                color: "#B07D62", letterSpacing: "0.015em", lineHeight: 1.35 }}>
                Your Profile maps what's underneath it.</p>
            </>
          )}
        </div>
 
 
        {/* ────────────────────────
            PRODUCT PHOTO
            ──────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ borderRadius: 4, overflow: "hidden",
            boxShadow: `0 16px 56px rgba(26,23,20,0.14), 0 0 0 1px ${cBorder}` }}>
            <img src="/profile-report.jpg" alt="ANSR Profile Report"
              style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590",
          textAlign: "center", letterSpacing: "0.04em", marginBottom: 72 }}>
          Radar chart · Dual-profile analysis · Six dimension deep-dives · Personalised practices</p>
 
 
        {/* ────────────────────────
            BODY
            ──────────────────────── */}
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, color: "#2C2C2C",
          lineHeight: 1.9, marginBottom: 28 }}>
          {primary ? primary.hook : "The Pulse measured 11 data points. The Profile measures 42. It maps all six dimensions, your secondary pattern, where your system is compensating, and the practices matched to your nervous system."}</p>
 
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, color: "#2C2C2C",
          lineHeight: 1.9, marginBottom: 28 }}>
          42 questions. Six dimensions fully mapped. Your dual-profile interaction.
          Sensory signature. Matched restoration practices.
          14 pages, generated instantly, yours to keep.</p>
 
        {/* Undertone card */}
        {undertone && primary && (
          <div style={{
            padding: "20px 24px", marginBottom: 28,
            background: undertone.colorSoft,
            borderLeft: `3px solid ${undertone.color}`,
            borderRadius: "0 4px 4px 0",
          }}>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#2C2C2C",
              lineHeight: 1.8, margin: 0 }}>
              Your undertone: <span style={{ color: undertone.color, fontWeight: 500 }}>{undertone.name}</span>.
              {" "}How your {primary.name} and {undertone.name} interact,
              and what that tension reveals, is mapped in your full Profile.</p>
          </div>
        )}
 
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590",
          letterSpacing: "0.04em", lineHeight: 1.7, marginBottom: 72 }}>
          Based on research from Stanford, UCL, Max Planck Institute, and the Polyvagal Institute.</p>
 
 
        {/* ────────────────────────
            EMOTIONAL LINE
            ──────────────────────── */}
        <div style={{ borderLeft: `2px solid ${c}`, paddingLeft: 24, marginBottom: 72 }}>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 19, color: "#2C2C2C",
            lineHeight: 2.1, fontStyle: "italic" }}>
            Most assessments tell you what you already suspect.
            Your ANSR Profile tells you what your nervous system
            has been hiding from you.</p>
        </div>
 
 
        {/* ────────────────────────
            VIDEO
            ──────────────────────── */}
        <div style={{ marginBottom: 72 }}>
          {VIDEO ? (
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0,
              overflow: "hidden", borderRadius: 4 }}>
              <iframe src={VIDEO} style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none",
              }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
                title="About the ANSR Profile" />
            </div>
          ) : (
            <div style={{
              aspectRatio: "16/9", background: "#F3EDE4", borderRadius: 4,
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 14,
            }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%",
                border: `2px solid ${c}`,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 0, height: 0, borderTop: "12px solid transparent",
                  borderBottom: "12px solid transparent",
                  borderLeft: `20px solid ${c}`, marginLeft: 5 }} />
              </div>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14,
                color: "#6B6560", fontStyle: "italic" }}>
                What the Profile reveals that the Pulse couldn't</p>
            </div>
          )}
        </div>
 
 
        {/* ────────────────────────
            TESTIMONIAL
            ──────────────────────── */}
        <div style={{ marginBottom: 72, maxWidth: 460 }}>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#6B6560",
            lineHeight: 1.9, fontStyle: "italic", marginBottom: 16 }}>
            "I have done so many assessments in my career. I was skeptical.
            But none were about how I feel, how I sense the world around me,
            my nervous system, my emotions and the degree of my sensitivity.
            On top of that, Alexandre was amazing at putting this into perspective.
            Will do it again in 6 months."</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9B9590",
            letterSpacing: "0.04em" }}>
            Delphine V., SVP & GM, Big Tech · Switzerland</p>
        </div>
 
 
        {/* ────────────────────────
            CTA
            ──────────────────────── */}
        <div ref={ctaRef} style={{ textAlign: "center", marginBottom: 72 }}>
          <Orbit color={c} size={80} />
          <div style={{ height: 32 }} />
          <CTA color={cSoft} onClick={onCTA} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9B9590",
            marginTop: 18, letterSpacing: "0.04em" }}>
            Instant PDF · Secure payment · 12 minutes</p>
        </div>
 
 
        {/* ────────────────────────
            FAQ
            ──────────────────────── */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ width: 40, height: 1, background: c,
            margin: "0 auto 48px", opacity: 0.25 }} />
          {FAQ_DATA.map((item, i) => (
            <FAQ key={i} item={item} open={i === 0} />
          ))}
        </div>
 
 
        {/* ────────────────────────
            FOUNDER
            ──────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: "#6B6560",
            fontStyle: "italic", marginBottom: 10 }}>
            Created by Alexandre Olive</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590",
            letterSpacing: "0.04em", lineHeight: 1.7 }}>
            16 years in luxury leadership · 10 years mentoring founders and executives</p>
        </div>
 
 
        {/* ────────────────────────
            CLOSING CTA
            ──────────────────────── */}
        <div style={{ textAlign: "center", paddingBottom: 80 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 300,
            color: "#2C2C2C", lineHeight: 1.45, marginBottom: 32 }}>
            See what your nervous system<br />
            <span style={{ color: c }}>has been trying to tell you.</span></p>
          <CTA color={cSoft} onClick={onCTA} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590",
            marginTop: 20, letterSpacing: "0.04em" }}>
            Developed for senior leaders and founders in luxury, finance, art, law, and architecture.</p>
        </div>
 
 
        {/* ────────────────────────
            DARK FOOTER
            ──────────────────────── */}
        <div style={{ background: "#1A1714", margin: "0 -28px",
          padding: "56px 28px 64px", textAlign: "center" }}>
          <Orbit color="#C4896A" size={64} />
          <div style={{ height: 28 }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400,
            color: "#F2EDE7", letterSpacing: "0.35em", marginBottom: 8 }}>ELIA</p>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: "#C4896A",
            letterSpacing: "0.1em", fontStyle: "italic", marginBottom: 36 }}>
            Beauty That Heals</p>
          <div style={{ width: 40, height: 1, background: "#C4896A",
            margin: "0 auto 36px", opacity: 0.2 }} />
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, color: "#C4BAA8",
            lineHeight: 1.8, marginBottom: 24 }}>
            ANSR™ — Aesthetic Nervous System Regulation</p>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 11, color: "#9B9590",
            lineHeight: 1.7 }}>
            © ELIA / Uskale SA · All rights reserved<br />
            This assessment is for personal development purposes
            and does not constitute medical diagnosis.</p>
        </div>
 
      </div>
    </div>
  );
}
 
