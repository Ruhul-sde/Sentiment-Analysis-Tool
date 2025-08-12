// Chart.js integration for Sentiment Analysis Tool

/**
 * Initialize distribution chart (pie chart)
 */
function initializeDistributionChart(distribution) {
    const canvas = document.getElementById('distributionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.distributionChart instanceof Chart) {
        window.distributionChart.destroy();
    }
    
    const data = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
            data: [
                distribution.positive || 0,
                distribution.neutral || 0,
                distribution.negative || 0
            ],
            backgroundColor: [
                'rgba(16, 185, 129, 0.8)',
                'rgba(107, 114, 128, 0.8)',
                'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
                'rgba(16, 185, 129, 1)',
                'rgba(107, 114, 128, 1)',
                'rgba(239, 68, 68, 1)'
            ],
            borderWidth: 2,
            hoverOffset: 10
        }]
    };
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed * 100) / total).toFixed(1) : 0;
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%',
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    };
    
    window.distributionChart = new Chart(ctx, config);
}

/**
 * Initialize sentiment trend chart (line chart for time-based analysis)
 */
function initializeTrendChart(trendData) {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.trendChart instanceof Chart) {
        window.trendChart.destroy();
    }
    
    const data = {
        labels: trendData.labels || [],
        datasets: [
            {
                label: 'Positive',
                data: trendData.positive || [],
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Neutral',
                data: trendData.neutral || [],
                borderColor: 'rgba(107, 114, 128, 1)',
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(107, 114, 128, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Negative',
                data: trendData.negative || [],
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time Period',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Count',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    };
    
    window.trendChart = new Chart(ctx, config);
}

/**
 * Initialize confidence distribution chart (bar chart)
 */
function initializeConfidenceChart(confidenceData) {
    const canvas = document.getElementById('confidenceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.confidenceChart instanceof Chart) {
        window.confidenceChart.destroy();
    }
    
    const data = {
        labels: ['0.0-0.2', '0.2-0.4', '0.4-0.6', '0.6-0.8', '0.8-1.0'],
        datasets: [{
            label: 'Analysis Count',
            data: confidenceData || [0, 0, 0, 0, 0],
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(34, 197, 94, 0.8)'
            ],
            borderColor: [
                'rgba(239, 68, 68, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(34, 197, 94, 1)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        title: function(context) {
                            return `Confidence Range: ${context[0].label}`;
                        },
                        label: function(context) {
                            return `Analyses: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Confidence Range',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Analyses',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    };
    
    window.confidenceChart = new Chart(ctx, config);
}

/**
 * Create a real-time sentiment gauge
 */
function createSentimentGauge(canvasId, value, sentiment) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart'] instanceof Chart) {
        window[canvasId + 'Chart'].destroy();
    }
    
    const data = {
        datasets: [{
            data: [value * 100, (1 - value) * 100],
            backgroundColor: [
                getSentimentColor(sentiment),
                'rgba(229, 231, 235, 0.3)'
            ],
            borderWidth: 0,
            cutout: '80%',
            circumference: 180,
            rotation: 270
        }]
    };
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            animation: {
                animateRotate: true,
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        },
        plugins: [{
            afterDraw: function(chart) {
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;
                const centerX = (chartArea.left + chartArea.right) / 2;
                const centerY = chartArea.bottom - 10;
                
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = getSentimentColor(sentiment);
                ctx.font = 'bold 14px Inter';
                ctx.fillText(`${Math.round(value * 100)}%`, centerX, centerY);
                ctx.restore();
            }
        }]
    };
    
    window[canvasId + 'Chart'] = new Chart(ctx, config);
}

/**
 * Update chart data dynamically
 */
function updateChartData(chart, newData) {
    if (!chart || !newData) return;
    
    chart.data.datasets[0].data = newData;
    chart.update('active');
}

/**
 * Get sentiment color for charts
 */
function getSentimentColor(sentiment) {
    switch (sentiment) {
        case 'positive': return 'rgba(16, 185, 129, 1)';
        case 'negative': return 'rgba(239, 68, 68, 1)';
        case 'neutral': return 'rgba(107, 114, 128, 1)';
        default: return 'rgba(107, 114, 128, 1)';
    }
}

/**
 * Create animated counter for statistics
 */
function animateStatCounter(element, endValue, duration = 1000) {
    if (!element) return;
    
    const startValue = 0;
    const increment = endValue / (duration / 16);
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= endValue) {
            element.textContent = endValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentValue);
        }
    }, 16);
}

/**
 * Initialize responsive chart handling
 */
function initializeResponsiveCharts() {
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.distributionChart) {
            window.distributionChart.resize();
        }
        if (window.trendChart) {
            window.trendChart.resize();
        }
        if (window.confidenceChart) {
            window.confidenceChart.resize();
        }
    });
}

/**
 * Export chart as image
 */
function exportChart(chartInstance, filename) {
    if (!chartInstance) return;
    
    const url = chartInstance.toBase64Image();
    const link = document.createElement('a');
    link.download = filename || 'chart.png';
    link.href = url;
    link.click();
}

/**
 * Initialize all charts with proper error handling
 */
function initializeAllCharts() {
    // Set default Chart.js configuration
    Chart.defaults.font.family = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    Chart.defaults.color = '#374151';
    Chart.defaults.borderColor = 'rgba(229, 231, 235, 0.5)';
    
    // Initialize responsive handling
    initializeResponsiveCharts();
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAllCharts);

// Export functions for global use
window.ChartUtils = {
    initializeDistributionChart,
    initializeTrendChart,
    initializeConfidenceChart,
    createSentimentGauge,
    updateChartData,
    getSentimentColor,
    animateStatCounter,
    exportChart
};
