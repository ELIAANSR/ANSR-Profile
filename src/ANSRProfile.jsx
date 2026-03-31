import { useState, useEffect, useMemo, useRef, useCallback } from "react";
 
/* ═══════════════════════════════════════════
   ANSR PROFILE — Landing Page + Delivery Page
   ELIA · Beauty That Heals
 
   Routes:
   ansr-profile.vercel.app?p=velvetblade&u=heartwood          → Profile LP
   ansr-profile.vercel.app/delivery?name=Sophie&p=velvetblade&u=heartwood  → Delivery Page
 
   March 31, 2026
   ═══════════════════════════════════════════ */
 
/* ── Checkout + Debrief URLs ── */
const CHECKOUT_URL = "https://beauty.eliaheals.com/resource_redirect/offers/dchhozm7";
const DEBRIEF_URL = "https://calendly.com/alexandre_elia/ansr-profile-debrief";
const PDF_BASE_URL = "/api/profile-pdf";
 
/* ── Profiles ── */
const PROFILES = {
  sunfire: {
    name: "Sunfire", color: "#D4845A", colorSoft: "rgba(212,132,90,0.08)", colorBorder: "rgba(212,132,90,0.20)",
    headline: "The pace you keep has a price the Pulse couldn't reach.",
    hook: "Your Pulse result caught the intensity. The pace that built your career and now runs without an off switch. What it couldn't show you is exactly where it's burning through your reserves, which dimension is paying the highest price, and why the strategies you've tried to slow down haven't worked.",
    delivery: "Before you open it, I want to say something. Your Pulse result caught the intensity. The pace that built your career and now runs without an off switch.\n\nI know your instinct is to scan the report quickly and move to the next thing. This is one of those rare moments where slowing down changes what you see. The report was built to be read at a pace your nervous system doesn't usually allow.\n\nLook carefully at the gap between your highest and lowest dimensions. That gap is the story.\n\n20 minutes. Somewhere quiet. This one is worth your full attention.",
  },
  velvetblade: {
    name: "Velvet Blade", color: "#9B7A8F", colorSoft: "rgba(155,122,143,0.08)", colorBorder: "rgba(155,122,143,0.20)",
    headline: "The composure carried a cost the Pulse couldn't map.",
    hook: "Your Pulse result identified the composure. The control that impresses everyone and costs you everything it touches. What it couldn't show you is where that cost is concentrated, how your sensitivity interacts with your performance, and why the things that used to restore you have stopped reaching your body.",
    delivery: "Before you open it, I want to say something. The woman who took this assessment and the woman who reads this report are not the same person. Something shifted between the first question and the last. You let yourself answer honestly. That takes more than most people realise.\n\nYour Velvet Blade result confirmed what you already sensed: the composure carries a cost. Your Profile maps exactly where that cost lives across all six dimensions. Pay particular attention to where your lowest dimension intersects with your highest. That's where the pattern reveals itself most clearly.\n\nRead it when you have 20 minutes alone. Not between meetings. Not on a screen next to your inbox. Print it if you can. This was written for a version of you that rarely gets space to show up.",
  },
  eclipse: {
    name: "Eclipse", color: "#6B7A8B", colorSoft: "rgba(107,122,139,0.08)", colorBorder: "rgba(107,122,139,0.20)",
    headline: "What went quiet in you runs deeper than the Pulse could show.",
    hook: "Your Pulse result registered the dimming. The flatness you've normalised so completely you forgot what colour felt like. What it couldn't show you is which dimensions your nervous system shut down first, where capacity still exists, and the specific pattern keeping you in conservation mode.",
    delivery: "Before you open it, I want to be honest with you. Eclipse is often the result that surprises women most. But what this report shows is not what's wrong with you. It shows what your nervous system did to protect you. And it shows where the capacity to feel, to want, to be moved by beauty, still lives.\n\nYour Profile maps all six dimensions. Some will be lower than you expected. At least one will be higher. That dimension is important. It's the opening.\n\nRead it with gentleness. Your system has been working very hard on your behalf for a long time. This report is the first thing that sees that clearly.",
  },
  summerstorm: {
    name: "Summer Storm", color: "#8B6B5C", colorSoft: "rgba(139,107,92,0.08)", colorBorder: "rgba(139,107,92,0.20)",
    headline: "The sensitivity that defines you has a structure the Pulse couldn't map.",
    hook: "Your Pulse result measured the sensitivity. The system that absorbs everything in the room before you've finished walking through the door. What it couldn't show you is where the overwhelm concentrates, which dimensions have been quieted to manage the flood, and what kind of container your nervous system actually needs.",
    delivery: "Before you open it, I want to name something. You'll feel it as you read. That's not a warning, it's a recognition. Women with your profile don't just read about their patterns. They feel them landing in their body.\n\nYour Summer Storm result showed a system with extraordinary sensitivity and insufficient architecture around it. Your Profile maps where the overwhelm concentrates and, more importantly, where your capacity is still intact. Those intact dimensions are your foundation. Everything builds from there.\n\nFind a moment where you're not absorbing anyone else's energy. Then read.",
  },
  heartwood: {
    name: "Heartwood", color: "#7A8B5B", colorSoft: "rgba(122,139,91,0.08)", colorBorder: "rgba(122,139,91,0.20)",
    headline: "What you carry for others comes at a cost the Pulse couldn't see.",
    hook: "Your Pulse result named the giving. The way you hold space so naturally that nobody thinks to hold space for you. What it couldn't show you is where your own signal has gone quiet, how your connection scores relate to your aliveness, and the specific imbalance between what you give and what reaches you.",
    delivery: "Before you open it, I want you to notice something as you read. At several points, you'll recognise a pattern you've been living inside for years. The instinct will be to think about how this applies to the people you care for. How it explains what you've been carrying for them.\n\nResist that instinct. This report is about you. Only you.\n\nYour Heartwood result showed a system that has become so skilled at reading others that it forgot to read itself. Your Profile maps where that imbalance sits across all six dimensions. The section on your undertone interaction will likely surprise you.\n\nRead it alone. Not to share. Not to discuss. For yourself.",
  },
  newmoon: {
    name: "New Moon", color: "#5B7A7A", colorSoft: "rgba(91,122,122,0.08)", colorBorder: "rgba(91,122,122,0.20)",
    headline: "What's shifting in you is more precise than the Pulse could measure.",
    hook: "Your Pulse result detected the shift. Something stirring beneath a surface that has been still for longer than you realised. What it couldn't show you is which dimensions are reactivating, where old patterns still hold, and what your nervous system needs to complete the transition it has already started.",
    delivery: "Before you open it, I want to say this. Something brought you to this assessment at exactly this moment. Not six months ago. Not next year. Now. Your New Moon result suggests your nervous system already knows why.\n\nYour Profile maps where the shift is happening across all six dimensions. Some dimensions are further along than others. The unevenness is not a flaw. It's the signature of a system in transition. Pay attention to which dimensions are moving fastest. That's where the energy wants to go.\n\nRead it with curiosity, not analysis. Your system is telling you something. This report gives it language.",
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
 
/* ── Pixel helpers ── */
function pixel(event, data) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, data || {});
  }
}
function pixelCustom(event, data) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("trackCustom", event, data || {});
  }
}
 
/* ── Shared components ── */
 
function Orbit({ color, size = 80 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${color}`, opacity: 0.2 }} />
      <div style={{ position: "absolute", inset: size * 0.15, borderRadius: "50%", border: `1px solid ${color}`, opacity: 0.35 }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 6, height: 6, borderRadius: "50%", background: color, opacity: 0.5 }} />
    </div>
  );
}
 
function FAQItem({ item, open: initOpen }) {
  const [open, setOpen] = useState(initOpen);
  return (
    <div onClick={() => setOpen(!open)} style={{ cursor: "pointer", userSelect: "none", padding: "20px 0", borderBottom: "1px solid rgba(44,44,44,0.07)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#2C2C2C", lineHeight: 1.5, paddingRight: 20 }}>{item.q}</span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#B07D62", transition: "transform 0.3s ease", transform: open ? "rotate(45deg)" : "rotate(0deg)", flexShrink: 0, lineHeight: 1 }}>+</span>
      </div>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height 0.4s ease, opacity 0.3s ease", opacity: open ? 1 : 0 }}>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: "#6B6560", lineHeight: 1.8, margin: 0, paddingTop: 12 }}>{item.a}</p>
      </div>
    </div>
  );
}
 
function CTAButton({ color, onClick, text }) {
  return (
    <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" onClick={onClick} style={{
      display: "inline-block", fontFamily: "'Cormorant Garamond', serif",
      fontSize: 16, letterSpacing: "0.12em", textTransform: "uppercase",
      background: "#C4896A", color: "#FFFFFF", padding: "18px 48px",
      textDecoration: "none", cursor: "pointer", transition: "all 0.3s ease",
      borderRadius: 2, boxShadow: `0 4px 20px ${color || "rgba(176,125,98,0.10)"}, 0 2px 12px rgba(176,125,98,0.15)`,
    }}
      onMouseEnter={(e) => { e.target.style.boxShadow = `0 8px 32px ${color || "rgba(176,125,98,0.15)"}, 0 4px 20px rgba(176,125,98,0.25)`; e.target.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.target.style.boxShadow = `0 4px 20px ${color || "rgba(176,125,98,0.10)"}, 0 2px 12px rgba(176,125,98,0.15)`; e.target.style.transform = "translateY(0)"; }}>
      {text || "Your full ANSR Profile — €97"}
    </a>
  );
}
 
function FontLinks() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet" />
    </>
  );
}
 
 
/* ════════════════════════════════════════════
   PROFILE LANDING PAGE
   ════════════════════════════════════════════ */
 
function ProfileLP() {
  const [vis, setVis] = useState(false);
  const [ctaSeen, setCtaSeen] = useState(false);
  const ctaRef = useRef(null);
 
  useEffect(() => { setTimeout(() => setVis(true), 100); pixel("PageView"); }, []);
 
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
 
  const onCTA = useCallback(() => {
    pixel("InitiateCheckout", { content_name: "ANSR Profile", value: 97, currency: "EUR" });
  }, []);
 
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
 
  const c = primary ? primary.color : "#B07D62";
  const cSoft = primary ? primary.colorSoft : "rgba(176,125,98,0.06)";
  const cBorder = primary ? primary.colorBorder : "rgba(176,125,98,0.20)";
 
  const VIDEO = "https://iframe.mediadelivery.net/embed/628520/f621c508-64ba-4374-b7a3-d4461bc5dcda";
 
  return (
    <div style={{ minHeight: "100vh", color: "#2C2C2C", position: "relative" }}>
      <FontLinks />
 
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, background: "#FAF5EE", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: NOISE, backgroundSize: "200px 200px", opacity: 0.018, zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        background: `radial-gradient(ellipse at 50% 15%, ${cSoft} 0%, transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(176,125,98,0.03) 0%, transparent 50%)` }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, rgba(26,23,20,0.06) 0%, transparent 100%)", zIndex: 1, pointerEvents: "none" }} />
 
      <div style={{ position: "relative", zIndex: 2, opacity: vis ? 1 : 0, transition: "opacity 0.9s ease", maxWidth: 600, margin: "0 auto", padding: "0 28px" }}>
 
        {/* Hero */}
        <div style={{ textAlign: "center", paddingTop: 80, paddingBottom: 72 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: "#2C2C2C", letterSpacing: "0.4em", marginBottom: 14 }}>ELIA</p>
          <div style={{ width: 32, height: 1, background: c, margin: "0 auto 48px", opacity: 0.5 }} />
 
          {primary ? (
            <>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Your ANSR Pulse Signature</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(38px, 9vw, 56px)", fontWeight: 300, color: c, letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: 12 }}>{primary.name}</h1>
              {undertone && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: "#6B6560", marginBottom: 20 }}>
                  with <span style={{ color: undertone.color, fontStyle: "italic" }}>{undertone.name}</span> undertone</p>
              )}
              <div style={{ width: 40, height: 1, background: c, margin: "0 auto 36px", opacity: 0.3 }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 300, color: "#2C2C2C", letterSpacing: "0.015em", lineHeight: 1.5 }}>{primary.headline}</p>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 6vw, 42px)", fontWeight: 300, color: "#2C2C2C", letterSpacing: "0.015em", lineHeight: 1.35, marginBottom: 10 }}>Your Pulse showed the pattern.</h1>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 6vw, 42px)", fontWeight: 300, color: "#B07D62", letterSpacing: "0.015em", lineHeight: 1.35 }}>Your Profile maps what's underneath it.</p>
            </>
          )}
        </div>
 
        {/* Product photo */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ borderRadius: 4, overflow: "hidden", boxShadow: `0 16px 56px rgba(26,23,20,0.14), 0 0 0 1px ${cBorder}` }}>
            <img src="/profile-report.jpg" alt="ANSR Profile Report" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590", textAlign: "center", letterSpacing: "0.04em", marginBottom: 72 }}>
          Radar chart · Dual-profile analysis · Six dimension deep-dives · Personalised practices</p>
 
        {/* Body */}
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, color: "#2C2C2C", lineHeight: 1.9, marginBottom: 28 }}>
          {primary ? primary.hook : "The Pulse measured 11 data points. The Profile measures 42. It maps all six dimensions, your secondary pattern, where your system is compensating, and the practices matched to your nervous system."}</p>
 
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, color: "#2C2C2C", lineHeight: 1.9, marginBottom: 28 }}>
          42 questions. Six dimensions fully mapped. Your dual-profile interaction. Sensory signature. Matched restoration practices. 14 pages, generated instantly, yours to keep.</p>
 
        {undertone && primary && (
          <div style={{ padding: "20px 24px", marginBottom: 28, background: undertone.colorSoft, borderLeft: `3px solid ${undertone.color}`, borderRadius: "0 4px 4px 0" }}>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#2C2C2C", lineHeight: 1.8, margin: 0 }}>
              Your undertone: <span style={{ color: undertone.color, fontWeight: 500 }}>{undertone.name}</span>.
              {" "}How your {primary.name} and {undertone.name} interact, and what that tension reveals, is mapped in your full Profile.</p>
          </div>
        )}
 
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590", letterSpacing: "0.04em", lineHeight: 1.7, marginBottom: 72 }}>
          Based on research from Stanford, UCL, Max Planck Institute, and the Polyvagal Institute.</p>
 
        {/* Emotional line */}
        <div style={{ borderLeft: `2px solid ${c}`, paddingLeft: 24, marginBottom: 72 }}>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 19, color: "#2C2C2C", lineHeight: 2.1, fontStyle: "italic" }}>
            Most assessments tell you what you already suspect. Your ANSR Profile tells you what your nervous system has been hiding from you.</p>
        </div>
 
        {/* Video */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 4 }}>
            <iframe src={VIDEO} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="About the ANSR Profile" />
          </div>
        </div>
 
        {/* Testimonial */}
        <div style={{ marginBottom: 72, maxWidth: 460 }}>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#6B6560", lineHeight: 1.9, fontStyle: "italic", marginBottom: 16 }}>
            "I have done so many assessments in my career. I was skeptical. But none were about how I feel, how I sense the world around me, my nervous system, my emotions and the degree of my sensitivity. On top of that, Alexandre was amazing at putting this into perspective. Will do it again in 6 months."</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9B9590", letterSpacing: "0.04em" }}>
            Delphine V., SVP & GM, Big Tech · Switzerland</p>
        </div>
 
        {/* CTA */}
        <div ref={ctaRef} style={{ textAlign: "center", marginBottom: 72 }}>
          <Orbit color={c} size={80} />
          <div style={{ height: 32 }} />
          <CTAButton color={cSoft} onClick={onCTA} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9B9590", marginTop: 18, letterSpacing: "0.04em" }}>
            Instant PDF · Secure payment · 12 minutes</p>
        </div>
 
        {/* FAQ */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ width: 40, height: 1, background: c, margin: "0 auto 48px", opacity: 0.25 }} />
          {FAQ_DATA.map((item, i) => <FAQItem key={i} item={item} open={i === 0} />)}
        </div>
 
        {/* Founder */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: "#6B6560", fontStyle: "italic", marginBottom: 10 }}>Created by Alexandre Olive</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590", letterSpacing: "0.04em", lineHeight: 1.7 }}>
            16 years in luxury leadership · 10 years mentoring founders and executives</p>
        </div>
 
        {/* Closing CTA */}
        <div style={{ textAlign: "center", paddingBottom: 80 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 300, color: "#2C2C2C", lineHeight: 1.45, marginBottom: 32 }}>
            See what your nervous system<br /><span style={{ color: c }}>has been trying to tell you.</span></p>
          <CTAButton color={cSoft} onClick={onCTA} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590", marginTop: 20, letterSpacing: "0.04em" }}>
            Developed for senior leaders and founders in luxury, finance, art, law, and architecture.</p>
        </div>
 
        {/* Dark footer */}
        <div style={{ background: "#1A1714", margin: "0 -28px", padding: "56px 28px 64px", textAlign: "center" }}>
          <Orbit color="#C4896A" size={64} />
          <div style={{ height: 28 }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: "#F2EDE7", letterSpacing: "0.35em", marginBottom: 8 }}>ELIA</p>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: "#C4896A", letterSpacing: "0.1em", fontStyle: "italic", marginBottom: 36 }}>Beauty That Heals</p>
          <div style={{ width: 40, height: 1, background: "#C4896A", margin: "0 auto 36px", opacity: 0.2 }} />
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, color: "#C4BAA8", lineHeight: 1.8, marginBottom: 24 }}>ANSR™ — Aesthetic Nervous System Regulation</p>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 11, color: "#9B9590", lineHeight: 1.7 }}>
            © ELIA / Uskale SA · All rights reserved<br />This assessment is for personal development purposes and does not constitute medical diagnosis.</p>
        </div>
      </div>
    </div>
  );
}
 
 
/* ════════════════════════════════════════════
   DELIVERY PAGE
   ════════════════════════════════════════════ */
 
function ProfileDelivery() {
  const [vis, setVis] = useState(false);
 
  useEffect(() => {
    setTimeout(() => setVis(true), 300);
    pixel("Purchase", { content_name: "ANSR Profile", value: 97, currency: "EUR" });
  }, []);
 
  const params = useMemo(() => {
    if (typeof window === "undefined") return { name: "", p: null, u: null };
    const s = new URLSearchParams(window.location.search);
    return { name: s.get("name") || "", p: s.get("p"), u: s.get("u") };
  }, []);
 
  const primary = params.p && PROFILES[params.p] ? PROFILES[params.p] : PROFILES.velvetblade;
  const undertone = params.u && PROFILES[params.u] ? PROFILES[params.u] : null;
  const userName = params.name;
  const c = primary.color;
 
  const handleDebrief = useCallback(() => {
    pixelCustom("DebriefInterest", { profile: primary.name, value: 147, currency: "EUR" });
  }, [primary.name]);
 
  const paragraphs = primary.delivery.split("\n\n");
 
  return (
    <div style={{ background: "#1A1714", minHeight: "100vh", color: "#F2EDE7", position: "relative" }}>
      <FontLinks />
 
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: NOISE, backgroundSize: "200px 200px", opacity: 0.025, zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse at 50% 30%, ${primary.colorSoft} 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(196,137,106,0.04) 0%, transparent 50%)` }} />
 
      <div style={{ position: "relative", zIndex: 1, opacity: vis ? 1 : 0, transition: "opacity 1.2s ease",
        maxWidth: 540, margin: "0 auto", padding: "0 28px", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh" }}>
 
        <div style={{ height: 80 }} />
        <Orbit color={c} size={72} />
        <div style={{ height: 28 }} />
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: "#F2EDE7", letterSpacing: "0.4em", marginBottom: 12, textAlign: "center" }}>ELIA</p>
        <div style={{ width: 32, height: 1, background: c, opacity: 0.4, marginBottom: 56 }} />
 
        {userName && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#C4BAA8", letterSpacing: "0.12em", marginBottom: 20, textAlign: "center" }}>
            Prepared for {userName}</p>
        )}
 
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 10vw, 60px)", fontWeight: 300, color: c, letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: 12, textAlign: "center" }}>
          {primary.name}</h1>
 
        {undertone && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: "#C4BAA8", marginBottom: 20, textAlign: "center" }}>
            with <span style={{ color: undertone.color, fontStyle: "italic" }}>{undertone.name}</span> undertone</p>
        )}
 
        <div style={{ width: 40, height: 1, background: c, opacity: 0.25, marginBottom: 56 }} />
 
        <div style={{ maxWidth: 480, marginBottom: 56 }}>
          {paragraphs.map((para, i) => (
            <p key={i} style={{ fontFamily: "'EB Garamond', serif", fontSize: 16.5, color: "#F2EDE7", lineHeight: 2.0, marginBottom: 20, opacity: 0.9, textAlign: "left" }}>{para}</p>
          ))}
        </div>
 
        {/* Download — PDF is attached to her email */}
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, letterSpacing: "0.08em",
          color: c, marginBottom: 8, textAlign: "center" }}>
          Your 14-page report is attached to the email that brought you here.</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590",
          letterSpacing: "0.04em", marginBottom: 44, textAlign: "center" }}>
          Open the attachment · Save it · Print it if you can</p>
 
        {/* Debrief */}
        <div style={{ maxWidth: 440, textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, color: "#C4BAA8", lineHeight: 1.9, fontStyle: "italic", marginBottom: 24 }}>
            If you'd like me to walk you through what this report reveals.</p>
 
          <a href={DEBRIEF_URL} target="_blank" rel="noopener noreferrer" onClick={handleDebrief}
            style={{
              display: "inline-block", fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14, letterSpacing: "0.10em", textTransform: "uppercase",
              background: "#FAF5EE", color: "#2C2C2C",
              padding: "14px 36px", textDecoration: "none", cursor: "pointer",
              transition: "all 0.3s ease", borderRadius: 2,
              boxShadow: "0 2px 16px rgba(250,245,238,0.12)",
            }}
            onMouseEnter={(e) => { e.target.style.background = "#FFFFFF"; e.target.style.boxShadow = "0 4px 24px rgba(250,245,238,0.2)"; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.target.style.background = "#FAF5EE"; e.target.style.boxShadow = "0 2px 16px rgba(250,245,238,0.12)"; e.target.style.transform = "translateY(0)"; }}>
            Profile Debrief with Alexandre — €147
          </a>
 
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B9590", marginTop: 14, letterSpacing: "0.04em" }}>
            30 minutes · Your pattern, your dimensions, the one thing you won't see alone</p>
        </div>
 
        {/* Footer */}
        <div style={{ textAlign: "center", paddingBottom: 56, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 40, width: "100%" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: "#F2EDE7", letterSpacing: "0.25em", marginBottom: 6 }}>ELIA</p>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: "#C4896A", letterSpacing: "0.1em", fontStyle: "italic", marginBottom: 24 }}>Beauty That Heals</p>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 11, color: "#9B9590", lineHeight: 1.7 }}>
            ANSR™ — Aesthetic Nervous System Regulation<br />
            Based on research from Stanford, UCL, Max Planck Institute, and the Polyvagal Institute.<br />
            © ELIA / Uskale SA · All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
 
 
/* ════════════════════════════════════════════
   ROUTER — checks URL path
   ════════════════════════════════════════════ */
 
export default function App() {
  const isDelivery = typeof window !== "undefined" && window.location.pathname.includes("delivery");
  return isDelivery ? <ProfileDelivery /> : <ProfileLP />;
}
