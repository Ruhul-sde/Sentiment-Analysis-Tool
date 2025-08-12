import os
import csv
import pandas as pd
from werkzeug.utils import secure_filename
from sentiment_analyzer import SentimentAnalyzer

class FileProcessor:
    def __init__(self, upload_folder):
        self.upload_folder = upload_folder
        self.analyzer = SentimentAnalyzer()
        self.allowed_extensions = {'txt', 'csv'}
    
    def is_allowed_file(self, filename):
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.allowed_extensions
    
    def save_file(self, file):
        """Save uploaded file and return filename"""
        if file and self.is_allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(self.upload_folder, filename)
            file.save(filepath)
            return filename, filepath
        return None, None
    
    def process_file(self, filepath, filename):
        """Process uploaded file and extract text for analysis"""
        file_extension = filename.rsplit('.', 1)[1].lower()
        
        try:
            if file_extension == 'txt':
                return self._process_txt_file(filepath)
            elif file_extension == 'csv':
                return self._process_csv_file(filepath)
        except Exception as e:
            raise Exception(f"Error processing file: {str(e)}")
        
        return []
    
    def _process_txt_file(self, filepath):
        """Process TXT file"""
        texts = []
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
            # Split by lines or paragraphs for individual analysis
            lines = content.split('\n')
            for line in lines:
                line = line.strip()
                if line and len(line) > 10:  # Only process meaningful lines
                    texts.append(line)
        return texts
    
    def _process_csv_file(self, filepath):
        """Process CSV file"""
        texts = []
        try:
            # Try to read CSV with pandas
            df = pd.read_csv(filepath, encoding='utf-8')
            
            # Look for text columns (common names)
            text_columns = []
            for col in df.columns:
                col_lower = col.lower()
                if any(keyword in col_lower for keyword in ['text', 'comment', 'review', 'message', 'content', 'description']):
                    text_columns.append(col)
            
            # If no obvious text columns, use all string columns
            if not text_columns:
                text_columns = df.select_dtypes(include=['object']).columns.tolist()
            
            # Extract text from identified columns
            for col in text_columns:
                for value in df[col].dropna():
                    if isinstance(value, str) and len(value.strip()) > 10:
                        texts.append(value.strip())
                        
        except Exception as e:
            # Fallback to basic CSV reading
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as file:
                csv_reader = csv.reader(file)
                for row in csv_reader:
                    for cell in row:
                        if cell and len(cell.strip()) > 10:
                            texts.append(cell.strip())
        
        return texts
    
    def analyze_file_content(self, texts, source_name, user_id):
        """Analyze extracted texts and return results"""
        results = []
        for text in texts:
            analysis = self.analyzer.analyze_text(text)
            if analysis:
                analysis['source_type'] = 'file'
                analysis['source_name'] = source_name
                analysis['user_id'] = user_id
                results.append(analysis)
        
        return results
    
    def cleanup_file(self, filepath):
        """Remove uploaded file after processing"""
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
        except Exception as e:
            print(f"Error cleaning up file: {e}")
