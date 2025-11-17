// Unified Carousel functionality
let currentProjectIndex = 0;
let totalProjects = 0;
let projectItems = [];

function getUnifiedCarouselElements() {
    const container = document.getElementById('unified-carousel');
    if (!container) return {};
    const slide = container.querySelector('.carousel-slide');
    return { container, slide };
}

function initializeUnifiedCarousel() {
    const { container, slide } = getUnifiedCarouselElements();
    if (!container || !slide) return;
    
    projectItems = Array.from(slide.querySelectorAll('.project-item'));
    totalProjects = projectItems.length;
    
    // Update total projects indicator
    const totalProjectsEl = document.getElementById('total-projects');
    if (totalProjectsEl) {
        totalProjectsEl.textContent = totalProjects;
    }
    
    // Set initial position to middle item
    currentProjectIndex = Math.floor(totalProjects / 2);
    updateCarouselPosition();
    updateCarouselButtons();
}

function updateCarouselPosition() {
    const { container, slide } = getUnifiedCarouselElements();
    if (!container || !slide || projectItems.length === 0) return;
    
    // Remove active class from all items
    projectItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to current item
    if (projectItems[currentProjectIndex]) {
        projectItems[currentProjectIndex].classList.add('active');
    }
    
    // Use double requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const containerWidth = window.innerWidth || container.offsetWidth;
            const activeItem = projectItems[currentProjectIndex];
            if (!activeItem) return;
            
            // Responsive sizing based on screen width
            let gap, nonActiveWidth, activeWidth;
            if (containerWidth <= 768) {
                // Mobile: full width items
                gap = 15;
                nonActiveWidth = containerWidth - 40; // Account for padding
                activeWidth = containerWidth - 40;
            } else if (containerWidth <= 1024) {
                // Tablet
                gap = 20;
                nonActiveWidth = 280;
                activeWidth = 500;
            } else {
                // Desktop
                gap = 30;
                nonActiveWidth = 300;
                activeWidth = 600;
            }
            
            // Get actual computed widths
            const actualActiveWidth = activeItem.offsetWidth || activeWidth;
            const actualNonActiveWidth = nonActiveWidth;
            
            // Calculate offset to center the current item
            let offset = 0;
            for (let i = 0; i < currentProjectIndex; i++) {
                offset += actualNonActiveWidth + gap;
            }
            
            // For mobile, center the item
            if (containerWidth <= 768) {
                const slidePadding = 20; // Mobile padding
                offset = (currentProjectIndex * (actualNonActiveWidth + gap)) + slidePadding;
                const finalOffset = offset - ((containerWidth - actualActiveWidth) / 2);
                slide.style.transform = `translate3d(-${Math.max(0, finalOffset)}px, 0, 0)`;
            } else {
                // Desktop/Tablet: center the active item
                const slidePadding = (containerWidth / 2) - 300;
                offset += slidePadding;
                const activeItemCenter = offset + (actualActiveWidth / 2);
                const viewportCenter = containerWidth / 2;
                const finalOffset = activeItemCenter - viewportCenter;
                slide.style.transform = `translate3d(-${Math.max(0, finalOffset)}px, 0, 0)`;
            }
        });
    });
    
    // Update current project indicator
    const currentProjectEl = document.getElementById('current-project');
    if (currentProjectEl) {
        currentProjectEl.textContent = currentProjectIndex + 1;
    }
}

function updateCarouselButtons() {
    const { container } = getUnifiedCarouselElements();
    if (!container) return;
    
    const controls = container.parentElement;
    const prevBtn = controls.querySelector('.prev');
    const nextBtn = controls.querySelector('.next');
    
    if (!prevBtn || !nextBtn) return;
    
    // Infinite loop - buttons are never disabled
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    prevBtn.classList.remove('disabled');
    nextBtn.classList.remove('disabled');
}

function moveUnifiedCarousel(direction) {
    if (totalProjects === 0) return;
    
    // Infinite loop logic
    let newIndex = currentProjectIndex + direction;
    
    if (newIndex < 0) {
        // Loop to the end
        newIndex = totalProjects - 1;
    } else if (newIndex >= totalProjects) {
        // Loop to the beginning
        newIndex = 0;
    }
    
    currentProjectIndex = newIndex;
    updateCarouselPosition();
    updateCarouselButtons();
}

function handleUnifiedCarouselResize() {
    updateCarouselPosition();
    updateCarouselButtons();
}

function debounce(fn, delay = 200) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}


// Intersection observer for reveal animations - works on scroll up and down
const revealObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
        } else {
            // Remove class when scrolling out of view for re-animation
            entry.target.classList.remove('reveal-visible');
        }
    });
}, revealObserverOptions);

function initRevealAnimations() {
    // Observe all reveal variants
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-fade').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Observe form groups
    document.querySelectorAll('.form-group').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Observe contact info items
    document.querySelectorAll('.contact-info-item').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Observe section titles
    document.querySelectorAll('.section-title').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Observe about boxes
    document.querySelectorAll('.expandable-box').forEach(el => {
        revealObserver.observe(el);
    });
}

// Brush stroke animation for hero roles
function animateHeroRoles() {
    const heroRoles = document.querySelectorAll('.hero-roles p');
    heroRoles.forEach((role, index) => {
        setTimeout(() => {
            role.classList.add('animate');
        }, index * 300);
    });
}

// Observer for hero roles - triggers on scroll
const heroRolesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const roles = entry.target.querySelectorAll('.hero-roles p');
            roles.forEach((role, index) => {
                role.classList.remove('animate');
                setTimeout(() => {
                    role.classList.add('animate');
                }, index * 300);
            });
        } else {
            // Reset when scrolling out
            const roles = entry.target.querySelectorAll('.hero-roles p');
            roles.forEach(role => {
                role.classList.remove('animate');
            });
        }
    });
}, { threshold: 0.3 });

function initHeroRolesAnimation() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroRolesObserver.observe(heroSection);
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler with envelope animation
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Show envelope animation
    const envelopeAnimation = document.getElementById('envelopeAnimation');
    if (envelopeAnimation) {
        envelopeAnimation.classList.add('show');
        
        // Hide animation after completion
        setTimeout(() => {
            envelopeAnimation.classList.remove('show');
            
            // Reset form after animation
            setTimeout(() => {
                document.getElementById('contactForm').reset();
            }, 600);
        }, 3500);
    } else {
        // Fallback if animation element doesn't exist
        alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon at ${email}.`);
        this.reset();
    }
});

// Animate skill icons on scroll
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillIcons = entry.target.querySelectorAll('.skill-icon-item');
            skillIcons.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px) scale(0.8)';
                    item.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                }, index * 100);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Expandable About Me boxes
function initExpandableBoxes() {
    const expandableBoxes = document.querySelectorAll('.expandable-box');
    
    expandableBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const isExpanded = this.classList.contains('expanded');
            
            // Toggle current box only - each box is independent
            if (isExpanded) {
                this.classList.remove('expanded');
            } else {
                this.classList.add('expanded');
            }
        });
    });
}

// Historical skill icon mouse tracking effect
function initHistoricalSkillIcons() {
    const skillWrappers = document.querySelectorAll('.skill-icon-wrapper');
    
    skillWrappers.forEach(wrapper => {
        wrapper.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            this.style.setProperty('--mouse-x', x + '%');
            this.style.setProperty('--mouse-y', y + '%');
        });
        
        wrapper.addEventListener('mouseleave', function() {
            this.style.setProperty('--mouse-x', '50%');
            this.style.setProperty('--mouse-y', '50%');
        });
    });
}

// Intro page transition to portfolio
function initIntroPage() {
    const introPage = document.getElementById('intro-page');
    const letterClosed = document.getElementById('letter-closed');
    const letterOpened = document.getElementById('letter-opened');
    const letterEnvelope = document.querySelector('.letter-envelope');
    const openPortfolioBtn = document.querySelector('.open-portfolio-btn');
    const body = document.body;
    
    // Check if intro was already shown (using sessionStorage)
    const introShown = sessionStorage.getItem('introShown');
    
    if (introShown === 'true') {
        // Hide intro immediately if already shown
        if (introPage) {
            introPage.classList.add('fade-out');
            body.classList.remove('intro-active');
        }
        return;
    }
    
    // Show intro and prevent body scroll
    body.classList.add('intro-active');
    
    // Open letter when envelope is clicked
    if (letterEnvelope) {
        letterEnvelope.addEventListener('click', function() {
            // Animate envelope opening
            const envelopeFront = document.querySelector('.envelope-front');
            if (envelopeFront) {
                envelopeFront.classList.add('opening');
            }
            
            // Hide closed letter and show opened letter with scroll animation
            setTimeout(() => {
                if (letterClosed) {
                    letterClosed.classList.add('hide');
                }
                if (letterOpened) {
                    letterOpened.classList.add('show');
                }
            }, 800);
        });
    }
    
    // Go to portfolio when button is clicked
    if (openPortfolioBtn) {
        openPortfolioBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mark intro as shown
            sessionStorage.setItem('introShown', 'true');
            
            // Fade out intro page
            if (introPage) {
                introPage.classList.add('fade-out');
                body.classList.remove('intro-active');
            }
            
            // Scroll to portfolio after fade out
            setTimeout(() => {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    projectsSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 500);
        });
    }
}

// Project Modal functionality
let currentModalImages = [];
let currentModalImageIndex = 0;

function openProjectModal(projectItem) {
    const modal = document.getElementById('projectModal');
    const modalImage = document.getElementById('modalImage');
    const modalCategory = document.getElementById('modalCategory');
    const modalProjectName = document.getElementById('modalProjectName');
    const visitSiteBtn = document.getElementById('visitSiteBtn');
    const projectLinksList = document.getElementById('projectLinksList');
    
    if (!modal || !modalImage || !modalCategory) return;
    
    // Get project data
    const img = projectItem.querySelector('img');
    const categoryLabel = projectItem.querySelector('.project-category-label');
    const projectName = projectItem.getAttribute('data-name');
    const category = projectItem.getAttribute('data-category');
    
    // Get project link if available
    const projectLink = projectItem.getAttribute('data-link');
    const linkLabel = projectItem.getAttribute('data-link-label') || 'Visit Site';
    const visitSiteBtnText = document.getElementById('visitSiteBtnText');
    
    // Check if this category should show a links list (like "websites")
    if (category === 'websites' && projectLinksList) {
        // Define all website projects with links (can be stored in data or hardcoded)
        const websitesList = [
            {
                name: 'ASC Maestra - Salon Website',
                url: 'https://asc-maestra.ct.ws',
                label: 'Visit Website'
            },
            {
                name: 'Puppy Path - Adoption Website',
                url: 'https://jennilynpataueg.github.io/PuppyPath_Website_Final/',
                label: 'Visit Website'
            }
        ];
        
        if (websitesList.length > 0) {
            // Hide single project display
            modalProjectName.style.display = 'none';
            visitSiteBtn.style.display = 'none';
            
            // Show links list
            projectLinksList.innerHTML = '';
            projectLinksList.style.display = 'block';
            
            websitesList.forEach(website => {
                // Ensure URL has protocol
                let url = website.url.trim();
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                
                const linkItem = document.createElement('div');
                linkItem.className = 'project-link-item';
                linkItem.innerHTML = `
                    <span class="project-link-name">${website.name}</span>
                    <a href="${url}" target="_blank" rel="noopener noreferrer" class="project-link-url">${website.label}</a>
                `;
                
                // Make entire item clickable
                linkItem.onclick = function(e) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    window.open(url, '_blank', 'noopener,noreferrer');
                    return false;
                };
                
                linkItem.querySelector('a').onclick = function(e) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    window.open(url, '_blank', 'noopener,noreferrer');
                    return false;
                };
                
                projectLinksList.appendChild(linkItem);
            });
        } else {
            projectLinksList.style.display = 'none';
        }
    } else {
        // Single project display (original behavior)
        projectLinksList.style.display = 'none';
        
        if (visitSiteBtn) {
            if (projectLink && projectLink.trim() !== '') {
            // Ensure URL has protocol
            let url = projectLink.trim();
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            // Set link properties
            visitSiteBtn.setAttribute('href', url);
            visitSiteBtn.setAttribute('target', '_blank');
            visitSiteBtn.setAttribute('rel', 'noopener noreferrer');
            visitSiteBtn.style.display = 'flex';
            visitSiteBtn.style.pointerEvents = 'auto';
            visitSiteBtn.style.cursor = 'pointer';
            
            // Update button text
            if (visitSiteBtnText) {
                visitSiteBtnText.textContent = linkLabel;
            }
            
            // Ensure link opens in new tab
            visitSiteBtn.onclick = function(e) {
                e.stopPropagation();
                // Prevent any parent handlers from interfering
                e.stopImmediatePropagation();
                // Open link
                window.open(url, '_blank', 'noopener,noreferrer');
                // Return false to prevent default navigation if needed
                return false;
            };
            } else {
                visitSiteBtn.style.display = 'none';
                visitSiteBtn.href = '#';
            }
        }
    }
    
    // Get images from data attribute or use the single image
    const imagesData = projectItem.getAttribute('data-images');
    if (imagesData) {
        try {
            currentModalImages = JSON.parse(imagesData);
        } catch (e) {
            currentModalImages = [];
        }
    } else {
        // Fallback to single image if no data-images attribute
        currentModalImages = img ? [{ src: img.src, alt: img.alt || 'Project' }] : [];
    }
    
    // If no images, try to get from data attribute as comma-separated string
    if (currentModalImages.length === 0 && imagesData) {
        const imageUrls = imagesData.split(',').map(url => url.trim());
        currentModalImages = imageUrls.map(url => ({ src: url, alt: categoryLabel ? categoryLabel.textContent : 'Project' }));
    }
    
    // Fallback to the carousel image if no images found
    if (currentModalImages.length === 0 && img) {
        currentModalImages = [{ src: img.src, alt: img.alt || 'Project' }];
    }
    
    currentModalImageIndex = 0;
    updateModalImage();
    updateModalNavigation();
    
    // Set category label
    if (categoryLabel) {
        modalCategory.textContent = categoryLabel.textContent;
    }
    
    // Set project name if available
    if (modalProjectName) {
        if (projectName) {
            modalProjectName.textContent = projectName;
            modalProjectName.style.display = 'block';
        } else {
            modalProjectName.style.display = 'none';
        }
    }
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function updateModalImage() {
    const modalImage = document.getElementById('modalImage');
    const currentImageEl = document.getElementById('currentImageIndex');
    const totalImagesEl = document.getElementById('totalImages');
    
    if (!modalImage || currentModalImages.length === 0) return;
    
    const currentImage = currentModalImages[currentModalImageIndex];
    modalImage.src = currentImage.src;
    modalImage.alt = currentImage.alt || 'Project';
    
    if (currentImageEl) {
        currentImageEl.textContent = currentModalImageIndex + 1;
    }
    
    if (totalImagesEl) {
        totalImagesEl.textContent = currentModalImages.length;
    }
}

function navigateModalImage(direction) {
    if (currentModalImages.length === 0) return;
    
    currentModalImageIndex += direction;
    
    // Loop around
    if (currentModalImageIndex < 0) {
        currentModalImageIndex = currentModalImages.length - 1;
    } else if (currentModalImageIndex >= currentModalImages.length) {
        currentModalImageIndex = 0;
    }
    
    updateModalImage();
    updateModalNavigation();
}

function updateModalNavigation() {
    const prevBtn = document.querySelector('.project-modal-nav-btn.prev');
    const nextBtn = document.querySelector('.project-modal-nav-btn.next');
    
    // Always show buttons if there are multiple images
    if (currentModalImages.length > 1) {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
    } else {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        currentModalImages = [];
        currentModalImageIndex = 0;
    }
}

// Observe skills section & initialize carousels when page loads
document.addEventListener('DOMContentLoaded', function() {
    initIntroPage();
    
    // Project Modal setup
    const modalOverlay = document.querySelector('.project-modal-overlay');
    const modalContainer = document.querySelector('.project-modal-container');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            // Only close if clicking directly on overlay, not on container
            if (e.target === modalOverlay) {
                closeProjectModal();
            }
        });
    }
    if (modalContainer) {
        modalContainer.addEventListener('click', function(e) {
            // Stop propagation to prevent closing when clicking inside modal
            e.stopPropagation();
        });
    }
    
    // Close modal on ESC key and navigate with arrow keys
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModal();
        } else if (e.key === 'ArrowLeft') {
            const modal = document.getElementById('projectModal');
            if (modal && modal.classList.contains('show')) {
                navigateModalImage(-1);
            }
        } else if (e.key === 'ArrowRight') {
            const modal = document.getElementById('projectModal');
            if (modal && modal.classList.contains('show')) {
                navigateModalImage(1);
            }
        }
    });
    
    // Add click handlers to project items
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('click', function() {
            openProjectModal(this);
        });
    });
    
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const skillIcons = skillsSection.querySelectorAll('.skill-icon-item');
        skillIcons.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) scale(0.8)';
        });
        observer.observe(skillsSection);
    }
    initRevealAnimations();
    initHeroRolesAnimation();
    initExpandableBoxes();
    initHistoricalSkillIcons();
    initializeUnifiedCarousel();
    
    // Handle resize for unified carousel
    window.addEventListener('resize', debounce(handleUnifiedCarouselResize, 200));
});

// Add active state to navigation on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Burger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (burgerMenu && navMenu) {
        // Toggle menu on burger click
        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnBurger = burgerMenu.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnBurger && navMenu.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

