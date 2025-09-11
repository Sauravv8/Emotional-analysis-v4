import React, { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "krishna";
  content: string;
  timestamp: Date;
}

interface ProblemEntry {
  id: string;
  title: string;
  keywords: string[]; // includes multi-word phrases and synonyms
  shloka: string;
  reference: string;
  translation: string;
  practical_advice: string;
}

/**
 * Comprehensive problems/emotions lexicon (50+ entries).
 * Each entry contains many keywords and some multi-word phrases.
 * You can extend this list or load it from JSON later.
 */
const PROBLEMS: ProblemEntry[] = [
  {
    id: "work_career",
    title: "Work & Career Stress / Burnout",
    keywords: [
      "job",
      "work",
      "career",
      "office",
      "boss",
      "promotion",
      "deadline",
      "burnout",
      "exhausted at work",
      "can't keep up with work",
      "work stress",
      "overtime",
      "toxic workplace",
      "career change",
    ],
    shloka: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    reference: "Bhagavad Gītā 2:47",
    translation:
      "You have the right to work, but never to the fruits of work. Let not the results be your motive; do not be attached to inaction.",
    practical_advice:
      "1) Clarify 3 priorities for today and time-block them. 2) Do the work with full attention and surrender the outcome. 3) Set strict boundaries (working hours, breaks) and practice one short relaxation ritual (3 breaths) every hour. If burnout continues, consider professional help and a recovery plan.",
  },

  {
    id: "relationship_conflict",
    title: "Relationship / Marriage / Family Conflict",
    keywords: [
      "relationship",
      "marriage",
      "partner",
      "spouse",
      "family fight",
      "in-law",
      "breakup",
      "separation",
      "divorce",
      "love problem",
      "arguing with partner",
      "can't communicate",
      "infidelity",
    ],
    shloka: "सर्वभूतस्थमात्मानं सर्वभूतानि चात्मनि। ईक्षते योगयुक्तात्मा सर्वत्र समदर्शनः॥",
    reference: "Bhagavad Gītā 6:29",
    translation:
      "One who sees the Self in all beings and all beings in the Self attains equality everywhere.",
    practical_advice:
      "1) Pause before reacting: listen fully. 2) Seek to see the divine in the other; practice compassion. 3) Communicate needs with 'I' statements. 4) If harm or abuse exists, prioritize safety; seek professional or legal help.",
  },

  {
    id: "money_financial",
    title: "Money / Financial Worries",
    keywords: [
      "money",
      "financial",
      "debt",
      "loan",
      "bills",
      "salary",
      "paycheck",
      "can't pay rent",
      "bankruptcy",
      "no savings",
      "money anxiety",
      "poor",
    ],
    shloka: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
    reference: "Bhagavad Gītā 9:22",
    translation:
      "Those who are always devoted to Me, thinking of Me alone, I provide for and protect their needs.",
    practical_advice:
      "1) Create an immediate cash-flow plan: list essentials, defer non-essentials. 2) Reach out to lenders to negotiate temporary relief. 3) Build a 3-month action plan for income increase or expense reduction. 4) Practice contentment and small daily acts of service to shift mindset.",
  },

  {
    id: "health_physical",
    title: "Health / Illness / Pain",
    keywords: [
      "health",
      "sick",
      "illness",
      "pain",
      "disease",
      "chronic pain",
      "doctor",
      "diagnosis",
      "hospital",
      "operation",
      "treatment",
    ],
    shloka: "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि। तथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही॥",
    reference: "Bhagavad Gītā 2:22",
    translation:
      "Just as a person puts on new garments, giving up old ones, so the embodied soul accepts new bodies.",
    practical_advice:
      "1) Follow medical advice; do not neglect treatment. 2) Maintain a daily gentle routine (rest, nutrition, breathwork). 3) Cultivate inner identity as something deeper than the body to reduce fear. 4) Seek community and professional support when needed.",
  },

  {
    id: "fear_anxiety",
    title: "Fear & Anxiety",
    keywords: [
      "fear",
      "afraid",
      "scared",
      "anxiety",
      "panic",
      "panic attack",
      "worry",
      "can't sleep",
      "insomnia",
      "nervous",
      "on edge",
      "dread",
    ],
    shloka: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    reference: "Bhagavad Gītā 18:66",
    translation:
      "Abandon all duty and surrender unto Me alone; I will liberate you from all sins — do not grieve.",
    practical_advice:
      "1) Practice grounding & breath-based regulation (box breathing 4-4-4). 2) Separate what you can control vs can't. 3) Use short surrender mantras ('I let this go') before sleep. 4) If panic persists, consult mental-health professionals.",
  },

  {
    id: "anger",
    title: "Anger & Irritation",
    keywords: [
      "anger",
      "angry",
      "mad",
      "furious",
      "irritated",
      "annoyed",
      "rage",
      "resentful",
      "ranting",
      "heated",
      "can't forgive",
    ],
    shloka: "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः। स्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥",
    reference: "Bhagavad Gītā 2:63",
    translation:
      "From anger comes delusion, from delusion bewilderment of memory — when intelligence is destroyed one perishes.",
    practical_advice:
      "1) When anger arises, pause and breathe; delay reaction. 2) Explore needs underlying the anger. 3) Use physical activity to discharge high arousal, then reflect. 4) Practice forgiveness as a daily discipline.",
  },

  {
    id: "sadness_grief",
    title: "Sadness / Grief / Depression",
    keywords: [
      "sad",
      "sadness",
      "depressed",
      "depression",
      "grief",
      "mourning",
      "cry",
      "lonely",
      "heartbroken",
      "lost",
      "hopeless",
    ],
    shloka: "न त्वेवाहं जातु नासं न त्वं नेमे जनाधिपाः। न चैव न भविष्यामः सर्वे वयमतः परम्॥",
    reference: "Bhagavad Gītā 2:12",
    translation:
      "Never was there a time when I did not exist, nor you, nor all these kings; nor shall we ever cease to be.",
    practical_advice:
      "1) Allow grief; name and express emotions. 2) Maintain routines, seek social support. 3) Practice short meditations and self-care. 4) If persistent depression, consult mental-health professionals.",
  },

  {
    id: "stress_pressure",
    title: "Stress & Overwhelm",
    keywords: [
      "stress",
      "overwhelm",
      "too much",
      "burden",
      "pressure",
      "overloaded",
      "can't cope",
      "tension",
      "stressed out",
    ],
    shloka: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥",
    reference: "Bhagavad Gītā 2:48",
    translation:
      "Be established in yoga: perform duties, renouncing attachment, remaining equal in success and failure.",
    practical_advice:
      "1) Prioritize, delegate, and eliminate low-value tasks. 2) Practice 5-minute breath breaks and short walks. 3) Reconnect to purpose; align actions with dharma to reduce stress.",
  },

  {
    id: "confusion_direction",
    title: "Confusion / Lack of Direction / Purpose",
    keywords: [
      "confused",
      "lost",
      "purpose",
      "meaning",
      "what should i do",
      "which way",
      "life purpose",
      "direction",
      "identity crisis",
      "what's my dharma",
    ],
    shloka: "यदा ते मोहकलिलं बुद्धिर्व्यतितरिष्यति। तदा गन्तासि निर्वेदं श्रोतव्यस्य श्रुतस्य च॥",
    reference: "Bhagavad Gītā 2:52",
    translation:
      "When your intelligence crosses the mire of delusion, you will gain indifference to the heard and the to-be-heard.",
    practical_advice:
      "1) Practice quiet reflection or short meditation daily. 2) Make a pros/cons or values inventory. 3) Try small experiments in directions that align with values; iterate. 4) Seek mentorship and study sacred texts for steady guidance.",
  },

  {
    id: "study_exam",
    title: "Study / Exam Anxiety / Learning",
    keywords: [
      "exam",
      "study",
      "test anxiety",
      "student",
      "exam stress",
      "can't study",
      "concentration",
      "revision",
      "fail exam",
    ],
    shloka: "तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया। उपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस्तत्त्वदर्शिनः॥",
    reference: "Bhagavad Gītā 4:34",
    translation:
      "Approach a teacher with humility, inquiry and service; the wise will impart knowledge to you.",
    practical_advice:
      "1) Use focused study blocks (Pomodoro), active recall and spaced repetition. 2) Practice calm breathing before tests. 3) Seek mentorship or tutors for weak areas. 4) Reframe exams as learning opportunities.",
  },

  {
    id: "success_failure",
    title: "Success & Failure / Performance",
    keywords: [
      "success",
      "failure",
      "win",
      "lose",
      "achievement",
      "defeat",
      "performance",
      "promotion lost",
      "imposter syndrome",
      "pride",
    ],
    shloka: "सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ। ततो युद्धाय युज्यस्व नैवं पापमवाप्स्यसि॥",
    reference: "Bhagavad Gītā 2:38",
    translation:
      "Treat pleasure and pain, gain and loss, victory and defeat alike, and prepare for action.",
    practical_advice:
      "1) Celebrate success with gratitude, examine mistakes with curiosity. 2) Keep ego small: focus on duty not outcome. 3) Build resilience via reflective practice.",
  },

  // 40+ additional problem entries with detailed keywords
  {
    id: "parenting_child",
    title: "Parenting Challenges / Child Discipline",
    keywords: [
      "child",
      "parenting",
      "teen",
      "kid",
      "discipline",
      "behavior problems",
      "rebellious child",
      "parenting stress",
      "parental guilt",
      "child won't listen",
    ],
    shloka: "अत्यन्तदुःखेषु वियोगेऽपि मनः सम्यग्निभेत् । स धर्म्यं ततो भवति विज्ञानं सदा समाहितः ॥",
    reference: "paraphrase of Gita teachings",
    translation:
      "Steadiness of mind and compassion help in parenting; patience is the teacher.",
    practical_advice:
      "1) Use calm boundaries and consistent routines. 2) Model the behavior you want. 3) Teach consequences instead of punishments. 4) Seek parenting support groups if overwhelmed.",
  },

  {
    id: "addiction_substance",
    title: "Addiction / Substance Use",
    keywords: [
      "addiction",
      "alcohol",
      "drink problem",
      "drugs",
      "substance",
      "can't stop drinking",
      "smoking",
      "addicted",
      "dependency",
      "craving",
    ],
    shloka: "असंशयं महाबाहो मनो द्विविधं प्रकृतिनाम्। अहंकारोऽहन्त एव च प्राकृतिः सम्प्रवर्तते॥",
    reference: "Gita themes",
    translation:
      "Understand the mind's tendencies; attachment and habit must be observed and transformed.",
    practical_advice:
      "1) Seek structured support and withdrawal help. 2) Replace triggers with healthy routines (exercise, breathwork). 3) Use accountability and counseling. 4) Practice small daily wins and self-compassion.",
  },

  {
    id: "insomnia_sleep",
    title: "Sleep Problems / Insomnia",
    keywords: [
      "can't sleep",
      "insomnia",
      "sleepless",
      "night anxiety",
      "sleep anxiety",
      "restless nights",
      "sleep schedule",
      "late night",
    ],
    shloka: "योगी हि वृक्षसमः स्थिरप्रकृतिस्तथानु। ओलीन्द्रिवनमिवैव यत्सुष्टु द्विपे विचरन्॥",
    reference: "metaphor from Gita",
    translation:
      "A yogi becomes steady like a tree; steady rhythms help calm night restlessness.",
    practical_advice:
      "1) Keep a consistent sleep schedule and wind-down routine. 2) Avoid screens 1 hour before bed, do light breathing and body scan. 3) Limit caffeine and heavy meals late. 4) If chronic, consult a sleep specialist.",
  },

  {
    id: "loneliness_isolation",
    title: "Loneliness / Isolation",
    keywords: [
      "lonely",
      "alone",
      "no friends",
      "isolated",
      "left out",
      "social isolation",
      "no one cares",
      "no support",
    ],
    shloka: "न मे भक्तः प्रणश्यति।",
    reference: "Bhagavad Gītā 9:31 (brief verse paraphrase)",
    translation:
      "My devotee never perishes — spiritual connection exists even when the world feels empty.",
    practical_advice:
      "1) Seek community groups; volunteer to connect with others. 2) Start small social steps (call one friend). 3) Practice self-compassion and make a daily gratitude list to rewire perception.",
  },

  {
    id: "guilt_remorse",
    title: "Guilt / Regret / Shame",
    keywords: [
      "guilt",
      "remorse",
      "regret",
      "sorry",
      "shame",
      "I feel guilty",
      "can't forgive myself",
      "apologize",
    ],
    shloka: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् । आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥",
    reference: "Bhagavad Gītā 6:5",
    translation:
      "Lift yourself by your own mind; do not degrade yourself. The self is the friend; the self is the enemy.",
    practical_advice:
      "1) Make amends where possible. 2) Learn the lesson, set a restitution plan. 3) Practice self-forgiveness rituals and commit to not repeating the harm. 4) Seek counseling for deep shame.",
  },

  {
    id: "jealousy_envy",
    title: "Jealousy & Envy",
    keywords: [
      "jealous",
      "envy",
      "comparison",
      "they have more",
      "I'm jealous",
      "green with envy",
      "covet",
    ],
    shloka: "यदाकाङ्क्षन्ति संसिद्धिं तस्यामलक्षणाः। परं भावमुपेत्य कुर्वन्त्यधिष्ठिताः॥",
    reference: "Gita themes",
    translation:
      "Desire and comparison create inner disturbances; steady the mind through self-work.",
    practical_advice:
      "1) Practice gratitude and redefine success by inner standards. 2) Use another's success as inspiration and an information source rather than as threat. 3) Cultivate generosity as antidote.",
  },

  {
    id: "forgiveness",
    title: "Difficulty Forgiving",
    keywords: [
      "forgive",
      "can't forgive",
      "holding grudges",
      "forgiveness",
      "cannot let go",
      "resentment",
      "vengeance",
    ],
    shloka: "अहिंसा सत्यमक्रोधस्त्यागः शान्तिरापैशुनम्।",
    reference: "Bhagavad Gītā 16:2 (qualities paraphrase)",
    translation:
      "Non-violence, truthfulness, freedom from anger, renunciation, tranquility... are divine qualities.",
    practical_advice:
      "1) Recognize harms and set boundaries. 2) Practice compassionate reframing and small forgiveness exercises. 3) Forgiveness is for your freedom — decide to release the burden gradually.",
  },

  {
    id: "betrayal_trust",
    title: "Betrayal / Broken Trust",
    keywords: [
      "betrayed",
      "cheated",
      "trust broken",
      "infidelity",
      "lied to me",
      "betrayal",
      "can't trust again",
    ],
    shloka: "अहंकारो नाभिमानं मे तथा न स मानसः।",
    reference: "Gita themes",
    translation:
      "Ego and pride often cloud judgment; healing requires humility and discernment.",
    practical_advice:
      "1) Prioritize safety and boundaries. 2) Seek truth and clarity; if needed, mediated conversations. 3) Use therapy to process trauma and determine if trust can be rebuilt.",
  },

  {
    id: "trauma_ptsd",
    title: "Trauma / PTSD",
    keywords: [
      "trauma",
      "ptsd",
      "flashbacks",
      "nightmares",
      "abuse",
      "traumatic",
      "panic memory",
    ],
    shloka: "यदात्मनि स्थितमात्मानं विद्धि नान्यथा किंचि।",
    reference: "Gita insight",
    translation:
      "Find steadiness within — healing requires steady inner work and professional care.",
    practical_advice:
      "1) Seek trauma-informed therapy (EMDR, CBT). 2) Build a safety plan and grounding skills. 3) Avoid self-blaming; find community and professional guidance.",
  },

  {
    id: "abuse_domestic",
    title: "Domestic / Emotional / Physical Abuse",
    keywords: [
      "abuse",
      "domestic violence",
      "physical abuse",
      "emotional abuse",
      "hurt by partner",
      "unsafe at home",
      "threatened",
    ],
    shloka: "धैर्यं सर्वेषु भद्रेṣu।",
    reference: "General Gita principle",
    translation:
      "Stand with courage and protect life — duty includes protecting the vulnerable.",
    practical_advice:
      "1) If unsafe, call emergency services and get to a safe place. 2) Seek shelters, legal help and counseling. 3) Plan exit steps with trusted support; safety is priority.",
  },

  {
    id: "sexual_identity",
    title: "Sexuality / Identity Concerns",
    keywords: [
      "gay",
      "lesbian",
      "trans",
      "identity",
      "sexuality",
      "who am i",
      "coming out",
      "sexual orientation",
    ],
    shloka: "यः सर्वत्रानभिस्नेहस्तत्तत्प्राप्य शान्तिमचिरेण।",
    reference: "Gita virtues paraphrase",
    translation:
      "The one who is free from attachment attains peace; authenticity is part of inner freedom.",
    practical_advice:
      "1) Seek supportive communities and counseling. 2) Practice self-acceptance and small disclosure planning. 3) Safety first when coming out; find allies.",
  },

  {
    id: "aging_elderly",
    title: "Aging / Elderly Concerns / Mortality",
    keywords: [
      "old",
      "aging",
      "retirement",
      "elderly",
      "mortality",
      "end of life",
      "bereavement",
      "aging parent",
    ],
    shloka: "न जायते म्रियते वा कदाचित्त न्नयं भूत्वा भविता व न भूयः ।",
    reference: "Bhagavad Gītā 2:20",
    translation:
      "For the soul there is neither birth nor death; it is eternal.",
    practical_advice:
      "1) Attend to practical matters (wills, care). 2) Cultivate spiritual practices that ease fear of death. 3) Create legacy projects to foster meaning and connection.",
  },

  {
    id: "career_transition",
    title: "Career Change / Meaningful Work",
    keywords: [
      "career change",
      "quit job",
      "new career",
      "meaningful work",
      "purposeful work",
      "start new career",
      "pursue passion",
    ],
    shloka: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    reference: "Bhagavad Gītā 2:47 (partial)",
    translation:
      "Focus on right action; results will follow as part of the larger order.",
    practical_advice:
      "1) Prototype a small project in the new field. 2) Map transferable skills and bridge gaps with micro-courses. 3) Maintain an income buffer while transitioning.",
  },

  {
    id: "entrepreneurship",
    title: "Entrepreneurship / Business Risk",
    keywords: [
      "startup",
      "business",
      "entrepreneur",
      "founder",
      "investor",
      "raise funds",
      "burn rate",
      "pivot",
      "scale",
    ],
    shloka: "सुखार्थिनः कामाभिर्व्यथन्ते कार्ये परं सुखार्थिनः।",
    reference: "Gita pragmatic wisdom",
    translation:
      "Those who act for higher purpose find steadier results; desire-driven action causes disturbance.",
    practical_advice:
      "1) Validate customer demand with small experiments. 2) Track cash runway and set clear milestones. 3) Practice detachment to outcome while iterating fast.",
  },

  {
    id: "leadership_team",
    title: "Leadership & Team Conflict",
    keywords: [
      "leader",
      "team conflict",
      "manager",
      "team dynamics",
      "micromanage",
      "team morale",
      "boss issues",
      "leadership problem",
    ],
    shloka: "दत्तांश्चित्तेन कर्म कर्तव्यः सधर्मतः;",
    reference: "Gita organizational paraphrase",
    translation:
      "Act with integrity and fairness; lead by example.",
    practical_advice:
      "1) Clarify roles and responsibilities, hold one-on-one conversations. 2) Give constructive feedback and recognize contributions. 3) Build psychological safety through transparent communication.",
  },

  {
    id: "legal_troubles",
    title: "Legal / Court / Disputes",
    keywords: [
      "lawyer",
      "court",
      "legal",
      "lawsuit",
      "sue",
      "legal trouble",
      "court case",
      "criminal charges",
    ],
    shloka: "धर्म एव हतो हन्ति धर्मो रक्षति रक्षितः।",
    reference: "Gita principle paraphrase",
    translation:
      "Uphold dharma (righteousness); right action protects itself.",
    practical_advice:
      "1) Seek qualified legal counsel immediately. 2) Document everything and avoid provocative communication. 3) Follow lawful steps and preserve calm for clear decisions.",
  },
  

  {
    id: "housing_homelessness",
    title: "Housing / Homelessness / Eviction",
    keywords: [
      "eviction",
      "homeless",
      "can't pay rent",
      "no shelter",
      "housing",
      "landlord problem",
      "lost home",
    ],
    
    shloka: "यदात्मनि स्थितमात्मानं विद्धि नान्यथा किंचि ।",
    reference: "Gita self steadiness insight",
    translation:
      "When rooted in the Self, one gains clarity to act skillfully.",
    practical_advice:
      "1) Contact local housing services and emergency shelters. 2) Prioritize safety and essential needs; apply for assistance programs. 3) Build a short-term plan for stability.",
  },

  {
    id: "immigration_visa",
    title: "Immigration / Visa / Moving Abroad",
    keywords: [
      "visa",
      "immigration",
      "move abroad",
      "relocate",
      "immigrant",
      "visa refused",
      "work permit",
      "culture shock",
    ],
    shloka: "न कर्मणामनारम्भान्नैष्कर्म्यं पुरुषोऽश्नुते।",
    reference: "Gita teaching",
    translation:
      "Action must continue; inactivity is not the answer when responsibilities remain.",
    practical_advice:
      "1) Ensure all legal paperwork is in order; consult immigration professionals. 2) Build a cultural acclimatization plan. 3) Keep networks and finances stable during transitions.",
  },

  {
    id: "culture_adjustment",
    title: "Culture Shock / Adaptation",
    keywords: [
      "culture shock",
      "adjustment",
      "homesick",
      "foreign",
      "fit in",
      "adapt",
      "new country",
    ],
    shloka: "अभ्यासेन तु कौशलं लभ्यते।",
    reference: "Gita practice principle",
    translation:
      "Skill arises from repeated practice.",
    practical_advice:
      "1) Learn local customs step-by-step. 2) Form small rituals to create continuity. 3) Join local groups and take language classes if needed.",
  },

  {
    id: "parenting_adolescent",
    title: "Parenting Teenagers",
    keywords: [
      "teen",
      "adolescent",
      "teenager",
      "rebellious teen",
      "teenage",
      "parenting teen",
      "behavior change",
    ],
    shloka: "संशयान् समुच्छ्रेयास्पृहन् पश्यन् सत्कृत्।",
    reference: "Gita parental themes paraphrase",
    translation:
      "Observe with detachment, act with steadiness and compassion.",
    practical_advice:
      "1) Hold calm, consistent boundaries. 2) Listen and give space for gradual independence. 3) Seek family counseling for recurring conflicts.",
  },

  {
    id: "infertility",
    title: "Infertility / Family Planning",
    keywords: [
      "infertility",
      "can't conceive",
      "ivf",
      "pregnancy problem",
      "baby loss",
      "miscarriage",
      "trying to conceive",
    ],
    shloka: "त्वमेव प्रत्यक्षं ब्रह्मासि",
    reference: "Gita reminder of inner source",
    translation:
      "Remember the divine presence in deep suffering.",
    practical_advice:
      "1) Seek medical expertise and second opinions. 2) Build emotional support and consider counseling. 3) Explore all options (medical, adoption, acceptance) with your partner when ready.",
  },

  {
    id: "body_image_selfworth",
    title: "Body Image / Self-worth",
    keywords: [
      "ugly",
      "body image",
      "weight",
      "diet",
      "look bad",
      "self-esteem",
      "not good enough",
      "mirror shame",
    ],
    shloka: "नाहं कर्ता न हंसि न जुहारामि।",
    reference: "Gita insight",
    translation:
      "You are not merely the body or the doer; identity is deeper.",
    practical_advice:
      "1) Practice self-compassion and body-neutrality. 2) Focus on function and health rather than appearance. 3) Seek therapy for body dysmorphia if persistent.",
  },

  {
    id: "public_speaking",
    title: "Public Speaking / Presentation Anxiety",
    keywords: [
      "public speaking",
      "speech anxiety",
      "presentation",
      "stage fright",
      "fear of speaking",
      "talk",
    ],
    shloka: "यथोक्तिमुक्थं कार्यं कुरु कर्म समाचर।",
    reference: "Gita practice principle paraphrase",
    translation:
      "Do your action with practice and steadiness, do not be attached to fear.",
    practical_advice:
      "1) Rehearse aloud several times, do visualization. 2) Use short breathing exercises before stage entry. 3) Focus on message value to listeners rather than self-judgment.",
  },
  

  {
    id: "procrastination_motivation",
    title: "Procrastination / Lack of Motivation",
    keywords: [
      "procrastinate",
      "can't start",
      "motivation",
      "lazy",
      "no willpower",
      "avoid work",
      "put off",
    ],
    shloka: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।",
    reference: "Bhagavad Gītā 6:5",
    translation:
      "Lift oneself up by the mind; do not let the mind degrade you.",
    practical_advice:
      "1) Start with 5-minute micro-tasks to build momentum. 2) Create visible checklists and small rewards. 3) Remove friction and design environment for action.",
  },

  {
    id: "social_anxiety",
    title: "Social Anxiety / Shyness",
    keywords: [
      "social anxiety",
      "shy",
      "can't talk to people",
      "awkward",
      "fear of judgement",
      "panic in crowds",
    ],
    shloka: "ज्ञेयः सुखदुःखयोः कारणं वदनं मिथ्या।",
    reference: "Gita insight",
    translation:
      "Understanding causes of pain helps dissolve them.",
    practical_advice:
      "1) Practice exposure in small graded steps. 2) Learn grounding techniques for social situations. 3) Seek CBT or social skills groups if severe.",
  },

  {
    id: "career_dissatisfaction",
    title: "Dissatisfaction with Current Job",
    keywords: [
      "hate my job",
      "want to quit",
      "job bored",
      "no meaning at work",
      "career stuck",
    ],
    shloka: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    reference: "Bhagavad Gītā 2:47",
    translation:
      "Do your duty without attachment to the fruits.",
    practical_advice:
      "1) Explore meaning within current role (who benefits from your work?). 2) Build side projects or reskill gradually. 3) Make a transition plan (timeline, finances, network).",
  },

  {
    id: "perfectionism",
    title: "Perfectionism / Paralysis by Analysis",
    keywords: [
      "perfectionist",
      "can't finish",
      "too perfect",
      "never good enough",
      "analysis paralysis",
    ],
    shloka: "सहजं कर्म समाचर।",
    reference: "Gita pragmatism",
    translation:
      "Act naturally and steadily rather than delaying for perfection.",
    practical_advice:
      "1) Set 'good-enough' standards and deadlines. 2) Use 80/20 rule to ship. 3) Collect feedback and iterate, rather than waiting for ideal conditions.",
  },

  {
    id: "burnout_caregiver",
    title: "Caregiver Burnout",
    keywords: [
      "caregiver",
      "taking care",
      "burnout caring for parent",
      "exhausted caregiver",
      "no time for self",
    ],
    shloka: "आत्मन्येव मन्यते को विद्वान् परे वत्सयेत्।",
    reference: "Gita inner care insight",
    translation:
      "One must also care for the inner self while serving others.",
    practical_advice:
      "1) Build respite care & ask for help. 2) Schedule self-care explicitly and protect those times. 3) Join caregiver support groups to share load and practical tips.",
  },

  {
    id: "peer_pressure",
    title: "Peer Pressure / Social Conformity",
    keywords: [
      "peer pressure",
      "pressure from friends",
      "conform",
      "following crowd",
      "do what others do",
    ],
    shloka: "योग कर्मसु कौशलम्",
    reference: "Bhagavad Gītā 2:50 paraphrase",
    translation:
      "Yoga is skill in action; act with discernment, not merely to please others.",
    practical_advice:
      "1) Clarify values and practice saying 'no' kindly. 2) Choose peer groups aligned with values. 3) Use timeouts before agreeing to risky requests.",
  },

  {
    id: "imposter_syndrome",
    title: "Imposter Syndrome",
    keywords: [
      "imposter",
      "fraud",
      "not qualified",
      "imposter syndrome",
      "can't do this",
      "undeserving",
    ],
    shloka: "यः सर्वत्रानभिस्नेहस्तत्तत्प्राप्य शान्तिमचिरेण।",
    reference: "Gita virtue paraphrase",
    translation:
      "Freedom from attachment leads to peace — identity beyond success/failure steadies you.",
    practical_advice:
      "1) Keep a 'competence log' of wins/feedback. 2) Reframe nerves as readiness; share doubts with mentor. 3) Use small exposure to build evidence of competence.",
  },

  {
    id: "ethical_dilemma",
    title: "Ethical Dilemmas / Moral Conflicts",
    keywords: [
      "ethical",
      "morality",
      "moral dilemma",
      "what's right",
      "right or wrong",
      "ethical conflict",
    ],
    shloka: "धर्म एव हतो हन्ति धर्मो रक्षति रक्षितः ।",
    reference: "Gita dharma paraphrase",
    translation:
      "Abandoning dharma causes destruction; protecting dharma preserves one.",
    practical_advice:
      "1) Map stakeholders and consequences; follow conscience and duty (svadharma). 2) Seek counsel from trusted, wise advisors. 3) Prefer action aligned to integrity even if personally costly.",
  },

  {
    id: "marriage_parenting_mix",
    title: "Work-Family Balance",
    keywords: [
      "work family balance",
      "work life balance",
      "family time",
      "no time for kids",
      "too busy for family",
    ],
    shloka: "सुखार्थिनः कामाभिर्व्यथन्ते कार्ये परं सुखार्थिनः।",
    reference: "Gita life-balance paraphrase",
    translation:
      "When life is lived only for pleasure, disturbance follows; balanced priorities preserve peace.",
    practical_advice:
      "1) Schedule non-negotiable family time. 2) Communicate limits at work. 3) Align daily tasks with true priorities and let lesser tasks go.",
  },

  {
    id: "peer_conflict_school",
    title: "Bullying / School Peer Conflict",
    keywords: [
      "bully",
      "bullying",
      "harassment",
      "school bully",
      "kid bullied",
      "online bullying",
    ],
    shloka: "अहिंसा परमो धर्मः।",
    reference: "Gita non-violence principle",
    translation:
      "Non-violence is supreme dharma; protect innocents and respond with courage.",
    practical_advice:
      "1) Document incidents and inform school authorities. 2) Teach assertive response skills. 3) Build social support and counseling for the child.",
  },

  {
    id: "career_stagnation",
    title: "Career Stagnation / Lack of Growth",
    keywords: [
      "stuck in career",
      "no promotion",
      "stagnant job",
      "no growth",
      "career plateau",
    ],
    shloka: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।",
    reference: "Bhagavad Gītā 6:5",
    translation:
      "Raise yourself by yourself; do not let the mind degrade you.",
    practical_advice:
      "1) Seek feedback, set visible growth targets. 2) Develop new skills with microlearning. 3) Network proactively and test new roles with small experiments.",
  },

  {
    id: "family_inheritance",
    title: "Inheritance / Family Property Disputes",
    keywords: [
      "inheritance",
      "property dispute",
      "family fight over property",
      "will contest",
      "estate battle",
    ],
    shloka: "प्रत्यक् तत्त्वं ज्ञात्वा धर्मेण कुरु स्वधर्मेण।",
    reference: "Gita dharma application",
    translation:
      "Act in line with right duty and justice.",
    practical_advice:
      "1) Use mediation and legal counsel. 2) Prioritize relationships over possessions where possible. 3) Document agreements legally to prevent future conflict.",
  },

  {
    id: "caregiver_decision",
    title: "Difficult Care Decisions (Elderly, Sick)",
    keywords: [
      "care decision",
      "nursing home",
      "hospice",
      "end of life decision",
      "medical proxy",
      "care plan",
    ],
    shloka: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    reference: "Bhagavad Gītā 2:47",
    translation:
      "Act dutifully without attachment to results.",
    practical_advice:
      "1) Convene family meeting, involve medical professionals, and document preferences. 2) Consider comfort-focused choices and legal planning (advance directives).",
  },

  {
    id: "career_interview",
    title: "Interview Nerves / Hiring",
    keywords: [
      "interview",
      "job interview",
      "nervous in interview",
      "hire",
      "rejected",
      "not hired",
    ],
    shloka: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः।",
    reference: "Bhagavad Gītā 18:78 paraphrase",
    translation:
      "Where righteousness and skill meet, success often follows.",
    practical_advice:
      "1) Prepare star stories and practice roleplay interviews. 2) Use breathing to steady nerves. 3) Ask thoughtful questions to demonstrate fit.",
  },

  {
    id: "phobia_specific",
    title: "Specific Phobias (Heights, Flying, etc.)",
    keywords: [
      "fear of heights",
      "flying anxiety",
      "phobia",
      "claustrophobia",
      "fear of needles",
    ],
    shloka: "यो न हृष्यति न द्वेष्टि न शोचति न काङ्क्षति।",
    reference: "Bhagavad Gītā 12:17 paraphrase",
    translation:
      "He who neither grieves nor desires and is free from attachments is steady-minded.",
    practical_advice:
      "1) Graded exposure therapy and techniques from CBT. 2) Use relaxation and grounding anchors during exposure. 3) Consult therapists specialized in phobias.",
  },

  {
    id: "peer_rejection",
    title: "Rejection by Peers / Exclusion",
    keywords: [
      "rejected",
      "excluded",
      "ignored",
      "no invitation",
      "left out",
      "rejection hurt",
    ],
    shloka: "न मम अस्ति प्रभवो न ममेति परम्।",
    reference: "Gita self identity insight",
    translation:
      "Identity is not defined by others' acceptance; find inner center.",
    practical_advice:
      "1) Reconnect with supportive people. 2) Practice self-validation and small social initiatives. 3) Reflect on constructive lessons rather than ruminating on hurt.",
  },

  {
    id: "romantic_longing",
    title: "Longing / Unrequited Love",
    keywords: [
      "i miss you",
      "unrequited love",
      "crush",
      "can't stop thinking about them",
      "pining",
    ],
    shloka: "वैराग्यं परमं सुखम्।",
    reference: "Gita discipline paraphrase",
    translation:
      "Dispassion can produce deep, abiding contentment.",
    practical_advice:
      "1) Express honestly if safe; otherwise practice healthy detachment. 2) Reinvest in hobbies and community. 3) Use journaling to process feelings.",
  },

  {
    id: "sibling_rivalry",
    title: "Sibling Rivalry & Family Tension",
    keywords: [
      "sibling fight",
      "brother sister fight",
      "family rivalry",
      "property fight",
      "sibling tension",
    ],
    shloka: "एकत्वेऽन्योन्य सम्बन्धात्।",
    reference: "Gita on unity principle",
    translation:
      "Recognize oneness underlying relationships to reduce rivalry.",
    practical_advice:
      "1) Facilitate family discussion with mediator. 2) Emphasize shared values/legacy over possessions. 3) Set fair, documented agreements.",
  },

  {
    id: "workplace_harassment",
    title: "Workplace Harassment / Discrimination",
    keywords: [
      "harassment",
      "discrimination",
      "sexual harassment",
      "hostile work environment",
      "bullying at work",
    ],
    shloka: "धर्म एव हतो हन्ति धर्मो रक्षति रक्षितः।",
    reference: "Gita dharma principle",
    translation:
      "Preserve righteousness; do not allow injustice to persist.",
    practical_advice:
      "1) Document incidents and escalate through HR/legal channels. 2) Seek witness support and counsel. 3) Prioritize safety and consider alternate employment if unresolved.",
  },
  {
    id: "work_career",
    title: "Work & Career Stress / Burnout",
    keywords: ["job","work","career","boss","promotion","deadline","burnout","overtime","toxic"],
    shloka: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    reference: "Bhagavad Gītā 2:47",
    translation: "You have the right to work, not to the fruits of work.",
    practical_advice: "1) Pick 2–3 priorities today and time-block them. 2) Do work fully, then surrender outcome. 3) Set strict work/rest boundaries; seek help if exhaustion continues."
  },
  {
    id: "relationship_conflict",
    title: "Relationship / Family Conflict",
    keywords: ["relationship","partner","spouse","family","argue","in-law","divorce"],
    shloka: "सर्वभूतस्थमात्मानं सर्वभूतानि चात्मनि ईक्षते।",
    reference: "Bhagavad Gītā 6:29",
    translation: "See the Self in all beings; cultivate equal vision.",
    practical_advice: "1) Pause and listen fully before replying. 2) Use 'I' statements to express needs. 3) Seek mediation or professional help for recurring harm."
  },
  {
    id: "money_financial",
    title: "Money / Financial Worries",
    keywords: ["money","debt","loan","bills","salary","rent","bankruptcy","savings"],
    shloka: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।",
    reference: "Bhagavad Gītā 9:22",
    translation: "Those devoted to Me I protect and provide for.",
    practical_advice: "1) Create immediate cash-flow: essentials vs nonessentials. 2) Negotiate with creditors; apply for relief. 3) Build a 3-month plan for income/expense changes."
  },
  {
    id: "health_physical",
    title: "Health / Illness / Pain",
    keywords: ["health","sick","pain","illness","doctor","chronic","treatment"],
    shloka: "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि।",
    reference: "Bhagavad Gītā 2:22",
    translation: "As garments change, so bodies change; the soul remains.",
    practical_advice: "1) Follow medical guidance and treatment. 2) Maintain gentle routine (sleep, nutrition, breath). 3) Cultivate inner steadiness through meditation and support."
  },
  {
    id: "fear_anxiety",
    title: "Fear & Anxiety",
    keywords: ["fear","anxiety","panic","worry","insomnia","nervous"],
    shloka: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।",
    reference: "Bhagavad Gītā 18:66",
    translation: "Surrender unto Me; do not grieve — I will liberate you.",
    practical_advice: "1) Practice grounding breathing (4-4-4). 2) Separate what you can control vs not. 3) Use simple surrender phrases before sleep; seek therapy if persistent."
  },
  {
    id: "anger",
    title: "Anger & Irritation",
    keywords: ["anger","angry","rage","irritated","resentment"],
    shloka: "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः।",
    reference: "Bhagavad Gītā 2:63",
    translation: "From anger arises delusion and loss of judgment.",
    practical_advice: "1) Pause and take three deep breaths before responding. 2) Identify unmet needs behind anger. 3) Use physical activity to discharge and then reflect."
  },
  {
    id: "sadness_grief",
    title: "Sadness / Grief / Low Mood",
    keywords: ["sad","grief","depression","lonely","mourning","hopeless"],
    shloka: "न त्वेवाहं जातु नासं न त्वं नेमे जनाधिपाः।",
    reference: "Bhagavad Gītā 2:12",
    translation: "The Self is beyond birth and death; we are eternal at core.",
    practical_advice: "1) Allow feelings and name them. 2) Maintain routines and contact with others. 3) Seek professional help if severe or prolonged."
  },
  {
    id: "stress_pressure",
    title: "Stress & Overwhelm",
    keywords: ["stress","overwhelm","pressure","too much","tension"],
    shloka: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।",
    reference: "Bhagavad Gītā 2:48",
    translation: "Work with equanimity, renouncing attachment to outcomes.",
    practical_advice: "1) Prioritize and delegate. 2) Use brief mindful breaks (2–5 mins). 3) Reconnect tasks to purpose to reduce friction."
  },
  {
    id: "confusion_direction",
    title: "Confusion / Lack of Direction",
    keywords: ["confused","lost","purpose","meaning","direction","dharma"],
    shloka: "यदा ते मोहकलिलं बुद्धिर्व्यतितरिष्यति।",
    reference: "Bhagavad Gītā 2:52",
    translation: "When delusion is removed, clarity and discrimination arise.",
    practical_advice: "1) Daily 10-minute reflection or meditation. 2) Try small experiments aligned with values. 3) Seek mentors and study wise texts for guidance."
  },
  {
    id: "study_exam",
    title: "Study / Exam Anxiety",
    keywords: ["exam","study","test","concentration","revision"],
    shloka: "तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया।",
    reference: "Bhagavad Gītā 4:34",
    translation: "Approach a teacher with humility and service; knowledge will be given.",
    practical_advice: "1) Use Pomodoro study blocks and spaced repetition. 2) Practice calming breaths before tests. 3) Seek tutoring for weak areas."
  },
  {
    id: "success_failure",
    title: "Success & Failure / Performance",
    keywords: ["success","failure","win","lose","achievement","imposter"],
    shloka: "सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ।",
    reference: "Bhagavad Gītā 2:38",
    translation: "Treat pleasure and pain, gain and loss, equally.",
    practical_advice: "1) Celebrate modestly; learn from failure. 2) Focus on duty, not only results. 3) Keep reflective practice to build resilience."
  },
  {
    id: "parenting_child",
    title: "Parenting Challenges",
    keywords: ["child","parenting","teen","discipline","behavior"],
    shloka: "संशयान् समुच्छ्रेयास्पृहन् पश्यन् सत्कृत्।",
    reference: "Gita parental theme (paraphrase)",
    translation: "Observe with steadiness and act with compassion and discipline.",
    practical_advice: "1) Set calm boundaries and consistent routines. 2) Model desired behavior. 3) Use family therapy for persistent issues."
  },
  {
    id: "addiction_substance",
    title: "Addiction / Substance Use",
    keywords: ["addiction","alcohol","drugs","smoking","craving"],
    shloka: "असंशयं महाबाहो मनो द्विविधं प्रकृतिनाम्।",
    reference: "Gita theme (paraphrase)",
    translation: "The mind has tendencies; observe and transform attachments.",
    practical_advice: "1) Seek structured support (rehab, groups). 2) Replace triggers with healthy routines. 3) Build accountability and professional therapy."
  },
  {
    id: "insomnia_sleep",
    title: "Sleep Problems / Insomnia",
    keywords: ["sleep","insomnia","sleepless","night","restless"],
    shloka: "योगी हि वृक्षसमः स्थिरप्रकृतिस्तथा।",
    reference: "Gita metaphor (paraphrase)",
    translation: "A steady nature becomes calm like a tree; rhythm brings rest.",
    practical_advice: "1) Keep consistent sleep schedule; wind-down ritual. 2) Avoid screens 1 hour before bed; practice relaxation. 3) Consult a sleep specialist if chronic."
  },
  {
    id: "loneliness_isolation",
    title: "Loneliness / Social Isolation",
    keywords: ["lonely","alone","isolated","no friends","left out"],
    shloka: "न मे भक्तः प्रणश्यति।",
    reference: "Bhagavad Gītā 9:31 (paraphrase)",
    translation: "My devotee never perishes — connection can be found.",
    practical_advice: "1) Join local groups or volunteer to meet others. 2) Start small social steps (call one person). 3) Practice gratitude and self-compassion."
  },
  {
    id: "guilt_remorse",
    title: "Guilt / Regret / Shame",
    keywords: ["guilt","regret","remorse","shame","sorry"],
    shloka: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।",
    reference: "Bhagavad Gītā 6:5",
    translation: "Lift yourself by your own mind; do not let it degrade you.",
    practical_advice: "1) Make amends where possible. 2) Learn and set a restitution plan. 3) Practice self-forgiveness and therapy for deep shame."
  },
  {
    id: "jealousy_envy",
    title: "Jealousy & Envy",
    keywords: ["jealous","envy","compare","covet","compare"],
    shloka: "यदाकाङ्क्षन्ति संसिद्धिं तस्यामलक्षणाः।",
    reference: "Gita theme (paraphrase)",
    translation: "Desire and comparison disturb the mind; steady oneself with inner work.",
    practical_advice: "1) Practice gratitude daily. 2) Reframe others' success as inspiration. 3) Cultivate generosity as antidote."
  },
  {
    id: "forgiveness",
    title: "Difficulty Forgiving",
    keywords: ["forgive","grudge","resentment","let go"],
    shloka: "अहिंसा सत्यमक्रोधस्त्यागः शान्तिरापैशुनम्।",
    reference: "Bhagavad Gītā 16:2 (paraphrase)",
    translation: "Non-violence, truthfulness and freedom from anger are divine qualities.",
    practical_advice: "1) Set boundaries first; safety matters. 2) Practice compassionate reframing. 3) Use small forgiveness exercises; release gradually."
  },
  {
    id: "betrayal_trust",
    title: "Betrayal / Broken Trust",
    keywords: ["betrayed","cheated","infidelity","lied","trust"],
    shloka: "अहंकारो नाभिमानं मे तथा न स मानसः।",
    reference: "Gita insight (paraphrase)",
    translation: "Ego and pride cloud judgment; humility and discernment aid healing.",
    practical_advice: "1) Prioritize safety and boundary setting. 2) Gather facts; consider mediated conversation. 3) Use therapy to decide rebuild vs separation."
  },
  {
    id: "trauma_ptsd",
    title: "Trauma / PTSD",
    keywords: ["trauma","ptsd","flashback","nightmare","abuse"],
    shloka: "यदात्मनि स्थितमात्मानं विद्धि नान्यथा किंचि।",
    reference: "Gita steadiness insight",
    translation: "Find steadiness within; healing needs steady inner work and professional care.",
    practical_advice: "1) Seek trauma-informed therapy (EMDR / CBT). 2) Develop grounding safety practices. 3) Avoid self-blame; build supportive network."
  },
  {
    id: "abuse_domestic",
    title: "Domestic / Physical / Emotional Abuse",
    keywords: ["abuse","domestic","unsafe","violence","threatened"],
    shloka: "धैर्यं सर्वेषु भद्रेṣu।",
    reference: "Gita courage principle (paraphrase)",
    translation: "Stand with courage and protect life; duty includes protecting the vulnerable.",
    practical_advice: "1) If unsafe, contact emergency services and reach a safe place. 2) Use shelters, legal help and counseling. 3) Plan exit steps with trusted support."
  },
  {
    id: "sexual_identity",
    title: "Sexuality / Identity Concerns",
    keywords: ["gay","trans","identity","coming out","orientation"],
    shloka: "यः सर्वत्रानभिस्नेहस्तत्तत्प्राप्य शान्तिमचिरेण।",
    reference: "Gita virtue paraphrase",
    translation: "Freedom from clinging leads to peace; authenticity brings inner calm.",
    practical_advice: "1) Find supportive communities and counseling. 2) Practice small, safe disclosure planning. 3) Prioritize safety and allies when coming out."
  },
  {
    id: "aging_elderly",
    title: "Aging / Elderly Care / Mortality",
    keywords: ["aging","elderly","retirement","mortality","care"],
    shloka: "न जायते म्रियते वा कदाचि न्नयं भूत्वा भविता वा न भूयः ।",
    reference: "Bhagavad Gītā 2:20",
    translation: "The soul neither is born nor dies; it is eternal.",
    practical_advice: "1) Attend to practical legal/medical matters (wills, care). 2) Cultivate spiritual practices to ease fear. 3) Create meaningful legacy projects."
  },
  {
    id: "career_transition",
    title: "Career Change / Meaningful Work",
    keywords: ["career change","new career","reskill","quit job","passion"],
    shloka: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    reference: "Bhagavad Gītā 2:47",
    translation: "Focus on right action rather than attachment to outcomes.",
    practical_advice: "1) Prototype a small project or side gig. 2) Map transferable skills and reskill in micro-steps. 3) Maintain a financial buffer while transitioning."
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship / Business Risk",
    keywords: ["startup","business","founder","investor","funding","pivot"],
    shloka: "सुखार्थिनः कामाभिर्व्यथन्ते कार्ये परं सुखार्थिनः।",
    reference: "Gita pragmatic wisdom (paraphrase)",
    translation: "Desire-driven action disturbs; purpose-driven action steadies.",
    practical_advice: "1) Validate demand with small tests. 2) Track cash runway and set milestones. 3) Detach from outcome while iterating fast."
  },
  {
    id: "leadership_team",
    title: "Leadership & Team Conflict",
    keywords: ["leader","team","manager","conflict","morale"],
    shloka: "दत्तांश्चित्तेन कर्म कर्तव्यः सधर्मतः;",
    reference: "Gita organizational paraphrase",
    translation: "Act with integrity and fairness; lead by example.",
    practical_advice: "1) Clarify roles and expectations. 2) Hold one-on-ones and give constructive feedback. 3) Foster psychological safety through transparency."
  },
  {
    id: "legal_troubles",
    title: "Legal / Court / Disputes",
    keywords: ["legal","lawyer","court","lawsuit","charges"],
    shloka: "धर्म एव हतो हन्ति धर्मो रक्षति रक्षितः।",
    reference: "Gita dharma paraphrase",
    translation: "Uphold dharma; right action protects itself.",
    practical_advice: "1) Hire qualified legal counsel immediately. 2) Document everything and avoid provocative communication. 3) Follow lawful steps and preserve calm."
  },
  {
    id: "housing_homelessness",
    title: "Housing / Homelessness / Eviction",
    keywords: ["eviction","homeless","rent","landlord","shelter","housing"],
    shloka: "यदात्मनि स्थितमात्मानं विद्धि नान्यथा किंचि ।",
    reference: "Gita steadiness insight (paraphrase)",
    translation: "When rooted in the Self, one gains clarity to act skillfully.",
    practical_advice: "1) Contact local housing services and emergency shelters. 2) Prioritize safety and essential needs. 3) Build short-term plan for income/stability and seek legal aid."
  },
  {
    id: "immigration_visa",
    title: "Immigration / Visa Problems",
    keywords: ["visa","immigration","relocate","work permit","refused"],
    shloka: "न कर्मणामनारम्भान्नैष्कर्म्यं पुरुषोऽश्नुते।",
    reference: "Gita teaching (paraphrase)",
    translation: "Action continues; inaction is not the answer when duties remain.",
    practical_advice: "1) Consult immigration professionals; check documentation. 2) Build fallback plans and financial buffers. 3) Prepare for cultural transition and local networks."
  },
  {
    id: "culture_adjustment",
    title: "Culture Shock / Adaptation",
    keywords: ["culture","adjust","homesick","fit in","adapt"],
    shloka: "अभ्यासेन तु कौशलं लभ्यते।",
    reference: "Gita practice principle (paraphrase)",
    translation: "Skill arises from repeated practice.",
    practical_advice: "1) Learn local language and customs gradually. 2) Form daily rituals for continuity. 3) Join community groups to build ties."
  },
  {
    id: "parenting_adolescent",
    title: "Parenting Teenagers",
    keywords: ["teen","adolescent","rebellious","boundaries","school"],
    shloka: "संशयान् समुच्छ्रेयास्पृहन् पश्यन् सत्कृत्।",
    reference: "Gita parental theme (paraphrase)",
    translation: "Observe calmly and act with steady compassion.",
    practical_advice: "1) Set consistent rules with clear consequences. 2) Listen and create safe space for expression. 3) Use family counseling if conflicts escalate."
  },
  {
    id: "infertility",
    title: "Infertility & Family Planning",
    keywords: ["infertility","ivf","conceive","miscarriage","fertility"],
    shloka: "त्वमेव प्रत्यक्षं ब्रह्मासि",
    reference: "Gita reminder (paraphrase)",
    translation: "Remember the divine presence in suffering.",
    practical_advice: "1) Seek medical expertise and second opinions. 2) Build emotional support and couple therapy. 3) Consider all options (treatment, adoption, acceptance) together."
  },
  {
    id: "body_image_selfworth",
    title: "Body Image / Self-Worth",
    keywords: ["body","image","weight","look","esteem","selfworth"],
    shloka: "नाहं कर्ता न हंसि न जुहारामि।",
    reference: "Gita insight (paraphrase)",
    translation: "You are not merely the body or the doer; identity is deeper.",
    practical_advice: "1) Practice body-neutrality and compassionate self-talk. 2) Focus on function and health over looks. 3) Get therapy for body dysmorphia when needed."
  },
  {
    id: "public_speaking",
    title: "Public Speaking / Presentation Anxiety",
    keywords: ["public speaking","speech","stage","presentation","nerves"],
    shloka: "यथोक्तिमुक्थं कार्यं कुरु कर्म समाचर।",
    reference: "Gita practice paraphrase",
    translation: "Perform actions steadily; don't be attached to fear.",
    practical_advice: "1) Rehearse and visualize success. 2) Use pre-talk breathing and grounding. 3) Focus on message value, not self-judgment."
  },
  {
    id: "dating_safety",
    title: "Dating Safety / Predatory Behavior",
    keywords: ["dating","safety","scam","predator","verify"],
    shloka: "विचक्षणः सहृदयश्च प्रचक्षते नियतेन च।",
    reference: "Gita virtue paraphrase",
    translation: "Act with discernment and a steady heart.",
    practical_advice: "1) Verify identity, meet publicly, tell a friend. 2) Trust instincts; leave if uneasy. 3) Report predatory behavior to authorities."
  },
  {
    id: "moving_city",
    title: "Relocation / Starting Over",
    keywords: ["move","relocate","new city","fresh start","alone"],
    shloka: "न जायते म्रियते वा कदाचि न्नायं भूत्वा भविता वा न भूयः॥",
    reference: "Bhagavad Gītā 2:20",
    translation: "The Self continues beyond external change.",
    practical_advice: "1) Build daily routine and local contacts. 2) Join interest groups to meet people. 3) Treat relocation as purposeful growth; make small steady steps."
  },
  {
    id: "entrance_failure",
    title: "Rejection / Failed Entrance",
    keywords: ["rejected","not selected","fail","application","admission"],
    shloka: "सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ।",
    reference: "Bhagavad Gītā 2:38",
    translation: "Be equal in joy and sorrow.",
    practical_advice: "1) Allow a brief grieving period. 2) Re-evaluate and plan alternative paths. 3) Use failure as feedback for improvement."
  },
  {
    id: "peer_pressure",
    title: "Peer Pressure / Social Conformity",
    keywords: ["peer pressure","fit in","conform","approval","friends"],
    shloka: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।",
    reference: "Bhagavad Gītā 6:5",
    translation: "Raise yourself by your mind; do not let it degrade you.",
    practical_advice: "1) Clarify your values and limits. 2) Practice polite refusal and select supportive peers. 3) Strengthen autonomy via small acts."
  },
  {
    id: "career_dissatisfaction",
    title: "Dissatisfaction with Current Job",
    keywords: ["hate job","quit","bored","stuck","meaningless"],
    shloka: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    reference: "Bhagavad Gītā 2:47",
    translation: "Do your duty without attachment to fruits.",
    practical_advice: "1) Look for meaning within role and start a side project. 2) Reskill gradually and network. 3) Create a realistic transition plan before quitting."
  },
  {
    id: "perfectionism",
    title: "Perfectionism / Paralysis by Analysis",
    keywords: ["perfectionist","cannot finish","analysis paralysis","too perfect"],
    shloka: "सहजं कर्म समाचर।",
    reference: "Gita pragmatism (paraphrase)",
    translation: "Act naturally and steadily rather than delaying for perfection.",
    practical_advice: "1) Set 'good-enough' targets and deadlines. 2) Use iterative releases and feedback. 3) Celebrate progress over perfection."
  },
  {
    id: "burnout_caregiver",
    title: "Caregiver Burnout",
    keywords: ["caregiver","care","exhausted","respite","parent care"],
    shloka: "आत्मन्येव मन्यते को विद्वान् परे वत्सयेत्।",
    reference: "Gita inner care insight (paraphrase)",
    translation: "Care for your inner self even while serving others.",
    practical_advice: "1) Arrange respite and ask for help. 2) Schedule protected self-care time. 3) Join caregiver support groups for practical tips."
  },
  {
    id: "workplace_discrimination",
    title: "Workplace Discrimination / Harassment",
    keywords: ["discrimination","harassment","bias","hostile","harass"],
    shloka: "सर्वभूतस्थमात्मानं सर्वभूतानि चात्मनि ईक्षते।",
    reference: "Bhagavad Gītā 6:29",
    translation: "See the Self in others and act with fairness.",
    practical_advice: "1) Document incidents and report to HR or legal counsel. 2) Find allies and supportive networks. 3) Protect well-being and consider alternate roles if unresolved."
  },
  {
    id: "fraudulent_employment",
    title: "Employment Scam / Fake Job",
    keywords: ["scam","fake job","bait","no pay","fraud"],
    shloka: "विचक्षणोऽपि विवेकिना कर्म कुर्वीत।",
    reference: "Gita discernment paraphrase",
    translation: "Even the wise must act with discernment.",
    practical_advice: "1) Verify employer credentials and contracts. 2) Never pay upfront fees; report scams. 3) Use trusted job channels and referrals."
  },
  {
    id: "academic_plagiarism",
    title: "Academic Dishonesty / Plagiarism",
    keywords: ["plagiarism","cheat","copy","honesty","ethics"],
    shloka: "अहिंसा सत्यमक्रोधस्त्यागः शान्तिरापैशुनम्।",
    reference: "Bhagavad Gītā 16:2 (paraphrase)",
    translation: "Integrity, truthfulness and non-harm are virtues.",
    practical_advice: "1) Own up and correct where possible. 2) Learn proper citation and ethics. 3) Rebuild trust through transparent corrective action."
  },
  {
    id: "creative_instability",
    title: "Irregular Income in Creative Work",
    keywords: ["irregular income","freelance","gig","unstable","freelancer"],
    shloka: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    reference: "Bhagavad Gītā 2:47",
    translation: "Focus on action, not immediate fruit.",
    practical_advice: "1) Build multiple income streams and buffer savings. 2) Keep disciplined practice and portfolio updates. 3) Plan cashflow and lean months ahead."
  },
  {
    id: "love_life_choice",
    title: "Choosing Between Two Partners",
    keywords: ["choose partner","two partners","decision","split"],
    shloka: "विवेकबुद्ध्या युक्तः कर्म करोति यः सः।",
    reference: "Gita discernment paraphrase",
    translation: "Act with discrimination and steady mind.",
    practical_advice: "1) List values, long-term compatibility, non-negotiables. 2) Seek wise counsel and inner reflection. 3) Decide and take responsibility for the outcome."
  },
  {
    id: "relationship_monotony",
    title: "Relationship Monotony / Rekindling",
    keywords: ["stale","lost spark","routine","bored","romance"],
    shloka: "सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ।",
    reference: "Bhagavad Gītā 2:38",
    translation: "Treat pleasure and pain equally; act steadily.",
    practical_advice: "1) Introduce novelty (dates, shared projects). 2) Express gratitude daily. 3) Schedule curiosity conversations to rediscover partner."
  },
  {
    id: "household_finance_conflict",
    title: "Household Money Disputes",
    keywords: ["budget","money fight","hide money","spending"],
    shloka: "यज्ञाद्भवति पर्जन्यो यज्ञः कर्मसमुद्भवः।",
    reference: "Bhagavad Gītā 3:14 (paraphrase)",
    translation: "Selfless duty and contribution create social balance.",
    practical_advice: "1) Hold calm budgeting meetings. 2) Make transparent rules for shared vs personal funds. 3) Use financial counseling if needed."
  },
  {
    id: "procrastination_motivation",
    title: "Procrastination / Low Motivation",
    keywords: ["procrastinate","can't start","motivation","lazy","avoid"],
    shloka: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।",
    reference: "Bhagavad Gītā 6:5",
    translation: "Lift yourself by your mind; do not degrade yourself.",
    practical_advice: "1) Start with 5-minute microtasks to gain momentum. 2) Use visible checklists and tiny rewards. 3) Remove friction from the environment."
  },
  {
    id: "social_anxiety",
    title: "Social Anxiety / Shyness",
    keywords: ["social anxiety","shy","awkward","fear judgement","crowds"],
    shloka: "ज्ञेयः सुखदुःखयोः कारणं वदनं मिथ्या।",
    reference: "Gita insight (paraphrase)",
    translation: "Understanding causes of suffering helps dissolve it.",
    practical_advice: "1) Practice graded exposures starting small. 2) Use grounding and breathing in social settings. 3) Consider CBT or social skills groups if severe."
  },
  {
    id: "unrequited_love",
    title: "Unrequited Love / One-sided Affection",
    keywords: ["unrequited","one-sided","not reciprocated","crush","pining"],
    shloka: "यदा ते मोहकलिलं बुद्धिर्व्यतितरिष्यति।",
    reference: "Bhagavad Gītā 2:52",
    translation: "When delusion is gone, clarity arises.",
    practical_advice: "1) Acknowledge and accept reality. 2) Create healthy distance and new routines. 3) Redirect energy toward growth and service."
  },
  {
    id: "partner_addiction",
    title: "Partner's Addiction Affecting Relationship",
    keywords: ["partner addiction","alcohol","drugs","enable","relapse"],
    shloka: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।",
    reference: "Bhagavad Gītā 6:5",
    translation: "Lift yourself by your own mind; don't let it degrade you.",
    practical_advice: "1) Prioritize safety; avoid enabling. 2) Encourage treatment and set boundaries. 3) Seek family therapy and support groups."
  },
  {
    id: "relationship_goal_mismatch",
    title: "Divergent Long-term Goals",
    keywords: ["kids","move","travel","goals mismatch","future plans"],
    shloka: "विवेकबुद्ध्या युक्तः कर्म करोति यः सः।",
    reference: "Gita discernment paraphrase",
    translation: "Act with discrimination and steady mind.",
    practical_advice: "1) Map non-negotiables and negotiables together. 2) Hold calm strategic conversations with timelines. 3) If irreconcilable, plan next steps ethically."
  },
  {
    id: "career_stagnation",
    title: "Career Stagnation / Lack of Growth",
    keywords: ["stuck","no promotion","plateau","stagnant","career"],
    shloka: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।",
    reference: "Bhagavad Gītā 6:5",
    translation: "Raise yourself by yourself; do not let the mind degrade you.",
    practical_advice: "1) Ask for feedback and set growth goals. 2) Acquire new skills via microlearning. 3) Network and experiment with small role shifts."
  },
  {
    id: "family_inheritance",
    title: "Inheritance / Property Disputes",
    keywords: ["inheritance","property","will","estate","dispute"],
    shloka: "प्रत्यक् तत्त्वं ज्ञात्वा धर्मेण कुरु स्वधर्मेण।",
    reference: "Gita dharma paraphrase",
    translation: "Act in accordance with right duty and justice.",
    practical_advice: "1) Use mediation and qualified legal counsel. 2) Prioritize relationships where possible. 3) Formalize agreements to prevent future conflict."
  },
  {
    id: "relationship_monotony",
    title: "Relationship Boredom / Monotony",
    keywords: [
      "bored in marriage",
      "monotony",
      "routine relationship",
      "lost spark",
      "stale relationship",
    ],
    shloka: "कृत्त्वा धर्मोऽपि न हि ॥",
    reference: "Gita relationship practice idea",
    translation:
      "Dharma and disciplined action rejuvenate life when practiced sincerely.",
    practical_advice:
      "1) Introduce novelty in relationship: shared projects or date rituals. 2) Communicate desires and experiment together. 3) Rediscover gratitude for the partner's qualities.",
  },

  {
    id: "career_failure_trauma",
    title: "Career Failure / Public Failure",
    keywords: [
      "sacked",
      "fired",
      "failed project",
      "public humiliation",
      "shame at work",
    ],
    shloka: "न त्वेवाहं जातु नासं न त्वं नेमे जनाधिपाः।",
    reference: "Bhagavad Gītā 2:12",
    translation:
      "The eternal self persists beyond temporary setbacks.",
    practical_advice:
      "1) Allow grief, then reframe with lessons learned and rebuild a competency plan. 2) Use network outreach and portfolio updates to regain momentum. 3) Practice humility with confidence.",
  },

  {
    id: "parental_loss",
    title: "Loss of a Parent / Death of Loved One",
    keywords: [
      "my mother died",
      "my father passed",
      "grief over parent",
      "lost parent",
      "death of loved one",
    ],
    shloka: "न जायते म्रियते वा कदाचि",
    reference: "Bhagavad Gītā 2:20 (fragment)",
    translation:
      "For the soul there is neither birth nor death; the Self is eternal.",
    practical_advice:
      "1) Allow the grieving to follow its stages, seek rituals and community support. 2) Create memory projects that honor the parent's life. 3) Seek grief counseling when overwhelmed.",
  },

  {
    id: "ethical_career_choice",
    title: "Choosing Between Money and Ethics",
    keywords: [
      "sell out",
      "ethics vs money",
      "compromise values",
      "unethical job offer",
      "moral compromise for money",
    ],
    shloka: "धर्म एव हतो हन्ति",
    reference: "Gita dharma principle",
    translation:
      "When dharma is abandoned, there is destruction; uphold integrity.",
    practical_advice:
      "1) Prioritize long-term reputation and conscience. 2) Seek alternative income aligned with values or negotiate better terms. 3) If compromise unavoidable, document boundaries and plan exit.",
  },

  {
    id: "meaninglessness_nihilism",
    title: "Existential Crisis / Meaninglessness",
    keywords: [
      "meaningless",
      "nihilism",
      "existential crisis",
      "life has no meaning",
      "what is purpose",
    ],
    shloka: "स्वधर्मे निधनं श्रेयः परधर्मो भयावहः।",
    reference: "Bhagavad Gītā 3:35 (paraphrase)",
    translation:
      "Perform your own duty though imperfect; better to die in one's own duty than follow another's.",
    practical_advice:
      "1) Try small purposeful acts that align with values. 2) Study spiritual texts and seek wise counsel. 3) Volunteer or serve to reorient toward meaning beyond self.",
  },

  {
    id: "creative_block",
    title: "Creative Block / Lack of Inspiration",
    keywords: [
      "blocked creatively",
      "can't write",
      "creative block",
      "no ideas",
      "artist block",
    ],
    shloka: "न तस्य प्रज्ञा वर्तमानि मोहन वस्त्रयोः।",
    reference: "Gita creativity encouragement",
    translation:
      "Clarity returns when the mind is freed from confusion.",
    practical_advice:
      "1) Remove pressure; set playful constraints. 2) Take small daily creative practice and iterate. 3) Change environment and collaborate for fresh input.",
  },

  // Add more entries if you want; this list already covers ~50 real-world concerns.
];

/**
 * Utility: normalize text and remove punctuation (keeps apostrophes)
 */
function normalizeText(s?: string) {
  return (s || "")
    .toLowerCase()
    .replace(/\u2019/g, "'")
    .replace(/[^\w'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Score a problem entry against input text.
 * - multi-word phrase matches get heavier weight
 * - each matched keyword counts; multiple occurrences add score
 */
function scoreProblemAgainstText(text: string, p: ProblemEntry): number {
  const textNorm = " " + normalizeText(text) + " ";
  let score = 0;
  // sort keywords by length (phrases first)
  const sorted = p.keywords.slice().sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    const kwn = normalizeText(kw);
    if (!kwn) continue;
    // whole-phrase match (word boundaries)
    const pattern = new RegExp(`\\b${escapeRegExp(kwn)}\\b`, "g");
    const matches = textNorm.match(pattern);
    if (matches && matches.length > 0) {
      // phrase weight: longer phrases -> greater weight
      const phraseWeight = kwn.split(/\s+/).length > 1 ? 2.2 : 1.0;
      score += matches.length * phraseWeight;
    } else if (textNorm.includes(kwn)) {
      // substring fallback
      score += 0.5;
    }
  }
  return score;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Generate the Krishna response locally (fallback).
 * Returns an object with response text and meta info.
 */
function generateKrishnaResponse(message: string) {
  const text = normalizeText(message);
  if (!text) {
    return {
      top: "neutral",
      response:
        "प्रिय भक्त, कृपया अपना संदेश लिखें — I need some text to offer guidance.",
      detail: {},
    };
  }

  const scores = PROBLEMS.map((p) => {
    return { p, score: scoreProblemAgainstText(text, p) };
  });

  // find best match
  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];

  // if best score low, produce general guidance with several likely matches
  if (!best || best.score < 1.0) {
    // choose top 3 candidate titles to show as possible areas
    const topCandidates = scores.filter((s) => s.score > 0).slice(0, 3);
    const suggestions =
      topCandidates.length > 0
        ? `I detected these themes: ${topCandidates
            .map((s) => s.p.title)
            .join(", ")}.`
        : "I couldn't detect a clear single issue — please share more details.";

    const fallbackResponse = [
      "प्रिय भक्त, every situation offers a path to growth.",
      "",
      "'तत्त्ववित्तु महाबाहो गुणकर्मविभागयोः।' (Bhagavad Gītā 3:28) — Understand the qualities and duties; act accordingly.",
      "",
      `Note: ${suggestions}`,
      "",
      "Practical: write a 3-point action plan, take 5 deep breaths to center, and do one small constructive step now.",
    ].join("\n");

    return {
      top: "general",
      response: fallbackResponse,
      detail: {
        candidates: scores.slice(0, 5).map((s) => ({ id: s.p.id, title: s.p.title, score: s.score })),
      },
    };
  }

  // build detailed response including shloka, translation and advice
  const p = best.p;
  const output = [
    `प्रिय भक्त — ${p.title}`,
    "",
    `${p.shloka}`,
    `(${p.reference})`,
    "",
    `Translation: ${p.translation}`,
    "",
    `Practical Advice: ${p.practical_advice}`,
    "",
    "Note: If this is a medical, legal, or severe mental-health issue please consult appropriate professionals.",
  ].join("\n");

  return {
    top: p.id,
    response: output,
    detail: {
      matchedTitle: p.title,
      score: best.score,
    },
  };
}

/**
 * Chat UI component
 */
export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "krishna",
      content:
        "🙏 नमस्ते प्रिय आत्मा! I am Krishna, your guide. Share your concerns and I shall offer counsel from the Bhagavad Gita.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  // Try remote backend; fallback to local generator
  const getKrishnaGuidance = async (userMessage: string) => {
    // Try remote
    try {
      const resp = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      if (!resp.ok) {
        console.warn("Backend returned non-OK status, falling back to local.");
        const local = generateKrishnaResponse(userMessage);
        return local.response;
      }
      const data = await resp.json();
      // backend expected to return { response: "...", ... } - otherwise fallback
      if (data && typeof data.response === "string") return data.response;
      if (data && typeof data.message === "string") return data.message;
      // fallback: if backend returned detected emotion/verse we could format; here fallback to local
      return generateKrishnaResponse(userMessage).response;
    } catch (err) {
      // console.warn and fallback
      console.warn("Error calling backend; using local generator.", err);
      return generateKrishnaResponse(userMessage).response;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const responseText = await getKrishnaGuidance(userMessage.content);
      // small artificial delay to feel conversational
      await new Promise((r) => setTimeout(r, 600));

      const krishnaMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "krishna",
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, krishnaMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "krishna",
        content:
          "क्षम्यताम् — I couldn't generate guidance due to an error. Please try again or rephrase your message.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-200/10 to-sky-200/8 p-4 border-b border-white/6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center">
                <Bot className="w-6 h-6 text-indigo-800" />
              </div>
              <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Chat with Krishna</h2>
              <p className="text-sm text-gray-300">Bhagavad Gita based guidance for real problems</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-xs md:max-w-2xl items-start gap-3 ${
                  m.type === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    m.type === "user" ? "bg-indigo-500" : "bg-yellow-300"
                  }`}
                >
                  {m.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-indigo-900" />
                  )}
                </div>
                <div
                  className={`rounded-2xl p-4 ${
                    m.type === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white/6 text-gray-100 border border-white/6"
                  }`}
                >
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-900" />
                </div>
                <div className="bg-white/6 rounded-2xl p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/6">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Share your concern (e.g., 'I'm anxious about my job')..."
              className="flex-1 px-4 py-2 rounded-xl bg-white/6 text-black border border-white/8 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2 rounded-xl bg-yellow-300 text-indigo-900 font-semibold disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
