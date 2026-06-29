/**
 * BRODONAM — Public-domain film catalog
 *
 * Real, legally-streamable films from the Internet Archive (public domain).
 * Each has a `source` (direct MP4) and `playable: true`, so player.html plays
 * the actual film in-app with the companion overlay — no licensing, no piracy.
 *
 * All stream URLs verified reachable with video/mp4 + range support (seeking).
 * Posters use the Internet Archive item thumbnail service.
 *
 * Loaded AFTER data/movies.js in the browser (self-appends to BRODONAM_MOVIES);
 * also require()-able in Node (server merges these into its film context).
 */

const PUBLIC_DOMAIN_FILMS = [
  {
    id: "penny-serenade",
    title: "Penny Serenade",
    trigger: "Holding a marriage together through loss",
    year: 1941,
    duration: "1 hr 59 min",
    categories: ["grief", "family", "relationship"],
    healingStage: "recognition",
    poster: "https://archive.org/services/img/SerenataPrateada-PennySerenade1941",
    gradient: "linear-gradient(155deg, #1a1228, #14101f, #08070c)",
    accentColor: "#9A86B0",
    watchModes: ["solo", "partner"],
    source: "https://archive.org/download/SerenataPrateada-PennySerenade1941/PennySerenade1941.mp4",
    playable: true,
    synopsis: "A couple replays the records of their marriage — courtship, a longed-for child, and a grief that nearly breaks them. A tender, unflinching look at how two people stay reachable to each other when life takes more than they can bear.",
    insights: [
      { pct: 34, framework: "ATT", accentColor: "#9A86B0",
        narration: "Notice how they reach for each other not when it's easy, but right at the edge of what they can survive. Longing for a child becomes a way of asking: can we hold something fragile together?",
        reframe: "What if wanting more from a relationship isn't neediness, but the part of you that still believes connection is possible?",
        question: "When you most want to be held, what do you usually do instead?",
        somatic: "Where in your body do you feel the wanting — chest, throat, hands?",
        action: "Name one small thing you could let someone do for you this week." },
      { pct: 68, framework: "PSY", accentColor: "#9A86B0",
        narration: "Grief doesn't pull them apart at first — it isolates each of them inside their own version of the loss. They stop being able to find each other in the dark.",
        reframe: "Is it possible the distance you feel from someone is two people grieving the same thing in different languages?",
        question: "Whose grief have you been comparing yours to, instead of sharing it?",
        somatic: "Let your shoulders drop an inch. Notice what you've been bracing against.",
        action: "Tell someone one true sentence about what you're carrying." }
    ]
  },
  {
    id: "meet-john-doe",
    title: "Meet John Doe",
    trigger: "Finding a reason to keep going",
    year: 1941,
    duration: "2 hr 3 min",
    categories: ["identity", "resilience", "self-worth"],
    healingStage: "transformation",
    poster: "https://archive.org/services/img/MeetJohnDoeHD",
    gradient: "linear-gradient(155deg, #1c1810, #16140e, #090805)",
    accentColor: "#C2A668",
    watchModes: ["solo"],
    source: "https://archive.org/download/MeetJohnDoeHD/Meet%20John%20Doe.mp4",
    playable: true,
    synopsis: "A down-and-out man agrees to embody a fictional everyman who has threatened to end his life in protest. Somewhere inside the performance, he has to decide whether his own life is worth living — and what he actually believes.",
    insights: [
      { pct: 30, framework: "NDT", accentColor: "#C2A668",
        narration: "He's playing a character invented by other people — saying their words, wearing their meaning. It's a sharp picture of what it's like to live a story someone else wrote for you.",
        reframe: "What if the version of you that others find easiest to deal with isn't actually you?",
        question: "Whose script have you been performing lately?",
        somatic: "Notice your jaw. Is it set for someone else's approval?",
        action: "Say one thing today that's true for you, even if it's inconvenient." },
      { pct: 82, framework: "ACT", accentColor: "#C2A668",
        narration: "When despair tells him there's no point, the answer isn't a grand reason — it's the ordinary people who showed up, the small acts of care that meant something after all.",
        reframe: "Is it possible meaning isn't a thing you find, but a thing you do — one small act at a time?",
        question: "What's one value you'd still want to act on, even on a day that feels pointless?",
        somatic: "Feel your feet on the floor. You're still here.",
        action: "Do one small thing that matters to you, badly, today." }
    ]
  },
  {
    id: "carnival-of-souls",
    title: "Carnival of Souls",
    trigger: "Feeling strangely disconnected from your own life",
    year: 1962,
    duration: "1 hr 18 min",
    categories: ["numbness", "loneliness", "identity"],
    healingStage: "recognition",
    poster: "https://archive.org/services/img/carnival-of-souls-1962_202312",
    gradient: "linear-gradient(155deg, #10161c, #0c1014, #060809)",
    accentColor: "#6E8A98",
    watchModes: ["solo"],
    source: "https://archive.org/download/carnival-of-souls-1962_202312/Carnival%20of%20Souls%20(1962).mp4",
    playable: true,
    synopsis: "After surviving an accident, a woman drifts through a life that no longer feels like hers — people seem far away, the world muffled. A haunting portrait of dissociation and the pull back toward feeling alive.",
    insights: [
      { pct: 38, framework: "SOM", accentColor: "#6E8A98",
        narration: "The world goes silent around her — sound drops out, people can't reach her. This is what numbness actually feels like from the inside: not sadness, but distance.",
        reframe: "What if numbness isn't the absence of feeling, but a part of you protecting you from feeling too much at once?",
        question: "When did you last feel fully here, in your own life?",
        somatic: "Press your fingertips together. Notice the pressure. That's a way back in.",
        action: "Name three things you can physically feel right now." },
      { pct: 74, framework: "IFS", accentColor: "#6E8A98",
        narration: "She keeps being pulled toward the thing she's avoiding. The more she runs from what happened, the more it surrounds her.",
        reframe: "Is it possible the thing you're avoiding is also the thing trying to bring you back?",
        question: "What feeling have you been keeping at arm's length?",
        somatic: "Take one slow breath all the way down. Let something thaw.",
        action: "Let yourself feel one avoided thing for sixty seconds, then let it go." }
    ]
  },
  {
    id: "scarlet-street",
    title: "Scarlet Street",
    trigger: "Losing yourself trying to be wanted",
    year: 1945,
    duration: "1 hr 41 min",
    categories: ["self-worth", "identity"],
    healingStage: "understanding",
    poster: "https://archive.org/services/img/ScarletStreet",
    gradient: "linear-gradient(155deg, #1c1014, #160f12, #080507)",
    accentColor: "#A8707C",
    watchModes: ["solo"],
    source: "https://archive.org/download/ScarletStreet/Scarlet_Street.mp4",
    playable: true,
    synopsis: "A meek, unseen man pours everything into someone who only wants to use him. A stark study of how the hunger to finally matter to someone can lead us to abandon ourselves.",
    insights: [
      { pct: 32, framework: "PSY", accentColor: "#A8707C",
        narration: "He's invisible everywhere — at work, at home — so the first scrap of attention feels like rescue. Watch how quickly he'll betray himself to keep it.",
        reframe: "What if the intensity of a connection is sometimes measuring how starved you were, not how right it is?",
        question: "Where in your life have you mistaken being needed for being loved?",
        somatic: "Notice if you're leaning forward, reaching. Sit back. Take up your space.",
        action: "Name one thing you want that has nothing to do with anyone's approval." },
      { pct: 70, framework: "CBT", accentColor: "#A8707C",
        narration: "Every time she takes more, he tells himself a story that makes it okay. The self-deception isn't stupidity — it's how badly he needs the relationship to be what he hoped.",
        reframe: "Is it possible the story you're telling to excuse someone's behaviour is costing you more than the truth would?",
        question: "What have you been explaining away that a friend would name plainly?",
        somatic: "Feel your spine lengthen. What does standing up straight let you see?",
        action: "Write the unflattering true sentence you've been avoiding." }
    ]
  },
  {
    id: "doa-1950",
    title: "D.O.A.",
    trigger: "Realising what matters only when time runs short",
    year: 1950,
    duration: "1 hr 23 min",
    categories: ["identity", "resilience"],
    healingStage: "recognition",
    poster: "https://archive.org/services/img/d.-o.-a.-1950",
    gradient: "linear-gradient(155deg, #181410, #13110d, #080706)",
    accentColor: "#B89068",
    watchModes: ["solo"],
    source: "https://archive.org/download/d.-o.-a.-1950/D.O.A.%20(1949).mp4",
    playable: true,
    synopsis: "A man learns he has been fatally poisoned and has only days to find out why. Stripped of his future, he discovers with brutal clarity who and what he actually cared about all along.",
    insights: [
      { pct: 28, framework: "ACT", accentColor: "#B89068",
        narration: "The moment his time is finite, everything reorders. The things he was anxious about dissolve; the person he kept at a distance becomes the centre.",
        reframe: "What if your fear of the clock running out is also pointing at what you'd reach for if it did?",
        question: "If your time were suddenly short, what would instantly stop mattering?",
        somatic: "One slow exhale. Notice what your body relaxes toward.",
        action: "Reach out to the person who'd be at your centre." },
      { pct: 66, framework: "NDT", accentColor: "#B89068",
        narration: "He spends his last days chasing the why. But the search keeps returning him to the life he was too distracted to fully live while he had it.",
        reframe: "Is it possible the meaning you're hunting for is already in the life you're rushing past?",
        question: "What ordinary part of your life would you miss most?",
        somatic: "Look up from this screen. Notice one thing in the room you love.",
        action: "Let one ordinary moment today be enough." }
    ]
  },
  {
    id: "the-red-house",
    title: "The Red House",
    trigger: "What stays buried doesn't stay quiet",
    year: 1947,
    duration: "1 hr 40 min",
    categories: ["grief", "family", "anxiety"],
    healingStage: "understanding",
    poster: "https://archive.org/services/img/the-red-house",
    gradient: "linear-gradient(155deg, #1a1210, #14100d, #080605)",
    accentColor: "#A07860",
    watchModes: ["solo"],
    source: "https://archive.org/download/the-red-house/The%20Red%20house.ia.mp4",
    playable: true,
    synopsis: "A family guards a forbidden house in the woods and the secret inside it. A psychological drama about how the things we refuse to look at shape everyone around us until they're finally faced.",
    insights: [
      { pct: 35, framework: "PSY", accentColor: "#A07860",
        narration: "The whole household organises itself around a place no one is allowed to go. Notice how a single avoided truth can quietly run an entire life.",
        reframe: "What if the thing you've sealed off isn't gone — it's just running the show from behind a locked door?",
        question: "What's the room in your own history you've agreed not to enter?",
        somatic: "Notice any tightening as you read that. Breathe into it, gently.",
        action: "Name the avoided thing, just to yourself, out loud." },
      { pct: 72, framework: "IFS", accentColor: "#A07860",
        narration: "The fear guarding the secret was, once, trying to protect someone. Even the harshest defences usually started as care that calcified.",
        reframe: "Is it possible the part of you that keeps everyone out was, long ago, trying to keep you safe?",
        question: "What is your most stubborn defence actually protecting?",
        somatic: "Place a hand where you feel the guardedness. Let it know you see it.",
        action: "Thank a defence for its work — then ask if it still needs to work so hard." }
    ]
  },
  {
    id: "beyond-tomorrow",
    title: "Beyond Tomorrow",
    trigger: "The quiet power of being kind to a stranger",
    year: 1940,
    duration: "1 hr 24 min",
    categories: ["loneliness", "grief", "healing"],
    healingStage: "transformation",
    poster: "https://archive.org/services/img/Www.VDBEYONDTOMORROW1940",
    gradient: "linear-gradient(155deg, #121620, #0e1118, #06080c)",
    accentColor: "#7E92B0",
    watchModes: ["solo", "partner"],
    source: "https://archive.org/download/Www.VDBEYONDTOMORROW1940/%5Bwww.VDyoutube.com%5D-BEYOND%20TOMORROW%20(1940).mp4",
    playable: true,
    synopsis: "Three lonely older men invite two strangers to dinner on a whim, and the small kindness ripples outward in ways none of them expect. A gentle film about connection as something you build, not something you wait for.",
    insights: [
      { pct: 26, framework: "ATT", accentColor: "#7E92B0",
        narration: "Their loneliness isn't for lack of means — it's for lack of reaching. The evening turns only because someone risked an unguarded gesture.",
        reframe: "What if connection is less about being chosen and more about being the one who extends the invitation?",
        question: "Who could you reach toward, if you let yourself go first?",
        somatic: "Unclench your hands. Open palms change how reaching feels.",
        action: "Send the message you've been waiting for someone else to send." },
      { pct: 64, framework: "ACT", accentColor: "#7E92B0",
        narration: "The kindness they gave outlives them — it keeps acting in the world after they can't. Small care turns out to be the most durable thing they made.",
        reframe: "Is it possible the smallest generous thing you do is also the most lasting?",
        question: "What kindness has someone done for you that still echoes?",
        somatic: "Feel the warmth of remembering it. That's yours to pass on.",
        action: "Pass one kindness forward today, no credit needed." }
    ]
  }
];

// Trigger-warning flags for the playable films (consumed like FILM_FLAGS).
const PD_FILM_FLAGS = {
  "penny-serenade":   ["child_death", "grief"],
  "meet-john-doe":    ["suicide"],
  "carnival-of-souls":["isolation", "death_of_loved_one"],
  "scarlet-street":   ["emotional_abuse"],
  "doa-1950":         ["terminal_illness", "death_of_loved_one"],
  "the-red-house":    ["death_of_loved_one", "emotional_abuse"],
  "beyond-tomorrow":  ["death_of_loved_one", "isolation"],
};
PUBLIC_DOMAIN_FILMS.forEach(m => { m.contentFlags = PD_FILM_FLAGS[m.id] || []; });

// Browser: merge into the shared catalog so they flow through reco + player.
if (typeof BRODONAM_MOVIES !== "undefined" && Array.isArray(BRODONAM_MOVIES)) {
  const have = new Set(BRODONAM_MOVIES.map(m => m.id));
  for (const f of PUBLIC_DOMAIN_FILMS) if (!have.has(f.id)) BRODONAM_MOVIES.push(f);
}

// Node: export for the server to merge into its film context.
if (typeof module !== "undefined") {
  module.exports = { PUBLIC_DOMAIN_FILMS, PD_FILM_FLAGS };
}
