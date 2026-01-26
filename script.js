document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    fetchGitHubRepos();
});

function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('.nav');
    
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.06)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.85)';
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-text, .about-skills, .experience-card, ' +
        '.project-card, .finding-card, .blog-card, .current-card, ' +
        '.resume-card, .contact-link'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

document.querySelectorAll('.project-card, .finding-card, .blog-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.12)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.04)';
    });
});

async function fetchGitHubRepos() {
    const container = document.getElementById('github-repos');
    const username = 'gouravhanumante';
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const repos = await response.json();
        
        const filteredRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 6);
        
        if (filteredRepos.length === 0) {
            container.innerHTML = '<div class="no-repos">No public repositories found.</div>';
            return;
        }
        
        container.innerHTML = filteredRepos.map(repo => createRepoCard(repo)).join('');
        
    } catch (error) {
        console.error('Error fetching repos:', error);
        container.innerHTML = `
            <div class="no-repos">
                <p>Unable to load repositories.</p>
                <a href="https://github.com/${username}" target="_blank" class="btn btn-outline" style="margin-top: 16px;">
                    View on GitHub
                </a>
            </div>
        `;
    }
}

function createRepoCard(repo) {
    const languageClass = repo.language ? repo.language.toLowerCase() : 'default';
    const description = repo.description || 'No description available';
    const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
    });
    
    return `
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="github-repo-card">
            <div class="repo-header">
                <div class="repo-icon">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                    </svg>
                </div>
            </div>
            <h4 class="repo-name">${repo.name}</h4>
            <p class="repo-description">${description}</p>
            <div class="repo-meta">
                ${repo.language ? `
                    <span class="repo-language">
                        <span class="language-dot ${languageClass}"></span>
                        ${repo.language}
                    </span>
                ` : ''}
                ${repo.stargazers_count > 0 ? `
                    <span class="repo-stat">
                        <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                        </svg>
                        ${repo.stargazers_count}
                    </span>
                ` : ''}
                ${repo.forks_count > 0 ? `
                    <span class="repo-stat">
                        <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                        </svg>
                        ${repo.forks_count}
                    </span>
                ` : ''}
                <span class="repo-stat">Updated ${updatedDate}</span>
            </div>
        </a>
    `;
}
