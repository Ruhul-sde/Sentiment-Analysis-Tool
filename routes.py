import os
import json
import csv
from datetime import datetime
from flask import render_template, request, jsonify, redirect, url_for, flash, session, send_file
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from app import db
from models import User, SentimentAnalysis
from sentiment_analyzer import SentimentAnalyzer
from file_processor import FileProcessor

def register_routes(app):
    analyzer = SentimentAnalyzer()
    file_processor = FileProcessor(app.config['UPLOAD_FOLDER'])
    
    @app.route('/')
    def index():
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        return render_template('index.html')
    
    @app.route('/dashboard')
    @login_required
    def dashboard():
        # Get user statistics
        stats = current_user.get_stats()
        
        # Get recent analyses
        recent_analyses = current_user.analyses.order_by(
            SentimentAnalysis.created_at.desc()
        ).limit(10).all()
        
        # Get sentiment distribution for charts
        all_analyses = current_user.analyses.all()
        distribution = analyzer.get_sentiment_distribution(all_analyses)
        
        return render_template('dashboard.html', 
                             stats=stats, 
                             recent_analyses=recent_analyses,
                             distribution=distribution)
    
    @app.route('/analyze', methods=['POST'])
    @login_required
    def analyze_text():
        """Real-time text analysis endpoint"""
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Analyze text
        result = analyzer.analyze_text(text)
        if not result:
            return jsonify({'error': 'Unable to analyze text'}), 400
        
        # Save to database
        analysis = SentimentAnalysis()
        analysis.user_id = current_user.id
        analysis.text = result['text']
        analysis.sentiment = result['sentiment']
        analysis.confidence = result['confidence']
        analysis.polarity = result['polarity']
        analysis.subjectivity = result['subjectivity']
        analysis.keywords = result['keywords']
        analysis.source_type = 'text'
        
        try:
            db.session.add(analysis)
            db.session.commit()
            
            # Return result with analysis ID
            result['analysis_id'] = analysis.id
            return jsonify(result)
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to save analysis'}), 500
    
    @app.route('/upload', methods=['POST'])
    @login_required
    def upload_file():
        """File upload and analysis endpoint"""
        if 'file' not in request.files:
            flash('No file selected', 'error')
            return redirect(url_for('dashboard'))
        
        file = request.files['file']
        if file.filename == '':
            flash('No file selected', 'error')
            return redirect(url_for('dashboard'))
        
        if not file_processor.is_allowed_file(file.filename):
            flash('File type not allowed. Please upload TXT or CSV files.', 'error')
            return redirect(url_for('dashboard'))
        
        try:
            # Save file
            filename, filepath = file_processor.save_file(file)
            if not filename:
                flash('Error saving file', 'error')
                return redirect(url_for('dashboard'))
            
            # Process file and extract texts
            texts = file_processor.process_file(filepath, filename)
            if not texts:
                flash('No text content found in file', 'error')
                file_processor.cleanup_file(filepath)
                return redirect(url_for('dashboard'))
            
            # Analyze extracted texts
            analysis_results = file_processor.analyze_file_content(texts, filename, current_user.id)
            
            # Save analyses to database
            saved_count = 0
            for result in analysis_results:
                analysis = SentimentAnalysis()
                analysis.user_id = result['user_id']
                analysis.text = result['text']
                analysis.sentiment = result['sentiment']
                analysis.confidence = result['confidence']
                analysis.polarity = result['polarity']
                analysis.subjectivity = result['subjectivity']
                analysis.keywords = result['keywords']
                analysis.source_type = result['source_type']
                analysis.source_name = result['source_name']
                db.session.add(analysis)
                saved_count += 1
            
            db.session.commit()
            
            # Cleanup uploaded file
            file_processor.cleanup_file(filepath)
            
            flash(f'Successfully analyzed {saved_count} text entries from {filename}', 'success')
            return redirect(url_for('results'))
            
        except Exception as e:
            db.session.rollback()
            try:
                if filename and 'filepath' in locals():
                    file_processor.cleanup_file(filepath)
            except:
                pass
            flash(f'Error processing file: {str(e)}', 'error')
            return redirect(url_for('dashboard'))
    
    @app.route('/results')
    @login_required
    def results():
        """Display analysis results"""
        page = request.args.get('page', 1, type=int)
        per_page = 20
        
        analyses = current_user.analyses.order_by(
            SentimentAnalysis.created_at.desc()
        ).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Get sentiment distribution
        all_analyses = current_user.analyses.all()
        distribution = analyzer.get_sentiment_distribution(all_analyses)
        
        return render_template('results.html', 
                             analyses=analyses, 
                             distribution=distribution)
    
    @app.route('/export')
    @login_required
    def export_results():
        """Export user's analysis results to CSV"""
        analyses = current_user.analyses.order_by(SentimentAnalysis.created_at.desc()).all()
        
        if not analyses:
            flash('No data to export', 'warning')
            return redirect(url_for('results'))
        
        # Create export filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'sentiment_analysis_{current_user.username}_{timestamp}.csv'
        filepath = os.path.join(app.config['EXPORT_FOLDER'], filename)
        
        try:
            with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['id', 'text', 'sentiment', 'confidence', 'polarity', 
                            'subjectivity', 'keywords', 'source_type', 'source_name', 'created_at']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                
                writer.writeheader()
                for analysis in analyses:
                    writer.writerow({
                        'id': analysis.id,
                        'text': analysis.text,
                        'sentiment': analysis.sentiment,
                        'confidence': analysis.confidence,
                        'polarity': analysis.polarity,
                        'subjectivity': analysis.subjectivity,
                        'keywords': analysis.keywords,
                        'source_type': analysis.source_type,
                        'source_name': analysis.source_name,
                        'created_at': analysis.created_at.isoformat()
                    })
            
            return send_file(filepath, as_attachment=True, download_name=filename)
            
        except Exception as e:
            flash(f'Error exporting data: {str(e)}', 'error')
            return redirect(url_for('results'))
    
    @app.route('/api/stats')
    @login_required
    def api_stats():
        """API endpoint for dashboard statistics"""
        stats = current_user.get_stats()
        all_analyses = current_user.analyses.all()
        distribution = analyzer.get_sentiment_distribution(all_analyses)
        
        return jsonify({
            'stats': stats,
            'distribution': distribution
        })
    
    # Authentication routes
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']
            
            user = User.query.filter_by(username=username).first()
            
            if user and user.check_password(password):
                remember_me = bool(request.form.get('remember'))
                login_user(user, remember=remember_me)
                next_page = request.args.get('next')
                return redirect(next_page) if next_page else redirect(url_for('dashboard'))
            else:
                flash('Invalid username or password', 'error')
        
        return render_template('login.html')
    
    @app.route('/register', methods=['GET', 'POST'])
    def register():
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        
        if request.method == 'POST':
            username = request.form['username']
            email = request.form['email']
            password = request.form['password']
            
            # Check if user already exists
            if User.query.filter_by(username=username).first():
                flash('Username already exists', 'error')
                return render_template('register.html')
            
            if User.query.filter_by(email=email).first():
                flash('Email already registered', 'error')
                return render_template('register.html')
            
            # Create new user
            user = User()
            user.username = username
            user.email = email
            user.set_password(password)
            
            try:
                db.session.add(user)
                db.session.commit()
                
                login_user(user)
                flash('Registration successful!', 'success')
                return redirect(url_for('dashboard'))
                
            except Exception as e:
                db.session.rollback()
                flash('Error creating account', 'error')
        
        return render_template('register.html')
    
    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        flash('You have been logged out', 'info')
        return redirect(url_for('index'))
