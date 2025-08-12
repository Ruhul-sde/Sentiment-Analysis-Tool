import json
import re
from textblob import TextBlob
from collections import Counter

class SentimentAnalyzer:
    def __init__(self):
        self.positive_threshold = 0.1
        self.negative_threshold = -0.1
    
    def analyze_text(self, text):
        """Analyze sentiment of given text"""
        if not text or not text.strip():
            return None
        
        # Clean text
        cleaned_text = self._clean_text(text)
        
        # Create TextBlob object
        blob = TextBlob(cleaned_text)
        
        # Get polarity and subjectivity
        sentiment_obj = blob.sentiment
        polarity = sentiment_obj.polarity
        subjectivity = sentiment_obj.subjectivity
        
        # Determine sentiment category
        if polarity > self.positive_threshold:
            sentiment = 'positive'
        elif polarity < self.negative_threshold:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        # Calculate confidence score (0-1)
        confidence = abs(polarity)
        
        # Extract keywords
        keywords = self._extract_keywords(blob)
        
        return {
            'text': text,
            'sentiment': sentiment,
            'confidence': confidence,
            'polarity': polarity,
            'subjectivity': subjectivity,
            'keywords': json.dumps(keywords)
        }
    
    def analyze_batch(self, texts):
        """Analyze sentiment for multiple texts"""
        results = []
        for text in texts:
            result = self.analyze_text(text)
            if result:
                results.append(result)
        return results
    
    def _clean_text(self, text):
        """Clean and preprocess text"""
        # Remove URLs
        text = re.sub(r'http\S+|www.\S+', '', text)
        # Remove extra whitespace
        text = ' '.join(text.split())
        return text
    
    def _extract_keywords(self, blob):
        """Extract important keywords from text"""
        # Get noun phrases
        noun_phrases = list(blob.noun_phrases)
        
        # Get individual words (filter out stop words and short words)
        words = [word.lower() for word in blob.words 
                if len(word) > 3 and word.lower() not in self._get_stop_words()]
        
        # Combine and count
        all_keywords = noun_phrases + words
        keyword_counts = Counter(all_keywords)
        
        # Return top 10 keywords
        return dict(keyword_counts.most_common(10))
    
    def _get_stop_words(self):
        """Common stop words to filter out"""
        return {
            'this', 'that', 'with', 'have', 'will', 'from', 'they', 'know',
            'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when',
            'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over',
            'such', 'take', 'than', 'them', 'well', 'were', 'what'
        }
    
    def get_sentiment_distribution(self, analyses):
        """Calculate sentiment distribution from analysis results"""
        if not analyses:
            return {'positive': 0, 'negative': 0, 'neutral': 0}
        
        distribution = {'positive': 0, 'negative': 0, 'neutral': 0}
        for analysis in analyses:
            sentiment = analysis.sentiment if hasattr(analysis, 'sentiment') else analysis.get('sentiment')
            if sentiment in distribution:
                distribution[sentiment] += 1
        
        return distribution
