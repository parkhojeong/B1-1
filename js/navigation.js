// Keep navigation events, state changes, and rendering together.
class Navigation {
    constructor(header, scrollTopButton) {
        this.header = header;
        this.scrollTopButton = scrollTopButton;
        this.menuButton = header.querySelector("#hamburger-menu");
        this.menu = header.querySelector("#menu-nav");
        this.desktopQuery = window.matchMedia("(min-width: 768px)");
        this.menuOpen = false;
        this.scrollPosition = window.scrollY;
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.menuButton.addEventListener("click", () => this.toggleMenu());
        this.menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => this.handleLinkClick(link));
        });
        document.addEventListener("keydown", (event) => this.handleKeydown(event));
        document.addEventListener("click", (event) => this.handleOutsideClick(event));
        this.desktopQuery.addEventListener("change", () => this.handleBreakpointChange());
        window.addEventListener("scroll", () => this.handleScroll(), { passive: true });
        this.scrollTopButton.addEventListener("click", () => this.scrollToTop());
    }

    setMenuOpen(isOpen) {
        this.menuOpen = isOpen;
        this.render();
    }

    toggleMenu() {
        this.setMenuOpen(!this.menuOpen);
        if (this.menuOpen) this.menu.querySelector("a").focus();
    }

    handleLinkClick(link) {
        this.setMenuOpen(false);
        document.querySelector(link.getAttribute("href")).focus({ preventScroll: true });
    }

    handleKeydown(event) {
        if (event.key === "Escape" && this.menuOpen) {
            this.setMenuOpen(false);
            this.menuButton.focus();
        }
    }

    handleOutsideClick(event) {
        if (!this.menu.contains(event.target) && !this.menuButton.contains(event.target)) {
            this.setMenuOpen(false);
        }
    }

    handleBreakpointChange() {
        const focusWasInMenu = this.menu.contains(document.activeElement);
        const focusWasOnButton = document.activeElement === this.menuButton;
        this.setMenuOpen(false);
        if (!this.desktopQuery.matches && focusWasInMenu) this.menuButton.focus();
        if (this.desktopQuery.matches && focusWasOnButton) this.menu.querySelector("a").focus();
    }

    handleScroll() {
        this.scrollPosition = window.scrollY;
        this.render();
    }

    scrollToTop() {
        document.querySelector("#hero").focus({ preventScroll: true });
        window.scrollTo({ top: 0 });
    }

    render() {
        this.menu.classList.toggle("active", this.menuOpen);
        this.header.classList.toggle("scrolled", this.scrollPosition >= 60);
        this.scrollTopButton.classList.toggle("hidden", this.scrollPosition < 300);
    }
}

// Reveal each static section once; project list height changes after API requests.
function initScrollAnimations() {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".reveal-target").forEach((section) => {
        section.classList.add("reveal-ready");
        observer.observe(section);
    });
}

const navigation = new Navigation(
    document.querySelector(".site-header"),
    document.querySelector("#scroll-top")
);
initScrollAnimations();
