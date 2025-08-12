from datetime import datetime
from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.Column(db.String(20), default='analyst')  # admin, analyst, viewer
    
    # Relationship with sentiment analyses
    analyses = db.relationship('SentimentAnalysis', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def get_stats(self):
        """Get user's analysis statistics"""
        total_analyses = self.analyses.count()
        positive_count = self.analyses.filter_by(sentiment='positive').count()
        negative_count = self.analyses.filter_by(sentiment='negative').count()
        neutral_count = self.analyses.filter_by(sentiment='neutral').count()
        
        return {
            'total': total_analyses,
            'positive': positive_count,
            'negative': negative_count,
            'neutral': neutral_count
        }

class SentimentAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(20), nullable=False)  # positive, negative, neutral
    confidence = db.Column(db.Float, nullable=False)
    polarity = db.Column(db.Float)
    subjectivity = db.Column(db.Float)
    keywords = db.Column(db.Text)  # JSON string of extracted keywords
    source_type = db.Column(db.String(50), default='text')  # text, file, url
    source_name = db.Column(db.String(255))  # filename or url
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'sentiment': self.sentiment,
            'confidence': self.confidence,
            'polarity': self.polarity,
            'subjectivity': self.subjectivity,
            'keywords': self.keywords,
            'source_type': self.source_type,
            'source_name': self.source_name,
            'created_at': self.created_at.isoformat()
        }
