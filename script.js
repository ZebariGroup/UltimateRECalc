// HouseMath.app - Professional Real Estate Calculator Suite
// Core JavaScript Functionality

// Global variables for charts
let paymentChart, amortizationChart, investmentChart, expenseChart, commissionChart, comparisonChart, closingChart, helocChart, flipChart, brrrrChart;

// Calculator types - IMPORTANT: This list must be complete and accurate
const CALCULATOR_TYPES = [
    'home', 'mortgage', 'investment', 'cashflow', 'closing', 'buyer', 
    'commission', 'comparison', 'rentbuy', 'refinance', 'heloc', 'flip', 'brrrr', 'report'
];

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('HouseMath.app initializing...');
    
    // Initialize components
    initializeNavigation();
    initializeMobileMenu();
    initializeThemeToggle();
    initializeCharts();
    initializeCalculators();
    
    console.log('HouseMath.app initialized successfully');
});

// Navigation and Tab Switching
function initializeNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const mobileTabs = document.querySelectorAll('.mobile-tab');
    const calculatorCards = document.querySelectorAll('.calculator-card');

    // Desktop tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchToCalculator(tabId);
        });
    });

    // Mobile tab switching  
    mobileTabs.forEach(mobileTab => {
        mobileTab.addEventListener('click', () => {
            const tabId = mobileTab.getAttribute('data-tab');
            switchToCalculator(tabId);
            closeMobileMenu();
        });
    });

    // Dashboard card navigation
    calculatorCards.forEach(card => {
        card.addEventListener('click', () => {
            const calculatorType = card.getAttribute('data-calculator');
            switchToCalculator(calculatorType);
        });
    });

    // Set home tab as active by default
    switchToCalculator('home');
}

// Switch to specific calculator
function switchToCalculator(calculatorId) {
    console.log(`Switching to calculator: ${calculatorId}`);

    // Update all tabs (desktop and mobile)
    updateTabStates(calculatorId);
    
    // Hide all calculators
    hideAllCalculators();
    
    // Show selected calculator
    showCalculator(calculatorId);
}

// Update tab states
function updateTabStates(activeTabId) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab, .mobile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to matching tabs
    const activeDesktopTab = document.querySelector(`.tab[data-tab="${activeTabId}"]`);
    const activeMobileTab = document.querySelector(`.mobile-tab[data-tab="${activeTabId}"]`);
    
    if (activeDesktopTab) activeDesktopTab.classList.add('active');
    if (activeMobileTab) activeMobileTab.classList.add('active');
}

// Hide all calculators
function hideAllCalculators() {
    CALCULATOR_TYPES.forEach(calc => {
        const element = document.getElementById(`${calc}-calculator`);
        if (element) {
            element.classList.add('hidden');
        }
    });
}

// Show specific calculator
function showCalculator(calculatorId) {
    const calculator = document.getElementById(`${calculatorId}-calculator`);
    if (calculator) {
        calculator.classList.remove('hidden');
        
        // Auto-scroll to results on mobile if it's a calculation page
        if (window.innerWidth <= 768 && calculatorId !== 'home') {
            setTimeout(() => {
                calculator.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        }
    } else {
        console.warn(`Calculator not found: ${calculatorId}-calculator`);
    }
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (!mobileMenuToggle || !mobileMenuOverlay || !mobileMenuClose) {
        console.warn('Mobile menu elements not found');
        return;
    }

    // Open mobile menu
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // Close mobile menu
    mobileMenuClose.addEventListener('click', closeMobileMenu);

    // Close when clicking overlay
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });

    // Close with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('show')) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Theme Toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        
        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch (e) {
            console.warn('Could not save theme preference');
        }
        
        // Reinitialize charts with new theme
        setTimeout(() => {
            reinitializeCharts();
        }, 100);
    });
}

// Charts Initialization
function initializeCharts() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded - charts will not be available');
        return;
    }

    const isDark = document.body.classList.contains('dark');
    const textColor = isDark ? '#f9fafb' : '#1f2937';
    const gridColor = isDark ? '#374151' : '#e5e7eb';

    // Common chart options
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: textColor }
            }
        },
        scales: {
            x: {
                grid: { color: gridColor },
                ticks: { color: textColor }
            },
            y: {
                grid: { color: gridColor },
                ticks: { color: textColor }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: { color: textColor }
            }
        }
    };

    // Initialize charts if canvas elements exist
    initializeChart('payment-chart', 'doughnut', {
        labels: ['Principal & Interest', 'Property Tax', 'Insurance', 'HOA'],
        datasets: [{
            data: [1425, 292, 100, 0],
            backgroundColor: ['#3b82f6', '#7c3aed', '#ec4899', '#10b981']
        }]
    }, pieOptions, (chart) => paymentChart = chart);

    initializeChart('amortization-chart', 'line', {
        labels: ['Year 5', 'Year 10', 'Year 15', 'Year 20', 'Year 25', 'Year 30'],
        datasets: [
            {
                label: 'Principal',
                data: [38000, 83000, 138000, 204000, 280000, 0],
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f6',
                tension: 0.1
            },
            {
                label: 'Interest',
                data: [62000, 105000, 137000, 156000, 0, 0],
                borderColor: '#7c3aed',
                backgroundColor: '#7c3aed',
                tension: 0.1
            }
        ]
    }, defaultOptions, (chart) => amortizationChart = chart);

    // Add more chart initializations here...
}

function initializeChart(canvasId, type, data, options, callback) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: type,
            data: data,
            options: options
        });
        if (callback) callback(chart);
    }
}

// Reinitialize charts when theme changes
function reinitializeCharts() {
    // Destroy existing charts
    [paymentChart, amortizationChart, investmentChart, expenseChart, 
     commissionChart, comparisonChart, closingChart, helocChart, 
     flipChart, brrrrChart].forEach(chart => {
        if (chart) chart.destroy();
    });

    // Reinitialize
    initializeCharts();
    
    // Recalculate to update with current data
    setTimeout(() => {
        const activeTab = document.querySelector('.tab.active')?.dataset.tab;
        if (activeTab) {
            triggerCalculation(activeTab);
        }
    }, 100);
}

// Calculator Functions
function initializeCalculators() {
    // Initialize sliders
    initializeSliders();
    
    // Initialize calculation buttons
    initializeCalculationButtons();
}

function initializeSliders() {
    const sliders = [
        { slider: 'down-payment-slider', display: 'down-payment-value', suffix: '%' },
        { slider: 'interest-rate-slider', display: 'interest-rate-value', suffix: '%' },
        { slider: 'expenses-slider', display: 'expenses-value', suffix: '%' },
        { slider: 'vacancy-slider', display: 'vacancy-value', suffix: '%' },
        { slider: 'appreciation-slider', display: 'appreciation-value', suffix: '%' },
        { slider: 'management-slider', display: 'management-value', suffix: '%' },
        { slider: 'maintenance-slider', display: 'maintenance-value', suffix: '%' },
        { slider: 'commission-rate-slider', display: 'commission-rate-display', suffix: '%' },
        // Add all other sliders...
    ];

    sliders.forEach(item => {
        const slider = document.getElementById(item.slider);
        const display = document.getElementById(item.display);
        
        if (slider && display) {
            // Set initial value
            display.textContent = slider.value + item.suffix;
            
            // Update on change
            slider.addEventListener('input', () => {
                display.textContent = slider.value + item.suffix;
            });
        }
    });
}

function initializeCalculationButtons() {
    const calculationButtons = [
        { button: 'calculate-mortgage', function: calculateMortgage },
        { button: 'calculate-investment', function: calculateInvestment },
        { button: 'calculate-cashflow', function: calculateCashFlow },
        { button: 'calculate-closing', function: calculateClosing },
        { button: 'calculate-buyer', function: calculateBuyer },
        { button: 'calculate-commission', function: calculateCommission },
        { button: 'calculate-comparison', function: calculateComparison },
        { button: 'calculate-rentbuy', function: calculateRentBuy },
        { button: 'calculate-refinance', function: calculateRefinance },
        { button: 'calculate-heloc', function: calculateHELOC },
        { button: 'calculate-flip', function: calculateFlip },
        { button: 'calculate-brrrr', function: calculateBRRRR }
    ];

    calculationButtons.forEach(item => {
        const button = document.getElementById(item.button);
        if (button && typeof item.function === 'function') {
            button.addEventListener('click', item.function);
        }
    });
}

// Trigger calculation based on calculator type
function triggerCalculation(calculatorType) {
    const calculationFunctions = {
        mortgage: calculateMortgage,
        investment: calculateInvestment,
        cashflow: calculateCashFlow,
        closing: calculateClosing,
        buyer: calculateBuyer,
        commission: calculateCommission,
        comparison: calculateComparison,
        rentbuy: calculateRentBuy,
        refinance: calculateRefinance,
        heloc: calculateHELOC,
        flip: calculateFlip,
        brrrr: calculateBRRRR
    };

    const calcFunction = calculationFunctions[calculatorType];
    if (calcFunction && typeof calcFunction === 'function') {
        calcFunction();
    }
}

// Calculator Functions (Stubs - to be implemented)
function calculateMortgage() {
    console.log('Calculating mortgage...');
    // Implementation will be added
}

function calculateInvestment() {
    console.log('Calculating investment...');
    // Implementation will be added
}

function calculateCashFlow() {
    console.log('Calculating cash flow...');
    // Implementation will be added
}

function calculateClosing() {
    console.log('Calculating closing costs...');
    // Implementation will be added
}

function calculateBuyer() {
    console.log('Calculating buyer costs...');
    // Implementation will be added
}

function calculateCommission() {
    console.log('Calculating commission...');
    // Implementation will be added
}

function calculateComparison() {
    console.log('Calculating comparison...');
    // Implementation will be added
}

function calculateRentBuy() {
    console.log('Calculating rent vs buy...');
    // Implementation will be added
}

function calculateRefinance() {
    console.log('Calculating refinance...');
    // Implementation will be added
}

function calculateHELOC() {
    console.log('Calculating HELOC...');
    // Implementation will be added
}

function calculateFlip() {
    console.log('Calculating property flip...');
    // Implementation will be added
}

function calculateBRRRR() {
    console.log('Calculating BRRRR strategy...');
    // Implementation will be added
}

// Utility Functions
function hapticFeedback(type = 'light') {
    if (navigator.vibrate) {
        switch(type) {
            case 'light': navigator.vibrate(10); break;
            case 'medium': navigator.vibrate(20); break;
            case 'heavy': navigator.vibrate([10, 10, 10]); break;
        }
    }
}

// Add loading states for buttons
function showLoadingState(element, text = 'Calculating...') {
    if (element) {
        element.disabled = true;
        element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    }
}

function hideLoadingState(element, originalText) {
    if (element) {
        element.disabled = false;
        element.innerHTML = originalText;
    }
}

// Loading screen management
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
});

// Export for debugging
window.HouseMath = {
    switchToCalculator,
    CALCULATOR_TYPES,
    reinitializeCharts
};
