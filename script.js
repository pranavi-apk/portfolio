// Clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}
updateClock();
setInterval(updateClock, 1000);

// Navigation System
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const currentPath = document.getElementById('current-path');

// Path mapping for terminal footer
const pathMap = {
    'home': '~',
    'projects': '~/projects',
    'competitions': '~/competitions',
    'experience': '~/experience',
    'research': '~/research'
};

function switchPage(pageName) {
    // Remove active class from all nav items and pages
    navItems.forEach(item => item.classList.remove('active'));
    pages.forEach(page => page.classList.remove('active'));
    
    // Add active class to selected nav item and page
    const selectedNav = document.querySelector(`[data-page="${pageName}"]`);
    const selectedPage = document.getElementById(pageName);
    
    if (selectedNav && selectedPage) {
        selectedNav.classList.add('active');
        selectedPage.classList.add('active');
        
        // Update path in footer
        if (currentPath) {
            currentPath.textContent = pathMap[pageName] || '~';
        }
        
        // Update URL hash for direct linking
        window.location.hash = pageName;
    }
}

// Navigation click handlers
navItems.forEach(nav => {
    nav.addEventListener('click', () => {
        const pageName = nav.getAttribute('data-page');
        switchPage(pageName);
    });
});

// Handle direct links (URL hash)
function loadPageFromHash() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        switchPage(hash);
    }
}

// Load page from hash on page load
loadPageFromHash();

// Listen for hash changes (for direct links)
window.addEventListener('hashchange', loadPageFromHash);

// Smooth entrance animations
document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.panel');
    
    panels.forEach((panel, index) => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            panel.style.transition = 'all 0.5s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Skill tag click effect
const skillTags = document.querySelectorAll('.skills-tags span');

skillTags.forEach(tag => {
    tag.addEventListener('click', function() {
        this.style.animation = 'ping 0.5s';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
    });
});

// Add ping animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ping {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Stats counter animation
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const text = stat.textContent;
        const value = parseInt(text.replace(/\D/g, ''));
        
        if (isNaN(value)) return;
        
        let current = 0;
        const increment = value / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                stat.textContent = text;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current).toString();
            }
        }, 30);
    });
}

// Trigger stats animation when home page is active
const homeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        const homePage = document.getElementById('home');
        if (homePage && homePage.classList.contains('active') && !statsAnimated) {
            setTimeout(animateStats, 500);
        }
    });
});

const homePage = document.getElementById('home');
if (homePage) {
    homeObserver.observe(homePage, { attributes: true, attributeFilter: ['class'] });
    // Also trigger on initial load if home is active
    if (homePage.classList.contains('active')) {
        setTimeout(animateStats, 500);
    }
}

// Project card interactions and detail view navigation
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    // Hover effect
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.project-icon');
        if (icon) {
            icon.style.transform = 'rotate(360deg) scale(1.2)';
            icon.style.transition = 'transform 0.5s ease';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.project-icon');
        if (icon) {
            icon.style.transform = 'rotate(0deg) scale(1)';
        }
    });
    
    // Click to view details
    const viewDetailsBtn = card.querySelector('.view-details-btn');
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = card.getAttribute('data-project');
            if (projectId) {
                switchPage(`project-${projectId}`);
            }
        });
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 1-5 to switch pages
    if (e.key >= '1' && e.key <= '5') {
        const pageIndex = parseInt(e.key) - 1;
        const navItem = navItems[pageIndex];
        if (navItem) {
            navItem.click();
        }
    }
    
    // Press 'h' for help
    if (e.key === 'h' || e.key === 'H') {
        showHelp();
    }
});

function showHelp() {
    const helpMessage = `
╔════════════════════════════════════════╗
║       PORTFOLIO NAVIGATION HELP        ║
╠════════════════════════════════════════╣
║  KEYBOARD SHORTCUTS:                   ║
║  1 - Home                              ║
║  2 - Projects                          ║
║  3 - Competitions                      ║
║  4 - Experience                        ║
║  5 - Research                          ║
║  H - Show this help                    ║
║                                        ║
║  DIRECT LINKS:                         ║
║  Add #home, #projects, #competitions,  ║
║  #experience, or #research to URL      ║
║                                        ║
║  Example:                              ║
║  portfolio.html#projects               ║
╚════════════════════════════════════════╝
    `;
    
    console.log(helpMessage);
    
    // Show visual notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(22, 27, 34, 0.98);
        border: 2px solid #7ce38b;
        border-radius: 8px;
        padding: 2rem;
        color: #c9d1d9;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.85rem;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        max-width: 90%;
    `;
    
    notification.innerHTML = `
        <div style="color: #7ce38b; font-weight: bold; margin-bottom: 1.5rem; font-size: 1rem;">⌨️  NAVIGATION SHORTCUTS</div>
        <div style="line-height: 2;">
            <div><span style="color: #39c5cf; font-weight: bold;">1</span> → Home</div>
            <div><span style="color: #39c5cf; font-weight: bold;">2</span> → Projects</div>
            <div><span style="color: #39c5cf; font-weight: bold;">3</span> → Competitions</div>
            <div><span style="color: #39c5cf; font-weight: bold;">4</span> → Experience</div>
            <div><span style="color: #39c5cf; font-weight: bold;">5</span> → Research</div>
            <div style="margin-top: 1rem;"><span style="color: #39c5cf; font-weight: bold;">H</span> → Help</div>
        </div>
        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #30363d;">
            <div style="color: #ffdf5d; font-weight: bold; margin-bottom: 0.5rem;">📌 Direct Links:</div>
            <div style="color: #8b949e; font-size: 0.75rem;">
                Add #home, #projects, #competitions, #experience, or #research to URL
            </div>
        </div>
        <div style="margin-top: 1.5rem; text-align: center; color: #8b949e; font-size: 0.75rem;">
            Click anywhere to close
        </div>
    `;
    
    document.body.appendChild(notification);
    
    const closeNotification = () => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
        document.removeEventListener('click', closeNotification);
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeNotification);
    }, 100);
}

// Console easter egg
console.log('%c╔════════════════════════════════════════╗', 'color: #7ce38b; font-family: monospace;');
console.log('%c║  👋 Hey there, curious developer!     ║', 'color: #7ce38b; font-family: monospace;');
console.log('%c║                                        ║', 'color: #7ce38b; font-family: monospace;');
console.log('%c║  Press H for keyboard shortcuts        ║', 'color: #39c5cf; font-family: monospace;');
console.log('%c║  Press 1-5 to navigate pages           ║', 'color: #39c5cf; font-family: monospace;');
console.log('%c║                                        ║', 'color: #7ce38b; font-family: monospace;');
console.log('%c║  Direct links available:               ║', 'color: #ffdf5d; font-family: monospace;');
console.log('%c║  #home #projects #competitions         ║', 'color: #ffdf5d; font-family: monospace;');
console.log('%c║  #experience #research                 ║', 'color: #ffdf5d; font-family: monospace;');
console.log('%c║                                        ║', 'color: #7ce38b; font-family: monospace;');
console.log('%c║  Built with ❤️  by Pranavi            ║', 'color: #ff6bcb; font-family: monospace;');
console.log('%c╚════════════════════════════════════════╝', 'color: #7ce38b; font-family: monospace;');

// Copy link functionality (helpful for sharing)
function copyPageLink(pageName) {
    const url = window.location.href.split('#')[0] + '#' + pageName;
    navigator.clipboard.writeText(url).then(() => {
        console.log(`✓ Link copied: ${url}`);
    });
}

// Add double-click on nav items to copy link
navItems.forEach(nav => {
    nav.addEventListener('dblclick', () => {
        const pageName = nav.getAttribute('data-page');
        copyPageLink(pageName);
        
        // Visual feedback
        nav.style.background = 'rgba(126, 227, 139, 0.3)';
        setTimeout(() => {
            nav.style.background = '';
        }, 300);
    });
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`⚡ Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
    });
}

// Add subtle hover effects to social links
const socialLinks = document.querySelectorAll('.social-links a');

socialLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 15px rgba(126, 227, 139, 0.4)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
});
