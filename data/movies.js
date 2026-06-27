/**
 * BRODONAM — Curated Therapeutic Film Library
 * Films are categorised by psychological need, not genre.
 * This is "Netflix for therapy" — each card shows a psychological situation (trigger),
 * not a film title. Titles are internal/comments only.
 *
 * Therapeutic frameworks used:
 *   CBT  — Cognitive Behavioural Therapy
 *   ATT  — Attachment Theory
 *   IFS  — Internal Family Systems
 *   NDT  — Narrative Therapy
 *   ACT  — Acceptance & Commitment Therapy
 *   PSY  — Psychodynamic
 *   SOM  — Somatic Awareness
 *
 * Categories:
 *   grief       — grief, loss, death, mourning
 *   relationship — couples, love, breakup, communication
 *   anxiety     — anxiety, OCD, perfectionism, mental health
 *   identity    — who am I, becoming, self-discovery, purpose
 *   family      — family trauma, parent-child, sibling, dysfunction
 *   self-worth  — not feeling enough, shame, confidence
 *   loneliness  — isolation, disconnection, being unseen
 *   resilience  — overcoming, redemption, perseverance
 *   attachment  — fear of intimacy, trust, abandonment
 *   healing     — recovery, integration, peace, wholeness
 */

const BRODONAM_MOVIES = [

  // ─── GRIEF ────────────────────────────────────────────────────────────────

  {
    id: "eternal-sunshine",
    trigger: "Fear of losing someone before you were ready",
    // Eternal Sunshine of the Spotless Mind (2004)
    year: 2004,
    duration: "2 hr 8 min",
    categories: ["grief", "attachment"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a4/Eternal_Sunshine_of_the_Spotless_Mind.png",
    gradient: "linear-gradient(155deg, #1a0a2e, #0d0f2a, #060508)",
    accentColor: "#7B6FA0",
    watchModes: ["solo", "partner"],
    synopsis: "A man erasing memories of a failed relationship discovers — mid-erasure — that he doesn't want to forget. Explores the grief of voluntary loss and the impossibility of escaping what we've loved.",
    insights: [
      {
        pct: 14.5, intensity: 0.78,
        framework: "PSY",
        ambientColor: "#6B5A9A",
        narration: "What Joel is doing right now — erasing Clementine — isn't an act of cruelty. It's the desperate attempt of a mind that doesn't know how to hold pain. We do this too. We 'delete' people by filling every moment with noise, with work, with anything but the feeling itself. Notice: is there something you've been trying not to remember?",
        somatic: "Place one hand on your chest. What do you feel there right now? Don't analyse it. Just notice.",
        reframe: "What if the memories you've been trying to erase are precisely the ones your healing needs you to return to?",
        question: "What are you trying to stop yourself from feeling?",
        action: "Name one thing — one memory, one person, one moment — you've been avoiding. You don't have to do anything with it yet. Just name it."
      },
      {
        pct: 31.2, intensity: 0.88,
        framework: "ATT",
        ambientColor: "#8A78A8",
        narration: "She didn't leave because she stopped loving him. She left because staying had become an act of self-erasure. In attachment theory, we call this an anxious-avoidant trap — one person reaches, the other retreats, until reaching feels pointless and retreating feels like survival. Does any part of this dynamic feel familiar?",
        somatic: "Breathe in slowly for 4 counts. Hold for 4. Out for 6. Do this once, right now, before we continue.",
        reframe: "What if her leaving was the only language she had left for 'I'm in pain and I don't know how to tell you'?",
        question: "In your closest relationship, who reaches and who retreats? Has that ever switched?",
        action: "Write down one thing you've never said to someone you love — not because it isn't true, but because you didn't know how to begin."
      },
      {
        pct: 67.8, intensity: 0.95,
        framework: "NDT",
        ambientColor: "#A09ABE",
        narration: "This is the scene. Right here. He's realising — inside the erasure itself — that he doesn't want to lose her. This is what narrative therapy calls the 're-authoring' moment. The story you've been telling yourself — 'I'm better off without this, I should stop feeling this' — is confronting an older, truer story: that love, even when it hurts, is part of you. You don't have to erase who you were.",
        somatic: "Your nervous system may be activated right now. That's appropriate. You're feeling something true.",
        reframe: "The version of you that was loved, that loved back — that version doesn't have to be erased to protect you.",
        question: "What part of yourself did you lose along with the person or thing you're grieving?",
        action: "This week, do one thing the version of you before this loss would have loved. Not to escape grief — to honour who you still are."
      },
      {
        pct: 88.0, intensity: 0.85,
        framework: "ACT",
        ambientColor: "#C09060",
        narration: "They choose each other again. Knowing everything. Knowing it will be hard. Knowing they'll hurt each other. This is not naivety — this is Acceptance and Commitment in its purest form. Values-based choosing. Not choosing because it's easy, but because it's true. What would you choose, if you chose from your deepest values instead of your deepest fear?",
        somatic: "Take a breath. Let your shoulders drop. What does 'enough' feel like in your body?",
        reframe: "Beginning again is not a betrayal of what was. It is what you build on top of it.",
        question: "If fear wasn't a factor — what would you choose?",
        action: "Write a letter to yourself from the perspective of someone who loves you completely. What would they want you to know right now?"
      }
    ]
  },

  {
    id: "manchester-by-the-sea",
    trigger: "Grief that has nowhere left to go",
    // Manchester by the Sea (2016)
    year: 2016,
    duration: "2 hr 17 min",
    categories: ["grief", "family"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/d/de/Manchester_by_the_Sea.jpg",
    gradient: "linear-gradient(155deg, #1a0a2e, #0d0f2a, #060508)",
    accentColor: "#6878A8",
    watchModes: ["solo"],
    synopsis: "A man unable to move through catastrophic guilt is forced back into proximity with his nephew and his past. An unflinching portrait of grief that cannot be processed and the people left stranded inside it.",
    insights: []
  },

  {
    id: "wild",
    trigger: "Walking away from everything to find yourself again",
    // Wild (2014)
    year: 2014,
    duration: "1 hr 55 min",
    categories: ["grief", "resilience"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/3/37/Wild2014Poster.jpg",
    gradient: "linear-gradient(155deg, #1a0a2e, #0d0f2a, #060508)",
    accentColor: "#8870A0",
    watchModes: ["solo"],
    synopsis: "A woman in freefall after her mother's death walks 1,100 miles alone to rebuild herself. Explores grief as a body experience, and the radical act of choosing your own recovery.",
    insights: []
  },

  {
    id: "rabbit-hole",
    trigger: "The impossible silence after unimaginable loss",
    // Rabbit Hole (2010)
    year: 2010,
    duration: "1 hr 31 min",
    categories: ["grief", "relationship"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Rabbit_Hole_Poster.jpg",
    gradient: "linear-gradient(155deg, #1a0a2e, #0d0f2a, #060508)",
    accentColor: "#7A6898",
    watchModes: ["solo", "partner"],
    synopsis: "A couple grieving the death of their young son discovers they cannot grieve together — each retreating into their own impossible silence. A quiet, devastating study of how loss fractures the people it doesn't take.",
    insights: []
  },

  {
    id: "the-hours",
    trigger: "When the weight of existing feels like too much",
    // The Hours (2002)
    year: 2002,
    duration: "1 hr 54 min",
    categories: ["grief", "loneliness"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/e/e6/The_Hours_poster.jpg",
    gradient: "linear-gradient(155deg, #1a0a2e, #0d0f2a, #060508)",
    accentColor: "#9080B0",
    watchModes: ["solo"],
    synopsis: "Three women across different eras each battle the pull toward ending their lives while navigating what it means to truly live. A profound meditation on depression, endurance, and the cost of suppressing the self.",
    insights: []
  },

  {
    id: "still-alice",
    trigger: "Losing yourself one memory at a time",
    // Still Alice (2014)
    year: 2014,
    duration: "1 hr 41 min",
    categories: ["grief", "identity"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/d/d2/Still_Alice_-_Movie_Poster.jpg",
    gradient: "linear-gradient(155deg, #1a0a2e, #0d0f2a, #060508)",
    accentColor: "#7870A0",
    watchModes: ["solo", "family"],
    synopsis: "A brilliant woman faces early-onset Alzheimer's and the gradual erosion of the self she has spent a lifetime building. A shattering but deeply human exploration of identity, fear, and what love looks like under pressure.",
    insights: []
  },

  {
    id: "a-ghost-story",
    trigger: "The grief of being left behind — and leaving",
    // A Ghost Story (2017)
    year: 2017,
    duration: "1 hr 32 min",
    categories: ["grief", "loneliness"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/d/dd/A_Ghost_Story_poster.jpeg",
    gradient: "linear-gradient(155deg, #1a0a2e, #0d0f2a, #060508)",
    accentColor: "#605880",
    watchModes: ["solo"],
    synopsis: "A ghost watches helplessly as life continues without him, unable to release his attachment to home and person. A radical meditation on grief from both sides — the one who stays and the one who is left.",
    insights: []
  },

  // ─── RELATIONSHIP ──────────────────────────────────────────────────────────

  {
    id: "marriage-story",
    trigger: "When love turns into a battleground",
    // Marriage Story (2019)
    year: 2019,
    duration: "2 hr 17 min",
    categories: ["relationship", "grief"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/5/55/MarriageStoryPoster.png",
    gradient: "linear-gradient(155deg, #2e0a0a, #1a0808, #060508)",
    accentColor: "#A87070",
    watchModes: ["partner", "solo"],
    synopsis: "A couple's divorce reveals everything they never said while married — the dreams deferred, the resentments accumulated, the love that never quite stopped. A masterclass in how good people can still devastate each other.",
    insights: [
      {
        pct: 18.0, intensity: 0.82,
        framework: "CBT",
        ambientColor: "#A87070",
        narration: "They're listing what they love about each other — and it's real. This is who they are. The argument that's coming doesn't erase this. In CBT, we work with something called 'cognitive distortion under stress' — when we're in conflict, our brain edits the positive evidence and amplifies the negative. The person who loves you doesn't disappear during a fight. They're just temporarily invisible to both of you.",
        somatic: "Think of someone you've been in conflict with. Can you hold simultaneously: 'I love this person' AND 'I'm in pain'?",
        reframe: "The opposite of love isn't hate. It's indifference. The fight is often proof that it still matters.",
        question: "When you argue with the people closest to you, what are you really asking for that you can't quite say directly?",
        action: "After a disagreement, try saying: 'I got angry because I care about this. What I really needed to say was ___.' Practice the template first, privately."
      },
      {
        pct: 61.3, intensity: 0.97,
        framework: "CBT",
        ambientColor: "#C09090",
        narration: "That argument. The one that went too far. Every word that couldn't be unsaid. This is what therapists call an 'escalation cycle' — each person defending, each defence landing as attack, until something true gets said in the worst possible way. Notice: neither of them wanted to be here. They were both fighting to be understood. The tragedy isn't the anger — it's that they couldn't find each other inside it.",
        somatic: "If you're feeling activated right now — heart rate up, jaw tight — that's your nervous system recognising something. Breathe.",
        reframe: "What if every harsh word was a failed attempt to say 'I'm in pain and I need you to see me'?",
        question: "What's the harshest thing you've ever said to someone you love — and what were you really trying to say underneath it?",
        action: "Write the version of that argument where both people's underlying need is visible. What would each person have said if they felt safe enough to be honest?"
      }
    ]
  },

  {
    id: "before-sunrise",
    trigger: "The connection that made you believe in love again",
    // Before Sunrise (1995)
    year: 1995,
    duration: "1 hr 41 min",
    categories: ["relationship", "identity"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/d/da/Before_Sunrise_poster.jpg",
    gradient: "linear-gradient(155deg, #2e0a0a, #1a0808, #060508)",
    accentColor: "#C08888",
    watchModes: ["solo", "partner"],
    synopsis: "Two strangers spend one night in Vienna talking with a depth and honesty most people never achieve. An exploration of what it feels like to be truly seen — and the fear of losing that before it's even begun.",
    insights: []
  },

  {
    id: "blue-valentine",
    trigger: "Watching love dissolve in slow motion",
    // Blue Valentine (2010)
    year: 2010,
    duration: "1 hr 52 min",
    categories: ["relationship", "grief"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/0/04/Blue_Valentine_film.jpg",
    gradient: "linear-gradient(155deg, #2e0a0a, #1a0808, #060508)",
    accentColor: "#906868",
    watchModes: ["solo", "partner"],
    synopsis: "Two timelines — the beginning and the end of a marriage — run alongside each other to show how love erodes without either person quite noticing. A raw portrait of how two people become strangers.",
    insights: []
  },

  {
    id: "revolutionary-road",
    trigger: "The life you built that became a trap",
    // Revolutionary Road (2008)
    year: 2008,
    duration: "1 hr 59 min",
    categories: ["relationship", "identity"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/3/39/Revolutionary_Road_%28Official_Film_Poster%29.png",
    gradient: "linear-gradient(155deg, #2e0a0a, #1a0808, #060508)",
    accentColor: "#A07070",
    watchModes: ["solo", "partner"],
    synopsis: "A couple's dream of escaping their suburban life collapses under the weight of compromise, fear, and mutual disappointment. Explores how unrealised selves can poison even the most loving relationships.",
    insights: []
  },

  {
    id: "500-days-of-summer",
    trigger: "Confusing projection for love",
    // (500) Days of Summer (2009)
    year: 2009,
    duration: "1 hr 35 min",
    categories: ["relationship", "attachment"],
    healingStage: "understanding",
    poster: "https://upload.wikimedia.org/wikipedia/en/d/d1/Five_hundred_days_of_summer.jpg",
    gradient: "linear-gradient(155deg, #2e0a0a, #1a0808, #060508)",
    accentColor: "#B87878",
    watchModes: ["solo"],
    synopsis: "A man processes a relationship by replaying it — and slowly realises he was in love with who he needed her to be, not who she was. A painfully honest look at projection, idealisation, and the stories we tell ourselves about love.",
    insights: []
  },

  {
    id: "normal-people",
    trigger: "Loving someone you keep running from",
    // Normal People (TV, 2020)
    year: 2020,
    duration: "5 hr 40 min",
    categories: ["relationship", "attachment"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a0/Normal_People_%28Rooney_novel%29.png",
    gradient: "linear-gradient(155deg, #2e0a0a, #1a0808, #060508)",
    accentColor: "#A86870",
    watchModes: ["solo", "partner"],
    synopsis: "Two people from the same Irish town circle each other through years of missed moments, bad timing, and the inability to say what they need. A precise portrait of how class, shame, and fear intercept desire.",
    insights: []
  },

  {
    id: "atonement",
    trigger: "A lie that destroyed two lives — and a lifetime of regret",
    // Atonement (2007)
    year: 2007,
    duration: "2 hr 3 min",
    categories: ["relationship", "grief"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/e/e4/Atonement_UK_poster.jpg",
    gradient: "linear-gradient(155deg, #2e0a0a, #1a0808, #060508)",
    accentColor: "#987080",
    watchModes: ["solo", "partner"],
    synopsis: "A misread moment sets off a chain of irreversible consequences for two lovers and the girl who wrongly separated them. A devastating study of guilt, false memory, and the stories we construct to survive what we've done.",
    insights: []
  },

  // ─── ANXIETY ──────────────────────────────────────────────────────────────

  {
    id: "a-beautiful-mind",
    trigger: "A mind at war with itself — and finding peace",
    // A Beautiful Mind (2001)
    year: 2001,
    duration: "2 hr 15 min",
    categories: ["anxiety", "identity"],
    healingStage: "understanding",
    poster: "https://upload.wikimedia.org/wikipedia/en/b/b8/A_Beautiful_Mind_Poster.jpg",
    gradient: "linear-gradient(155deg, #0a1e1e, #0a1428, #060508)",
    accentColor: "#60A880",
    watchModes: ["solo", "family"],
    synopsis: "A mathematical genius navigates schizophrenia and slowly learns to live with, rather than be destroyed by, his mind. A compassionate portrait of what it takes to build a life when your own perception cannot be trusted.",
    insights: []
  },

  {
    id: "whiplash",
    trigger: "When the pursuit of greatness becomes self-destruction",
    // Whiplash (2014)
    year: 2014,
    duration: "1 hr 47 min",
    categories: ["anxiety", "self-worth"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/0/01/Whiplash_poster.jpg",
    gradient: "linear-gradient(155deg, #0a1e1e, #0a1428, #060508)",
    accentColor: "#50889A",
    watchModes: ["solo"],
    synopsis: "A young drummer submits to a sadistic instructor's regime in pursuit of perfection — and dismantles everything else in his life to do it. A harrowing examination of perfectionism, worth-through-achievement, and the cost of an inner critic who is never satisfied.",
    insights: []
  },

  {
    id: "black-swan",
    trigger: "The perfection that swallows you whole",
    // Black Swan (2010)
    year: 2010,
    duration: "1 hr 48 min",
    categories: ["anxiety", "identity"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/6/68/Black_Swan_poster.jpg",
    gradient: "linear-gradient(155deg, #0a1e1e, #0a1428, #060508)",
    accentColor: "#8090B8",
    watchModes: ["solo"],
    synopsis: "A ballet dancer's obsession with perfection triggers a psychological unravelling as she pushes toward her most demanding role. A visceral study of the self-destructive parts that emerge when worth is entirely conditional on performance.",
    insights: []
  },

  {
    id: "silver-linings-playbook",
    trigger: "When your own mind feels like the enemy",
    // Silver Linings Playbook (2012)
    year: 2012,
    duration: "2 hr 2 min",
    categories: ["anxiety", "healing"],
    healingStage: "understanding",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/9a/Silver_Linings_Playbook_Poster.jpg",
    gradient: "linear-gradient(155deg, #0a1e1e, #0a1428, #060508)",
    accentColor: "#70A898",
    watchModes: ["solo", "family"],
    synopsis: "A man with bipolar disorder rebuilds his life after hospitalisation by finding unexpected connection with a woman carrying her own wounds. An honest, warm portrait of mental health recovery without sentimentality.",
    insights: []
  },

  {
    id: "perks-of-being-a-wallflower",
    trigger: "Surviving adolescence when no one sees how much you're hurting",
    // The Perks of Being a Wallflower (2012)
    year: 2012,
    duration: "1 hr 43 min",
    categories: ["anxiety", "identity"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/0/0b/The_Perks_of_Being_a_Wallflower_Poster.jpg",
    gradient: "linear-gradient(155deg, #0a1e1e, #0a1428, #060508)",
    accentColor: "#6080A0",
    watchModes: ["solo"],
    synopsis: "A teenager dealing with unprocessed trauma navigates high school, first love, and the terrifying task of letting people in. A tender portrait of how the past lives in the present and what it costs to finally face it.",
    insights: []
  },

  {
    id: "as-good-as-it-gets",
    trigger: "The rituals that keep the fear at bay",
    // As Good as It Gets (1997)
    year: 1997,
    duration: "2 hr 19 min",
    categories: ["anxiety", "attachment"],
    healingStage: "understanding",
    poster: "https://upload.wikimedia.org/wikipedia/en/d/dc/As_good_as_it_gets.jpg",
    gradient: "linear-gradient(155deg, #0a1e1e, #0a1428, #060508)",
    accentColor: "#58909A",
    watchModes: ["solo"],
    synopsis: "A man with severe OCD finds his elaborate protective routines dismantled by unexpected relationship. Explores how compulsive control is a response to vulnerability — and what happens when someone refuses to leave anyway.",
    insights: []
  },

  {
    id: "melancholia",
    trigger: "Depression that makes the world feel like it's ending",
    // Melancholia (2011)
    year: 2011,
    duration: "2 hr 15 min",
    categories: ["anxiety", "grief"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/7/71/Melancholia_%282011_film_poster%29.png",
    gradient: "linear-gradient(155deg, #0a1e1e, #0a1428, #060508)",
    accentColor: "#7080A8",
    watchModes: ["solo"],
    synopsis: "A woman in the grip of severe depression discovers strange clarity as an actual planetary catastrophe approaches. A bold, surreal portrait of what it feels like inside depression — and the unexpected calm that can come with surrender.",
    insights: []
  },

  // ─── IDENTITY ─────────────────────────────────────────────────────────────

  {
    id: "moonlight",
    trigger: "Not knowing who you are allowed to become",
    // Moonlight (2016)
    year: 2016,
    duration: "1 hr 51 min",
    categories: ["identity", "self-worth"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/84/Moonlight_%282016_film%29.png",
    gradient: "linear-gradient(155deg, #0a0a2e, #080a1e, #060508)",
    accentColor: "#5080A0",
    watchModes: ["solo"],
    synopsis: "A young Black man in Miami moves through three chapters of his life, each shaped by violence, tenderness, and the desperate suppression of who he truly is. A quiet masterpiece about the cost of hiding yourself to survive.",
    insights: []
  },

  {
    id: "good-will-hunting",
    trigger: "Afraid to let anyone truly see you",
    // Good Will Hunting (1997)
    year: 1997,
    duration: "2 hr 6 min",
    categories: ["identity", "self-worth"],
    healingStage: "understanding",
    poster: "https://upload.wikimedia.org/wikipedia/en/5/52/Good_Will_Hunting.png",
    gradient: "linear-gradient(155deg, #0a0a2e, #080a1e, #060508)",
    accentColor: "#7A9870",
    watchModes: ["solo"],
    synopsis: "A genius from South Boston keeps the world at arm's length with wit and hostility — until a therapist refuses to give up on him. A profound study of how early wounds create protective armour that eventually imprisons us.",
    insights: [
      {
        pct: 22.0, intensity: 0.80,
        framework: "IFS",
        ambientColor: "#7A9870",
        narration: "Will just dismantled that man in seconds — and it felt like power. But watch his face afterward. That's not triumph. That's a scared kid checking to see if everyone's still there. In IFS, we call this a Protector part. It attacks before it can be hurt. How many of us have a version of this — an intellect, a wit, a coldness we deploy when we feel threatened?",
        somatic: "What does your 'protector' feel like? Where do you carry it in your body?",
        reframe: "The armour isn't the problem. The question is — what is it protecting?",
        question: "What's the thing you do when you feel someone getting too close?",
        action: "Identify your primary protection strategy. Name it without judgment. Just: 'When I feel threatened, I ___.'"
      },
      {
        pct: 58.5, intensity: 0.98,
        framework: "ATT",
        ambientColor: "#90B090",
        narration: "'It's not your fault.' Sean says it again. And again. Until something in Will breaks open. This is one of the most clinically accurate depictions of therapeutic breakthrough in cinema. The repetition matters. Trauma doesn't believe the first time. It doesn't always believe the second or third. But something in the body keeps count — and eventually, the accumulated weight of being seen becomes more real than the old story of being worthless.",
        somatic: "Let yourself feel whatever is coming up. You don't have to hold it together right now.",
        reframe: "Whatever happened to you — none of it was your fault. You were a child doing the best you could with what you had.",
        question: "What have you been blaming yourself for that was never yours to carry?",
        action: "Write down one thing that happened to you that you've secretly believed was your fault. Then write: 'I was doing the best I could.'"
      },
      {
        pct: 86.0, intensity: 0.88,
        framework: "ACT",
        ambientColor: "#A0C0A0",
        narration: "He drives south. He chooses. Not because it's safe — it isn't. But because it's alive. Growth and safety rarely occupy the same space. The places where we are most terrified of being truly seen are almost always exactly the places our real life is waiting.",
        somatic: "Notice if there's a flicker of something hopeful. Even the smallest flicker. Let it be there.",
        reframe: "Choosing the thing you're most afraid of losing is not recklessness. It's the bravest form of self-respect.",
        question: "What are you not going after because you're afraid of what it would mean if you lost it?",
        action: "Identify one move — one conversation, one reach, one door you've been not opening. Take one step toward it this week."
      }
    ]
  },

  {
    id: "lost-in-translation",
    trigger: "The connection that almost happened, and almost was enough",
    // Lost in Translation (2003)
    year: 2003,
    duration: "1 hr 41 min",
    categories: ["identity", "loneliness"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/4/4c/Lost_in_Translation_poster.jpg",
    gradient: "linear-gradient(155deg, #0a0a2e, #080a1e, #060508)",
    accentColor: "#7888B0",
    watchModes: ["solo"],
    synopsis: "Two Americans — adrift in Tokyo and in their own lives — find each other in the in-between hours. A gentle, aching study of what happens when you meet yourself in someone else, and neither of you knows what to do with it.",
    insights: []
  },

  {
    id: "into-the-wild",
    trigger: "Running from everything to find something real",
    // Into the Wild (2007)
    year: 2007,
    duration: "2 hr 28 min",
    categories: ["identity", "resilience"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/d/dc/Into_the_Wild_%282007_film_poster%29.png",
    gradient: "linear-gradient(155deg, #0a0a2e, #080a1e, #060508)",
    accentColor: "#6890A8",
    watchModes: ["solo"],
    synopsis: "A young man abandons everything — family, comfort, convention — for a life of radical freedom, only to discover what he was fleeing was inside him all along. A beautiful, cautionary meditation on authenticity and the cost of running.",
    insights: []
  },

  {
    id: "boyhood",
    trigger: "The years that shape you whether you notice or not",
    // Boyhood (2014)
    year: 2014,
    duration: "2 hr 45 min",
    categories: ["identity", "family"],
    healingStage: "understanding",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a6/Boyhood_%282014%29.png",
    gradient: "linear-gradient(155deg, #0a0a2e, #080a1e, #060508)",
    accentColor: "#8898B8",
    watchModes: ["solo", "family"],
    synopsis: "Filmed over twelve years with the same actors, a boy grows into a man through the accumulation of ordinary moments. A quiet, radical film about how identity forms not through grand events but through the texture of daily life.",
    insights: []
  },

  {
    id: "lady-bird",
    trigger: "Hating where you came from while becoming who you are",
    // Lady Bird (2017)
    year: 2017,
    duration: "1 hr 33 min",
    categories: ["identity", "family"],
    healingStage: "understanding",
    poster: "https://upload.wikimedia.org/wikipedia/en/6/61/Lady_Bird_poster.jpeg",
    gradient: "linear-gradient(155deg, #0a0a2e, #080a1e, #060508)",
    accentColor: "#9888B0",
    watchModes: ["solo", "family"],
    synopsis: "A headstrong teenager in Sacramento fights to escape her hometown and her mother — while both shape her more than she can see. A tender portrait of how we define ourselves against the people who made us.",
    insights: []
  },

  {
    id: "bohemian-rhapsody",
    trigger: "Being too much for the world — until the world finally catches up",
    // Bohemian Rhapsody (2018)
    year: 2018,
    duration: "2 hr 14 min",
    categories: ["identity", "self-worth"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/2/2e/Bohemian_Rhapsody_poster.png",
    gradient: "linear-gradient(155deg, #0a0a2e, #080a1e, #060508)",
    accentColor: "#A888C0",
    watchModes: ["solo"],
    synopsis: "The story of Freddie Mercury's rise, unravelling, and final triumph — the journey of a man who was always too much until he learned it was his greatest gift. A film about belonging, authenticity, and what it costs to be exactly yourself.",
    insights: []
  },

  // ─── FAMILY ───────────────────────────────────────────────────────────────

  {
    id: "ordinary-people",
    trigger: "The family pain everyone pretends isn't there",
    // Ordinary People (1980)
    year: 1980,
    duration: "2 hr 4 min",
    categories: ["family", "grief"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/88/OrdinaryPeople.jpg",
    gradient: "linear-gradient(155deg, #2e1408, #1a0c08, #060508)",
    accentColor: "#A87860",
    watchModes: ["solo", "family"],
    synopsis: "A family fractures after the death of one son, as the surviving brother carries impossible guilt and a mother retreats behind an impenetrable wall of composure. A landmark portrait of how grief goes wrong when feelings are forbidden.",
    insights: []
  },

  {
    id: "august-osage-county",
    trigger: "A family reunion that turns into a reckoning",
    // August: Osage County (2013)
    year: 2013,
    duration: "2 hr 1 min",
    categories: ["family", "self-worth"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/7/7e/August_Osage_County_2013_poster.jpg",
    gradient: "linear-gradient(155deg, #2e1408, #1a0c08, #060508)",
    accentColor: "#C08858",
    watchModes: ["solo", "family"],
    synopsis: "A dysfunctional Oklahoma family collides during a crisis and decades of wounds, cruelties, and buried truths explode to the surface. An unflinching portrait of how toxic family systems reproduce themselves across generations.",
    insights: []
  },

  {
    id: "beautiful-boy",
    trigger: "Watching someone you love destroy themselves",
    // Beautiful Boy (2018)
    year: 2018,
    duration: "2 hr",
    categories: ["family", "resilience"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/8b/Beautiful_Boy_%282018%29_poster.png",
    gradient: "linear-gradient(155deg, #2e1408, #1a0c08, #060508)",
    accentColor: "#B07850",
    watchModes: ["solo", "family"],
    synopsis: "A father and son navigate addiction, relapse, and the limits of parental love. A dual portrait of helplessness — the addict who cannot stop and the parent who cannot fix it — and what love looks like when it has to accept powerlessness.",
    insights: []
  },

  {
    id: "little-miss-sunshine",
    trigger: "When broken things are still worth loving",
    // Little Miss Sunshine (2006)
    year: 2006,
    duration: "1 hr 42 min",
    categories: ["family", "self-worth"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/1/16/Little_miss_sunshine_poster.jpg",
    gradient: "linear-gradient(155deg, #2e1408, #1a0c08, #060508)",
    accentColor: "#B09050",
    watchModes: ["family", "solo"],
    synopsis: "A wildly dysfunctional family drives across the country to support their youngest in a beauty pageant — and the journey dismantles every pretension they've been using to hold themselves together. A warm, subversive celebration of chosen family and radical acceptance.",
    insights: []
  },

  {
    id: "terms-of-endearment",
    trigger: "Loving your mother — even the difficult parts",
    // Terms of Endearment (1983)
    year: 1983,
    duration: "2 hr 12 min",
    categories: ["family", "grief"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/e/e9/Terms_of_endearment.png",
    gradient: "linear-gradient(155deg, #2e1408, #1a0c08, #060508)",
    accentColor: "#A87060",
    watchModes: ["solo", "family"],
    synopsis: "A mother and daughter navigate thirty years of love, friction, and the final crisis that strips away everything unnecessary. An honest study of how complicated parent-child bonds can be, and how love sometimes only becomes visible in extremity.",
    insights: []
  },

  {
    id: "kramer-vs-kramer",
    trigger: "Children carrying the weight of adult choices",
    // Kramer vs. Kramer (1979)
    year: 1979,
    duration: "1 hr 45 min",
    categories: ["family", "relationship"],
    healingStage: "understanding",
    poster: "https://upload.wikimedia.org/wikipedia/en/b/b0/Oscar_posters_79.jpg",
    gradient: "linear-gradient(155deg, #2e1408, #1a0c08, #060508)",
    accentColor: "#B09040",
    watchModes: ["family", "partner"],
    synopsis: "A custody battle between two parents who both love their son forces each to confront who they actually are. A compassionate examination of how children become the collateral damage of their parents' unfinished business.",
    insights: []
  },

  {
    id: "the-squid-and-the-whale",
    trigger: "Growing up inside your parents' war",
    // The Squid and the Whale (2005)
    year: 2005,
    duration: "1 hr 21 min",
    categories: ["family", "identity"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a6/The_Squid_and_the_Whale_poster.png",
    gradient: "linear-gradient(155deg, #2e1408, #1a0c08, #060508)",
    accentColor: "#988850",
    watchModes: ["solo"],
    synopsis: "Two brothers in 1980s Brooklyn navigate their parents' acrimonious divorce — each boy absorbing a different parent's worst qualities as a way of coping. A sharp, uncomfortable portrait of how divorce lives inside children for years.",
    insights: []
  },

  // ─── SELF-WORTH ───────────────────────────────────────────────────────────

  {
    id: "pursuit-of-happyness",
    trigger: "Building yourself when the world says you can't",
    // The Pursuit of Happyness (2006)
    year: 2006,
    duration: "1 hr 57 min",
    categories: ["self-worth", "resilience"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/81/Poster-pursuithappyness.jpg",
    gradient: "linear-gradient(155deg, #0a1e0a, #0a1408, #060508)",
    accentColor: "#80A860",
    watchModes: ["solo", "family"],
    synopsis: "A man in freefall — homeless, failing, overlooked — refuses to pass his despair to his young son and rebuilds his life through will and presence. A portrait of dignity under pressure and self-worth as an act of stubborn daily commitment.",
    insights: []
  },

  {
    id: "precious",
    trigger: "Carrying abuse while no one believes it happened",
    // Precious (2009)
    year: 2009,
    duration: "1 hr 50 min",
    categories: ["self-worth", "family"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/9f/Precious2009poster.jpg",
    gradient: "linear-gradient(155deg, #0a1e0a, #0a1408, #060508)",
    accentColor: "#6A9860",
    watchModes: ["solo"],
    synopsis: "A teenager in Harlem, abused and invisible, discovers language, community, and for the first time a space in which she is worth something. A fierce and compassionate portrait of what it takes to believe in your own worth when no one has ever reflected it back.",
    insights: []
  },

  {
    id: "i-tonya",
    trigger: "A world that rewards you, then destroys you",
    // I, Tonya (2017)
    year: 2017,
    duration: "1 hr 59 min",
    categories: ["self-worth", "resilience"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/0/0e/I%2C_Tonya_%282017_film%29.png",
    gradient: "linear-gradient(155deg, #0a1e0a, #0a1408, #060508)",
    accentColor: "#78A858",
    watchModes: ["solo"],
    synopsis: "Tonya Harding tells her story — of becoming the best in the world despite a system built to exclude her, and the forces that dismantled everything she worked for. An angry, vital exploration of class, ambition, and how systems punish those who don't fit the image.",
    insights: []
  },

  {
    id: "gifted",
    trigger: "When being exceptional makes you feel more alone",
    // Gifted (2017)
    year: 2017,
    duration: "1 hr 41 min",
    categories: ["self-worth", "family"],
    healingStage: "understanding",
    poster: "https://upload.wikimedia.org/wikipedia/en/4/43/Gifted_poster.jpeg",
    gradient: "linear-gradient(155deg, #0a1e0a, #0a1408, #060508)",
    accentColor: "#90B870",
    watchModes: ["solo", "family"],
    synopsis: "A child prodigy is fought over by the adults who love her — each convinced they know what's best — as she quietly tries to figure out who she is outside her gift. A warm, careful film about the cost of being defined by one extraordinary quality.",
    insights: []
  },

  {
    id: "the-whale",
    trigger: "Believing you are beyond being loved — and being wrong",
    // The Whale (2022)
    year: 2022,
    duration: "1 hr 57 min",
    categories: ["self-worth", "grief"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/f/f3/TheWhalePoster.jpg",
    gradient: "linear-gradient(155deg, #0a1e0a, #0a1408, #060508)",
    accentColor: "#70A068",
    watchModes: ["solo"],
    synopsis: "A man who has given up on himself makes one last attempt to reconnect with his estranged daughter before it's too late. A difficult, compassionate portrait of shame, self-destruction, and the devastating belief that one is undeserving of love.",
    insights: []
  },

  {
    id: "brooklyn",
    trigger: "Choosing yourself when everyone expects you to shrink",
    // Brooklyn (2015)
    year: 2015,
    duration: "1 hr 52 min",
    categories: ["self-worth", "identity"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/5/5b/Brooklyn_FilmPoster.jpg",
    gradient: "linear-gradient(155deg, #0a1e0a, #0a1408, #060508)",
    accentColor: "#88B878",
    watchModes: ["solo"],
    synopsis: "A young Irish woman emigrates to Brooklyn and slowly, painfully builds a self of her own choosing — only to be tested when home pulls her back. A quiet study of how women learn to take up space and make choices that belong to them alone.",
    insights: []
  },

  {
    id: "maid",
    trigger: "Starting over with nothing and a child depending on you",
    // Maid (TV, 2021)
    year: 2021,
    duration: "6 hr 2 min",
    categories: ["self-worth", "resilience"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/f/fb/Maid_%28miniseries%29.png",
    gradient: "linear-gradient(155deg, #0a1e0a, #0a1408, #060508)",
    accentColor: "#78A870",
    watchModes: ["solo"],
    synopsis: "A young mother escapes an abusive relationship with nothing and navigates a system designed to keep her trapped. A visceral, grounded portrait of how poverty, trauma, and self-doubt conspire against women who are already doing everything right.",
    insights: []
  },

  // ─── LONELINESS ───────────────────────────────────────────────────────────

  {
    id: "cast-away",
    trigger: "What you discover about yourself when everyone is gone",
    // Cast Away (2000)
    year: 2000,
    duration: "2 hr 23 min",
    categories: ["loneliness", "resilience"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a7/Cast_away_film_poster.jpg",
    gradient: "linear-gradient(155deg, #08082e, #050518, #060508)",
    accentColor: "#5868A8",
    watchModes: ["solo"],
    synopsis: "A man stranded alone for four years on a Pacific island discovers which parts of himself are essential and which were just noise. A stripped-down meditation on solitude, meaning, and whether the life we return to is still ours.",
    insights: []
  },

  {
    id: "her",
    trigger: "The loneliness you mistook for love",
    // Her (2013)
    year: 2013,
    duration: "2 hr 6 min",
    categories: ["loneliness", "attachment"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/4/44/Her2013Poster.jpg",
    gradient: "linear-gradient(155deg, #08082e, #050518, #060508)",
    accentColor: "#7870B8",
    watchModes: ["solo"],
    synopsis: "A man falls in love with an operating system — and the relationship is entirely real, until it isn't. A prescient, tender exploration of loneliness in the digital age and the question of whether connection can exist without two physical bodies.",
    insights: []
  },

  {
    id: "the-lighthouse",
    trigger: "Isolation that turns the mind against itself",
    // The Lighthouse (2019)
    year: 2019,
    duration: "1 hr 49 min",
    categories: ["loneliness", "identity"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/2/2c/The_Lighthouse.jpeg",
    gradient: "linear-gradient(155deg, #08082e, #050518, #060508)",
    accentColor: "#5060A0",
    watchModes: ["solo"],
    synopsis: "Two men trapped together on a remote lighthouse descend into paranoia, resentment, and mutual destruction. A mythic, claustrophobic portrait of what isolation and power imbalance can do to the human mind.",
    insights: []
  },

  {
    id: "a-single-man",
    trigger: "Holding yourself together through unspeakable loss",
    // A Single Man (2009)
    year: 2009,
    duration: "1 hr 39 min",
    categories: ["loneliness", "grief"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/1/1c/A_Single_Man.jpg",
    gradient: "linear-gradient(155deg, #08082e, #050518, #060508)",
    accentColor: "#6070A8",
    watchModes: ["solo"],
    synopsis: "A professor grieving the death of his partner decides to end his life — and spends one last day noticing the world with devastating clarity. A gorgeous, sorrowful meditation on invisible grief, gay loss, and the surprising reasons a person stays.",
    insights: []
  },

  {
    id: "the-remains-of-the-day",
    trigger: "The life you didn't live because you were too careful",
    // The Remains of the Day (1993)
    year: 1993,
    duration: "2 hr 14 min",
    categories: ["loneliness", "attachment"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/9e/Remains_of_the_day.jpg",
    gradient: "linear-gradient(155deg, #08082e, #050518, #060508)",
    accentColor: "#7080A0",
    watchModes: ["solo"],
    synopsis: "A devoted English butler realises, too late, that his devotion to duty cost him the only person who truly saw him. A quiet, heartbreaking exploration of emotional repression and the love that was never allowed to be expressed.",
    insights: []
  },

  {
    id: "the-hours-loneliness",
    trigger: "Surrounded by people, invisible to everyone including yourself",
    // The Hours (2002) — loneliness angle
    year: 2002,
    duration: "1 hr 54 min",
    categories: ["loneliness", "grief"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/e/e6/The_Hours_poster.jpg",
    gradient: "linear-gradient(155deg, #08082e, #050518, #060508)",
    accentColor: "#8078A8",
    watchModes: ["solo"],
    synopsis: "Across three timelines, women suffocating inside their expected lives discover that the deepest loneliness is not being alone but being unseen. A film about the isolation of performing a life that was never yours.",
    insights: []
  },

  {
    id: "lost-in-translation-loneliness",
    trigger: "Two strangers more honest with each other than anyone at home",
    // Lost in Translation (2003) — loneliness angle
    year: 2003,
    duration: "1 hr 41 min",
    categories: ["loneliness", "identity"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/4/4c/Lost_in_Translation_poster.jpg",
    gradient: "linear-gradient(155deg, #08082e, #050518, #060508)",
    accentColor: "#6870A8",
    watchModes: ["solo"],
    synopsis: "Two Americans meet in the transient glow of a Tokyo hotel and discover in each other the only honest conversation either has had in years. A study of how we can be loneliest inside our own lives — and how strangers sometimes see us more clearly than those who love us.",
    insights: []
  },

  // ─── RESILIENCE ───────────────────────────────────────────────────────────

  {
    id: "shawshank-redemption",
    trigger: "Hope as a form of defiance when everything has been taken",
    // The Shawshank Redemption (1994)
    year: 1994,
    duration: "2 hr 22 min",
    categories: ["resilience", "self-worth"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
    gradient: "linear-gradient(155deg, #2e100a, #1a0808, #060508)",
    accentColor: "#B07858",
    watchModes: ["solo"],
    synopsis: "A man wrongly imprisoned over two decades refuses to let the institution take his mind or his hope. A foundational portrait of inner freedom, the power of friendship, and resilience as a slow, patient practice rather than a dramatic gesture.",
    insights: []
  },

  {
    id: "127-hours",
    trigger: "The moment that forces you to choose to live",
    // 127 Hours (2010)
    year: 2010,
    duration: "1 hr 34 min",
    categories: ["resilience", "identity"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/b/b3/127_Hours_Poster.jpg",
    gradient: "linear-gradient(155deg, #2e100a, #1a0808, #060508)",
    accentColor: "#C08050",
    watchModes: ["solo"],
    synopsis: "A hiker trapped alone in a canyon for five days faces the end of his life and discovers what it means to truly want to survive. A visceral, intimate study of the will to live and the relationships we take for granted until we cannot reach them.",
    insights: []
  },

  {
    id: "nomadland",
    trigger: "Building a new life from the rubble of the old one",
    // Nomadland (2020)
    year: 2020,
    duration: "1 hr 48 min",
    categories: ["resilience", "grief"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a5/Nomadland_poster.jpeg",
    gradient: "linear-gradient(155deg, #2e100a, #1a0808, #060508)",
    accentColor: "#B08860",
    watchModes: ["solo"],
    synopsis: "A woman who lost everything in the 2008 recession joins a community of van-dwelling nomads and slowly discovers that grief and freedom can coexist. A tender, unhurried meditation on what it means to start again without pretending the loss wasn't real.",
    insights: []
  },

  {
    id: "the-intouchables",
    trigger: "An unlikely friendship that heals without trying to",
    // The Intouchables (2011)
    year: 2011,
    duration: "1 hr 52 min",
    categories: ["resilience", "loneliness"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/93/The_Intouchables.jpg",
    gradient: "linear-gradient(155deg, #2e100a, #1a0808, #060508)",
    accentColor: "#C08868",
    watchModes: ["solo", "family"],
    synopsis: "A quadriplegic aristocrat and his irreverent young caregiver build an improbable friendship that revives both their lives. A celebration of how genuine human connection — without pity or agenda — is one of the most powerful healing forces there is.",
    insights: []
  },

  {
    id: "rocky",
    trigger: "Proving something to yourself when no one believes in you",
    // Rocky (1976)
    year: 1976,
    duration: "2 hr",
    categories: ["resilience", "self-worth"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/1/18/Rocky_poster.jpg",
    gradient: "linear-gradient(155deg, #2e100a, #1a0808, #060508)",
    accentColor: "#B87860",
    watchModes: ["solo"],
    synopsis: "A small-time boxer gets one impossible shot at the heavyweight title — and decides that lasting the distance is enough to prove he is not just another bum. A foundational portrait of dignity, self-belief, and the difference between winning and proving yourself worthy.",
    insights: []
  },

  {
    id: "wild-resilience",
    trigger: "Earning yourself back one step at a time",
    // Wild (2014) — resilience angle
    year: 2014,
    duration: "1 hr 55 min",
    categories: ["resilience", "grief"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/3/37/Wild2014Poster.jpg",
    gradient: "linear-gradient(155deg, #2e100a, #1a0808, #060508)",
    accentColor: "#A87860",
    watchModes: ["solo"],
    synopsis: "A woman who dismantled her life through grief and addiction reclaims herself by walking the Pacific Crest Trail alone. A film about how physical endurance can become a proxy for the emotional work we're finally ready to do.",
    insights: []
  },

  {
    id: "the-fighter",
    trigger: "Fighting your way free of the family that made you",
    // The Fighter (2010)
    year: 2010,
    duration: "1 hr 56 min",
    categories: ["resilience", "family"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/93/The_Fighter_Poster.jpg",
    gradient: "linear-gradient(155deg, #2e100a, #1a0808, #060508)",
    accentColor: "#C07858",
    watchModes: ["solo", "family"],
    synopsis: "A boxer from a chaotic working-class family must choose between the people who raised him and the future he might actually have. A visceral study of loyalty, enmeshment, and what it costs to pursue your own life when your family needs you to stay small.",
    insights: []
  },

  // ─── ATTACHMENT ───────────────────────────────────────────────────────────

  {
    id: "la-la-land",
    trigger: "Loving someone while both of you are becoming",
    // La La Land (2016)
    year: 2016,
    duration: "2 hr 8 min",
    categories: ["attachment", "identity"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png",
    gradient: "linear-gradient(155deg, #1e0a2e, #140820, #060508)",
    accentColor: "#9870B8",
    watchModes: ["solo", "partner"],
    synopsis: "Two dreamers fall in love in Los Angeles — and discover that the same ambition that drew them together is pulling them apart. A bittersweet study of what it means to love someone through their becoming, and whether love and destiny can occupy the same life.",
    insights: []
  },

  {
    id: "gone-girl",
    trigger: "The performance of love hiding the truth beneath it",
    // Gone Girl (2014)
    year: 2014,
    duration: "2 hr 29 min",
    categories: ["attachment", "relationship"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/0/05/Gone_Girl_Poster.jpg",
    gradient: "linear-gradient(155deg, #1e0a2e, #140820, #060508)",
    accentColor: "#8060A0",
    watchModes: ["solo", "partner"],
    synopsis: "A marriage unravels to reveal two people who were performing versions of themselves neither could sustain. A dark, provocative study of how fear of abandonment and the need to control can calcify into something genuinely dangerous.",
    insights: []
  },

  {
    id: "eternal-sunshine-attachment",
    trigger: "Choosing someone again with full knowledge of the cost",
    // Eternal Sunshine of the Spotless Mind (2004) — attachment angle
    year: 2004,
    duration: "2 hr 8 min",
    categories: ["attachment", "grief"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a4/Eternal_Sunshine_of_the_Spotless_Mind.png",
    gradient: "linear-gradient(155deg, #1e0a2e, #140820, #060508)",
    accentColor: "#7B6FA0",
    watchModes: ["solo", "partner"],
    synopsis: "Two people who erased each other choose each other again — not despite knowing the pain, but informed by it. A study of fearful avoidant attachment and the moment when vulnerability becomes a conscious, courageous act.",
    insights: []
  },

  {
    id: "the-notebook",
    trigger: "A love that refused every practical reason to stop",
    // The Notebook (2004)
    year: 2004,
    duration: "2 hr 3 min",
    categories: ["attachment", "grief"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/86/Posternotebook.jpg",
    gradient: "linear-gradient(155deg, #1e0a2e, #140820, #060508)",
    accentColor: "#A870A0",
    watchModes: ["partner", "solo"],
    synopsis: "A man reads to his wife with dementia every day, hoping to reach her through the memories she is losing. An exploration of what enduring love actually looks like — not as a feeling but as a daily choice in the face of helplessness.",
    insights: []
  },

  {
    id: "brokeback-mountain",
    trigger: "A love you were never allowed to live",
    // Brokeback Mountain (2005)
    year: 2005,
    duration: "2 hr 14 min",
    categories: ["attachment", "identity"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a1/Brokeback_mountain.jpg",
    gradient: "linear-gradient(155deg, #1e0a2e, #140820, #060508)",
    accentColor: "#7060A0",
    watchModes: ["solo"],
    synopsis: "Two men share an intense love over two decades that neither can acknowledge in the world they inhabit. A devastating portrait of suppressed attachment, the grief of unlived lives, and what happens when shame is stronger than desire.",
    insights: []
  },

  {
    id: "call-me-by-your-name",
    trigger: "A summer love that changes everything — and cannot stay",
    // Call Me by Your Name (2017)
    year: 2017,
    duration: "2 hr 12 min",
    categories: ["attachment", "grief"],
    healingStage: "recognition",
    poster: "https://upload.wikimedia.org/wikipedia/en/c/c9/CallMeByYourName2017.png",
    gradient: "linear-gradient(155deg, #1e0a2e, #140820, #060508)",
    accentColor: "#9878B8",
    watchModes: ["solo"],
    synopsis: "A teenage boy falls completely in love over one Italian summer, knowing it cannot last. A luminous study of first attachment, the exquisite pain of loving without holding back, and a father's extraordinary gift of telling his son: feel everything.",
    insights: []
  },

  {
    id: "crazy-rich-asians",
    trigger: "Loving someone whose world was not built for you",
    // Crazy Rich Asians (2018)
    year: 2018,
    duration: "2 hr",
    categories: ["attachment", "self-worth"],
    healingStage: "understanding",
    poster: "https://upload.wikimedia.org/wikipedia/en/b/ba/Crazy_Rich_Asians_poster.png",
    gradient: "linear-gradient(155deg, #1e0a2e, #140820, #060508)",
    accentColor: "#B088C0",
    watchModes: ["solo", "partner"],
    synopsis: "A Chinese-American woman falls in love with a man from an ultra-wealthy Singaporean dynasty — and must decide if she can belong somewhere that keeps making her feel like she isn't enough. A warm exploration of class anxiety, family loyalty, and whether love requires full acceptance or just full honesty.",
    insights: []
  },

  // ─── HEALING ──────────────────────────────────────────────────────────────

  {
    id: "inside-out",
    trigger: "Learning to feel again after you forgot how",
    // Inside Out (2015)
    year: 2015,
    duration: "1 hr 35 min",
    categories: ["healing", "identity"],
    healingStage: "understanding",
    poster: "https://upload.wikimedia.org/wikipedia/en/0/0a/Inside_Out_%282015_film%29_poster.jpg",
    gradient: "linear-gradient(155deg, #0a1e14, #081408, #060508)",
    accentColor: "#60A880",
    watchModes: ["family", "solo"],
    synopsis: "A girl's emotions — Joy, Sadness, Anger, Fear, Disgust — struggle to navigate her world after a major life upheaval. A clinically grounded and emotionally radical argument that sadness is not the enemy of wellbeing but the prerequisite for connection.",
    insights: []
  },

  {
    id: "groundhog-day",
    trigger: "Stuck in the same loop — until you finally change",
    // Groundhog Day (1993)
    year: 1993,
    duration: "1 hr 41 min",
    categories: ["healing", "identity"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/b/b1/Groundhog_Day_%28movie_poster%29.jpg",
    gradient: "linear-gradient(155deg, #0a1e14, #081408, #060508)",
    accentColor: "#78B090",
    watchModes: ["solo"],
    synopsis: "A cynical man relives the same day indefinitely until he exhausts every selfish option and discovers that becoming someone worth knowing is its own form of freedom. A sly, profound portrait of how change is always available and always comes from within.",
    insights: []
  },

  {
    id: "room",
    trigger: "Rebuilding a world after surviving the unthinkable",
    // Room (2015)
    year: 2015,
    duration: "1 hr 58 min",
    categories: ["healing", "resilience"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/c/c2/Room_%282015_film%29.png",
    gradient: "linear-gradient(155deg, #0a1e14, #081408, #060508)",
    accentColor: "#70A878",
    watchModes: ["solo"],
    synopsis: "A woman and her young son, having escaped years of captivity, must now survive freedom — the harder, stranger, less forgiving world beyond the room. An extraordinary portrait of trauma, the complexity of rescue, and the slow, non-linear nature of healing.",
    insights: []
  },

  {
    id: "good-will-hunting-healing",
    trigger: "The moment you finally stop blaming yourself",
    // Good Will Hunting (1997) — healing arc
    year: 1997,
    duration: "2 hr 6 min",
    categories: ["healing", "self-worth"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/5/52/Good_Will_Hunting.png",
    gradient: "linear-gradient(155deg, #0a1e14, #081408, #060508)",
    accentColor: "#80B880",
    watchModes: ["solo"],
    synopsis: "A genius from South Boston finally hears — and believes — that what was done to him was not his fault. Explores the mechanics of therapeutic breakthrough and the extraordinary moment when the defended self finally softens into something that can heal.",
    insights: []
  },

  {
    id: "the-way",
    trigger: "Walking through grief toward something you can't yet name",
    // The Way (2010)
    year: 2010,
    duration: "2 hr 3 min",
    categories: ["healing", "grief"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/1/15/The_Way_poster.png",
    gradient: "linear-gradient(155deg, #0a1e14, #081408, #060508)",
    accentColor: "#68A870",
    watchModes: ["solo", "family"],
    synopsis: "A father walks the Camino de Santiago to honour the son he never understood, carrying his ashes and his regret. A quiet, hopeful film about the kinds of healing that can only happen when we give ourselves permission to be in motion.",
    insights: []
  },

  {
    id: "eat-pray-love",
    trigger: "Leaving the life that looked right but felt wrong",
    // Eat Pray Love (2010)
    year: 2010,
    duration: "2 hr 13 min",
    categories: ["healing", "identity"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/7/7e/Eat_pray_love_ver2.jpg",
    gradient: "linear-gradient(155deg, #0a1e14, #081408, #060508)",
    accentColor: "#88B870",
    watchModes: ["solo"],
    synopsis: "A woman at a crossroads walks away from her life and spends a year in Italy, India, and Bali searching for pleasure, devotion, and balance. A portrait of the courage it takes to admit that a life can look entirely successful and still not be yours.",
    insights: []
  },

  {
    id: "soul",
    trigger: "Searching for the reason you exist at all",
    // Soul (2020)
    year: 2020,
    duration: "1 hr 40 min",
    categories: ["healing", "identity"],
    healingStage: "transformation",
    poster: "https://upload.wikimedia.org/wikipedia/en/3/39/Soul_%282020_film%29_poster.jpg",
    gradient: "linear-gradient(155deg, #0a1e14, #081408, #060508)",
    accentColor: "#70B898",
    watchModes: ["solo", "family"],
    synopsis: "A jazz musician on the verge of his dream is suddenly forced to reckon with whether purpose is found in achievement or in the texture of being alive at all. A profound, gentle argument that the point is not to find your spark but to be present for your life.",
    insights: []
  }

];

// ─── CATEGORY METADATA ────────────────────────────────────────────────────────

const CATEGORIES = {
  grief: {
    label: "Grief & Loss",
    desc: "Films for when you are carrying loss — recent or ancient, acknowledged or buried.",
    color: "#8878A8",
    gradient: "linear-gradient(135deg, #1a0a2e, #0d0f2a)"
  },
  relationship: {
    label: "Love & Relationships",
    desc: "Films for when love is complicated — breaking down, building up, or finally making sense.",
    color: "#A87878",
    gradient: "linear-gradient(135deg, #2e0a0a, #1a0808)"
  },
  anxiety: {
    label: "Anxiety & The Mind",
    desc: "Films for when your own thinking feels like the threat.",
    color: "#60A898",
    gradient: "linear-gradient(135deg, #0a1e1e, #0a1428)"
  },
  identity: {
    label: "Identity & Becoming",
    desc: "Films for when you don't know who you are — or who you're allowed to be.",
    color: "#8888B8",
    gradient: "linear-gradient(135deg, #0a0a2e, #080a1e)"
  },
  family: {
    label: "Family Wounds",
    desc: "Films for the pain that started before you had words for it.",
    color: "#B08858",
    gradient: "linear-gradient(135deg, #2e1408, #1a0c08)"
  },
  "self-worth": {
    label: "Self-Worth",
    desc: "Films for when you struggle to believe you are enough.",
    color: "#80A868",
    gradient: "linear-gradient(135deg, #0a1e0a, #0a1408)"
  },
  loneliness: {
    label: "Loneliness",
    desc: "Films for the feeling of being unseen — in a crowd, in a relationship, in your own life.",
    color: "#6878A8",
    gradient: "linear-gradient(135deg, #08082e, #050518)"
  },
  resilience: {
    label: "Resilience",
    desc: "Films for when you need to be reminded that people survive, and sometimes flourish.",
    color: "#B08068",
    gradient: "linear-gradient(135deg, #2e100a, #1a0808)"
  },
  attachment: {
    label: "Love & Attachment",
    desc: "Films for fear of intimacy, the push-pull of closeness, and learning to let people stay.",
    color: "#9878B8",
    gradient: "linear-gradient(135deg, #1e0a2e, #140820)"
  },
  healing: {
    label: "Healing Arc",
    desc: "Films that show the way through — integration, peace, and the possibility of becoming whole.",
    color: "#70A880",
    gradient: "linear-gradient(135deg, #0a1e14, #081408)"
  }
};

// ─── HEALING STAGES ───────────────────────────────────────────────────────────

const HEALING_STAGES = {
  recognition: {
    label: "Recognition",
    desc: "This film mirrors your experience. It says: you are not alone in this.",
    icon: "◎"
  },
  understanding: {
    label: "Understanding",
    desc: "This film explains the pattern. It says: here is why this happens.",
    icon: "◈"
  },
  transformation: {
    label: "Transformation",
    desc: "This film shows the way through. It says: this is what becoming looks like.",
    icon: "◆"
  }
};

// ─── THERAPEUTIC FRAMEWORKS ───────────────────────────────────────────────────

const FRAMEWORKS = {
  PSY: { name: "Psychodynamic",  desc: "Exploring unconscious patterns shaped by the past" },
  ATT: { name: "Attachment",     desc: "Understanding your patterns in close relationships" },
  CBT: { name: "CBT",            desc: "Examining the thoughts that are driving your feelings" },
  IFS: { name: "Parts Work",     desc: "Meeting the different parts of yourself with curiosity" },
  NDT: { name: "Narrative",      desc: "Re-authoring the story you tell about yourself" },
  ACT: { name: "Acceptance",     desc: "Choosing based on your values, not your fear" },
  SOM: { name: "Somatic",        desc: "Listening to what your body already knows" }
};

// ─── CONTENT FLAGS ────────────────────────────────────────────────────────────
// Trigger-warning vocabulary. Shown to users BEFORE a film begins.
// Severity tiers let the UI mute mild flags by default for some users.

const FLAG_LABELS = {
  suicide:              { label: "Suicide or suicidal ideation",         severity: "high" },
  suicide_attempt:      { label: "On-screen suicide attempt",            severity: "high" },
  self_harm:            { label: "Self-harm",                            severity: "high" },
  child_death:          { label: "Death of a child",                     severity: "high" },
  child_abuse:          { label: "Child abuse",                          severity: "high" },
  child_sexual_abuse:   { label: "Child sexual abuse",                   severity: "high" },
  sexual_violence:      { label: "Sexual violence",                      severity: "high" },
  abduction_captivity:  { label: "Abduction or captivity",               severity: "high" },
  graphic_injury:       { label: "Graphic injury or bodily harm",        severity: "high" },
  overdose:             { label: "Drug overdose",                        severity: "high" },
  domestic_violence:    { label: "Domestic violence",                    severity: "high" },
  addiction:            { label: "Active addiction",                     severity: "med"  },
  emotional_abuse:      { label: "Emotional or psychological abuse",     severity: "med"  },
  death_of_loved_one:   { label: "Death of a loved one",                 severity: "med"  },
  pregnancy_loss:       { label: "Pregnancy loss or abortion",           severity: "med"  },
  terminal_illness:     { label: "Terminal illness",                     severity: "med"  },
  dementia:             { label: "Dementia or cognitive decline",        severity: "med"  },
  psychosis:            { label: "Psychosis or severe dissociation",     severity: "med"  },
  eating_disorder:      { label: "Disordered eating",                    severity: "med"  },
  homophobic_violence:  { label: "Homophobic violence",                  severity: "high" },
  war_violence:         { label: "War-related violence",                 severity: "med"  },
  divorce:              { label: "Divorce or separation",                severity: "low"  },
  alcoholism:           { label: "Alcoholism",                           severity: "med"  },
  bipolar:              { label: "Bipolar disorder",                     severity: "low"  },
  ocd:                  { label: "OCD",                                  severity: "low"  },
  grief:                { label: "Grief",                                severity: "low"  },
  isolation:            { label: "Extreme isolation",                    severity: "low"  },
  poverty:              { label: "Severe poverty or homelessness",       severity: "low"  },
};

const FILM_FLAGS = {
  // Originally curated set
  "eternal-sunshine":          ["grief"],
  "before-sunrise":            [],
  "500-days-of-summer":        [],
  "lost-in-translation":       ["isolation"],
  "her":                       ["isolation"],
  "the-remains-of-the-day":    [],
  "brooklyn":                  ["death_of_loved_one"],
  "rocky":                     [],
  "la-la-land":                [],
  "the-notebook":              ["dementia"],
  "call-me-by-your-name":      ["grief"],
  "crazy-rich-asians":         [],
  "inside-out":                ["grief"],
  "soul":                      [],
  "eat-pray-love":             ["divorce"],
  "manchester-by-the-sea":     ["child_death", "suicide_attempt", "alcoholism", "grief"],
  "wild":                      ["addiction", "death_of_loved_one", "sexual_violence"],
  "rabbit-hole":               ["child_death", "grief"],
  "the-hours":                 ["suicide", "self_harm"],
  "still-alice":               ["dementia", "terminal_illness"],
  "a-ghost-story":             ["death_of_loved_one", "grief"],
  "marriage-story":            ["divorce", "emotional_abuse"],
  "blue-valentine":            ["divorce", "addiction"],
  "revolutionary-road":        ["pregnancy_loss", "emotional_abuse", "divorce"],
  "normal-people":             ["emotional_abuse", "self_harm"],
  "atonement":                 ["sexual_violence", "war_violence", "death_of_loved_one"],
  "a-beautiful-mind":          ["psychosis"],
  "whiplash":                  ["emotional_abuse", "graphic_injury"],
  "black-swan":                ["psychosis", "self_harm", "eating_disorder"],
  "silver-linings-playbook":   ["bipolar", "domestic_violence"],
  "perks-of-being-a-wallflower":["child_sexual_abuse", "suicide", "self_harm"],
  "as-good-as-it-gets":        ["ocd"],
  "melancholia":               ["suicide"],
  "moonlight":                 ["child_abuse", "addiction", "homophobic_violence"],
  "good-will-hunting":         ["child_abuse"],
  "into-the-wild":             ["isolation", "death_of_loved_one"],
  "boyhood":                   ["divorce", "alcoholism", "domestic_violence"],
  "lady-bird":                 ["divorce"],
  "bohemian-rhapsody":         ["terminal_illness", "addiction"],
  "ordinary-people":           ["suicide_attempt", "death_of_loved_one"],
  "august-osage-county":       ["suicide", "addiction"],
  "beautiful-boy":             ["addiction", "overdose"],
  "little-miss-sunshine":      ["suicide"],
  "terms-of-endearment":       ["terminal_illness", "death_of_loved_one"],
  "kramer-vs-kramer":          ["divorce"],
  "the-squid-and-the-whale":   ["divorce", "emotional_abuse"],
  "pursuit-of-happyness":      ["poverty"],
  "precious":                  ["child_sexual_abuse", "child_abuse", "terminal_illness"],
  "i-tonya":                   ["domestic_violence", "child_abuse"],
  "gifted":                    ["suicide", "death_of_loved_one"],
  "the-whale":                 ["terminal_illness", "suicide", "eating_disorder"],
  "maid":                      ["domestic_violence", "poverty", "emotional_abuse"],
  "cast-away":                 ["isolation", "graphic_injury", "death_of_loved_one"],
  "the-lighthouse":            ["psychosis", "isolation"],
  "a-single-man":              ["suicide", "death_of_loved_one"],
  "shawshank-redemption":      ["sexual_violence", "suicide", "graphic_injury"],
  "127-hours":                 ["graphic_injury", "isolation"],
  "nomadland":                 ["grief", "poverty", "death_of_loved_one"],
  "the-intouchables":          [],
  "the-fighter":               ["addiction"],
  "gone-girl":                 ["emotional_abuse", "graphic_injury"],
  "the-notebook":              ["dementia"],
  "brokeback-mountain":        ["homophobic_violence"],
  "room":                      ["abduction_captivity", "child_abuse", "sexual_violence"],
  "the-way":                   ["death_of_loved_one"],
  "groundhog-day":             ["suicide"],

  // Duplicate-angle entries inherit from their primary film
  "the-hours-loneliness":              ["suicide"],
  "lost-in-translation-loneliness":    [],
  "wild-resilience":                   ["addiction", "death_of_loved_one", "sexual_violence"],
  "eternal-sunshine-attachment":       [],
  "good-will-hunting-healing":         ["child_abuse"],
};

// Real film titles — used for streaming-service title matching (extension)
// and outbound search links (JustWatch). The on-screen "trigger" stays poetic.
const FILM_TITLES = {
  "eternal-sunshine": "Eternal Sunshine of the Spotless Mind",
  "manchester-by-the-sea": "Manchester by the Sea",
  "wild": "Wild",
  "rabbit-hole": "Rabbit Hole",
  "the-hours": "The Hours",
  "still-alice": "Still Alice",
  "a-ghost-story": "A Ghost Story",
  "marriage-story": "Marriage Story",
  "before-sunrise": "Before Sunrise",
  "blue-valentine": "Blue Valentine",
  "revolutionary-road": "Revolutionary Road",
  "500-days-of-summer": "500 Days of Summer",
  "normal-people": "Normal People",
  "atonement": "Atonement",
  "a-beautiful-mind": "A Beautiful Mind",
  "whiplash": "Whiplash",
  "black-swan": "Black Swan",
  "silver-linings-playbook": "Silver Linings Playbook",
  "perks-of-being-a-wallflower": "The Perks of Being a Wallflower",
  "as-good-as-it-gets": "As Good as It Gets",
  "melancholia": "Melancholia",
  "moonlight": "Moonlight",
  "good-will-hunting": "Good Will Hunting",
  "lost-in-translation": "Lost in Translation",
  "into-the-wild": "Into the Wild",
  "boyhood": "Boyhood",
  "lady-bird": "Lady Bird",
  "bohemian-rhapsody": "Bohemian Rhapsody",
  "ordinary-people": "Ordinary People",
  "august-osage-county": "August: Osage County",
  "beautiful-boy": "Beautiful Boy",
  "little-miss-sunshine": "Little Miss Sunshine",
  "terms-of-endearment": "Terms of Endearment",
  "kramer-vs-kramer": "Kramer vs. Kramer",
  "the-squid-and-the-whale": "The Squid and the Whale",
  "pursuit-of-happyness": "The Pursuit of Happyness",
  "precious": "Precious",
  "i-tonya": "I, Tonya",
  "gifted": "Gifted",
  "the-whale": "The Whale",
  "brooklyn": "Brooklyn",
  "maid": "Maid",
  "cast-away": "Cast Away",
  "her": "Her",
  "the-lighthouse": "The Lighthouse",
  "a-single-man": "A Single Man",
  "the-remains-of-the-day": "The Remains of the Day",
  "the-hours-loneliness": "The Hours",
  "lost-in-translation-loneliness": "Lost in Translation",
  "shawshank-redemption": "The Shawshank Redemption",
  "127-hours": "127 Hours",
  "nomadland": "Nomadland",
  "the-intouchables": "The Intouchables",
  "rocky": "Rocky",
  "wild-resilience": "Wild",
  "the-fighter": "The Fighter",
  "la-la-land": "La La Land",
  "gone-girl": "Gone Girl",
  "eternal-sunshine-attachment": "Eternal Sunshine of the Spotless Mind",
  "the-notebook": "The Notebook",
  "brokeback-mountain": "Brokeback Mountain",
  "call-me-by-your-name": "Call Me by Your Name",
  "crazy-rich-asians": "Crazy Rich Asians",
  "inside-out": "Inside Out",
  "groundhog-day": "Groundhog Day",
  "room": "Room",
  "good-will-hunting-healing": "Good Will Hunting",
  "the-way": "The Way",
  "eat-pray-love": "Eat Pray Love",
  "soul": "Soul",
};

// Attach flags AND titles to each film at load time
BRODONAM_MOVIES.forEach(m => {
  m.contentFlags = FILM_FLAGS[m.id] || [];
  m.title        = FILM_TITLES[m.id] || m.trigger;
});

if (typeof module !== "undefined") {
  module.exports = { BRODONAM_MOVIES, CATEGORIES, HEALING_STAGES, FRAMEWORKS, FLAG_LABELS, FILM_FLAGS, FILM_TITLES };
}
