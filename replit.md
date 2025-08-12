# Overview

This is a Flask-based sentiment analysis web application that provides real-time text sentiment analysis capabilities. The application allows users to analyze text sentiment through manual input, file uploads (TXT, CSV), and provides comprehensive visualization and reporting features. It includes user authentication, role-based access control, and data export functionality. The system uses TextBlob for natural language processing and provides sentiment classification into positive, negative, and neutral categories with confidence scores.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Template Engine**: Jinja2 templates with Bootstrap 5 for responsive UI
- **Styling**: Glass morphism design using custom CSS with CSS variables for theming
- **JavaScript**: Vanilla JavaScript with Chart.js for data visualization
- **Theme System**: Light/dark mode toggle with localStorage persistence
- **Real-time Features**: AJAX-based sentiment analysis for instant feedback

## Backend Architecture
- **Framework**: Flask web framework with modular route organization
- **Authentication**: Flask-Login for session management with password hashing
- **Database**: SQLAlchemy ORM with support for SQLite (default) and PostgreSQL
- **File Processing**: Custom FileProcessor class for handling TXT and CSV uploads
- **Sentiment Engine**: TextBlob-based SentimentAnalyzer with keyword extraction
- **Security**: Werkzeug ProxyFix for deployment behind reverse proxies

## Data Models
- **User Model**: Authentication, role-based permissions (admin/analyst/viewer), and relationship to analyses
- **SentimentAnalysis Model**: Stores analysis results with text, sentiment, confidence scores, and metadata
- **Database Schema**: Relational design with foreign key relationships and indexing for performance

## Processing Pipeline
- **Text Cleaning**: Preprocessing pipeline for input sanitization
- **Sentiment Classification**: Polarity-based categorization with configurable thresholds
- **Batch Processing**: Support for multiple text analysis in single operations
- **Export System**: CSV, PDF, and Excel export capabilities for analysis results

# External Dependencies

## Core Libraries
- **Flask**: Web framework and application server
- **SQLAlchemy**: Database ORM and migration handling
- **TextBlob**: Natural language processing and sentiment analysis
- **Pandas**: Data manipulation for file processing and exports
- **Werkzeug**: WSGI utilities and security helpers

## Frontend Libraries
- **Bootstrap 5**: CSS framework for responsive design
- **Font Awesome**: Icon library for UI elements
- **Chart.js**: Data visualization and charting library

## File Processing
- **Werkzeug File Upload**: Secure file handling with extension validation
- **CSV Module**: Processing of CSV data files
- **Pandas**: Advanced data manipulation and export functionality

## Authentication & Security
- **Flask-Login**: Session management and user authentication
- **Werkzeug Security**: Password hashing and verification
- **ProxyFix**: Security middleware for production deployment

## Configuration
- **Environment Variables**: Database URL and session secret configuration
- **File Storage**: Local filesystem for uploads and exports with configurable directories
- **Database Options**: Connection pooling and health check configurations