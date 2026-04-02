import { useState, useEffect, useCallback, useMemo } from "react";

// ═══════════════════════════════════════
// DESIGN SYSTEM — Upgraded to match Pulse
// ═══════════════════════════════════════
const T = {
  bg: "#1A1714", accent: "#C4896A", accentBright: "#D4976F", text: "#F0E8DC", textMuted: "#B0A494", textDim: "#7A7068",
  border: "rgba(255,255,255,0.08)", warmWhite: "#FAF5EE", warmCharcoal: "#3A3530",
  accentSoft: "rgba(196,137,106,0.18)", accentGlow: "rgba(196,137,106,0.08)",
  // Chapter glows — 30% stronger than original
  chapterGlow: [
    "rgba(100,130,180,0.06)",
    "rgba(196,137,106,0.07)",
    "rgba(180,160,100,0.06)",
    "rgba(180,120,140,0.06)",
    "rgba(140,140,140,0.05)",
    "rgba(180,160,130,0.07)"
  ],
  f: {
    d: "'Cormorant Garamond', serif",
    b: "'EB Garamond', serif",
    ui: "'DM Sans', sans-serif"  // Added: matches Pulse
  },
};

// ═══════════════════════════════════════
// CHAPTERS
// ═══════════════════════════════════════
const CH = [
  { name:"Alertness", frame:"Your nervous system has a baseline state — a level of activation it returns to when nothing is happening. This chapter maps whether that baseline is calm, bracing, or stuck in survival mode." },
  { name:"Sensitivity", frame:"Sensitivity is the bandwidth of your experience — how much beauty, sensation, and feeling your nervous system allows through. This chapter maps what's still open and what's been turned down." },
  { name:"Vitality", frame:"Vitality isn't energy. It's your body's capacity to restore itself — to shift from spending to rebuilding. This chapter maps whether your system recovers, collapses, or just keeps running." },
  { name:"Connection", frame:"Connection isn't social skill. It's nervous system availability — whether you can receive, be seen, and stay present when it matters. This chapter maps the quality of your presence." },
  { name:"Performance", frame:"Performance isn't about output. It's about cost — what your work requires from your nervous system and what it's taken in return. This chapter maps the price." },
  { name:"Aliveness", frame:"Everything the first five chapters describe converges here. This chapter asks the deepest question: does your life still feel like yours?" },
];

// ═══════════════════════════════════════
// 42 QUESTIONS — 4 are sensory (6 options, flagged)
// ═══════════════════════════════════════
const Q = [
  // ─── CH0: ALERTNESS (7 questions) ───
  {c:0,t:"How do you breathe most of the day, honestly?",o:["I hold my breath more than I realise. Especially during tasks.","Steadily. My breathing feels natural and easy.","I don't know. I've never paid attention.","Shallow, high in my chest. I only notice when someone tells me to breathe."],s:["S","V","D","S"]},
  {c:0,t:"At night, when everything is quiet, what happens in your mind?",o:["It speeds up. The quiet makes the thoughts louder.","I fall asleep fast but wake at 3 or 4am with my mind already running","I need something. A podcast, a screen, wine. To fill the space.","It finally slows down. Silence is welcome."],s:["S","S","M","V"]},
  {c:0,t:"When was the last time your body fully let go? Not sleep, not vacation, but that feeling where nothing in you is bracing for anything?",o:["I honestly can't remember","Rarely. A moment here or there but it doesn't last.","This week. I know what that feels like.","I'm not sure what that would even feel like anymore"],s:["S","M","V","D"]},
  {c:0,t:"Look around your daily spaces right now. Your desk, your home, the screens you live in. What does your visual world actually look like?",o:["There's beauty in it. I've made spaces that give my eyes somewhere to rest","Clean but cold. Ordered, minimal, but nothing warm or beautiful.","Visually calm is rare. There's always something competing for my attention.","Functional but visually noisy. Cables, piles, tabs, nothing that feeds my eyes."],s:["V","M","S","S"]},
  {c:0,t:"When you finish a demanding day and finally sit down, what does your body do?",o:["It vibrates. I'm still running even though I've stopped moving.","It collapses. Not relaxes. Collapses. Like something that was held up by effort alone.","It settles gradually. I can feel the transition from doing to being","Nothing changes. My body doesn't register the difference between on and off."],s:["S","D","V","D"]},
  {c:0,t:"What is your relationship with adrenaline right now?",o:["I need it. Without urgency or pressure I feel flat and unmotivated","I'm drowning in it. My system is producing stress chemistry I can't switch off.","I don't feel it anymore. Even real emergencies don't produce the surge they used to.","I can access it when I need it and let it go when I don't"],s:["S","S","D","V"]},
  {c:0,t:"When was the last time you felt genuinely safe? Not protected, not defended, but safe in your body, with nothing to brace against?",o:["Recently. I know what safety feels like in my body.","On vacation or in a rare perfect moment. It exists but it's not daily.","I don't remember. I'm not sure my body knows the difference between stopping and collapsing.","It happens sometimes. And when it does, I notice how hungry I was for it."],s:["V","M","D","S"]},

  // ─── CH1: SENSITIVITY (7 questions, Q13 = sensory S1-C) ───
  {c:1,t:"Has your intuition changed over the past few years?",o:["It's gotten quieter. I used to feel things clearly, now I second-guess everything.","It's still there but I override it constantly with logic and analysis","I can't tell the difference between intuition and anxiety anymore","It's sharp. I trust what I feel and it's usually right"],s:["D","M","S","V"]},
  {c:1,t:"Your sensitivity to people, to beauty, to the energy of a room. Is it a strength or something you've had to manage?",o:["A strength. It's one of the most valuable things about me","Both. It's powerful but overwhelming, so I've turned it down.","I used to see it as a strength. Now I'm not sure it's still there.","Something to manage. Feeling too much has always been a liability."],s:["V","M","D","S"]},
  {c:1,t:"Where do you get your energy hits right now, honestly?",o:["From intensity. Adrenaline, dopamine, something strong enough to cut through.","From achievement. Closing something, finishing something.","From beauty, nature, meaningful conversations, sensory experiences","I don't get energy hits. I run on willpower and caffeine."],s:["S","M","V","D"]},
  {c:1,t:"When you walk into a room, a restaurant, an office, someone's home, do you feel the energy of the space?",o:["I used to. Now I mostly notice if it's functional or not.","Immediately. I feel whether a place is alive or dead before I can explain why.","Not really. A room is a room.","In strong environments I notice, otherwise I'm in my head"],s:["M","V","D","M"]},
  {c:1,t:"Think about your appetite for beauty right now. The desire to seek out something that moves you.",o:["The appetite is alive. I actively seek beauty and it feeds me.","It's there but I don't act on it. Beauty feels like a luxury I haven't earned.","I've stopped seeking. I wait for beauty to find me, and it rarely does.","I seek intensity instead. Beauty feels too slow, too quiet to reach me."],s:["V","M","D","S"]},
  {c:1,t:"When was the last time you cried? Not from frustration or exhaustion, but from being moved?",o:["It almost happened recently. I felt something rising but I shut it down.","I can't remember. I'm not sure my body produces those tears anymore.","I cry from stress but not from beauty. The tears I have are survival tears.","Recently. Music, a film, something beautiful broke through."],s:["M","D","S","V"]},
  {c:1,t:"When you are genuinely depleted, not tired from a long day, but deep-bone depleted, which of these becomes unbearable first?",sensory:true,
    o:["Light. Everything is too bright, too much visual information. You need darkness or soft light.","Noise. Sounds that are normally fine become piercing, voices grate. You need silence.","Temperature. You can't get comfortable, too hot or too cold. Your skin feels wrong.","Contact. Clothes feel abrasive, being touched is irritating. Physical contact is too much.","Smell. Ordinary scents become overpowering, food smells turn your stomach. Perfume is suffocating.","Nothing becomes unbearable. Everything just goes flat and grey"],
    s:["M","M","M","M","M","D"], sc:["V","A","M","S","O","D"]},

  // ─── CH2: VITALITY (7 questions, Q16 = sensory S3) ───
  {c:2,t:"What is true about sound in your daily life?",o:["I use sound to manage myself. Podcasts, playlists, background noise.","Noise sharpens me at first, then exhausts me","I have access to silence or sounds that nourish me","Silence is rare and I miss it. My nervous system craves quiet."],s:["M","S","V","S"]},
  {c:2,t:"How do you rest?",o:["I collapse. Couch, screen, wine, numb out.","I have things that genuinely restore me. Movement, a walk, music, time in beauty.","I don't. I switch from work tasks to life tasks and call that a break","I try to rest but my body doesn't know how to receive it"],s:["D","V","S","S"]},
  {c:2,t:"When your body begins to settle after sustained stress, not when you decide to relax, but when your system finally lets go on its own, what is usually present?",sensory:true,
    o:["Space. A wide view, an uncluttered room, sky. Your eyes soften and your visual field opens.","Sound. Music playing, rain, wind in trees, a specific voice. Your ears relax and your jaw unclenches.","Warmth. A shower running, a heated room, sun on your face. Your muscles release when temperature changes.","Weight or contact. A blanket, your own arms wrapped around yourself, feet on cool floor. Your body grounds through physical contact.","A scent. The air changes, you smell coffee or earth or a candle, and something in your chest releases.","My system doesn't let go on its own. I either push through or I crash. There's no gradual settling"],
    s:["M","M","M","M","M","D"], sc:["V","A","M","S","O","D"]},
  {c:2,t:"Your body has carried you through everything. How do you feel toward it right now?",o:["Grateful. It's given me more than I've given it back.","Disconnected. I live in my head and my body is just transport.","At war. I push it and it pushes back with pain and fatigue.","At home. I live in my body with respect and care."],s:["M","D","S","V"]},
  {c:2,t:"Describe your sleep in one honest sentence.",o:["I sleep enough hours but wake up tired. Quantity without quality.","I sleep well. I fall asleep easily, stay asleep, and wake rested.","My sleep is broken. 3am wake-ups, racing thoughts, or I need substances.","I sleep like the dead and still wake exhausted"],s:["M","V","S","D"]},
  {c:2,t:"In the last year, has your body been sending you signals you've been ignoring?",o:["Yes. Multiple signals, and I know exactly what they mean but I haven't stopped","Yes. But I've disconnected so much I only notice when something forces me to stop.","My body feels balanced. Signals come and I attend to them.","Some. I'm learning to listen and respond before they escalate."],s:["S","D","V","M"]},
  {c:2,t:"Think of the last time you were in a truly beautiful place. What happened in your body?",o:["I softened. My breathing changed, my shoulders dropped, something let go","I noticed it was beautiful but my body stayed the same","I felt a pang, almost like grief, because the contrast with my daily life was so sharp.","I can't remember the last time I was somewhere truly beautiful"],s:["V","S","M","D"]},

  // ─── CH3: CONNECTION (7 questions, Q27 = sensory S4) ───
  {c:3,t:"When things get tense with someone you care about, what does your body do?",o:["I stay present. I can hold tension without losing myself.","I shut down. I go quiet, I leave the room, or I agree just to end it.","I get sharp. My words become precise, controlled, designed to win.","I feel flooded. Emotion rises so fast I either explode or freeze."],s:["V","D","S","M"]},
  {c:3,t:"How are you at receiving? A compliment, a beautiful moment, help, being taken care of?",o:["It makes me uncomfortable. I'd rather be the one giving.","It doesn't land. People offer me things and I feel almost nothing.","I deflect. 'You didn't have to.' 'It's nothing.' 'I'm fine.\","I let it in. Beauty, kindness, care. Receiving feels natural and good."],s:["S","D","S","V"]},
  {c:3,t:"Your body has a bracing pattern, a place it holds tension habitually, even at rest. Which do you recognise?",o:["Jaw and face. I clench, I grind at night, my expression is controlled.","Throat and chest. There's a tightness around my heart that never fully opens.","Stomach and gut. I carry a knot that food, stress, and emotion all tighten.","I don't hold a fixed pattern. My body moves through tension and releases it."],s:["S","S","S","V"]},
  {c:3,t:"How do you experience physical closeness right now? Being held, being touched?",o:["I'm numb to it. Closeness doesn't register the way it used to.","I crave it. My body wants more closeness than I'm getting.","I avoid it. Letting someone that close requires something my system isn't offering.","I tolerate it. I'm there but not fully in my body when it happens."],s:["D","V","S","M"]},
  {c:3,t:"Do you feel lonely, not alone, but lonely, even when you're surrounded by people?",o:["Often. I'm in rooms full of people and fundamentally unreached.","Sometimes. There are moments of real connection but they're rarer than they should be.","Rarely. I feel genuinely connected to the people in my life.","I've stopped noticing. Loneliness requires a sensitivity I think I've shut down."],s:["D","M","V","D"]},
  {c:3,t:"When you share a moment of beauty with someone, a sunset, a piece of music, does it bring you closer?",o:["Sometimes. With the right person and my guard down, it opens something.","I experience it alone. Even with someone beside me, beauty is private now.","I don't share those moments anymore","It brings us closer. Shared beauty is one of the deepest ways I connect."],s:["M","D","D","V"]},
  {c:3,t:"Your nervous system carries a memory it may not have words for. Which of these descriptions produces the strongest physical response in your body, not the one you like best, but the one that makes something shift in your chest, your hands, or your breath?",sensory:true,
    o:["You are standing at a window at dawn. The sky is enormous. There is nothing between you and the horizon. The light is changing","A piece of music you haven't heard in years begins to play. The first four notes arrive and something inside you opens","You lower yourself into water that is exactly the right temperature. Your shoulders drop. The water holds your weight","Someone places a heavy hand on your shoulder. Steady. Warm. No words. Just weight. Your body exhales","You open a door and a scent you haven't encountered since childhood fills the room. Your whole body remembers before your mind can name what it is","None of these produced a noticeable physical response"],
    s:["M","M","M","M","M","D"], sc:["V","A","M","S","O","D"]},

  // ─── CH4: PERFORMANCE (7 questions) ───
  {c:4,t:"When you arrive at work, or open your laptop, who shows up?",o:["The version of me that gets things done. She's not the real me but she's very good.","Me. I bring the same person to work that I bring everywhere else.","I don't notice a shift anymore. The work version has become the only version.","Someone who's running on fumes but will never let anyone see it"],s:["M","V","D","S"]},
  {c:4,t:"What drives your performance right now, honestly?",o:["Fear. Of falling behind, being found out, losing what I've built.","Habit. I don't even know why I push this hard anymore.","Standards. I can't tolerate mediocrity, especially from myself.","Purpose. I believe in what I'm doing and it energises me."],s:["S","D","S","V"]},
  {c:4,t:"What has your career cost you that you don't talk about?",o:["Relationships. I've lost people or let them fade because work always won.","My health. My body is carrying the bill for my ambition.","Nothing I regret. The life I've built reflects who I am.","Myself. I've become someone I respect but don't fully recognise."],s:["S","S","V","D"]},
  {c:4,t:"When you imagine stepping off, just releasing the pressure for a season, what happens?",o:["Calm. I could do it and I'd be fine.","Panic. Who am I without this?","Nothing. I can't even imagine it.","Relief so deep it almost scares me"],s:["V","S","D","D"]},
  {c:4,t:"Beneath the pressure, there is a version of your work that you once loved. Can you still feel her?",o:["I catch glimpses. In rare moments when the pressure lifts.","Yes. I still love what I do when I can do it at my own rhythm.","I've replaced love with discipline. Excellent at what I do but I stopped loving it.","I can't feel anything about my work anymore. It's just what I do."],s:["M","V","S","D"]},
  {c:4,t:"If your title, your role, and your responsibilities were removed tomorrow, who would you be?",o:["I don't know. I cannot picture myself without my professional identity.","I'd be terrified. My identity is built on what I do, not who I am.","I'd be relieved. There's a whole person underneath that's been waiting.","I'd be lost at first, then curious. I sense there's someone in there."],s:["D","S","V","M"]},
  {c:4,t:"The pace you're running at right now. Is it yours?",o:["It's mine. I chose this pace and I can change it.","It was set years ago and I've never questioned it. Until now.","It's not mine. But I don't know how to change it without everything falling apart.","There is no pace. There's just constant, undifferentiated acceleration."],s:["V","M","S","S"]},

  // ─── CH5: ALIVENESS (7 questions, Q40 = sensory S2-A) ───
  {c:5,t:"When you look in the mirror, not at your face, but at your life, do you recognise the woman who built it?",o:["I recognise her but I don't like what it cost her to get here","I recognise her but she feels far away. Like someone I used to know.","I don't know who I'm looking at anymore","Yes. This life is mine and I feel it."],s:["S","M","D","V"]},
  {c:5,t:"What do you want right now? Not what you should want. What does the deepest part of you actually want?",o:["I want permission to stop. To not be strong for one day.","I know exactly what I want. And I'm moving toward it.","I don't know anymore. I've been living from obligation so long my desires went quiet.","I want to feel something again. Anything real."],s:["S","V","D","D"]},
  {c:5,t:"What is the most beautiful thing about you that has nothing to do with your achievements?",o:["My strength. I've carried more than most people could imagine.","My sensitivity. Even when it's muted, it's what makes me extraordinary.","My depth. I feel and think at a level most people never access.","I don't know. It's been so long since I thought about myself outside of what I accomplish."],s:["S","M","V","D"]},
  {c:5,t:"There is something in you that has survived everything. What is it?",o:["My care for others. Even depleted, I still show up for people.","My drive. I don't stop, even when I probably should.","I'm not sure anything survived. I feel like I'm running on empty.","My ability to feel. Even when it's quiet, it's never fully gone."],s:["M","S","D","V"]},
  {c:5,t:"If you could send a message to yourself from five years ago, what would you say?",o:["You're going to be okay. And you're going to find your way back.","It's going to cost you more than you think. Protect yourself.","I wouldn't know what to say. I can't remember who she was.","Don't lose her. The one who feels, who dreams, who sees beauty."],s:["V","S","D","M"]},
  {c:5,t:"Your nervous system has a physical response to beauty that you may never have noticed. Read each of these. Which one produces something in your body right now, not the one you find most appealing, but the one that makes something move in your chest, your throat, or your breath?",sensory:true,
    o:["Late afternoon light falling across a stone floor","The first note of a cello in an empty room","Stepping into the sea when the water is exactly your body's temperature and the boundary between you and it dissolves","A hand placed flat on warm, rough wood. The grain under your palm, the weight of your arm resting","Opening a window after rain and the earth exhaling","I read all of them. Nothing moved"],
    s:["M","M","M","M","M","D"], sc:["V","A","M","S","O","D"]},
  {c:5,t:"Right now, after everything you've just reflected on, what is your nervous system asking for?",o:["Permission. To slow down, to feel, to stop performing.","Beauty. Something that reaches past the walls and reminds me I'm alive.","Nothing. I feel at peace with where I am.","I still can't hear it. But taking this assessment is the first time I've tried to listen."],s:["S","M","V","D"],final:true},
];

// ═══════════════════════════════════════
// SCORING — DO NOT MODIFY
// ═══════════════════════════════════════
const SM = { V: 3, A: 2.5, M: 2, S: 1, O: 1.5, D: 0.5 };
const DK = ["alertness","sensitivity","vitality","connection","performance","aliveness"];
const DLL = ["Alertness","Sensitivity","Vitality","Connection","Performance","Aliveness"];
const DM = [0,0,0,0,0,0,0, 1,1,1,1,1,1,1, 2,2,2,2,2,2,2, 3,3,3,3,3,3,3, 4,4,4,4,4,4,4, 5,5,5,5,5,5,5];

function calcScores(ans) {
  const r = {}, q = {};
  DK.forEach(d => { r[d] = 0; q[d] = 0; });
  ans.forEach((a, i) => {
    if (i < 42) { const d = DK[DM[i]]; r[d] += SM[a] || 0; q[d]++; }
  });
  const s = {};
  DK.forEach(d => { const m = q[d] * 3; s[d] = m > 0 ? Math.round((r[d] / m) * 100) / 10 : 5; });
  return s;
}

function calcSensoryFromPicks(picks) {
  const counts = { V: 0, A: 0, M: 0, S: 0, O: 0, D: 0 };
  picks.forEach(ch => { if (counts.hasOwnProperty(ch)) counts[ch]++; });
  const tieOrder = ["S", "A", "M", "V", "O", "D"];
  let maxCount = 0;
  for (const ch of Object.keys(counts)) { if (counts[ch] > maxCount) maxCount = counts[ch]; }
  if (maxCount >= 2) {
    const candidates = Object.keys(counts).filter(ch => counts[ch] === maxCount);
    if (candidates.length === 1) return candidates[0];
    for (const ch of tieOrder) { if (candidates.includes(ch)) return ch; }
  }
  return "D";
}

// ═══════════════════════════════════════
// PROFILES — DO NOT MODIFY
// ═══════════════════════════════════════
const PR = {
  sunfire: { key: "sunfire", name: "Sunfire", tag: "Burns magnificent and unsustainable.", color: "#D4845A",
    desc: "Your nervous system is locked in activation. You perform at extraordinary levels but your body never comes down. Rest feels like failure. Stillness triggers anxiety.\n\nThe fire is real and extraordinary. People are drawn to your energy, your decisiveness. But the fire has been consuming its own fuel. Your body has been borrowing from tomorrow to pay for today.\n\nWhat looks like ambition is actually a nervous system that only feels safe when it's producing. Achievement has become your last remaining source of feeling alive.",
    hope: "The fire doesn't need to go out. It needs a hearth. Your system has extraordinary capacity — what it's missing is the ability to come down without collapsing." },
  velvetblade: { key: "velvetblade", name: "Velvet Blade", tag: "Elegant and dangerous. The danger is to yourself.", color: "#9B7A8F",
    desc: "You built armour out of elegance. Your composure is impeccable — the clothes, the poise, the controlled warmth that keeps everyone at exactly the right distance.\n\nBut the armour was never meant to be permanent. The sensitivity underneath — the depth, the feeling, the capacity for beauty — is still there. Behind glass.\n\nYou see beauty but you don't feel it in your body. You hear compliments but they don't land. The blade is the precision. The velvet is the disguise.",
    hope: "The woman underneath the elegance is still breathing. The practices that reach her don't ask you to dismantle the armour. They bypass it — through the body, through the senses, through doorways your system forgot to guard." },
  eclipse: { key: "eclipse", name: "Eclipse", tag: "The light didn't leave. Something moved in front of it.", color: "#6B7A8B",
    desc: "Something bright has been covered over. You function, you deliver, you show up. But the experience of being alive has gone flat. Food has less taste. Music doesn't move you.\n\nYour nervous system made an intelligent decision: faced with sustained pressure, it turned down the volume on everything. Sensation, emotion, beauty, desire — gone because they weren't essential for survival.\n\nYou are not broken. You are a nervous system in deep conservation mode — and conservation mode was designed to be temporary.",
    hope: "The light didn't leave. Your system protected it. The path back is through the body's oldest safety signals: warmth, gentle touch, micro-sensory experiences. One small beautiful thing at a time." },
  summerstorm: { key: "summerstorm", name: "Summer Storm", tag: "You feel everything. That's not the problem.", color: "#8B6B5C",
    desc: "Your sensitivity is fully alive — and it's flooding you. You absorb everything: tension, beauty, other people's pain. The world comes in too fast and too loud.\n\nYour sensitivity is not a defect — it's a nervous system capacity that most people have lost. You still feel spaces. You still feel people. You still feel beauty.\n\nThe problem isn't that you feel too much. It's that you have no container for it.",
    hope: "You don't need less feeling. You need a container strong enough to hold what you feel — so your sensitivity becomes a strength you can regulate, not a flood you survive." },
  heartwood: { key: "heartwood", name: "Heartwood", tag: "The one who holds everything up. The one nobody thinks to check on.", color: "#7A8B5B",
    desc: "The densest, strongest part of the tree — the part that holds everything up. Nobody sees it.\n\nYou give, organise, carry, show up. You create beautiful experiences for everyone around you. And the care flows one way. Out. Never in.\n\nThe question your pattern asks: when was the last time anything was for you?",
    hope: "The beauty and care you create for others is the exact medicine your own nervous system is missing. Redirecting even a fraction of it inward is not selfish. It's the beginning of sustainability." },
  newmoon: { key: "newmoon", name: "New Moon", tag: "Invisible — but already pulling the tide.", color: "#5B7A7A",
    desc: "Something is shifting. Not dramatic — more like a direction. A quiet knowing that the way you've been living isn't the way you want to keep living. Your sensitivity is flickering back on.\n\nThe New Moon pattern means your nervous system is in transition. Old patterns are loosening. You're beginning to feel things you haven't felt in years.\n\nThis is the most delicate moment. The shift is genuine but fragile.",
    hope: "What's stirring in you is not a crisis. It's an emergence. Don't turn the awakening into a to-do list. Let your nervous system show you the pace." },
};

// ═══════════════════════════════════════
// SENSORY CHANNEL DATA
// ═══════════════════════════════════════
const SENSORY = {
  V: { name: "Light & Space", desc: "Your nervous system finds its way back through visual openness — horizons, natural light, uncluttered space." },
  A: { name: "Sound & Voice", desc: "Your nervous system regulates through auditory input — music, prosody, silence, the human voice at specific frequencies." },
  M: { name: "Water & Warmth", desc: "Your nervous system finds its way back through thermal and aquatic sensation — showers, baths, the sea, warmth against skin." },
  S: { name: "Touch & Texture", desc: "Your nervous system finds its way back through tactile sensation — weight, fabric, stone, warmth in the hands." },
  O: { name: "Scent & Breath", desc: "Your nervous system regulates through olfactory input — essential oils, earth after rain, wood, coffee, skin." },
  D: { name: "Signal Lost", desc: "Your nervous system doesn't currently have a reliable sensory channel for regulation. The channels are dormant, not broken." },
};

// ═══════════════════════════════════════
// PROFILE ASSIGNMENT — DO NOT MODIFY
// ═══════════════════════════════════════
function assignProfile(s) {
  const avg = DK.reduce((sum, k) => sum + s[k], 0) / 6;
  const vals = DK.map(k => s[k]);
  const rng = Math.max(...vals) - Math.min(...vals);
  const variance = vals.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / 6;
  const sd = Math.sqrt(variance);
  const bands = {};
  DK.forEach(k => { const v = s[k]; bands[k] = v <= 2.5 ? "Contracted" : v <= 5 ? "Compressed" : v <= 7.5 ? "Emerging" : "Open"; });
  const contracted = Object.values(bands).filter(b => b === "Contracted").length;
  const compressed = Object.values(bands).filter(b => b === "Compressed").length;
  const emerging = Object.values(bands).filter(b => b === "Emerging").length;
  const openCount = Object.values(bands).filter(b => b === "Open").length;
  let primary = null;
  const otherAvg = (DK.reduce((sum, k) => sum + s[k], 0) - s.sensitivity) / 5;
  const sensDominates = s.sensitivity >= 7.5 && (s.sensitivity - otherAvg) > 2.5;
  if (s.aliveness >= 6.0 && !sensDominates && (emerging + openCount) >= 2 && (contracted + compressed) >= 2 && rng >= 2.5) primary = "newmoon";
  else if (sd >= 1.8 && rng >= 4.0 && (emerging + openCount) >= 2 && contracted <= 2 && compressed >= 1 && !sensDominates) primary = "newmoon";
  if (!primary) { if (s.sensitivity <= 3.5 && s.vitality <= 4.0 && s.aliveness <= 3.5 && s.connection <= 4.0 && avg <= 4.5) primary = "eclipse"; else if (contracted + compressed >= 5 && avg <= 3.5) primary = "eclipse"; }
  if (!primary) { if (s.alertness <= 4.0 && s.performance >= 6.5) primary = "sunfire"; else if (s.alertness <= 3.5 && s.performance >= 5.0) primary = "sunfire"; else if (s.performance >= 7.0 && s.vitality <= 4.5 && s.alertness <= 4.5) primary = "sunfire"; }
  if (!primary) { if (s.sensitivity <= 4.5 && s.connection <= 5.0 && s.sensitivity <= s.connection + 1.0) primary = "velvetblade"; else if (s.sensitivity <= 3.5) primary = "velvetblade"; }
  if (!primary) { if (s.sensitivity >= 5.5 && s.alertness <= 5.0 && s.vitality <= 5.5) primary = "summerstorm"; else if (s.sensitivity >= 6.5) primary = "summerstorm"; }
  if (!primary) { if (s.connection <= 5.0 && s.aliveness <= 5.0 && s.connection <= s.sensitivity) primary = "heartwood"; else if (s.connection <= 4.0 && s.aliveness <= 4.5) primary = "heartwood"; }
  if (!primary) {
    const w = {};
    w.sunfire = (10 - s.alertness) * 2 + s.performance + (10 - s.vitality);
    w.velvetblade = (10 - s.sensitivity) * 2 + s.alertness + (10 - s.connection);
    w.eclipse = (10 - s.sensitivity) + (10 - s.vitality) + (10 - s.aliveness) + (10 - s.connection);
    w.summerstorm = s.sensitivity * 2 + (10 - s.alertness) + (10 - s.vitality);
    w.heartwood = (10 - s.connection) * 2 + (10 - s.aliveness) + s.performance * 0.5;
    w.newmoon = (Math.abs(avg - 5.5) < 2 ? 15 : 5) + (s.sensitivity > 5 ? 5 : 0) + (s.aliveness > 5 ? 5 : 0);
    primary = Object.entries(w).sort((a, b) => b[1] - a[1])[0][0];
  }
  return PR[primary] || PR.newmoon;
}

function getSecondary(s, primaryKey) {
  const avg = DK.reduce((sum, k) => sum + s[k], 0) / 6;
  const w = {};
  w.sunfire = (10 - s.alertness) * 2 + s.performance + (10 - s.vitality);
  w.velvetblade = (10 - s.sensitivity) * 2 + s.alertness + (10 - s.connection);
  w.eclipse = (10 - s.sensitivity) + (10 - s.vitality) + (10 - s.aliveness) + (10 - s.connection);
  w.summerstorm = s.sensitivity * 2 + (10 - s.alertness) + (10 - s.vitality);
  w.heartwood = (10 - s.connection) * 2 + (10 - s.aliveness) + s.performance * 0.5;
  w.newmoon = (Math.abs(avg - 5.5) < 2 ? 15 : 5) + (s.sensitivity > 5 ? 5 : 0) + (s.aliveness > 5 ? 5 : 0);
  delete w[primaryKey];
  return PR[Object.entries(w).sort((a, b) => b[1] - a[1])[0][0]];
}

const REFPATTERNS = {
  sunfire: { alertness: 3.0, sensitivity: 4.0, vitality: 3.0, connection: 4.5, performance: 8.0, aliveness: 3.5 },
  velvetblade: { alertness: 5.0, sensitivity: 3.0, vitality: 5.0, connection: 3.5, performance: 6.5, aliveness: 4.0 },
  eclipse: { alertness: 3.5, sensitivity: 2.5, vitality: 3.0, connection: 3.0, performance: 4.5, aliveness: 2.0 },
  summerstorm: { alertness: 4.0, sensitivity: 7.5, vitality: 4.0, connection: 5.5, performance: 5.0, aliveness: 5.5 },
  heartwood: { alertness: 5.0, sensitivity: 5.0, vitality: 4.5, connection: 3.0, performance: 5.5, aliveness: 3.5 },
  newmoon: { alertness: 5.0, sensitivity: 6.0, vitality: 5.5, connection: 4.0, performance: 5.0, aliveness: 7.0 },
};

// Dimension insights
const gB = sc => sc <= 2.5 ? "Contracted" : sc <= 5 ? "Compressed" : sc <= 7.5 ? "Emerging" : "Open";
const INSIGHTS = {
  alertness: { Contracted: "Your nervous system is in survival mode. The activation has become your baseline.", Compressed: "Your system runs hot but controlled. You never fully leave pressure mode.", Emerging: "Your system can find calm — but it takes effort. The capacity is returning.", Open: "Your alertness is well-regulated. You activate when needed and return to baseline naturally." },
  sensitivity: { Contracted: "Your sensory bandwidth has narrowed dramatically. Beauty arrives but doesn't land in your body.", Compressed: "You sense through a filter. Strong experiences get through — subtle ones don't.", Emerging: "Your sensitivity is coming back online. When beauty breaks through, you feel what you've missed.", Open: "Your aesthetic channels are alive. Beauty reaches your body. This is rare and precious." },
  vitality: { Contracted: "Your body is in restoration deficit. Sleep doesn't restore. Energy is borrowed, not generated.", Compressed: "You manage declining energy. The tank refills to 60%, never 100%.", Emerging: "Restoration capacity is returning. Some days, energy feels genuine rather than manufactured.", Open: "Your vitality system works. Your body recovers. You know rest from collapse." },
  connection: { Contracted: "You've withdrawn from connection to conserve energy. Care flows out, not in.", Compressed: "You're present but not fully available. Part of you is behind glass.", Emerging: "Connection is available but requires conditions your life rarely provides.", Open: "Your capacity for genuine connection is intact. You can receive, be seen, and stay present." },
  performance: { Contracted: "Work is your last source of feeling. Achievement replaced aliveness.", Compressed: "You perform well but the cost escalates. The mask gets heavier each year.", Emerging: "You're beginning to question the relationship between identity and output.", Open: "Work feels sustainable. Purpose drives you, not fear or habit." },
  aliveness: { Contracted: "Joy, desire, beauty, purpose — gone quiet. You function but don't feel alive.", Compressed: "Aliveness visits in flashes — a sunset, a conversation, a rare moment of stillness.", Emerging: "Something is stirring. Your system is beginning to remember what it turned off.", Open: "You feel alive. Beauty moves you. Joy arrives without needing achievement to justify it." },
};

// Matched practices
const PRACTICES = {
  sunfire: [
    { n: "The Extended Exhale", d: "In 4, out 8. This ratio activates the vagal brake. Two minutes before sleep." },
    { n: "Deliberate Deceleration", d: "Add 30 seconds of complete stillness between two daily transitions. Just stopping." },
    { n: "Warm Descent", d: "Hold something warm before sleep — a cup, your own hands on your chest. Warmth signals safety." },
  ],
  velvetblade: [
    { n: "The Unguarded Minute", d: "Once a day, let your face go completely soft. Unclench the jaw. Let the eyes unfocus. The muscles of your face are directly wired to your vagal nerve." },
    { n: "Receive Without Composing", d: "The next time something beautiful appears, do not compose a response. Just let it land in your body without your mind organising the experience." },
    { n: "The Unperformed Moment", d: "Find 5 minutes alone where you are not performing for anyone — including yourself." },
  ],
  eclipse: [
    { n: "The Warm Anchor", d: "Place your hand on your chest for 90 seconds. This activates C-tactile afferent nerves. Every day. The same spot." },
    { n: "One Beautiful Thing", d: "Each morning, find one thing that is beautiful. Notice it with your body, not your mind." },
    { n: "The Slow Return", d: "Don't force feeling. Let sensation arrive in its own time. One small beautiful thing at a time." },
  ],
  summerstorm: [
    { n: "The Container", d: "Place both hands on your sternum. Press gently. Breathe into the pressure. This gives your sensitivity edges." },
    { n: "Sensory Boundaries", d: "Before entering a stimulating environment: both hands on sternum, one breath, 'I feel what's mine. I release what's not.'" },
    { n: "Structured Beauty", d: "Seek beauty that has a beginning and an end — a piece of music, a walk with a destination." },
  ],
  heartwood: [
    { n: "First Beautiful Thing That's Yours", d: "Before you do anything for anyone else, give yourself one beautiful sensory experience." },
    { n: "Receive Without Reciprocating", d: "The next time someone offers you something, receive it without giving anything back. Just 'thank you' and silence." },
    { n: "The Boundary of Beauty", d: "Create one space in your life that exists only for you. Not a room for the family. A space that is beautiful and functional only for you." },
  ],
  newmoon: [
    { n: "The Question Beneath", d: "When an impulse arrives, pause. Ask: what is my nervous system asking for right now?" },
    { n: "Follow Beauty as Compass", d: "Notice what draws you. Don't analyse why. Beauty is your nervous system pointing toward what it needs." },
    { n: "Protect the Stirring", d: "Don't turn the emergence into a to-do list. Let it be private until it's strong enough to survive contact with the world." },
  ],
};

// ═══════════════════════════════════════
// COMPONENT — Upgraded design
// ═══════════════════════════════════════
export default function ANSRAssessment() {
  const [scr, setScr] = useState("welcome");
  const [qi, setQi] = useState(0);
  const [ans, setAns] = useState([]);
  const [ch, setCh] = useState(0);
  const [cqi, setCqi] = useState(0);
  const [scores, setScores] = useState(null);
  const [prof, setProf] = useState(null);
  const [sec, setSec] = useState(null);
  const [sensoryType, setSensoryType] = useState("D");
  const [sensoryPicks, setSensoryPicks] = useState([]);
  const [userName, setUserName] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [saved, setSaved] = useState(false); // Upgrade 6: progress saved indicator

  // Answer randomization — seeded per session
  const [sessionSeed] = useState(() => Math.floor(Math.random() * 10000));
  const shuffledOrders = useMemo(() => {
    function seededShuffle(arr, seed) {
      const a = [...arr]; let s = seed;
      for (let i = a.length - 1; i > 0; i--) { s = (s * 16807 + 0) % 2147483647; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }
    return Q.map((q, qi) => seededShuffle(q.o.map((_, i) => i), sessionSeed + qi * 137));
  }, [sessionSeed]);

  // XSS + token check
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const rawName = params.get("name") || "";
      const clean = rawName.replace(/<[^>]*>/g, "").replace(/[<>"'&]/g, "").replace(/[\n\r\t]/g, " ").trim().slice(0, 100);
      setUserName(clean || "");
      const token = params.get("t");
      const host = window.location.hostname || "";
      const isDev = host === "localhost" || host === "127.0.0.1" || !window.location.search || host.includes("claude.ai") || host.includes("anthropic") || host.includes("vercel.app") || window.self !== window.top;
      if (!isDev && !token) setAccessDenied(true);
    } catch (e) {}
  }, []);

  // localStorage save/resume
  useEffect(() => {
    try {
      const s = localStorage.getItem("ansr_profile_progress");
      if (s) { const d = JSON.parse(s); if (d.ans && d.ans.length > 0 && d.ans.length < 42) { setAns(d.ans); setQi(d.qi || 0); setCh(d.ch || 0); setCqi(d.cqi || 0); if (d.sensoryPicks) setSensoryPicks(d.sensoryPicks); setScr("resume"); } }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (ans.length > 0 && ans.length < 42) {
      try { localStorage.setItem("ansr_profile_progress", JSON.stringify({ ans, qi, ch, cqi, sensoryPicks })); } catch (e) {}
      // Upgrade 6: show "Progress saved" briefly
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 1500);
      return () => clearTimeout(t);
    }
    if (ans.length >= 42) { try { localStorage.removeItem("ansr_profile_progress"); } catch (e) {} }
  }, [ans, qi, ch, cqi, sensoryPicks]);

  // Preload jsPDF at chapter 4
  useEffect(() => {
    if (ch >= 3 && typeof window !== "undefined" && !window.jspdf) {
      const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.async = true; document.head.appendChild(s);
    }
  }, [ch]);

  const chQ = Q.filter(q => q.c === ch);
  const curQ = chQ[cqi];
  const isLast = cqi === chQ.length - 1;
  const [tappedIdx, setTappedIdx] = useState(-1);

  const onAns = useCallback((dimCode, sensoryCh) => {
    const na = [...ans, dimCode]; setAns(na);
    if (sensoryCh) { const sp = [...sensoryPicks, sensoryCh]; setSensoryPicks(sp); }
    if (isLast) {
      if (ch === 5) {
        try {
          const s = calcScores(na); setScores(s);
          const p = assignProfile(s); setProf(p);
          setSec(getSecondary(s, p.key));
          const finalPicks = sensoryCh ? [...sensoryPicks, sensoryCh] : sensoryPicks;
          setSensoryType(calcSensoryFromPicks(finalPicks));
        } catch (e) { console.error(e); }
        setScr("gen");
      } else { setScr("breath"); }
    } else { setCqi(cqi + 1); }
    setQi(qi + 1); setTappedIdx(-1);
  }, [ans, sensoryPicks, isLast, ch, cqi, qi]);

  const onBack = useCallback(() => {
    if (cqi > 0) {
      setTappedIdx(-1);
      const prevQ = chQ[cqi - 1];
      if (prevQ && prevQ.sensory && sensoryPicks.length > 0) setSensoryPicks(sensoryPicks.slice(0, -1));
      setAns(ans.slice(0, -1)); setCqi(cqi - 1); setQi(qi - 1);
    }
  }, [ans, cqi, qi, chQ, sensoryPicks]);

  const nextCh = useCallback(() => { setCh(ch + 1); setCqi(0); setScr("chcard"); }, [ch]);

  // Webhook
  const sendWebhook = useCallback((profileData) => {
    try {
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email") || "";
      const token = params.get("t") || "";
      const sc = profileData.scores;
      const avg = DK.reduce((s, k) => s + sc[k], 0) / 6;
      const bands = DK.map(k => { const v = sc[k]; return v <= 2.5 ? "C" : v <= 5 ? "Co" : v <= 7.5 ? "E" : "O"; }).join("/");
      const payload = { timestamp: new Date().toISOString(), name: userName, email, primary: profileData.prof.name, secondary: profileData.sec.name, sensory: profileData.sensory, alertness: sc.alertness, sensitivity: sc.sensitivity, vitality: sc.vitality, connection: sc.connection, performance: sc.performance, aliveness: sc.aliveness, average: Math.round(avg * 10) / 10, band_dist: bands, source: "ansr-profile", payment: "kajabi", token };
      fetch("https://hooks.zapier.com/hooks/catch/26745547/uxk9ayd/", { method: "POST", body: new URLSearchParams(payload).toString(), headers: { "Content-Type": "application/x-www-form-urlencoded" } }).catch(() => {});
      fetch("https://web-production-305eb4.up.railway.app/generate-and-send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: userName, email, primary: profileData.prof.key, secondary: profileData.sec.key, sensory: profileData.sensory, scores: profileData.scores, token }) }).catch(() => {});
    } catch (e) {}
  }, [userName]);

  useEffect(() => {
    if (scr === "results" && prof && sec && scores) sendWebhook({ prof, sec, sensory: sensoryType, scores });
  }, [scr, prof, sec, scores, sensoryType, sendWebhook]);

  // ═══════════════════════════════════════
  // BREATHING TRANSITION — ELIA orbit (matches Pulse)
  // ═══════════════════════════════════════
  const Breath = ({ onDone }) => {
    const [op, setOp] = useState(0);
    const [deg, setDeg] = useState(0);
    useEffect(() => {
      setTimeout(() => setOp(1), 100);
      const i = setInterval(() => setDeg(d => d + 0.85), 16);
      const t = setTimeout(() => { setOp(0); setTimeout(onDone, 600); }, 4200);
      return () => { clearInterval(i); clearTimeout(t); };
    }, [onDone]);
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", opacity: op, transition: "opacity 0.6s" }}>
        <div style={{ position: "relative", width: 140, height: 140 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 2 }}>
            <p style={{ fontFamily: T.f.d, fontSize: 28, fontWeight: 400, color: T.text, letterSpacing: "0.35em", margin: 0, opacity: 0.8 }}>ELIA</p>
          </div>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: `rotate(${deg}deg)`, transition: "none" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, borderRadius: "50%", background: T.accent, opacity: 0.6 }} />
          </div>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "50%", border: `1px solid ${T.accent}`, opacity: 0.15 }} />
          <div style={{ position: "absolute", top: "15%", left: "15%", right: "15%", bottom: "15%", borderRadius: "50%", border: `1px solid ${T.accent}`, opacity: 0.25 }} />
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════
  // GENERATION SCREEN — orbit → profile reveal → chime
  // ═══════════════════════════════════════
  const Gen = ({ onDone }) => {
    const [ph, setPh] = useState(0);
    const [deg, setDeg] = useState(0);
    useEffect(() => {
      const i = setInterval(() => setDeg(d => d + 0.6), 16);
      setTimeout(() => setPh(1), 3000);
      setTimeout(() => setPh(2), 5000);
      setTimeout(() => setPh(3), 7000);
      return () => clearInterval(i);
    }, []);
    const playChimeAndReveal = () => {
      try {
        const c = new (window.AudioContext || window.webkitAudioContext)();
        const t = c.currentTime;
        const o1 = c.createOscillator(); const g1 = c.createGain();
        o1.connect(g1); g1.connect(c.destination);
        o1.frequency.setValueAtTime(528, t); o1.type = "sine";
        g1.gain.setValueAtTime(0, t); g1.gain.linearRampToValueAtTime(0.006, t + 1.0);
        g1.gain.linearRampToValueAtTime(0.004, t + 2.5); g1.gain.exponentialRampToValueAtTime(0.0001, t + 5.0);
        o1.start(t); o1.stop(t + 4.5);
        const o2 = c.createOscillator(); const g2 = c.createGain();
        o2.connect(g2); g2.connect(c.destination);
        o2.frequency.setValueAtTime(1056, t); o2.type = "sine";
        g2.gain.setValueAtTime(0, t); g2.gain.linearRampToValueAtTime(0.002, t + 1.5);
        g2.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);
        o2.start(t + 0.3); o2.stop(t + 4.0);
      } catch (e) {}
      onDone();
    };
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center" }}><div>
        {ph < 1 && <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 40px" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 2 }}>
            <p style={{ fontFamily: T.f.d, fontSize: 28, fontWeight: 400, color: T.text, letterSpacing: "0.35em", margin: 0, opacity: 0.8 }}>ELIA</p></div>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: `rotate(${deg}deg)` }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, borderRadius: "50%", background: T.accent, opacity: 0.6 }} /></div>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "50%", border: `1px solid ${T.accent}`, opacity: 0.12 }} /></div>}
        <p style={{ fontFamily: T.f.b, fontSize: 14, color: T.textMuted, letterSpacing: "0.12em", marginBottom: 40, opacity: ph < 1 ? 1 : 0, transition: "opacity 0.8s" }}>Assembling your ANSR Profile...</p>
        <p style={{ fontFamily: T.f.d, fontSize: 28, fontWeight: 400, color: T.text, letterSpacing: "0.35em", marginBottom: 40, opacity: ph >= 1 ? 0.5 : 0, transition: "opacity 1.2s" }}>ELIA</p>
        <p style={{ fontFamily: T.f.d, fontSize: 48, fontWeight: 300, color: prof ? prof.color : T.text, letterSpacing: "0.04em", marginBottom: 14, opacity: ph >= 1 ? 1 : 0, transition: "opacity 1.5s" }}>{prof ? prof.name : ""}</p>
        <p style={{ fontFamily: T.f.b, fontSize: 18, color: T.textMuted, fontStyle: "italic", opacity: ph >= 2 ? 1 : 0, transition: "opacity 1.2s" }}>{sec ? `with ${sec.name} undertone` : ""}</p>
        {ph >= 3 && <button onClick={playChimeAndReveal} style={{ fontFamily: T.f.d, fontSize: 15, letterSpacing: "0.12em", marginTop: 48, background: T.warmWhite, border: "none", color: T.warmCharcoal, padding: "13px 36px", cursor: "pointer", borderRadius: 6, animation: "fadeIn 1s ease" }}>Reveal My Profile</button>}
      </div></div>
    );
  };

  // ═══════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════
  const sensoryData = SENSORY[sensoryType] || SENSORY.D;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text, position: "relative" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet" />
      {/* Noise texture */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", opacity: 0.035, zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />
      {/* Chapter ambient glow — Upgrade 5: stronger */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0, background: `radial-gradient(ellipse at 50% 40%, ${T.chapterGlow[ch]}, transparent 70%)`, transition: "background 2s ease" }} />

      {/* Upgrade 6: Progress saved indicator */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 100, fontFamily: T.f.ui, fontSize: 11, color: T.accent, letterSpacing: "0.08em", opacity: saved ? 0.7 : 0, transition: "opacity 0.5s ease", pointerEvents: "none" }}>Progress saved</div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ACCESS DENIED */}
        {accessDenied && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "48px 24px" }}>
            <div style={{ textAlign: "center", maxWidth: 440 }}>
              <p style={{ fontFamily: T.f.d, fontSize: 28, fontWeight: 400, color: T.text, letterSpacing: "0.35em", marginBottom: 40 }}>ELIA</p>
              <p style={{ fontFamily: T.f.b, fontSize: 16, color: T.textMuted, lineHeight: 1.8, marginBottom: 20 }}>This assessment requires a valid access link.</p>
              <p style={{ fontFamily: T.f.b, fontSize: 14, color: T.textDim, lineHeight: 1.7, marginBottom: 40 }}>If you've purchased your ANSR Profile, check your email for the access link.</p>
              <a href="https://beauty.eliaheals.com/elia-ansr-profile" style={{ fontFamily: T.f.d, fontSize: 14, letterSpacing: "0.12em", border: `1px solid ${T.accent}`, color: T.accent, padding: "14px 40px", textDecoration: "none", borderRadius: 2 }}>Get Your ANSR Profile</a>
            </div>
          </div>
        )}

        {/* RESUME */}
        {scr === "resume" && !accessDenied && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "48px 24px" }}>
            <div style={{ textAlign: "center", maxWidth: 440 }}>
              <p style={{ fontFamily: T.f.d, fontSize: 28, fontWeight: 400, color: T.text, letterSpacing: "0.35em", marginBottom: 40 }}>ELIA</p>
              <p style={{ fontFamily: T.f.b, fontSize: 16, color: T.text, lineHeight: 1.8, marginBottom: 12 }}>Welcome back.</p>
              <p style={{ fontFamily: T.f.b, fontSize: 14, color: T.textMuted, lineHeight: 1.7, marginBottom: 40 }}>You have {ans.length} of 42 questions completed.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <button onClick={() => setScr("chcard")} style={{ fontFamily: T.f.d, fontSize: 14, letterSpacing: "0.12em", background: "transparent", border: `1px solid ${T.accent}`, color: T.accent, padding: "14px 40px", cursor: "pointer", borderRadius: 2 }}>Continue</button>
                <button onClick={() => { setAns([]); setQi(0); setCh(0); setCqi(0); setSensoryPicks([]); try { localStorage.removeItem("ansr_profile_progress"); } catch (e) {} setScr("welcome"); }} style={{ fontFamily: T.f.b, fontSize: 12, color: T.textDim, background: "transparent", border: "none", cursor: "pointer", padding: "8px 24px" }}>Start over</button>
              </div>
            </div>
          </div>
        )}

        {/* WELCOME — The Aman lobby moment */}
        {!accessDenied && scr === "welcome" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "48px 24px", animation: "fadeIn 1.8s ease" }}>
            <div style={{ textAlign: "center", maxWidth: 480 }}>
              {/* Orbit motif */}
              <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 48px" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${T.accent}`, opacity: 0.15 }} />
                <div style={{ position: "absolute", inset: "18%", borderRadius: "50%", border: `1px solid ${T.accent}`, opacity: 0.25 }} />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 6, height: 6, borderRadius: "50%", background: T.accent, opacity: 0.5 }} />
              </div>
              <p style={{ fontFamily: T.f.d, fontSize: 42, fontWeight: 400, color: "#F0E8DC", letterSpacing: "0.4em", marginBottom: 20 }}>ELIA</p>
              <p style={{ fontFamily: T.f.b, fontSize: 14, color: T.accent, letterSpacing: "0.15em", fontStyle: "italic", marginBottom: 56 }}>Beauty That Heals</p>
              <div style={{ width: 48, height: 1, background: T.accent, margin: "0 auto 56px", opacity: 0.4 }} />
              <p style={{ fontFamily: T.f.d, fontSize: 26, fontWeight: 300, color: "#F0E8DC", lineHeight: 1.5, letterSpacing: "0.04em", marginBottom: 12 }}>Your ANSR Profile</p>
              <p style={{ fontFamily: T.f.b, fontSize: 15, color: T.textMuted, lineHeight: 1.7, marginBottom: 56 }}>42 questions across six dimensions</p>
              {userName && <p style={{ fontFamily: T.f.d, fontSize: 16, color: T.accent, letterSpacing: "0.12em", marginBottom: 48, opacity: 0.7 }}>Prepared for {userName.split(" ")[0]}</p>}
              <button onClick={() => setScr("intention")} style={{ fontFamily: T.f.d, fontSize: 16, letterSpacing: "0.15em", background: T.warmWhite, border: "none", color: T.warmCharcoal, padding: "18px 56px", cursor: "pointer", borderRadius: 2, transition: "all 0.4s ease" }}
                onMouseEnter={(e) => { e.target.style.background = "#FFFFFF"; }}
                onMouseLeave={(e) => { e.target.style.background = T.warmWhite; }}>Begin</button>
              <p style={{ fontFamily: T.f.ui, fontSize: 11, color: T.textDim, marginTop: 24, letterSpacing: "0.04em" }}>~12 minutes · Your progress saves automatically</p>
            </div>
          </div>
        )}

        {/* INTENTION */}
        {scr === "intention" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "48px 24px" }}>
            <div style={{ textAlign: "center", maxWidth: 460 }}>
              <p style={{ fontFamily: T.f.d, fontSize: 32, fontWeight: 400, color: "#F0E8DC", letterSpacing: "0.35em", marginBottom: 56 }}>ELIA</p>
              <div style={{ width: 32, height: 1, background: T.accent, margin: "0 auto 48px", opacity: 0.35 }} />
              <p style={{ fontFamily: T.f.d, fontSize: 26, fontWeight: 300, color: "#F0E8DC", lineHeight: 1.7, marginBottom: 20 }}>Find a place that feels good.</p>
              <p style={{ fontFamily: T.f.b, fontSize: 16, color: T.textMuted, lineHeight: 2.0, marginBottom: 12 }}>This assessment works best when your body is comfortable</p>
              <p style={{ fontFamily: T.f.b, fontSize: 16, color: T.textMuted, lineHeight: 2.0, marginBottom: 56 }}>and your phone is the only screen.</p>
              <div style={{ width: 32, height: 1, background: T.accent, margin: "0 auto 48px", opacity: 0.15 }} />
              <button onClick={() => setScr("chcard")} style={{ fontFamily: T.f.d, fontSize: 15, letterSpacing: "0.12em", color: T.warmCharcoal, background: T.warmWhite, border: "none", cursor: "pointer", padding: "15px 44px", borderRadius: 2 }}>I'm ready</button>
            </div>
          </div>
        )}

        {/* CHAPTER CARD */}
        {scr === "chcard" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "48px 24px" }}>
            <div style={{ textAlign: "center", maxWidth: 480 }}>
              <p style={{ fontFamily: T.f.d, fontSize: 30, fontWeight: 400, color: "#F0E8DC", letterSpacing: "0.35em", marginBottom: 32 }}>ELIA</p>
              <p style={{ fontFamily: T.f.ui, fontSize: 12, color: T.accent, letterSpacing: "0.2em", marginBottom: 24 }}>Chapter {ch + 1} of 6</p>
              <p style={{ fontFamily: T.f.d, fontSize: 44, fontWeight: 300, color: T.text, letterSpacing: "0.06em", marginBottom: 28 }}>{CH[ch].name}</p>
              <div style={{ width: 32, height: 1, background: T.accent, margin: "0 auto 32px", opacity: 0.3 }} />
              <p style={{ fontFamily: T.f.b, fontSize: 16, color: T.textMuted, lineHeight: 1.9, letterSpacing: "0.015em", marginBottom: 48, maxWidth: 400, margin: "0 auto 48px" }}>{CH[ch].frame}</p>
              <button onClick={() => setScr("q")} style={{ fontFamily: T.f.d, fontSize: 15, letterSpacing: "0.12em", color: T.warmCharcoal, background: T.warmWhite, border: "none", cursor: "pointer", padding: "13px 36px", borderRadius: 6 }}>Continue</button>
            </div>
          </div>
        )}

        {/* QUESTIONS — Upgraded with ELIA logo, progress dots, chapter counter, DM Sans buttons */}
        {scr === "q" && curQ && (() => {
          const globalIdx = ch * 7 + cqi;
          const order = shuffledOrders[globalIdx] || curQ.o.map((_, i) => i);
          return (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh", padding: curQ.final ? "60px 24px" : "48px 24px", maxWidth: 580, margin: "0 auto" }}>
            {/* ELIA logo — prominent, ivory */}
            <p style={{ fontFamily: T.f.d, fontSize: 28, fontWeight: 400, color: "#F0E8DC", letterSpacing: "0.35em", textAlign: "center", marginBottom: 32 }}>ELIA</p>
            {/* Chapter counter — visible ivory */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {cqi > 0 && (<button onClick={onBack} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontFamily: T.f.b, fontSize: 13, padding: "4px 0", transition: "color 0.3s ease" }} onMouseEnter={(e) => { e.target.style.color = T.accent; }} onMouseLeave={(e) => { e.target.style.color = T.textDim; }}>←</button>)}
                <span style={{ fontFamily: T.f.ui, fontSize: 12, color: T.accent, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>{CH[ch].name}</span>
              </div>
              <span style={{ fontFamily: T.f.ui, fontSize: 12, color: "#F0E8DC", letterSpacing: "0.08em", opacity: 0.7 }}>Chapter {ch + 1} of 6</span>
            </div>
            {/* Progress dots within chapter */}
            <div style={{ display: "flex", gap: 6, marginBottom: 6, justifyContent: "center" }}>
              {Array.from({ length: chQ.length }, (_, i) => (<div key={i} style={{ width: i <= cqi ? 18 : 8, height: 2, background: i <= cqi ? T.accent : "rgba(255,255,255,0.1)", borderRadius: 1, transition: "all 0.5s ease" }} />))}
            </div>
            <h2 style={{ fontFamily: T.f.b, fontSize: curQ.final ? 26 : curQ.sensory ? 20 : 22, fontWeight: 400, color: T.text, lineHeight: 1.7, margin: curQ.final ? "36px 0 40px" : "28px 0 28px", fontStyle: "italic" }}>{curQ.t}</h2>
            {/* DM Sans answer buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: curQ.sensory ? 8 : 10 }}>
              {order.map((origIdx) => (
                <button key={origIdx}
                  onClick={() => { setTappedIdx(origIdx); setTimeout(() => { if (curQ.sensory) onAns(curQ.s[origIdx], curQ.sc[origIdx]); else onAns(curQ.s[origIdx]); }, 280); }}
                  style={{
                    fontFamily: T.f.ui, fontSize: curQ.sensory ? 14 : 14.5,
                    textAlign: "left", lineHeight: 1.65,
                    padding: curQ.sensory ? "14px 20px" : "17px 22px",
                    background: tappedIdx === origIdx ? T.accent : T.warmWhite,
                    color: tappedIdx === origIdx ? "#FFFFFF" : T.warmCharcoal,
                    border: tappedIdx === origIdx ? `1px solid ${T.accent}` : "1px solid rgba(220,215,200,0.4)",
                    borderRadius: 3, cursor: "pointer", transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => { if (tappedIdx !== origIdx) { e.target.style.borderColor = T.accent + "66"; e.target.style.background = "rgba(255,252,248,1)"; } }}
                  onMouseLeave={(e) => { if (tappedIdx !== origIdx) { e.target.style.borderColor = "rgba(220,215,200,0.4)"; e.target.style.background = T.warmWhite; } }}
                >{curQ.o[origIdx]}</button>
              ))}
            </div>
            {/* Her name — quiet, personal */}
            {userName && !curQ.final && (
              <p style={{ fontFamily: T.f.d, fontSize: 13, color: T.accent, letterSpacing: "0.15em", textAlign: "center", marginTop: 36, opacity: 0.35 }}>{userName.split(" ")[0]}'s ANSR Profile</p>
            )}
          </div>);
        })()}

        {/* BREATHING TRANSITION */}
        {scr === "breath" && <Breath onDone={nextCh} />}

        {/* GENERATION */}
        {scr === "gen" && <Gen onDone={() => setScr("results")} />}

        {/* RESULTS — Full profile report */}
        {scr === "results" && prof && scores && (
          <div style={{ padding: "48px 24px 80px", maxWidth: 600, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <p style={{ fontFamily: T.f.d, fontSize: 34, fontWeight: 400, color: T.text, letterSpacing: "0.35em", marginBottom: 32 }}>ELIA</p>
              <p style={{ fontFamily: T.f.d, fontSize: 16, fontWeight: 300, color: T.text, letterSpacing: "0.12em", marginBottom: 40, opacity: 0.6 }}>Your ANSR Profile</p>
              {userName && <p style={{ fontFamily: T.f.b, fontSize: 16, color: T.text, marginBottom: 24, opacity: 0.7 }}>{userName}</p>}
              <h1 style={{ fontFamily: T.f.d, fontSize: 52, fontWeight: 300, color: prof.color, letterSpacing: "0.04em", marginBottom: 14 }}>{prof.name}</h1>
              <p style={{ fontFamily: T.f.b, fontSize: 20, color: T.text, fontStyle: "italic", lineHeight: 1.6, marginBottom: 20, opacity: 0.8 }}>{prof.tag}</p>
              {sec && (
                <div style={{ marginTop: 24, marginBottom: 8 }}>
                  <p style={{ fontFamily: T.f.b, fontSize: 15, color: T.text, opacity: 0.55, marginBottom: 16 }}>with <span style={{ color: sec.color, fontWeight: "bold" }}>{sec.name}</span> undertone</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, maxWidth: 280, margin: "0 auto" }}>
                    <div style={{ flex: 55, height: 3, background: prof.color, borderRadius: "2px 0 0 2px" }} />
                    <div style={{ flex: 45, height: 3, background: sec.color, borderRadius: "0 2px 2px 0", opacity: 0.6 }} />
                  </div>
                </div>
              )}
            </div>
            <div style={{ textAlign: "left", marginBottom: 36 }}>
              {prof.desc.split("\n\n").map((p, i) => <p key={i} style={{ fontFamily: T.f.b, fontSize: 17, color: T.text, lineHeight: 1.9, marginBottom: 18, opacity: 0.75 }}>{p}</p>)}
            </div>
            <div style={{ borderLeft: `2px solid ${prof.color}`, paddingLeft: 24, textAlign: "left", marginBottom: 52 }}>
              <p style={{ fontFamily: T.f.b, fontSize: 17, color: T.text, lineHeight: 1.95, fontStyle: "italic" }}>{prof.hope}</p>
            </div>
            {/* Radar Chart */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontFamily: T.f.d, fontSize: 22, fontWeight: 300, color: T.text, letterSpacing: "0.08em", marginBottom: 16 }}>{userName ? `${userName}'s` : "Your"} ANSR Map</p>
              <svg viewBox="-10 -10 420 400" style={{ width: "100%", maxWidth: 440, margin: "0 auto", display: "block" }}>
                {[.25, .5, .75, 1].map(s => {
                  const ring = DK.map((_, i) => { const a = (Math.PI * 2 * i) / 6 - Math.PI / 2; return `${200 + Math.cos(a) * 130 * s},${190 + Math.sin(a) * 130 * s}`; }).join(' ');
                  return <polygon key={s} points={ring} fill="none" stroke="rgba(240,232,220,0.1)" strokeWidth="0.5" />;
                })}
                {DK.map((_, i) => { const a = (Math.PI * 2 * i) / 6 - Math.PI / 2; return <line key={i} x1={200} y1={190} x2={200 + Math.cos(a) * 130} y2={190 + Math.sin(a) * 130} stroke="rgba(240,232,220,0.06)" strokeWidth="0.5" />; })}
                {sec && REFPATTERNS[sec.key] && (
                  <path d={DK.map((k, i) => { const a = (Math.PI * 2 * i) / 6 - Math.PI / 2; const v = Math.max(REFPATTERNS[sec.key][k] / 10, 0.05); return `${i === 0 ? 'M' : 'L'}${200 + Math.cos(a) * 130 * v},${190 + Math.sin(a) * 130 * v}`; }).join(' ') + 'Z'} fill={sec.color} fillOpacity="0.06" stroke={sec.color} strokeWidth="1.5" strokeDasharray="8,5" opacity="0.7" />
                )}
                <path d={DK.map((k, i) => { const a = (Math.PI * 2 * i) / 6 - Math.PI / 2; const v = Math.max(scores[k] / 10, 0.05); return `${i === 0 ? 'M' : 'L'}${200 + Math.cos(a) * 130 * v},${190 + Math.sin(a) * 130 * v}`; }).join(' ') + 'Z'} fill={prof.color} fillOpacity="0.18" stroke={prof.color} strokeWidth="2.5" />
                {DK.map((k, i) => { const a = (Math.PI * 2 * i) / 6 - Math.PI / 2; const v = Math.max(scores[k] / 10, 0.05); return <circle key={i} cx={200 + Math.cos(a) * 130 * v} cy={190 + Math.sin(a) * 130 * v} r="5" fill={prof.color} />; })}
                <circle cx={200} cy={190} r="3" fill={T.accent} />
                {DLL.map((lb, i) => { const a = (Math.PI * 2 * i) / 6 - Math.PI / 2; const lx = 200 + Math.cos(a) * 158; const ly = 190 + Math.sin(a) * 158; return <text key={i} x={lx} y={ly} textAnchor={Math.cos(a) > 0.3 ? "start" : Math.cos(a) < -0.3 ? "end" : "middle"} dominantBaseline="central" fill={T.text} fontSize="14" fontFamily={T.f.b} opacity="0.85">{lb} {scores[DK[i]].toFixed(1)}</text>; })}
              </svg>
              <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 20, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 3, background: prof.color, borderRadius: 2 }} />
                  <span style={{ fontFamily: T.f.b, fontSize: 13, color: T.text, opacity: 0.7 }}>Your scores ({prof.name})</span>
                </div>
                {sec && <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="24" height="3"><line x1="0" y1="1.5" x2="24" y2="1.5" stroke={sec.color} strokeWidth="2" strokeDasharray="5,3" opacity="0.7" /></svg>
                  <span style={{ fontFamily: T.f.b, fontSize: 13, color: T.text, opacity: 0.7 }}>{sec.name} reference</span>
                </div>}
              </div>
            </div>
            {/* Six Dimensions */}
            <div style={{ marginBottom: 56 }}>
              <p style={{ fontFamily: T.f.d, fontSize: 24, fontWeight: 300, color: T.text, letterSpacing: "0.08em", marginBottom: 36 }}>Six Dimensions</p>
              {[...DK].sort((a, b) => scores[b] - scores[a]).map((dim) => {
                const sc = scores[dim]; const band = gB(sc); const idx = DK.indexOf(dim);
                const insight = INSIGHTS[dim]?.[band] || "";
                return (
                  <div key={dim} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                      <p style={{ fontFamily: T.f.d, fontSize: 24, fontWeight: 300, color: T.text, margin: 0 }}>{DLL[idx]}</p>
                      <p style={{ fontFamily: T.f.b, fontSize: 15, color: T.text, margin: 0, opacity: 0.7 }}>{sc.toFixed(1)}/10 · {band}</p>
                    </div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: 14 }}>
                      <div style={{ height: "100%", width: `${Math.max(sc / 10 * 100, 3)}%`, background: prof.color, borderRadius: 2 }} />
                    </div>
                    <p style={{ fontFamily: T.f.b, fontSize: 16, color: T.text, lineHeight: 1.85, opacity: 0.7 }}>{insight}</p>
                  </div>
                );
              })}
            </div>
            {/* Sensory Signature */}
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontFamily: T.f.d, fontSize: 24, fontWeight: 300, color: T.text, letterSpacing: "0.08em", marginBottom: 20 }}>Your Sensory Signature</p>
              <p style={{ fontFamily: T.f.d, fontSize: 34, fontWeight: 300, color: T.text, marginBottom: 18 }}>{sensoryData.name}</p>
              <p style={{ fontFamily: T.f.b, fontSize: 16, color: T.text, lineHeight: 1.9, marginBottom: 28, opacity: 0.7 }}>{sensoryData.desc}</p>
            </div>
            {/* Practices */}
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontFamily: T.f.d, fontSize: 24, fontWeight: 300, color: T.text, letterSpacing: "0.08em", marginBottom: 32 }}>Your Restoration Path</p>
              {(PRACTICES[prof.key] || PRACTICES.newmoon).map((p, i) => (
                <div key={i} style={{ marginBottom: 28 }}>
                  <p style={{ fontFamily: T.f.d, fontSize: 24, fontWeight: 300, color: T.text, marginBottom: 10 }}>{i + 1}. {p.n}</p>
                  <p style={{ fontFamily: T.f.b, fontSize: 16, color: T.text, lineHeight: 1.9, opacity: 0.7 }}>{p.d}</p>
                </div>
              ))}
            </div>
            {/* PDF notice */}
            <div style={{ background: T.accentGlow, border: `1px solid ${T.accentSoft}`, padding: "32px 24px", textAlign: "center", borderRadius: 3, marginBottom: 48 }}>
              <p style={{ fontFamily: T.f.d, fontSize: 20, fontWeight: 300, color: T.text, marginBottom: 12 }}>Your 14-Page PDF Report</p>
              <p style={{ fontFamily: T.f.b, fontSize: 13, color: T.textMuted, lineHeight: 1.7, marginBottom: 8 }}>Full dual-profile analysis · Dimension insights · Sensory signature · Restoration practices</p>
              <p style={{ fontFamily: T.f.b, fontSize: 12, color: T.accent, fontStyle: "italic" }}>Arriving in your inbox now</p>
            </div>
            {/* Closing */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ width: 32, height: 1, background: T.accent, margin: "0 auto 32px", opacity: 0.25 }} />
              <p style={{ fontFamily: T.f.b, fontSize: 16, color: T.text, fontStyle: "italic", opacity: 0.55, lineHeight: 1.8 }}>Your nervous system found its way here. That matters.</p>
            </div>
            {/* Footer */}
            <div style={{ textAlign: "center", paddingTop: 40, borderTop: `1px solid ${T.border}` }}>
              <p style={{ fontFamily: T.f.d, fontSize: 20, fontWeight: 400, color: T.text, letterSpacing: "0.15em", marginBottom: 4 }}>ELIA</p>
              <p style={{ fontFamily: T.f.b, fontSize: 11, color: T.textMuted, fontStyle: "italic", marginBottom: 16 }}>Beauty That Heals</p>
              <p style={{ fontFamily: T.f.b, fontSize: 9, color: T.textDim }}>ANSR™ · © ELIA / Uskale SA</p>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}
