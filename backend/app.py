# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import nltk
from textblob import TextBlob
import random
import json
from datetime import datetime
import sqlite3
import os
from typing import Dict, List, Tuple

# -----------------------------
# NLTK data bootstrap (safe)
# -----------------------------
def _safe_nltk_download(resource: str):
    try:
        nltk.data.find(resource)
    except LookupError:
        try:
            nltk.download(resource.split('/')[-1])
        except Exception:
            pass

# Punkt, VADER; new NLTK sometimes needs 'punkt_tab'
_safe_nltk_download('tokenizers/punkt')
_safe_nltk_download('tokenizers/punkt_tab')
_safe_nltk_download('sentiment/vader_lexicon')
_safe_nltk_download('corpora/wordnet')

from nltk.sentiment import SentimentIntensityAnalyzer

app = Flask(__name__)
CORS(app)

# ------------------------------------
# Initialize sentiment analyzer & DB
# ------------------------------------
SIA = SentimentIntensityAnalyzer()

DB_PATH = 'user_data.db'

def db_connect():
    return sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)

def init_db():
    conn = db_connect()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS user_emotions
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  emotion TEXT,
                  confidence REAL,
                  input_text TEXT,
                  sentiment TEXT,
                  compound REAL,
                  timestamp DATETIME)''')
    c.execute('''CREATE TABLE IF NOT EXISTS user_progress
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id TEXT DEFAULT 'default',
                  karma_points INTEGER DEFAULT 0,
                  streak_days INTEGER DEFAULT 0,
                  emotional_balance REAL DEFAULT 50.0,
                  last_updated DATETIME)''')
    conn.commit()
    conn.close()

init_db()

# ------------------------------------
# Gita Shlokas (your provided content)
# ------------------------------------
GITA_SHLOKAS = {
    "joy": [
        {
            "sanskrit": "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥",
            "translation": "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.",
            "chapter": 2, "verse": 48,
            "explanation": "True joy comes from performing our duties without attachment to results...",
            "practical_advice": "Today, choose one important task and perform it with complete dedication..."
        },
        {
            "sanskrit": "सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ। ततो युद्धाय युज्यस्व नैवं पापमवाप्स्यसि॥",
            "translation": "Fight for the sake of duty, treating alike happiness and distress, loss and gain, victory and defeat...",
            "chapter": 2, "verse": 38,
            "explanation": "True joy comes from doing our duty without being affected by dualities...",
            "practical_advice": "Practice seeing both pleasant and unpleasant experiences as opportunities for growth..."
        }
    ],
    "sadness": [
        {
            "sanskrit": "न त्वेवाहं जातु नासं न त्वं नेमे जनाधिपाः। न चैव न भविष्यामः सर्वे वयमतः परम्॥",
            "translation": "Never was there a time when I did not exist, nor you, nor all these kings...",
            "chapter": 2, "verse": 12,
            "explanation": "This fundamental truth about the eternal nature of the soul provides comfort...",
            "practical_advice": "When sadness overwhelms you, remember that your true self is eternal..."
        },
        {
            "sanskrit": "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
            "translation": "O son of Kunti, the contact between the senses and their objects gives rise to happiness and distress...",
            "chapter": 2, "verse": 14,
            "explanation": "Sadness, like happiness, arises from the contact of our senses with the external world...",
            "practical_advice": "Acknowledge your sadness without judgment, but remember it's temporary..."
        }
    ],
    "anxiety": [
        {
            "sanskrit": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
            "translation": "You have the right to perform your prescribed duties, but never to the fruits of action...",
            "chapter": 2, "verse": 47,
            "explanation": "This is the most fundamental teaching for overcoming anxiety...",
            "practical_advice": "Make a clear list of what's within your control versus what isn't..."
        },
        {
            "sanskrit": "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः। तत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम॥",
            "translation": "Wherever there is Krishna... there will certainly be opulence, victory, extraordinary power, and morality.",
            "chapter": 18, "verse": 78,
            "explanation": "When we align our actions with divine consciousness and perform our duties with skill...",
            "practical_advice": "Before making any decision, connect with your inner wisdom through prayer or meditation..."
        }
    ],
    "anger": [
        {
            "sanskrit": "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः। स्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥",
            "translation": "From anger comes delusion...",
            "chapter": 2, "verse": 63,
            "explanation": "This verse reveals the destructive chain reaction that begins with anger...",
            "practical_advice": "When you feel anger rising, immediately pause and take three deep breaths..."
        },
        {
            "sanskrit": "अहिंसा सत्यमक्रोधस्त्यागः शान्तिरपैशुनम्...",
            "translation": "Non-violence, truthfulness, freedom from anger...",
            "chapter": 16, "verse": 2,
            "explanation": "Freedom from anger is listed among the divine qualities that lead to liberation...",
            "practical_advice": "Practice compassion today, especially toward the person or situation that triggered your anger..."
        }
    ],
    "confusion": [
        {
            "sanskrit": "यदा ते मोहकलिलं बुद्धिर्व्यतितरिष्यति...",
            "translation": "When your intelligence crosses the mire of confusion...",
            "chapter": 2, "verse": 52,
            "explanation": "Confusion often precedes clarity...",
            "practical_advice": "When confused, sit quietly for 10-15 minutes without trying to solve anything..."
        },
        {
            "sanskrit": "तत्त्ववित्तु महाबाहो गुणकर्मविभागयोः...",
            "translation": "One who is in knowledge of the Absolute Truth does not engage in the senses...",
            "chapter": 3, "verse": 28,
            "explanation": "True knowledge brings clarity about what actions to take and why...",
            "practical_advice": "Seek knowledge from reliable sources..."
        }
    ],
    "gratitude": [
        {
            "sanskrit": "यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धनः...",
            "translation": "Work done as a sacrifice for Vishnu has to be performed...",
            "chapter": 3, "verse": 9,
            "explanation": "When we perform all actions as offerings to the divine, work becomes worship...",
            "practical_advice": "Begin each task today with gratitude and the intention to serve..."
        },
        {
            "sanskrit": "अन्नाद्भवन्ति भूतानि पर्जन्यादन्नसम्भवः...",
            "translation": "All living beings subsist on food grains... Rains are produced by performance of yajna...",
            "chapter": 3, "verse": 14,
            "explanation": "This verse reveals the interconnectedness of all existence...",
            "practical_advice": "Before eating today, take a moment to appreciate all the elements that brought this food..."
        }
    ],
    "self_realization": [
        {
            "sanskrit": "न जायते म्रियते वा कदाचिन्...",
            "translation": "For the soul there is neither birth nor death at any time...",
            "chapter": 2, "verse": 20,
            "explanation": "This verse points to the eternal Self beyond the body...",
            "practical_advice": "When overwhelmed, remember your deeper, unchanging identity..."
        }
    ],
    "discipline": [
        {
            "sanskrit": "यतते चिरं तदाग्रे चित्तस्य ब्रह्मचर्ये स्थितः...",
            "translation": "One who regulates eating, sleeping, recreation and work is fit for yoga...",
            "chapter": 6, "verse": 17,
            "explanation": "Moderation and disciplined habits protect practice...",
            "practical_advice": "Make a tiny daily routine: 20 minutes of focused practice..."
        }
    ],
    "self_mastery": [
        {
            "sanskrit": "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्...",
            "translation": "Elevate yourself through the power of your mind...",
            "chapter": 6, "verse": 5,
            "explanation": "Practical instruction emphasizing that inner mastery is the key...",
            "practical_advice": "When negative thoughts rise, practice 'mind-lift'..."
        }
    ],
    "humility": [
        {
            "sanskrit": "अमानित्वमदम्भित्वमहिंसा क्षान्तिरार्जवम्...",
            "translation": "Humbleness, lack of hypocrisy, non-violence, tolerance...",
            "chapter": 13, "verse": 8,
            "explanation": "A practical list of virtues — humility and modesty...",
            "practical_advice": "Practice one small act of anonymous service today..."
        }
    ],
    "steadiness": [
        {
            "sanskrit": "दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः...",
            "translation": "One who is steady-minded in sorrow and pleasure...",
            "chapter": 2, "verse": 56,
            "explanation": "Describes inner balance—steady wisdom remains unmoved...",
            "practical_advice": "When you react strongly, pause and ask: 'Is this permanent?'"
        }
    ],
    "attachment_awareness": [
        {
            "sanskrit": "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते...",
            "translation": "When one dwells on sense objects, attachment is born...",
            "chapter": 2, "verse": 62,
            "explanation": "Maps how small mental habits escalate...",
            "practical_advice": "Notice the first five seconds of desire..."
        }
    ],
    "anger_warning": [
        {
            "sanskrit": "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः...",
            "translation": "From anger comes delusion...",
            "chapter": 2, "verse": 63,
            "explanation": "A strong caution: anger triggers a chain leading to bad decisions...",
            "practical_advice": "When anger surfaces, count to ten with slow exhalations..."
        }
    ],
    "surrender": [
        {
            "sanskrit": "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज...",
            "translation": "Abandon all varieties of dharma and surrender unto Me alone...",
            "chapter": 18, "verse": 66,
            "explanation": "An invitation to radical surrender...",
            "practical_advice": "If anxiety swamps you, practice a brief surrender..."
        }
    ],
    "divine_intervention": [
        {
            "sanskrit": "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत...",
            "translation": "Whenever there is a decline of righteousness...",
            "chapter": 4, "verse": 7,
            "explanation": "Gives hope that a higher principle intervenes...",
            "practical_advice": "When you feel powerless, look for one corrective action..."
        }
    ],
    "duty": [
        {
            "sanskrit": "यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धनः...",
            "translation": "Work done as a sacrifice for the Divine frees one from bondage...",
            "chapter": 3, "verse": 9,
            "explanation": "Emphasizes right attitude toward work...",
            "practical_advice": "Before starting work, dedicate the effort to a purpose larger than self..."
        }
    ],
    "fear": [
        {
            "sanskrit": "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज...",
            "translation": "Abandon all varieties of dharma and surrender unto Me alone. Do not fear.",
            "chapter": 18, "verse": 66,
            "explanation": "This is Krishna's ultimate assurance...",
            "practical_advice": "When fear arises, remember you are not facing challenges alone..."
        },
        {
            "sanskrit": "न मे भक्तः प्रणश्यति।",
            "translation": "My devotee never perishes.",
            "chapter": 9, "verse": 31,
            "explanation": "Those who dedicate their lives to divine service are always protected...",
            "practical_advice": "Dedicate your actions today to serving something greater than yourself..."
        }
    ]
}

# ------------------------------------
# Emotion Lexicon (regex-ready)
# ------------------------------------
# Tip: use \b word boundaries where possible; keep some multi-word phrases as-is.
RAW_EMOTION_KEYWORDS: Dict[str, List[str]] = {
    "joy": [
        "happy","happiness","joyful","delighted","glad","content","contented",
        "cheerful","elated","ecstatic","pleased","overjoyed","bliss","blissful",
        "satisfied","uplifted","buoyant","hopeful","optimistic","relieved",
        "feeling good","i feel good","i'm happy","really happy","so happy",
        "this is great","that's wonderful","made my day","i'm thrilled"
    ],
    "sadness": [
        "sad","sadness","depressed","depression","down","downcast","unhappy",
        "melancholy","grief","grieving","sorrow","sorrowful","heartbroken",
        "tearful","tear up","lonely","loneliness","lost","hopeless","despair",
        "homesick","blue","i miss","missing you","can't cope","can't handle this"
    ],
    "anxiety": [
        "anxious","anxiety","worried","worry","nervous","stressed","stress",
        "panic","panicking","overthinking","ruminating","tense","restless",
        "uneasy","dread","apprehensive","on edge","freaking out","can't sleep",
        "insomnia","heart racing","i'm worried about","i'm anxious about","too much on my mind"
    ],
    "anger": [
        "angry","anger","mad","furious","irate","resentful","resentment",
        "irritated","annoyed","outraged","fuming","heated","rage","ranting",
        "hate","disgusted at someone","sore","i'm furious","i'm mad at"
    ],
    "fear": [
        "afraid","fear","scared","terror","terrified","phobia",
        "fearful","dread","panic attack","i'm scared","i'm terrified","i'm afraid",
        "safety","unsafe","threat","threatened","danger"
    ],
    "confusion": [
        "confused","confusion","uncertain","uncertainty","undecided",
        "doubt","doubting","puzzled","bewildered","not sure","which way","what should i do",
        "help me choose","i don't know what to do","direction","purpose","lost"
    ],
    "gratitude": [
        "grateful","gratefulness","thankful","thanks","appreciative","blessed",
        "thank you","much obliged","i'm grateful","i appreciate"
    ],
    "guilt": [
        "guilty","guilt","remorse","remorseful","regret","regretful","sorry",
        "apologize","i'm sorry","i regret","i did wrong","shame","shameful"
    ],
    "shame": [
        "ashamed","embarrassed","humiliated","mortified","cringe","deep shame",
        "i'm ashamed","i feel ashamed","losing face"
    ],
    "loneliness": [
        "lonely","isolated","alone","no one cares","no friends","nobody","left out",
        "isolated at home","socially isolated"
    ],
    # your advanced / spiritual states
    "self_realization": [
        "soul","eternal","immortal","self","i am not the body","who am i",
        "true self","atman","i feel like more than body","spiritual awakening",
        "seeking truth","existential","realize self","i am consciousness"
    ],
    "discipline": [
        "routine","discipline","practice","consistent","habit","schedule",
        "self-discipline","self control","willpower","staying consistent","daily practice",
        "commitment","i can't keep routine","need a routine"
    ],
    "self_mastery": [
        "mind","master","control","self control","willpower","overcome",
        "control my thoughts","train my mind","dominate my mind","mind discipline",
        "conquer mind","mindfulness practice"
    ],
    "humility": [
        "humble","humility","modest","unassuming","servant","lack of ego",
        "i want to be humble","let go of pride","stop boasting","humble myself"
    ],
    "steadiness": [
        "steady","calm","balanced","even-minded","equanimity","steady mind",
        "stable","unshakable","composed","centered","grounded","remain calm"
    ],
    "attachment_awareness": [
        "attachment","craving","desire","longing","cling","clinging","neediness",
        "want too much","can't let go","obsessed with","addicted to","attached to"
    ],
    "surrender": [
        "surrender","let go","i give up","i can't control","i surrender",
        "accept","acceptance","offer it to god","let it be","release control"
    ],
    "divine_intervention": [
        "help","miracle","save me","save","restore","intervene","divine help",
        "i need a sign","divine will","god help","i need guidance","miracle please"
    ],
    "duty": [
        "duty","work","karma","responsibility","svadharma","dharma",
        "my role","i have a duty","responsible for","obligation","should i do my duty"
    ]
}

# Compile regex patterns for speed & better matching
# We use word boundaries for single words; keep phrase search case-insensitive.
COMPILED_LEXICON: Dict[str, List[re.Pattern]] = {}
for emotion, phrases in RAW_EMOTION_KEYWORDS.items():
    compiled = []
    for p in phrases:
        if ' ' in p or "'" in p:
            # phrase match - escape & use simple search
            compiled.append(re.compile(re.escape(p), re.IGNORECASE))
        else:
            # word boundary match
            compiled.append(re.compile(rf'\b{re.escape(p)}\b', re.IGNORECASE))
    COMPILED_LEXICON[emotion] = compiled

# ------------------------------------
# Sentiment helpers
# ------------------------------------
def vader_sentiment(text: str) -> Dict[str, float]:
    return SIA.polarity_scores(text)

def blob_sentiment(text: str) -> Tuple[float, float]:
    blob = TextBlob(text)
    return blob.sentiment.polarity, blob.sentiment.subjectivity

def label_sentiment(vader_compound: float) -> str:
    if vader_compound >= 0.05:
        return "positive"
    elif vader_compound <= -0.05:
        return "negative"
    return "neutral"

# ------------------------------------
# Emotion analysis
# ------------------------------------
def score_emotions(text: str) -> Dict[str, float]:
    """
    Score each emotion by regex hits (count) and lightly weight by sentiment.
    Returns a dict {emotion: score}
    """
    if not text.strip():
        return {}

    text_lower = text.lower()
    hits: Dict[str, int] = {}
    for emotion, patterns in COMPILED_LEXICON.items():
        count = 0
        for pat in patterns:
            # count number of matches (non-overlapping)
            count += len(pat.findall(text_lower))
        if count > 0:
            hits[emotion] = count

    # If no keyword hits, return empty to let fallback pick
    if not hits:
        return {}

    # Optional: weight by sentiment direction
    # Positive push up joy/gratitude/steadiness; negative push up sadness/anger/fear/anxiety.
    vader = vader_sentiment(text)
    comp = vader.get('compound', 0.0)

    pos_bias = {"joy","gratitude","steadiness","self_realization","humility","discipline","self_mastery","surrender","duty","divine_intervention"}
    neg_bias = {"sadness","anger","fear","anxiety","guilt","shame","loneliness","confusion","attachment_awareness","anger_warning"}

    scores: Dict[str, float] = {}
    for emo, cnt in hits.items():
        base = float(cnt)
        if emo in pos_bias and comp > 0:
            base *= (1.0 + min(0.5, comp))   # up to +50%
        if emo in neg_bias and comp < 0:
            base *= (1.0 + min(0.5, -comp))  # up to +50%
        scores[emo] = base

    return scores

def analyze_emotion(text: str) -> Dict:
    """
    Full emotion + sentiment analysis with fallbacks and confidence.
    Returns:
      {
        emotion: str,
        confidence: float (0..1),
        top_emotions: [{emotion, score}],
        sentiment: {label, compound, pos, neu, neg, blob_polarity, blob_subjectivity},
        details: {...}
      }
    """
    if not text or not text.strip():
        return {
            "emotion": "confusion",
            "confidence": 0.4,
            "top_emotions": [],
            "sentiment": {"label": "neutral", "compound": 0.0, "pos":0.0, "neu":1.0, "neg":0.0,
                          "blob_polarity": 0.0, "blob_subjectivity": 0.0},
            "details": {}
        }

    vader = vader_sentiment(text)
    blob_pol, blob_subj = blob_sentiment(text)
    sent_label = label_sentiment(vader.get('compound', 0.0))

    lex_scores = score_emotions(text)
    top_list = sorted(lex_scores.items(), key=lambda x: x[1], reverse=True)[:3]

    # Determine primary emotion
    if top_list:
        primary_emotion = top_list[0][0]
        # Confidence from (normalized) keyword signal + sentiment alignment
        max_score = top_list[0][1]
        total = sum(s for _, s in top_list) or max_score
        kw_conf = min(0.9, 0.6 + 0.3 * (max_score / max(1.0, total)))
        # Extra nudge if sentiment direction matches classic mapping
        if primary_emotion in {"joy","gratitude","steadiness","self_realization","humility","discipline","self_mastery","surrender","duty","divine_intervention"} and sent_label == "positive":
            kw_conf = min(0.95, kw_conf + 0.05)
        if primary_emotion in {"sadness","anger","fear","anxiety","guilt","shame","loneliness","confusion","attachment_awareness","anger_warning"} and sent_label == "negative":
            kw_conf = min(0.95, kw_conf + 0.05)
        confidence = round(kw_conf, 3)
    else:
        # Fallback: sentiment-only mapping
        comp = vader.get('compound', 0.0)
        if comp >= 0.25 or blob_pol > 0.3:
            primary_emotion = "joy"
        elif comp <= -0.25 or blob_pol < -0.3:
            # pick between sadness/anxiety/fear based on neg vs neu and subjectivity
            if vader.get('neg', 0.0) > 0.4:
                primary_emotion = "sadness"
            elif blob_subj > 0.55:
                primary_emotion = "anxiety"
            else:
                primary_emotion = "fear"
        else:
            primary_emotion = "confusion"
        confidence = round(min(0.8, 0.5 + abs(comp) * 0.5), 3)
        top_list = [(primary_emotion, 1.0)]

    return {
        "emotion": primary_emotion,
        "confidence": confidence,
        "top_emotions": [{"emotion": e, "score": round(s, 3)} for e, s in top_list],
        "sentiment": {
            "label": sent_label,
            "compound": round(vader.get('compound', 0.0), 4),
            "pos": vader.get('pos', 0.0),
            "neu": vader.get('neu', 0.0),
            "neg": vader.get('neg', 0.0),
            "blob_polarity": round(blob_pol, 4),
            "blob_subjectivity": round(blob_subj, 4),
        },
        "details": {}
    }

def get_relevant_shloka(emotion: str) -> Dict:
    if emotion in GITA_SHLOKAS:
        return random.choice(GITA_SHLOKAS[emotion])
    # fallback
    return random.choice(GITA_SHLOKAS["confusion"])

def save_emotion_row(emotion: str, confidence: float, input_text: str, sentiment_label: str, compound: float):
    conn = db_connect()
    c = conn.cursor()
    c.execute(
        '''INSERT INTO user_emotions (emotion, confidence, input_text, sentiment, compound, timestamp)
           VALUES (?, ?, ?, ?, ?, ?)''',
        (emotion, float(confidence), input_text, sentiment_label, float(compound), datetime.now())
    )
    conn.commit()
    conn.close()

# ------------------------------------
# Krishna-style response generator
# ------------------------------------
def generate_krishna_response(message: str, emotion: str) -> str:
    ml = message.lower()

    # Work & career
    if any(w in ml for w in ['job','work','career','office','boss','colleague','manager','promotion']):
        return ("प्रिय कर्मयोगी, I understand your workplace challenges.\n\n"
                "“कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥” (2.47)\n\n"
                "You have the right to perform your prescribed duties, but never to the fruits of action.\n\n"
                "🎯 Practical: Focus on excellence in action; release outcomes.")

    # Relationships
    if any(w in ml for w in ['relationship','marriage','family','parents','love','breakup','divorce','partner','wife','husband']):
        return ("प्रिय आत्मा, relationships are mirrors for growth.\n\n"
                "“सर्वभूतस्थमात्मानं ... सर्वत्र समदर्शनः॥” (6.29)\n\n"
                "A true yogi sees the Divine in all beings.\n\n"
                "💕 Practical: Practice forgiveness and see the divine spark in the other.")

    # Money
    if any(w in ml for w in ['money','financial','debt','poor','rich','salary','income','bills']):
        return ("वत्स, financial concerns are real—remember this promise:\n\n"
                "“अनन्याश्चिन्तयन्तो मां ... योगक्षेमं वहाम्यहम्॥” (9.22)\n\n"
                "Align with dharma; your needs are carried.\n\n"
                "💰 Practical: Serve through your skills; be diligent and content.")

    # Health
    if any(w in ml for w in ['health','disease','sick','pain','illness','doctor','injury']):
        return ("प्रिय मित्र, the body is temporary; you are eternal.\n\n"
                "“वासांसि जीर्णानि ... देही॥” (2.22)\n\n"
                "Care for the body as a temple, but don’t identify with it.\n\n"
                "🏥 Practical: Sattvic food, breathwork, gentle movement, steady mind.")

    # Fear/Anxiety
    if any(w in ml for w in ['fear','afraid','scared','anxiety','panic','worry','worried']):
        return ("वत्स, fear fades with remembrance of your true nature.\n\n"
                "“सर्वधर्मान्परित्यज्य ... मा शुचः॥” (18.66)\n\n"
                "🛡️ Practical: Breathe, pray, surrender the outcome, act with courage.")

    # Anger
    if any(w in ml for w in ['anger','angry','mad','frustrated','hate','irritated','rage','furious']):
        return ("मित्र, anger clouds wisdom.\n\n"
                "“क्रोधाद्भवति सम्मोहः ... प्रणश्यति॥” (2.63)\n\n"
                "🔥 Practical: Pause, exhale slowly, choose one constructive action.")

    # Sadness
    if any(w in ml for w in ['sad','depression','lonely','grief','cry','sorrow','heartbroken']):
        return ("प्रिय आत्मा, your pain is seen.\n\n"
                "“न त्वेवाहं जातु नासं ... परम्॥” (2.12)\n\n"
                "🌅 Practical: Gentle self-care, connection, and remember—this too shall pass.")

    # Stress
    if any(w in ml for w in ['stress','pressure','overwhelm','burden','tension','burnout','stressed']):
        return ("प्रिय मित्र, release attachment to outcomes.\n\n"
                "“योगस्थः कुरु कर्माणि ... उच्यते॥” (2.48)\n\n"
                "⚖️ Practical: Focus on effort; meditate daily for equanimity.")

    # Confusion / Purpose
    if any(w in ml for w in ['confused','lost','direction','purpose','meaning','which way','what should i do']):
        return ("वत्स, confusion precedes clarity.\n\n"
                "“यदा ते मोहकलिलं ... च॥” (2.52)\n\n"
                "🧭 Practical: Quiet the mind; seek knowledge; your dharma will reveal itself.")

    # Default: tie to detected emotion
    shloka = get_relevant_shloka(emotion)
    return (f"प्रिय, I sense **{emotion.replace('_',' ')}**.\n\n"
            f"{shloka['sanskrit']}\n\n"
            f"{shloka['translation']}\n\n"
            f"Practical: {shloka['practical_advice']}")

# ------------------------------------
# API Endpoints
# ------------------------------------
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/analyze-emotion', methods=['POST'])
def analyze_emotion_endpoint():
    try:
        data = request.get_json(force=True) or {}
        text = data.get('text', '')
        if not text.strip():
            return jsonify({"error": "Text input is required"}), 400

        result = analyze_emotion(text)
        shloka = get_relevant_shloka(result['emotion'])

        # persist
        save_emotion_row(
            result['emotion'],
            result['confidence'],
            text,
            result['sentiment']['label'],
            result['sentiment']['compound']
        )

        return jsonify({
            "emotion": result['emotion'],
            "confidence": result['confidence'],
            "top_emotions": result['top_emotions'],
            "sentiment": result['sentiment'],
            "shloka": {
                "sanskrit": shloka['sanskrit'],
                "translation": shloka['translation'],
                "chapter": shloka['chapter'],
                "verse": shloka['verse'],
                "explanation": shloka['explanation'],
                "practical_advice": shloka['practical_advice']
            },
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    try:
        data = request.get_json(force=True) or {}
        message = data.get('message', '')
        if not message.strip():
            return jsonify({"error": "Message is required"}), 400

        emotion_result = analyze_emotion(message)
        response_text = generate_krishna_response(message, emotion_result['emotion'])

        # persist
        save_emotion_row(
            emotion_result['emotion'],
            emotion_result['confidence'],
            message,
            emotion_result['sentiment']['label'],
            emotion_result['sentiment']['compound']
        )

        return jsonify({
            "response": response_text,
            "detected_emotion": emotion_result['emotion'],
            "confidence": emotion_result['confidence'],
            "sentiment": emotion_result['sentiment'],
            "top_emotions": emotion_result['top_emotions'],
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/daily-quote', methods=['GET'])
def daily_quote():
    try:
        all_shlokas = []
        for arr in GITA_SHLOKAS.values():
            all_shlokas.extend(arr)
        daily_shloka = random.choice(all_shlokas)
        return jsonify({
            "shloka": daily_shloka,
            "date": datetime.now().date().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/user-progress', methods=['GET'])
def get_user_progress():
    try:
        conn = db_connect()
        c = conn.cursor()
        c.execute('''SELECT emotion, COUNT(*) as count 
                     FROM user_emotions 
                     WHERE datetime(timestamp) >= datetime('now', '-30 days')
                     GROUP BY emotion''')
        emotion_stats = dict(c.fetchall())

        positive_emotions = sum(emotion_stats.get(k, 0) for k in ['joy','gratitude','steadiness'])
        negative_emotions = sum(emotion_stats.get(k, 0) for k in ['sadness','anger','fear','anxiety','guilt','shame'])
        total_emotions = sum(emotion_stats.values())
        emotional_balance = 50.0
        if total_emotions > 0:
            emotional_balance = (positive_emotions / total_emotions) * 100.0

        conn.close()

        return jsonify({
            "karma_points": 150 + (total_emotions * 10),
            "streak_days": 7,
            "emotional_balance": round(emotional_balance, 1),
            "emotion_distribution": emotion_stats,
            "total_sessions": total_emotions
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/journey', methods=['GET'])
def get_user_journey():
    try:
        conn = db_connect()
        c = conn.cursor()
        c.execute('''SELECT emotion, confidence, input_text, sentiment, compound, timestamp 
                     FROM user_emotions 
                     ORDER BY timestamp DESC 
                     LIMIT 10''')
        rows = c.fetchall()
        conn.close()

        entries = []
        for emotion, confidence, input_text, sentiment, compound, ts in rows:
            shloka = get_relevant_shloka(emotion)
            entries.append({
                "emotion": emotion,
                "confidence": confidence,
                "input_text": (input_text[:100] + "...") if len(input_text) > 100 else input_text,
                "timestamp": ts,
                "sentiment": {"label": sentiment, "compound": compound},
                "shloka_preview": shloka['translation'][:120] + "...",
                "mood_score": int(round(confidence * 10))
            })

        return jsonify({"entries": entries})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------- Optional: inspect emotions/keywords --------
@app.route('/api/emotions', methods=['GET'])
def list_emotions():
    return jsonify({
        "emotions": sorted(list(GITA_SHLOKAS.keys())),
        "lexicon_counts": {k: len(v) for k, v in RAW_EMOTION_KEYWORDS.items()}
    })

# ------------------------------------
# Run
# ------------------------------------
if __name__ == '__main__':
    # For docker/k8s use env PORT; default 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
