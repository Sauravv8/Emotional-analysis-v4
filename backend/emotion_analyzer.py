"""
enhanced_emotion_analyzer.py

Advanced Emotion Analyzer:
- Large lexicon (phrases + keywords)
- WordNet expansion + stemming + fuzzy fallback
- Intensity modifiers and multi-word phrase handling
- VADER + TextBlob sentiment signals
- Robust confidence calculation and detailed debug info
- Animation hints for UI per emotion
"""

import re
import math
import json
from typing import Dict, List, Tuple, Any
from collections import defaultdict, Counter
from difflib import get_close_matches

import nltk
from textblob import TextBlob
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.stem.porter import PorterStemmer
from nltk.corpus import wordnet as wn

# Ensure NLTK resources (downloads silently if missing)
def _ensure_nltk_resources():
    try:
        nltk.data.find("tokenizers/punkt")
    except LookupError:
        nltk.download("punkt", quiet=True)
    try:
        nltk.data.find("sentiment/vader_lexicon")
    except LookupError:
        nltk.download("vader_lexicon", quiet=True)
    try:
        nltk.data.find("corpora/wordnet")
    except LookupError:
        nltk.download("wordnet", quiet=True)
    try:
        nltk.data.find("tokenizers/punkt")
    except LookupError:
        nltk.download("punkt", quiet=True)

_ensure_nltk_resources()


class EnhancedEmotionAnalyzer:
    def __init__(self, expand_wordnet: bool = True, fuzzy_cutoff: float = 0.86):
        self.sia = SentimentIntensityAnalyzer()
        self.stemmer = PorterStemmer()
        self.fuzzy_cutoff = fuzzy_cutoff
        self.expand_wordnet = expand_wordnet

        # Intensity multipliers that amplify nearby emotion words
        self.intensity_modifiers = {
            "extremely": 2.0, "incredibly": 1.9, "very": 1.6, "so": 1.5,
            "really": 1.4, "quite": 1.25, "somewhat": 0.85, "slightly": 0.7,
            "a bit": 0.7, "barely": 0.6, "totally": 1.6, "utterly": 1.8
        }

        # Build lexicon (phrases + keywords). See _build_lexicon for details.
        self.lexicon = self._build_lexicon()

        # optionally expand keywords via WordNet to capture synonyms
        if self.expand_wordnet:
            self._apply_wordnet_expansion()

        # Build stems lookup to speed matching
        self._build_stem_lookup()

        # Phrase bonus multiplier (phrases are stronger signal than single keywords)
        self.PHRASE_BONUS = 1.6
        self.KEYWORD_WEIGHT = 1.0
        self.SENTIMENT_WEIGHT = 0.20  # how much sentiment aligns with lexical signal

        # animation hints (UI-friendly)
        self.animation_map = {
            "joy": {"name": "glow-pulse", "color": "#FFD166", "duration_ms": 850},
            "sadness": {"name": "slow-fade", "color": "#6C7A89", "duration_ms": 1400},
            "anxiety": {"name": "fast-shimmer", "color": "#FF6B6B", "duration_ms": 600},
            "anger": {"name": "shake", "color": "#E63946", "duration_ms": 450},
            "confusion": {"name": "blur-pulse", "color": "#9B8CFC", "duration_ms": 1000},
            "gratitude": {"name": "soft-glow", "color": "#8BE9A1", "duration_ms": 1000},
            "fear": {"name": "vibrate", "color": "#FF8DA1", "duration_ms": 500},
            "love": {"name": "warm-glow", "color": "#FFB6C1", "duration_ms": 1000},
            "hope": {"name": "ripple", "color": "#7DD3FC", "duration_ms": 900},
            "surrender": {"name": "calm-sink", "color": "#A3E635", "duration_ms": 1200},
            "self_realization": {"name": "soft-orbit", "color": "#D8B4FE", "duration_ms": 1800},
            "discipline": {"name": "steady-scale", "color": "#60A5FA", "duration_ms": 800},
            "self_mastery": {"name": "inner-rise", "color": "#FCA5A5", "duration_ms": 900},
            "humility": {"name": "gentle-fade", "color": "#FDE68A", "duration_ms": 1200},
            "steadiness": {"name": "anchor", "color": "#34D399", "duration_ms": 1500},
            "attachment_awareness": {"name": "untangle", "color": "#FBCFE8", "duration_ms": 1100},
            "divine_intervention": {"name": "light-beam", "color": "#FFF59D", "duration_ms": 1000},
            "duty": {"name": "firm-pulse", "color": "#93C5FD", "duration_ms": 900},
            "jealousy": {"name": "tighten", "color": "#D97706", "duration_ms": 600},
            "relief": {"name": "exhale", "color": "#86EFAC", "duration_ms": 900},
            "nostalgia": {"name": "soft-waves", "color": "#C7B8FF", "duration_ms": 1400},
            "boredom": {"name": "slow-drift", "color": "#BDBDBD", "duration_ms": 1600},
            "curiosity": {"name": "pulse-inquire", "color": "#60A5FA", "duration_ms": 800}
        }

    # -------------------------
    # Lexicon construction
    # -------------------------
    def _build_lexicon(self) -> Dict[str, Dict[str, Dict[str, float]]]:
        # Each emotion: phrases (multi-word) and keywords (single words) with base weights
        L: Dict[str, Dict[str, Dict[str, float]]] = {}

        # Core emotions (expanded)
        L["joy"] = {
            "phrases": {"i feel good": 2.0, "made my day": 2.2, "so happy": 1.8, "very happy": 1.9},
            "keywords": {
                "happy": 1.8, "joy": 1.6, "elated": 1.9, "ecstatic": 2.0, "delighted": 1.6,
                "bliss": 1.7, "thrilled": 1.8, "grinning": 1.2, "cheerful": 1.2, "content": 1.1,
                "satisfied": 1.0, "relieved": 1.2,"win":1.0,"winning":1.0
            }
        }

        L["sadness"] = {
            "phrases": {"i am heartbroken": 2.3, "feeling down": 1.7, "can't cope": 2.0, "i miss you": 1.8},
            "keywords": {
                "sad": 1.7, "unhappy": 1.5, "lonely": 1.6, "depressed": 2.2, "grief": 2.0,
                "sorrow": 1.8, "hopeless": 1.9, "tearful": 1.6, "mournful": 1.4
            }
        }

        L["anxiety"] = {
            "phrases": {"i am anxious about": 2.2, "can't sleep": 2.2, "panic attack": 2.7, "i'm worried about": 2.0},
            "keywords": {
                "anxious": 1.9, "anxiety": 2.1, "worried": 1.7, "panic": 2.4, "nervous": 1.5,
                "stressed": 1.7, "overthinking": 1.8, "restless": 1.3, "dread": 1.6
            }
        }

        L["anger"] = {
            "phrases": {"i am furious": 2.5, "i'm so mad": 2.0, "i want to hurt": 3.0, "i can't forgive": 2.0},
            "keywords": {
                "angry": 2.0, "rage": 2.5, "furious": 2.5, "irate": 2.1, "resentful": 1.8,
                "hostile": 1.7, "annoyed": 1.1, "frustrated": 1.5
            }
        }

        L["confusion"] = {
            "phrases": {"i don't know what to do": 2.0, "which way to go": 1.9, "help me choose": 2.1, "i'm not sure": 1.5},
            "keywords": {"confused": 1.8, "uncertain": 1.5, "undecided": 1.3, "puzzled": 1.2, "lost": 1.3, "doubt": 1.3}
        }

        L["fear"] = {
            "phrases": {"i'm really scared": 2.2, "i am terrified": 2.5, "i'm afraid of": 2.0},
            "keywords": {"afraid": 1.8, "scared": 1.8, "fear": 1.9, "phobia": 1.8, "panic": 2.3}
        }

        L["gratitude"] = {
            "phrases": {"thank you so much": 2.2, "i am truly grateful": 2.0},
            "keywords": {"grateful": 1.8, "thankful": 1.7, "appreciative": 1.4, "blessed": 1.5}
        }

        L["love"] = {
            "phrases": {"i love you": 2.6, "i miss you dearly": 2.2, "i care deeply": 2.0},
            "keywords": {"love": 2.1, "adore": 1.9, "cherish": 1.7, "affection": 1.5, "devotion": 1.6}
        }

        L["hope"] = {
            "phrases": {"i hope so": 1.6, "i am hopeful": 1.8, "fingers crossed": 1.5},
            "keywords": {"hope": 1.4, "hopeful": 1.3, "optimistic": 1.2, "faith": 1.5, "trust": 1.2}
        }

        # additional nuanced emotions
        L["guilt"] = {
            "phrases": {"i feel guilty": 2.2, "i regret doing": 2.0},
            "keywords": {"guilty": 2.0, "regret": 1.8, "remorse": 1.9, "sorry": 1.6}
        }

        L["shame"] = {
            "phrases": {"i am ashamed": 2.2, "so embarrassed": 1.8},
            "keywords": {"ashamed": 1.9, "embarrassed": 1.7, "humiliated": 1.8}
        }

        L["boredom"] = {
            "phrases": {"i am bored": 1.8, "this is boring": 1.6},
            "keywords": {"bored": 1.6, "meh": 1.2, "uninterested": 1.4, "apathetic": 1.5}
        }

        L["curiosity"] = {
            "phrases": {"i wonder": 1.6, "tell me more": 1.8, "what is": 1.3},
            "keywords": {"curious": 1.6, "intrigued": 1.4, "interested": 1.3, "inquisitive": 1.5}
        }

        L["awe"] = {
            "phrases": {"i am in awe": 2.0, "this is amazing": 1.8},
            "keywords": {"awe": 1.9, "amazed": 1.7, "astonished": 1.6, "wonder": 1.5}
        }

        L["jealousy"] = {
            "phrases": {"i am jealous": 1.9, "i envy": 1.8},
            "keywords": {"jealous": 1.8, "envy": 1.7, "resentful": 1.5}
        }

        L["relief"] = {
            "phrases": {"what a relief": 2.0, "i am relieved": 1.9},
            "keywords": {"relief": 1.8, "relieved": 1.7, "phew": 1.2}
        }

        L["nostalgia"] = {
            "phrases": {"remember when": 1.8, "back in the day": 1.6},
            "keywords": {"nostalgia": 1.6, "nostalgic": 1.6, "memories": 1.2}
        }

        L["frustration"] = {
            "phrases": {"i am frustrated": 2.0, "this is infuriating": 2.1},
            "keywords": {"frustrated": 1.8, "annoyed": 1.3, "blocked": 1.4}
        }

        L["loneliness"] = {
            "phrases": {"i feel alone": 1.9, "no one cares": 2.0},
            "keywords": {"alone": 1.6, "isolated": 1.7, "lonely": 1.9}
        }

        # ensure structure
        for emo, d in list(L.items()):
            d.setdefault("phrases", {})
            d.setdefault("keywords", {})

        return L

    # -------------------------
    # WordNet expansion (optional)
    # -------------------------
    def _apply_wordnet_expansion(self):
        # For each keyword, add top few synonyms (lemma names) to that emotion's keywords with smaller weight
        # keep weights conservative (0.9 * base)
        for emo, group in self.lexicon.items():
            new_synonyms = {}
            for kw, base_w in list(group["keywords"].items()):
                try:
                    synsets = wn.synsets(kw)
                    count = 0
                    for s in synsets:
                        for lemma in s.lemmas():
                            name = lemma.name().replace("_", " ").lower()
                            if name != kw and len(name) > 1 and name.isalpha():
                                # avoid very common words or duplicates
                                if name not in group["keywords"] and name not in group["phrases"]:
                                    new_synonyms[name] = max(new_synonyms.get(name, 0.0), base_w * 0.85)
                                    count += 1
                                if count >= 2:
                                    break
                        if count >= 2:
                            break
                except Exception:
                    continue
            # merge synonyms (do not overwrite base keywords)
            for s, w in new_synonyms.items():
                if s not in group["keywords"]:
                    group["keywords"][s] = round(w, 3)

    # -------------------------
    # Stem lookup
    # -------------------------
    def _build_stem_lookup(self):
        # build stems for all keywords to match morphological variants
        self.stem_lookup: Dict[str, List[Tuple[str, str]]] = defaultdict(list)
        for emo, group in self.lexicon.items():
            for kw in group["keywords"].keys():
                stem = self.stemmer.stem(kw)
                self.stem_lookup[stem].append((emo, kw))
            for ph in group["phrases"].keys():
                # also index phrase words
                for token in ph.split():
                    st = self.stemmer.stem(token)
                    self.stem_lookup[st].append((emo, ph))

    # -------------------------
    # Normalization & tokenization
    # -------------------------
    @staticmethod
    def _normalize_text(text: str) -> str:
        t = (text or "").lower()
        t = t.replace("\u2019", "'").replace("\u201c", '"').replace("\u201d", '"')
        # keep alphanum and apostrophes, convert other punctuation to spaces
        t = re.sub(r"[^\w'\s]", " ", t)
        t = re.sub(r"\s+", " ", t).strip()
        return t

    def _tokenize(self, text: str) -> List[str]:
        return self._normalize_text(text).split()

    # -------------------------
    # Matching helpers
    # -------------------------
    def _phrase_hits(self, text_norm: str, phrases: Dict[str, float]) -> List[Tuple[str, float, int]]:
        hits = []
        for phrase, weight in phrases.items():
            ph = self._normalize_text(phrase)
            if ph in text_norm:
                count = text_norm.count(ph)
                hits.append((phrase, weight, count))
        return hits

    def _keyword_hits(self, tokens: List[str], keywords: Dict[str, float]) -> List[Tuple[str, float, int, float]]:
        # return (keyword, base_weight, count, avg_intensity_multiplier)
        hits = []
        for kw, base_w in keywords.items():
            kw_norm = self._normalize_text(kw)
            count = 0
            intensity_acc = 0.0
            for i, t in enumerate(tokens):
                # direct match or substring (for 'overthinking' matching 'overthink')
                if kw_norm == t or kw_norm in t:
                    count += 1
                    mult = 1.0
                    if i > 0:
                        prev = tokens[i - 1]
                        if prev in self.intensity_modifiers:
                            mult = self.intensity_modifiers[prev]
                    intensity_acc += mult
                else:
                    # try stem match
                    if self.stemmer.stem(kw_norm) == self.stemmer.stem(t):
                        count += 1
                        mult = 1.0
                        if i > 0 and tokens[i - 1] in self.intensity_modifiers:
                            mult = self.intensity_modifiers[tokens[i - 1]]
                        intensity_acc += mult
            if count > 0:
                avg_intensity = intensity_acc / count if count else 1.0
                hits.append((kw, base_w, count, avg_intensity))
        return hits

    # fallback fuzzy token match for unseen words
    def _fuzzy_matches(self, token_list: List[str], all_keywords: List[str]) -> List[Tuple[str, str, float]]:
        # returns triples (token, matched_keyword, match_ratio)
        matches = []
        for t in token_list:
            # ignore short tokens
            if len(t) < 3:
                continue
            close = get_close_matches(t, all_keywords, n=2, cutoff=self.fuzzy_cutoff)
            for c in close:
                # compute a crude similarity ratio (difflib was used)
                matches.append((t, c, 1.0))  # we treat existence as hit
        return matches

    # -------------------------
    # Main detection method
    # -------------------------
    def detect_emotion(self, text: str, top_k: int = 4) -> Dict[str, Any]:
        """
        Returns:
          - top_emotion: str
          - confidence: float (0..1)
          - candidates: list of (emotion, normalized_score)
          - animation: UI hint for top emotion
          - details: debugging info (raw_scores, evidence, sentiment, matches)
        """
        if not text or not text.strip():
            return {
                "top_emotion": "neutral",
                "confidence": 0.5,
                "candidates": [],
                "animation": self.animation_map.get("steadiness"),
                "details": {"reason": "empty_input"}
            }

        text_norm = self._normalize_text(text)
        tokens = self._tokenize(text_norm)
        total_tokens = max(1, len(tokens))

        # sentiment signals
        tb = TextBlob(text)
        tb_polarity = tb.sentiment.polarity
        tb_subjectivity = tb.sentiment.subjectivity
        vader = self.sia.polarity_scores(text)
        vader_compound = vader["compound"]

        raw_scores = defaultdict(float)
        evidence = defaultdict(list)

        # 1) phrases
        for emo, group in self.lexicon.items():
            hits = self._phrase_hits(text_norm, group.get("phrases", {}))
            for phrase, weight, count in hits:
                inc = weight * self.PHRASE_BONUS * count * self.KEYWORD_WEIGHT
                raw_scores[emo] += inc
                evidence[emo].append({"type": "phrase", "phrase": phrase, "count": count, "inc": round(inc, 3)})

        # 2) keywords
        all_keywords = []
        for emo, group in self.lexicon.items():
            kw_hits = self._keyword_hits(tokens, group.get("keywords", {}))
            for kw, base_w, count, avg_intensity in kw_hits:
                inc = base_w * count * avg_intensity * self.KEYWORD_WEIGHT
                raw_scores[emo] += inc
                evidence[emo].append({"type": "keyword", "keyword": kw, "count": count, "avg_intensity": round(avg_intensity, 3), "inc": round(inc, 3)})
            all_keywords.extend(list(group.get("keywords", {}).keys()))

        # 3) fuzzy fallback if few hits
        any_hits = any(v > 0 for v in raw_scores.values())
        if not any_hits:
            fuzzy = self._fuzzy_matches(tokens, all_keywords)
            for token, matched_kw, _score in fuzzy:
                # find which emotion owns matched_kw
                for emo, group in self.lexicon.items():
                    if matched_kw in group.get("keywords", {}):
                        base_w = group["keywords"][matched_kw]
                        inc = base_w * 0.8  # fuzzy less than direct
                        raw_scores[emo] += inc
                        evidence[emo].append({"type": "fuzzy", "token": token, "matched_kw": matched_kw, "inc": round(inc, 3)})

        # 4) sentiment alignment bump
        emotion_valence = {
            "joy": 1, "gratitude": 1, "hope": 1, "love": 1, "awe": 1,
            "sadness": -1, "anxiety": -1, "fear": -1, "anger": -1, "frustration": -1, "guilt": -1, "shame": -1
        }
        compound = vader_compound
        polarity = tb_polarity

        for emo in list(self.lexicon.keys()):
            val = emotion_valence.get(emo, 0)
            if val != 0:
                aligned = (val > 0 and compound > 0.25) or (val < 0 and compound < -0.25)
                if aligned:
                    bump = abs(compound) * self.SENTIMENT_WEIGHT * (1 + 0.5 * abs(polarity))
                    raw_scores[emo] += bump
                    evidence[emo].append({"type": "sentiment_bump", "bump": round(bump, 4), "compound": compound})

        # 5) fallback mapping if still nothing: map sentiment to one of common emotions
        if not any(v > 0 for v in raw_scores.values()):
            if compound >= 0.3 or polarity >= 0.35:
                raw_scores["joy"] += 1.0 + abs(compound)
                evidence["joy"].append({"type": "fallback_sentiment", "compound": compound})
            elif compound <= -0.3 or polarity <= -0.35:
                # negative select: prefer anxiety if panic language present otherwise sadness
                if "panic" in text_norm or "can't sleep" in text_norm or "panic attack" in text_norm:
                    raw_scores["anxiety"] += 1.3
                    evidence["anxiety"].append({"type": "fallback_sentiment", "compound": compound})
                elif "angry" in text_norm or "furious" in text_norm or "rage" in text_norm:
                    raw_scores["anger"] += 1.3
                    evidence["anger"].append({"type": "fallback_sentiment", "compound": compound})
                else:
                    raw_scores["sadness"] += 1.2
                    evidence["sadness"].append({"type": "fallback_sentiment", "compound": compound})
            else:
                raw_scores["confusion"] += 0.7
                evidence["confusion"].append({"type": "fallback_sentiment", "compound": compound})

        # 6) normalize into candidate probabilities (softmax-like)
        # convert raw dict into list consistent order
        score_items = [(emo, max(0.0, raw_scores.get(emo, 0.0))) for emo in self.lexicon.keys()]
        max_raw = max((v for _, v in score_items), default=0.0)

        candidates: List[Tuple[str, float]] = []
        if max_raw <= 0:
            # still nothing: fall back to confusion (low confidence)
            candidates = [("confusion", 0.5)]
            top = "confusion"
            top_score = 0.5
        else:
            # compute exponentials for smoothing but keep scale controlled
            exps = []
            for emo, raw in score_items:
                val = raw
                exps.append((emo, math.exp(val / (max_raw + 1e-9))))
            total = sum(v for _, v in exps) or 1.0
            normalized = [(emo, v / total) for emo, v in exps]
            normalized.sort(key=lambda x: x[1], reverse=True)
            candidates = [(emo, round(score, 4)) for emo, score in normalized[:max(4, len(normalized))]]
            top, top_score = candidates[0]

        # 7) compute confidence:
        # factors: top_score (dominance) + token_coverage + sentiment_strength + uniqueness_bonus + length_factor
        # token coverage: how many matched tokens / total tokens
        matched_tokens = set()
        for emo in evidence:
            for ev in evidence[emo]:
                if ev.get("type") in ("keyword", "phrase", "fuzzy"):
                    # gather token fragments
                    if ev.get("type") == "keyword":
                        matched_tokens.add(ev.get("keyword", ""))
                    if ev.get("type") == "phrase":
                        matched_tokens.update(ev.get("phrase", "").split())
                    if ev.get("type") == "fuzzy":
                        matched_tokens.add(ev.get("token", ""))
        token_coverage = min(1.0, len([t for t in matched_tokens if t]) / float(total_tokens))

        sentiment_strength = min(1.0, abs(compound) + abs(polarity)) / 2.0  # scale to 0..1
        uniqueness = 1.0 if len([c for c in candidates if c[1] > 0.05]) == 1 else 0.0
        length_factor = min(1.0, total_tokens / 25.0)

        # weights for confidence components
        w_top = 0.55
        w_token = 0.18
        w_sent = 0.15
        w_uni = 0.07
        w_len = 0.05

        confidence = (w_top * top_score) + (w_token * token_coverage) + (w_sent * sentiment_strength) + (w_uni * uniqueness) + (w_len * length_factor)
        confidence = max(0.0, min(0.99, confidence))

        animation = self.animation_map.get(top, {"name": "none", "color": "#CCCCCC", "duration_ms": 700})

        details = {
            "raw_scores": {emo: float(raw_scores.get(emo, 0.0)) for emo in self.lexicon.keys()},
            "evidence": {emo: evidence.get(emo, []) for emo in self.lexicon.keys()},
            "sentiment": {"textblob_polarity": tb_polarity, "textblob_subjectivity": tb_subjectivity, "vader_compound": vader_compound},
            "matched_tokens_count": len(matched_tokens),
            "token_coverage": round(token_coverage, 3),
            "sentiment_strength": round(sentiment_strength, 3),
            "uniqueness": uniqueness,
            "length_factor": round(length_factor, 3),
            "total_tokens": total_tokens
        }

        return {
            "top_emotion": top,
            "confidence": round(confidence, 3),
            "candidates": candidates,
            "animation": animation,
            "details": details
        }

    # batch analyze convenience
    def analyze_batch(self, texts: List[str]) -> List[Dict[str, Any]]:
        return [self.detect_emotion(t) for t in texts]


# -------------------------
# Quick test / examples
# -------------------------
if __name__ == "__main__":
    analyzer = EnhancedEmotionAnalyzer()
    samples = [
        "I'm extremely anxious about my job and can't sleep at night, panic attacks keep coming.",
        "I am so happy today — this achievement made my day and I feel elated!",
        "I don't know what to do, I'm confused and lost about my career direction.",
        "I forgive myself and surrender these worries to the Divine, let it go.",
        "I feel ashamed of what I did and I regret it so much.",
        "What a relief! The test results are negative and I'm so relieved.",
        "I'm bored with this meeting, it's so repetitive and dull.",
        "I wonder how that works — curious to learn more.",
        "I'm jealous when I see them succeed so easily.",
        "I feel gratitude for all the support I received today."
    ]
    for s in samples:
        out = analyzer.detect_emotion(s)
        print(json.dumps({"text": s, "result": out}, indent=2, ensure_ascii=False))
