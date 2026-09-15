// Keep the mobile menu's .active class and accessibility attributes in sync.
const menuButton = document.querySelector("#hamburger-menu");
const menu = document.querySelector("#menu-nav");
const desktopQuery = window.matchMedia("(min-width: 768px)");

function setMenuOpen(isOpen) {
    menu.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

menuButton.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("active");
    setMenuOpen(isOpen);
    if (isOpen) menu.querySelector("a").focus();
});

menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        setMenuOpen(false);
        document.querySelector(link.getAttribute("href")).focus({ preventScroll: true });
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("active")) {
        setMenuOpen(false);
        menuButton.focus();
    }
});

document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
        setMenuOpen(false);
    }
});

desktopQuery.addEventListener("change", () => {
    const focusWasInMenu = menu.contains(document.activeElement);
    const focusWasOnButton = document.activeElement === menuButton;
    setMenuOpen(false);
    if (!desktopQuery.matches && focusWasInMenu) menuButton.focus();
    if (desktopQuery.matches && focusWasOnButton) menu.querySelector("a").focus();
});

// Update the header appearance and back-to-top button visibility based on scroll position.
const header = document.querySelector(".site-header");
const scrollTopButton = document.querySelector("#scroll-top");

function updateScrollState() {
    header.classList.toggle("scrolled", window.scrollY >= 60);
    scrollTopButton.classList.toggle("hidden", window.scrollY < 300);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

scrollTopButton.addEventListener("click", () => {
    document.querySelector("#hero").focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
});

// Exclude the dynamic project list from observation because its height can change significantly.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
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
