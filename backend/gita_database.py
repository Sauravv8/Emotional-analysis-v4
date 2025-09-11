"""
Bhagavad Gita shloka database with comprehensive teachings
organized by emotional states and life situations
"""

from typing import Dict, List, Any
import random

class GitaDatabase:
    def __init__(self):
        self.shlokas = {
            "joy": [
                {
                    "sanskrit": "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।",
                    "translation": "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.",
                    "chapter": 2, "verse": 48,
                    "explanation": "True joy comes from performing our duties without attachment to results. This creates inner peace and lasting happiness that doesn't depend on external outcomes.",
                    "practical_advice": "Today, choose one activity and do it with complete presence, without worrying about the outcome. Notice how this detachment brings peace and allows you to enjoy the process itself."
                },
                {
                    "sanskrit": "प्रकाशं च प्रवृत्तिं च मोहमेव च पाण्डव।",
                    "translation": "Light, activity, and delusion—when these are present, O Pandava, a person is not disturbed by them, nor does he long for them when they are absent.",
                    "chapter": 14, "verse": 22,
                    "explanation": "True joy is found in equanimity—not being overly elated by good times nor disturbed by challenges. This balanced state of mind is the source of lasting happiness.",
                    "practical_advice": "Practice gratitude for this moment of joy while remaining unattached to it. Remember that all states are temporary, and true happiness comes from within."
                }
            ],
            
            "sadness": [
                {
                    "sanskrit": "न त्वेवाहं जातु नासं न त्वं नेमे जनाधिपाः।",
                    "translation": "Never was there a time when I did not exist, nor you, nor all these kings; nor in the future shall any of us cease to be.",
                    "chapter": 2, "verse": 12,
                    "explanation": "This verse reminds us of the eternal nature of the soul. Sadness often comes from attachment to temporary things, but our true essence is eternal and unchanging.",
                    "practical_advice": "Remember that difficult times are temporary. Focus on what is eternal within you—your capacity for love, growth, and connection with the divine. Your current sadness will pass."
                },
                {
                    "sanskrit": "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।",
                    "translation": "O son of Kunti, the contact between the senses and their objects gives rise to happiness and distress. They are temporary, so learn to tolerate them.",
                    "chapter": 2, "verse": 14,
                    "explanation": "Sadness, like happiness, is temporary. It arises from our interaction with the world through our senses. Understanding this helps us endure difficult times with patience.",
                    "practical_advice": "Acknowledge your sadness without judgment. Like winter gives way to spring, this feeling will pass. Focus on taking care of your basic needs and practicing self-compassion."
                }
            ],
            
            "anxiety": [
                {
                    "sanskrit": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
                    "translation": "You have the right to perform your actions, but you are not entitled to the fruits of action.",
                    "chapter": 2, "verse": 47,
                    "explanation": "Anxiety often comes from attachment to outcomes. This fundamental teaching reminds us to focus on what we can control—our actions and efforts—while releasing attachment to results.",
                    "practical_advice": "Make a list of what's within your control today. Focus your energy there and consciously release attachment to outcomes. Take one small action without worrying about the result."
                },
                {
                    "sanskrit": "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः।",
                    "translation": "Wherever there is Krishna, the master of yoga, and wherever there is Arjuna, the supreme archer, there will certainly be opulence, victory, extraordinary power, and morality.",
                    "chapter": 18, "verse": 78,
                    "explanation": "When we align our actions with divine will and perform our duties with skill and dedication, success naturally follows. This removes anxiety about outcomes.",
                    "practical_advice": "Connect with your inner wisdom before making decisions. Ask yourself: 'What would love do?' Then act from that place, trusting that right action leads to right results."
                }
            ],
            
            "anger": [
                {
                    "sanskrit": "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः।",
                    "translation": "From anger, complete delusion arises, and from delusion bewilderment of memory. When memory is bewildered, intelligence is lost, and when intelligence is lost one falls down again into the material pool.",
                    "chapter": 2, "verse": 63,
                    "explanation": "Anger clouds our judgment and leads to actions we regret. This verse shows the destructive chain reaction that begins with anger, helping us understand why we must learn to manage it.",
                    "practical_advice": "When you feel anger rising, take three deep breaths and count to ten. Ask yourself: 'What is this emotion trying to teach me?' Often anger masks hurt or fear—address the root cause."
                },
                {
                    "sanskrit": "अहिंसा सत्यमक्रोधस्त्यागः शान्तिरपैशुनम्।",
                    "translation": "Non-violence, truthfulness, freedom from anger, renunciation, tranquility, aversion to fault-finding, compassion for all living entities, freedom from covetousness, gentleness, modesty, steady determination...",
                    "chapter": 16, "verse": 2,
                    "explanation": "Freedom from anger is listed among divine qualities. Cultivating these qualities transforms our character and brings us closer to our highest potential.",
                    "practical_advice": "Practice compassion today, especially toward the person or situation that triggered your anger. Try to understand their perspective or the lessons this situation offers you."
                }
            ],
            
            "confusion": [
                {
                    "sanskrit": "यदा ते मोहकलिलं बुद्धिर्व्यतितरिष्यति।",
                    "translation": "When your intellect crosses the mire of confusion, you shall become indifferent to what has been heard and what is to be heard.",
                    "chapter": 2, "verse": 52,
                    "explanation": "Confusion is temporary and serves a purpose—it signals that we're ready for greater understanding. With patience and right discrimination, clarity emerges naturally.",
                    "practical_advice": "When confused, sit quietly for 10 minutes without trying to solve anything. Often, the answer emerges when we stop forcing it. Trust that clarity will come at the right time."
                },
                {
                    "sanskrit": "तत्त्ववित्तु महाबाहो गुणकर्मविभागयोः।",
                    "translation": "One who is in knowledge of the Absolute Truth, O mighty-armed, does not engage himself in the senses and sense gratification, knowing well the differences between work in devotion and work for fruitive results.",
                    "chapter": 3, "verse": 28,
                    "explanation": "True knowledge brings clarity about what actions to take and why. When we understand our purpose and the nature of reality, confusion naturally dissolves.",
                    "practical_advice": "Seek knowledge from reliable sources—wise teachers, sacred texts, or your own inner wisdom through meditation. Ask: 'What would serve the highest good in this situation?'"
                }
            ],
            
            "gratitude": [
                {
                    "sanskrit": "यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धनः।",
                    "translation": "Work done as a sacrifice for Vishnu has to be performed, otherwise work causes bondage in this material world.",
                    "chapter": 3, "verse": 9,
                    "explanation": "When we work with gratitude and see our actions as service to something greater, even mundane tasks become sacred. This attitude transforms our entire experience of life.",
                    "practical_advice": "Begin each task today with gratitude. Ask: 'How can this serve something greater than myself?' Notice how this shifts your energy and experience of the work."
                },
                {
                    "sanskrit": "अन्नाद्भवन्ति भूतानि पर्जन्यादन्नसम्भवः।",
                    "translation": "All living beings subsist on food grains, which are produced from rains. Rains are produced by performance of yagna [sacrifice], and yagna is born of prescribed duties.",
                    "chapter": 3, "verse": 14,
                    "explanation": "This verse reveals the interconnectedness of all life. Recognizing how everything is connected naturally cultivates gratitude for the web of support that sustains us.",
                    "practical_advice": "Before eating today, take a moment to appreciate all the elements that brought this food to you—the sun, rain, soil, farmers, and countless others. Feel the connection."
                }
            ],
            
            "fear": [
                {
                    "sanskrit": "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।",
                    "translation": "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
                    "chapter": 18, "verse": 66,
                    "explanation": "Fear often comes from feeling alone or unsupported. This verse reminds us that there is always a higher power available to support us when we surrender our ego and trust in divine guidance.",
                    "practical_advice": "When fear arises, remember you are not facing challenges alone. Connect with your inner strength, pray or meditate, and ask for guidance from whatever you consider divine."
                },
                {
                    "sanskrit": "न मे भक्तः प्रणश्यति।",
                    "translation": "My devotee never perishes.",
                    "chapter": 9, "verse": 31,
                    "explanation": "Those who dedicate their lives to higher purpose and divine service are always protected. This doesn't mean free from challenges, but that we're given the strength to face them.",
                    "practical_advice": "Dedicate your actions today to serving something greater than yourself. When we act from love and service, we tap into a source of strength beyond our individual capacity."
                }
            ],
            
            "love": [
                {
                    "sanskrit": "सर्वभूतस्थमात्मानं सर्वभूतानि चात्मनि।",
                    "translation": "A true yogi observes Me in all beings and also sees every being in Me. Indeed, the self-realized person sees Me, the same Supreme Lord, everywhere.",
                    "chapter": 6, "verse": 29,
                    "explanation": "True love recognizes the divine presence in all beings. This universal love transcends personal attachment and becomes a way of seeing and being in the world.",
                    "practical_advice": "Practice seeing the divine spark in everyone you meet today, including yourself. Let this recognition guide your interactions with compassion and respect."
                },
                {
                    "sanskrit": "समोऽहं सर्वभूतेषु न मे द्वेष्योऽस्ति न प्रियः।",
                    "translation": "I am equal to all beings; no one is hateful or dear to Me. But those who worship Me with love and devotion are in Me, and I am in them.",
                    "chapter": 9, "verse": 29,
                    "explanation": "Divine love is impartial and unconditional. By cultivating this quality of love—without favorites or prejudices—we align ourselves with the highest truth.",
                    "practical_advice": "Practice loving-kindness meditation. Send good wishes to loved ones, neutral people, difficult people, and yourself. Notice how this expands your capacity for love."
                }
            ],
            
            "hope": [
                {
                    "sanskrit": "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।",
                    "translation": "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion—at that time I descend Myself.",
                    "chapter": 4, "verse": 7,
                    "explanation": "This verse offers hope that divine intervention comes precisely when it's needed most. Even in the darkest times, there is a force working to restore balance and righteousness.",
                    "practical_advice": "When facing challenges, remember that difficulties often precede breakthroughs. Look for signs of positive change and be willing to be part of the solution."
                },
                {
                    "sanskrit": "अन्तकाले च मामेव स्मरन्मुक्त्वा कलेवरम्।",
                    "translation": "And whoever, at the end of his life, quits his body remembering Me alone at once attains My nature. Of this there is no doubt.",
                    "chapter": 8, "verse": 5,
                    "explanation": "This verse offers ultimate hope—that consciousness focused on the divine at life's end guarantees spiritual realization. It reminds us that it's never too late for transformation.",
                    "practical_advice": "Cultivate hope by remembering that every moment is a new beginning. Focus on the divine qualities you want to embody and take one small step toward that ideal today."
                }
            ]
        }
        
        # Daily wisdom quotes for inspiration
        self.daily_wisdom = [
            {
                "sanskrit": "तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया।",
                "translation": "Learn the truth by approaching a spiritual master, inquiring from him submissively, and rendering service unto him.",
                "chapter": 4, "verse": 34,
                "theme": "learning"
            },
            {
                "sanskrit": "यो मां पश्यति सर्वत्र सर्वं च मयि पश्यति।",
                "translation": "For one who sees Me everywhere and sees everything in Me, I am never lost, nor is he ever lost to Me.",
                "chapter": 6, "verse": 30,
                "theme": "unity"
            },
            {
                "sanskrit": "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।",
                "translation": "Better is one's own dharma, though imperfectly performed, than the dharma of another well performed.",
                "chapter": 3, "verse": 35,
                "theme": "authenticity"
            }
        ]

    def get_shloka_for_emotion(self, emotion: str) -> Dict[str, Any]:
        """Get a relevant shloka for the given emotion"""
        if emotion.lower() in self.shlokas:
            return random.choice(self.shlokas[emotion.lower()])
        else:
            # Return a general wisdom shloka for unknown emotions
            return random.choice(self.shlokas["confusion"])

    def get_multiple_shlokas(self, emotion: str, count: int = 3) -> List[Dict[str, Any]]:
        """Get multiple shlokas for deeper study"""
        if emotion.lower() in self.shlokas:
            available_shlokas = self.shlokas[emotion.lower()]
            if len(available_shlokas) >= count:
                return random.sample(available_shlokas, count)
            else:
                return available_shlokas
        else:
            return [self.get_shloka_for_emotion(emotion)]

    def get_daily_wisdom(self) -> Dict[str, Any]:
        """Get a daily wisdom quote"""
        return random.choice(self.daily_wisdom)

    def search_by_theme(self, theme: str) -> List[Dict[str, Any]]:
        """Search shlokas by theme or keyword"""
        results = []
        theme_lower = theme.lower()
        
        for emotion, shlokas in self.shlokas.items():
            for shloka in shlokas:
                if (theme_lower in shloka['explanation'].lower() or 
                    theme_lower in shloka['practical_advice'].lower() or
                    theme_lower in shloka['translation'].lower()):
                    shloka_copy = shloka.copy()
                    shloka_copy['emotion_context'] = emotion
                    results.append(shloka_copy)
        
        return results

    def get_shloka_by_chapter_verse(self, chapter: int, verse: int) -> Dict[str, Any]:
        """Get a specific shloka by chapter and verse"""
        for emotion, shlokas in self.shlokas.items():
            for shloka in shlokas:
                if shloka['chapter'] == chapter and shloka['verse'] == verse:
                    shloka_copy = shloka.copy()
                    shloka_copy['emotion_context'] = emotion
                    return shloka_copy
        return None

    def get_all_emotions(self) -> List[str]:
        """Get list of all emotions in the database"""
        return list(self.shlokas.keys())

    def get_emotion_count(self, emotion: str) -> int:
        """Get count of shlokas for a specific emotion"""
        return len(self.shlokas.get(emotion.lower(), []))

    def get_stats(self) -> Dict[str, Any]:
        """Get database statistics"""
        total_shlokas = sum(len(shlokas) for shlokas in self.shlokas.values())
        emotion_counts = {emotion: len(shlokas) for emotion, shlokas in self.shlokas.items()}
        
        return {
            "total_shlokas": total_shlokas,
            "total_emotions": len(self.shlokas),
            "emotion_distribution": emotion_counts,
            "daily_wisdom_count": len(self.daily_wisdom)
        }