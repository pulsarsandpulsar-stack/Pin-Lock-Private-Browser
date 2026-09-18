// Pin Lock Private Browser — small progressive enhancements.
// Everything here is optional; every page is fully usable with this disabled
// or if IntersectionObserver isn't supported (content simply stays visible).

document.addEventListener("DOMContentLoaded", function () {
    setCopyrightYear();
    initTocScrollSpy();
    initQuickStartAnimation();
    initAccordion();
});

function setCopyrightYear() {
    var yearEl = document.getElementById("copyright-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Highlight the current section in the Terms/Privacy sidebar table of contents.
function initTocScrollSpy() {
    var tocLinks = document.querySelectorAll(".toc a, .mobile-toc a");
    if (!tocLinks.length || !("IntersectionObserver" in window)) return;

    var sections = [];
    tocLinks.forEach(function (link) {
        var id = link.getAttribute("href").slice(1);
        var section = document.getElementById(id);
        if (section) sections.push({ id: id, el: section });
    });
    if (!sections.length) return;

    var active = null;
    function setActive(id) {
        if (id === active) return;
        active = id;
        tocLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        },
        { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { observer.observe(s.el); });
}

// Fade the guide's quick-start cards up into view on scroll. Reduced-motion
// users and browsers without IntersectionObserver just see the cards
// immediately — the "anim-ready" class (which hides them pre-animation) is
// only ever added once we know we can also reveal them again.
function initQuickStartAnimation() {
    var grid = document.querySelector(".quickstart-grid");
    if (!grid || !("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    grid.classList.add("anim-ready");
    var observer = new IntersectionObserver(
        function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    grid.classList.add("in-view");
                    obs.disconnect();
                }
            });
        },
        { threshold: 0.15 }
    );
    observer.observe(grid);
}

// Accordion "Expand all" / "Collapse all" controls, plus auto-opening the
// right <details> when arriving via a #hash link (e.g. from another page).
function initAccordion() {
    var items = document.querySelectorAll("details.acc-item");
    if (!items.length) return;

    var expandAll = document.getElementById("acc-expand-all");
    var collapseAll = document.getElementById("acc-collapse-all");
    if (expandAll) expandAll.addEventListener("click", function () {
        items.forEach(function (d) { d.open = true; });
    });
    if (collapseAll) collapseAll.addEventListener("click", function () {
        items.forEach(function (d) { d.open = false; });
    });

    function openFromHash() {
        var id = window.location.hash.slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        var details = target.closest ? target.closest("details.acc-item") : null;
        if (details) {
            details.open = true;
            details.scrollIntoView({ block: "start" });
        }
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
}
