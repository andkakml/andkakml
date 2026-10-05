/* =========================================================
   AKMAL'S — PORTFOLIO SCRIPT

   Dimuat dengan <script defer>, jadi semua modul di bawah
   berjalan setelah HTML selesai di-parse.

   Daftar modul:
    1. NAVBAR INTRO            6. HERO PARALLAX + ENJOYNEERING TRAIL
    2. MOBILE NAVIGATION       7. CUSTOM CURSOR
    3. ACTIVE NAVIGATION       8. VINYL PLATTER
    4. MOBILE HERO CODE PANEL  9. SCROLL REVEAL
    5. PROJECT DETAIL MODAL   10. CONTACT FORM
                              11. LANGUAGE SWITCHER
========================================================= */

/* =========================================================
   CONFIG — ISI BAGIAN INI SEBELUM DEPLOY
   Form kontak memakai salah satu dari dua opsi berikut:
     formEndpoint : URL layanan form, mis. Formspree
                    "https://formspree.io/f/xxxxxxxx"
     contactEmail : cadangan; membuka aplikasi email pengunjung
   Jika keduanya kosong, form menampilkan pesan error
   (isi form tidak dihapus) dan TIDAK berpura-pura terkirim.
========================================================= */
const SITE_CONFIG = {
    formEndpoint: "",
    contactEmail: ""
};

/* State bersama antar modul. */
const appState = {
    activeProjectCard: null
};

/* =========================================================
   NAVBAR INTRO
   AKMAL'S appears first. After a short pause it moves left while
   navigation emerges from around its right side.
   Mobile skips the intro for a faster first paint.
========================================================= */
window.addEventListener("load", () => {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    const isMobile = window.matchMedia("(max-width: 760px)").matches;

    // Desktop keeps the original intro. Mobile skips it for faster first paint.
    if (isMobile) {
        navbar.classList.add("nav-ready");
        return;
    }

    // Let the centered brand breathe first, then expand the navigation.
    setTimeout(() => {
        navbar.classList.add("nav-ready");
    }, 1550);
});

/* =========================================================
   MOBILE NAVIGATION
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("mobileMenu");
    const mobileLinks = menu ? [...menu.querySelectorAll(".mobile-link")] : [];

    if (!navbar || !toggle || !menu) return;

    const closeMenu = () => {
        navbar.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        menu.setAttribute("aria-hidden", "true");
    };

    toggle.addEventListener("click", () => {
        const open = navbar.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        menu.setAttribute("aria-hidden", String(!open));
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
        if (!navbar.contains(event.target)) closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) closeMenu();
    }, { passive: true });
});

/* =========================================================
   ACTIVE NAVIGATION
   Hero is a neutral state: no section link stays underlined.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = [...document.querySelectorAll(".nav-link")];
    const hero = document.getElementById("home");
    const sections = [
        document.getElementById("about"),
        document.getElementById("projects"),
        document.getElementById("contact")
    ].filter(Boolean);

    const setActive = id => {
        navLinks.forEach(link => {
            link.classList.toggle(
                "is-active",
                Boolean(id) && link.getAttribute("href") === `#${id}`
            );
        });
    };

    if (hero) {
        const heroObserver = new IntersectionObserver(entries => {
            const entry = entries[0];
            if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
                setActive(null);
            }
        }, {
            threshold: [0.45, 0.6, 0.8]
        });

        heroObserver.observe(hero);
    }

    const sectionObserver = new IntersectionObserver(entries => {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        setActive(visible.target.id);
    }, {
        threshold: [0.25, 0.5, 0.75]
    });

    sections.forEach(section => sectionObserver.observe(section));
});

document.addEventListener("DOMContentLoaded", () => {
    const brandHome = document.getElementById("brandHome");
    const navLinks = [...document.querySelectorAll(".nav-link")];

    brandHome?.addEventListener("click", () => {
        navLinks.forEach(link => link.classList.remove("is-active"));
    });
});

/* =========================================================
   MOBILE HERO CODE PANEL
   Menggandakan stream kode dekoratif untuk loop animasi CSS.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".terminal-track");
    const stream = track?.querySelector(".terminal-stream");
    if (!track || !stream || track.querySelectorAll(".terminal-stream").length > 1) return;

    // Stream kedua dibutuhkan agar loop CSS mulus; cukup tulis markup-nya sekali di HTML.
    const copy = stream.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
});

/* =========================================================
   PROJECT DETAIL MODAL
   Termasuk focus trap dan pengembalian fokus saat ditutup.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("projectModal");
    const closeButton = document.getElementById("projectModalClose");
    const modalMedia = document.getElementById("projectModalMedia");
    const modalKicker = document.getElementById("projectModalKicker");
    const modalTitle = document.getElementById("projectModalTitle");
    const modalDescription = document.getElementById("projectModalDescription");
    const modalTags = document.getElementById("projectModalTags");
    const cards = [...document.querySelectorAll(".project-card")];

    if (!modal || !cards.length) return;

    let lastFocused = null;

    const openProject = card => {
        const sourceImage = card.querySelector(".project-media img");
        const media = card.querySelector(".project-media");

        modalKicker.textContent = card.dataset.kicker || "SELECTED WORK";
        modalTitle.textContent = card.dataset.title || "PROJECT";
        modalDescription.textContent = card.dataset.description || "";
        modalTags.textContent = card.dataset.tags || "";
        modalMedia.innerHTML = "";
        modalMedia.style.background = getComputedStyle(media).background;

        if (sourceImage?.getAttribute("src")) {
            const image = document.createElement("img");
            image.src = sourceImage.src;
            image.alt = sourceImage.alt || "";
            modalMedia.appendChild(image);
        }

        lastFocused = document.activeElement;
        appState.activeProjectCard = card;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        // focus() gagal bila elemen masih visibility:hidden (transisi), jadi tunda sebentar.
        window.setTimeout(() => closeButton?.focus(), 60);
    };

    const closeProject = () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        // Kembalikan fokus ke kartu yang membuka modal.
        if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
        lastFocused = null;
    };

    cards.forEach(card => {
        card.addEventListener("click", () => openProject(card));
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProject(card);
            }
        });
    });

    closeButton?.addEventListener("click", closeProject);
    modal.addEventListener("click", event => {
        if (event.target === modal) closeProject();
    });
    document.addEventListener("keydown", event => {
        if (!modal.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            closeProject();
            return;
        }

        // Focus trap: Tab tidak boleh keluar dari modal selama terbuka.
        if (event.key === "Tab") {
            const focusable = [...modal.querySelectorAll(
                'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
            )].filter(element => !element.disabled);

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (!modal.contains(document.activeElement)) {
                event.preventDefault();
                first.focus();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
});

/* =========================================================
   SUBTLE HERO PARALLAX
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".hero");
    const heroPhoto = document.querySelector(".hero-photo");

    if (!hero || !heroPhoto || matchMedia("(pointer: coarse)").matches || window.innerWidth <= 760) return;

    hero.addEventListener("pointermove", event => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        heroPhoto.style.transform = `translate3d(${x * 7}px, ${y * 5}px, 0)`;
    });

    hero.addEventListener("pointerleave", () => {
        heroPhoto.style.transform = "translate3d(0,0,0)";
    });
});

/* =========================================================
   ENJOYNEERING CURSOR TRAIL
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const heroPhoto = document.querySelector(".hero-photo");
    const trail = document.getElementById("enjoyTrail");

    if (!heroPhoto || !trail || matchMedia("(pointer: coarse)").matches) {
        return;
    }

    let lastX = -999;
    let lastY = -999;
    let lastSpawn = 0;
    let spawnCount = 0;

    const spawnWord = (x, y) => {
        const word = document.createElement("span");
        word.className = "enjoy-word";
        word.textContent = "enjoyneering";

        const rotation = (Math.random() * 18) - 9;
        const scale = .9 + Math.random() * .25;
        word.style.left = `${x}px`;
        word.style.top = `${y}px`;
        word.style.setProperty("--r", `${rotation}deg`);
        word.style.transform =
            `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;

        trail.appendChild(word);

        word.addEventListener("animationend", () => {
            word.remove();
        }, { once: true });
    };

    heroPhoto.addEventListener("pointerenter", event => {
        heroPhoto.classList.add("is-enjoying");
        const rect = heroPhoto.getBoundingClientRect();
        lastX = event.clientX - rect.left;
        lastY = event.clientY - rect.top;
        spawnWord(lastX, lastY);
    });

    heroPhoto.addEventListener("pointermove", event => {
        const rect = heroPhoto.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const now = performance.now();
        const distance = Math.hypot(x - lastX, y - lastY);

        // Spawn along the cursor path, but not so often that it becomes noisy.
        if (distance >= 48 && now - lastSpawn >= 145) {
            spawnWord(x, y);
            lastX = x;
            lastY = y;
            lastSpawn = now;
            spawnCount++;
        }
    });

    heroPhoto.addEventListener("pointerleave", () => {
        heroPhoto.classList.remove("is-enjoying");
    });
});

/* =========================================================
   CUSTOM CURSOR
   Loop animasi berhenti otomatis saat kursor diam.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById("customCursor");
    if (!cursor || matchMedia("(pointer: coarse)").matches) return;

    let mouseX = -100, mouseY = -100;
    let currentX = -100, currentY = -100;

    // Loop animasi hanya berjalan saat kursor bergerak / baru berubah state,
    // lalu berhenti sendiri ketika sudah diam (hemat CPU & baterai).
    let rafId = null;
    let lastActivity = 0;

    const follow = () => {
        currentX += (mouseX - currentX) * .18;
        currentY += (mouseY - currentY) * .18;
        cursor.style.transform = `translate3d(${currentX - cursor.offsetWidth / 2}px, ${currentY - cursor.offsetHeight / 2}px, 0)`;

        const settled = Math.abs(mouseX - currentX) < .1 && Math.abs(mouseY - currentY) < .1;
        if (settled && performance.now() - lastActivity > 450) {
            rafId = null;
            return;
        }
        rafId = requestAnimationFrame(follow);
    };

    const wake = () => {
        lastActivity = performance.now();
        if (rafId === null) rafId = requestAnimationFrame(follow);
    };

    window.addEventListener("pointermove", event => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        wake();
    });

    const refreshTargets = () => document.querySelectorAll(
        "a, button, .project-card, .vinyl-drag, .role, input, textarea"
    );

    refreshTargets().forEach(element => {
        element.addEventListener("pointerenter", () => { cursor.classList.add("is-hover"); wake(); });
        element.addEventListener("pointerleave", () => { cursor.classList.remove("is-hover"); wake(); });
    });

    window.addEventListener("pointerdown", () => { cursor.classList.add("is-click"); wake(); });
    window.addEventListener("pointerup", () => { cursor.classList.remove("is-click"); wake(); });
});

/* =========================================================
   VINYL / DJ PLATTER INTERACTION
   Idle: slow continuous spin (berhenti jika di luar layar / reduced motion).
   Drag: rotate the platter directly around its center.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const vinyl = document.querySelector(".vinyl-drag");
    const record = vinyl?.querySelector(".vinyl-record");

    if (!vinyl || !record) return;

    let rotation = 0;
    let dragging = false;
    let startPointerAngle = 0;
    let startRotation = 0;
    let lastPointerAngle = 0;
    let lastTime = performance.now();
    let dragVelocity = 0;

    const idleSpeed = 45; // degrees per second
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const toDegrees = radians => radians * 180 / Math.PI;

    const pointerAngle = event => {
        const rect = vinyl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        return Math.atan2(
            event.clientY - centerY,
            event.clientX - centerX
        );
    };

    const shortestAngleDelta = (from, to) => {
        let delta = to - from;

        while (delta > Math.PI) delta -= Math.PI * 2;
        while (delta < -Math.PI) delta += Math.PI * 2;

        return delta;
    };

    const render = () => {
        record.style.setProperty("--rotation", `${rotation}deg`);
    };

    // Loop hanya jalan saat piringan hitam terlihat di layar.
    let onScreen = true;
    let looping = false;

    const spinLoop = now => {
        if (!onScreen) {
            looping = false;
            return;
        }

        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        if (!dragging && !reducedMotion.matches) {
            rotation += idleSpeed * dt;
        }

        render();
        requestAnimationFrame(spinLoop);
    };

    const startLoop = () => {
        if (looping) return;
        looping = true;
        lastTime = performance.now();
        requestAnimationFrame(spinLoop);
    };

    vinyl.addEventListener("pointerdown", event => {
        dragging = true;
        vinyl.classList.add("is-dragging");
        vinyl.setPointerCapture(event.pointerId);

        startPointerAngle = pointerAngle(event);
        lastPointerAngle = startPointerAngle;
        startRotation = rotation;
        dragVelocity = 0;
        lastTime = performance.now();
    });

    vinyl.addEventListener("pointermove", event => {
        if (!dragging) return;

        const now = performance.now();
        const currentAngle = pointerAngle(event);
        const delta = shortestAngleDelta(startPointerAngle, currentAngle);
        const nextRotation = startRotation + toDegrees(delta);

        const deltaForVelocity = shortestAngleDelta(
            lastPointerAngle,
            currentAngle
        );

        const dt = Math.max((now - lastTime) / 1000, 0.001);
        dragVelocity = toDegrees(deltaForVelocity) / dt;

        rotation = nextRotation;
        lastPointerAngle = currentAngle;
        lastTime = now;

        render();
    });

    const stopDragging = event => {
        if (!dragging) return;

        dragging = false;
        vinyl.classList.remove("is-dragging");

        try {
            vinyl.releasePointerCapture(event.pointerId);
        } catch (_) {
            /* Pointer capture can already be released. */
        }

        // Tiny momentum, like a real DJ platter.
        const momentum = Math.max(
            -360,
            Math.min(360, dragVelocity * 0.08)
        );

        const startMomentum = performance.now();
        const momentumDuration = 260;
        const momentumStart = rotation;

        const easeOut = t => 1 - Math.pow(1 - t, 3);

        const momentumFrame = now => {
            const progress = Math.min(
                (now - startMomentum) / momentumDuration,
                1
            );

            rotation =
                momentumStart +
                momentum * easeOut(progress);

            render();

            if (progress < 1) {
                requestAnimationFrame(momentumFrame);
            }
        };

        requestAnimationFrame(momentumFrame);
    };

    vinyl.addEventListener("pointerup", stopDragging);
    vinyl.addEventListener("pointercancel", stopDragging);

    new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) startLoop();
    }).observe(vinyl);

    startLoop();
});

/* =========================================================
   SCROLL REVEAL
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

    /* About: continuous first-word -> last-word opacity highlight. */
    /* Continuous karaoke-style About animation. */
    const lyricWords = document.querySelectorAll(".lyric-word");
    lyricWords.forEach((word, index) => {
        word.style.setProperty("--lyric-index", index);
    });

    const elements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px"
    });

    elements.forEach(element => observer.observe(element));
});

/* =========================================================
   CONTACT FORM
   Lihat SITE_CONFIG di atas.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form");
    const toast = document.getElementById("contactToast");
    const closeToast = document.querySelector(".toast-close");
    const toastTitle = toast?.querySelector(".toast-copy strong");
    const toastCopy = toast?.querySelector(".toast-copy small");
    const submitButton = form?.querySelector(".contact-submit");

    if (!form || !toast) return;

    const MESSAGES = {
        en: {
            successTitle: "MESSAGE SENT",
            successCopy: "Thank you! I'll get back to you soon.",
            mailtoTitle: "OPENING YOUR EMAIL APP",
            mailtoCopy: "Press send in your email app to deliver the message.",
            errorTitle: "MESSAGE NOT SENT",
            errorCopy: "Something went wrong. Please try again in a moment.",
            notConfiguredCopy: "The contact form isn't connected yet."
        },
        id: {
            successTitle: "PESAN TERKIRIM",
            successCopy: "Terima kasih! Saya akan segera membalas.",
            mailtoTitle: "MEMBUKA APLIKASI EMAIL",
            mailtoCopy: "Tekan kirim di aplikasi email untuk mengirim pesan.",
            errorTitle: "PESAN BELUM TERKIRIM",
            errorCopy: "Terjadi kesalahan. Coba lagi sebentar lagi.",
            notConfiguredCopy: "Formulir kontak belum terhubung."
        }
    };

    const text = () => MESSAGES[document.documentElement.lang === "id" ? "id" : "en"];

    let toastTimer;

    const hideToast = () => {
        toast.classList.remove("is-visible");
        toast.classList.add("is-hiding");
        toast.setAttribute("aria-hidden", "true");

        window.setTimeout(() => {
            toast.classList.remove("is-hiding");
        }, 500);
    };

    const showToast = (title, copy, isError = false) => {
        window.clearTimeout(toastTimer);
        if (toastTitle) toastTitle.textContent = title;
        if (toastCopy) toastCopy.textContent = copy;
        toast.classList.toggle("is-error", isError);
        toast.classList.remove("is-hiding");
        toast.classList.add("is-visible");
        toast.setAttribute("aria-hidden", "false");
        toastTimer = window.setTimeout(hideToast, 4200);
    };

    const setBusy = busy => {
        form.setAttribute("aria-busy", String(busy));
        if (submitButton) submitButton.disabled = busy;
    };

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const t = text();
        const data = new FormData(form);

        // 1) Layanan form (mis. Formspree) -> kirim lewat fetch
        if (SITE_CONFIG.formEndpoint) {
            setBusy(true);
            try {
                const response = await fetch(SITE_CONFIG.formEndpoint, {
                    method: "POST",
                    body: data,
                    headers: { Accept: "application/json" }
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                showToast(t.successTitle, t.successCopy);
                form.reset();
            } catch (error) {
                console.error("Contact form error:", error);
                showToast(t.errorTitle, t.errorCopy, true);
            } finally {
                setBusy(false);
            }
            return;
        }

        // 2) Fallback: buka aplikasi email pengunjung (mailto)
        if (SITE_CONFIG.contactEmail) {
            const subject = data.get("subject") || `Portfolio message from ${data.get("name")}`;
            const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`;

            window.location.href =
                `mailto:${SITE_CONFIG.contactEmail}` +
                `?subject=${encodeURIComponent(subject)}` +
                `&body=${encodeURIComponent(body)}`;

            showToast(t.mailtoTitle, t.mailtoCopy);
            form.reset();
            return;
        }

        // 3) Belum dikonfigurasi: jangan pura-pura terkirim, dan jangan hapus isi form.
        console.warn("Contact form: set SITE_CONFIG.formEndpoint or SITE_CONFIG.contactEmail in script.js.");
        showToast(t.errorTitle, t.notConfiguredCopy, true);
    });

    closeToast?.addEventListener("click", hideToast);
});

/* =========================================================
   LANGUAGE SWITCHER
   Default: English. Switches visible copy between English / Indonesian.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const languageSwitch = document.getElementById("languageSwitch");
    if (!languageSwitch) return;

    const navbar = document.getElementById("navbar");
    const options = [...languageSwitch.querySelectorAll(".lang-option")];

    const navLinks = [...document.querySelectorAll(".nav-link, .nav-contact")];
    const mobileLinks = [...document.querySelectorAll(".mobile-link")];
    const heroSubtitle = document.querySelector(".hero-subtitle");
    const roles = [...document.querySelectorAll(".role")];
    const aboutHeading = document.querySelector(".about-heading");
    const aboutLyric = document.querySelector(".about-lyric");
    const skillLabels = [...document.querySelectorAll(".skill-label")];
    const projectsKicker = document.querySelector(".projects-head .contact-kicker");
    const projectsTitle = document.querySelector(".projects-title");
    const projectsIntro = document.querySelector(".projects-intro");
    const projectCards = [...document.querySelectorAll(".project-card")];

    const contactKicker = document.querySelector(".contact-intro .contact-kicker");
    const contactTitle = document.querySelector(".contact-title");
    const contactCopy = document.querySelector(".contact-copy");
    const formLabels = {
        name: document.querySelector('label[for="contact-name"]'),
        email: document.querySelector('label[for="contact-email"]'),
        subject: document.querySelector('label[for="contact-subject"]'),
        message: document.querySelector('label[for="contact-message"]')
    };
    const inputs = {
        name: document.getElementById("contact-name"),
        email: document.getElementById("contact-email"),
        subject: document.getElementById("contact-subject"),
        message: document.getElementById("contact-message")
    };
    const submitButton = document.querySelector(".contact-submit span:first-child");
    const toastClose = document.querySelector(".toast-close");
    const footerCopy = document.querySelector(".footer-copy");
    const projectModal = document.getElementById("projectModal");
    const projectModalKicker = document.getElementById("projectModalKicker");
    const projectModalTitle = document.getElementById("projectModalTitle");
    const projectModalDescription = document.getElementById("projectModalDescription");
    const projectModalTags = document.getElementById("projectModalTags");
    const projectModalMetaLabels = [...document.querySelectorAll(".modal-meta-label")];
    const projectModalRole = document.querySelectorAll(".modal-meta-value")[1];
    const projectModalStatus = document.querySelectorAll(".modal-meta-value")[2];
    const projectModalClose = document.getElementById("projectModalClose");

    const originalProjectCards = projectCards.map(card => ({
        card,
        number: card.querySelector(".project-number"),
        name: card.querySelector(".project-name"),
        tags: card.querySelector(".project-tags"),
        en: {
            title: card.dataset.title || "PROJECT",
            kicker: card.dataset.kicker || "SELECTED WORK",
            tags: card.dataset.tags || "",
            description: card.dataset.description || "",
            aria: card.getAttribute("aria-label") || ""
        }
    }));

    const translations = {
        en: {
            nav: ["ABOUT", "PROJECT", "CONTACT"],
            heroSubtitle: "Informatics Engineering.",
            roles: ["UI/UX Designer", "Frontend Engineer", "HTML", "Laravel", "Python", "Java", "C++", "JavaScript"],
            aboutHeading: "ABOUT",
            aboutLyric: [
                ["I", "GRADUATED", "FROM", "MARHAS"],
                ["MARGAHAYU", "VOCATIONAL"],
                ["MAJORING", "IN", "COMPUTER", "ENGINEERING"],
                ["&", "I", "CAN", "WORK", "BOTH", "IN", "TEAMS", "AND", "I'M"],
                ["PROFICIENT", "IN", "OPERATING"],
                ["COMPUTERS", "AND", "VARIOUS", "SOFTWARE."]
            ],
            skillLabels: ["UI/UX Design", "Programming", "Editing"],
            projectsKicker: "SELECTED WORK / 01—04",
            projectsTitle: "PROJECTS.",
            projectsIntro: "A collection of interfaces, web experiences and digital work. The layout intentionally breaks the usual portfolio card grid to keep the presentation visual and editorial.",
            cardName: "PROJECT NAME",
            contactKicker: "LET'S CONNECT",
            contactTitle: ["LET'S", "TALK."],
            contactCopy: "Tell me a little about your project, idea, or collaboration. I’ll get back to you through the contact details you provide.",
            labels: ["Name", "Email", "Subject", "Message"],
            placeholders: ["Your name", "you@example.com", "Project / collaboration", "Tell me about your project..."],
            send: "Send message",
            footer: "© 2026 Akmal's. All rights reserved.",
            modalMeta: ["Tools", "Role", "Status"],
            modalRole: "UI/UX Designer · Frontend",
            modalStatus: "Selected work",
            modalClose: "Close project details",
            title: "Andika Akmal Ramadhan — UI/UX Designer & Frontend Engineer"
        },
        id: {
            nav: ["TENTANG", "PROYEK", "KONTAK"],
            heroSubtitle: "Teknik Informatika.",
            roles: ["Desainer UI/UX", "Frontend Engineer", "HTML", "Laravel", "Python", "Java", "C++", "JavaScript"],
            aboutHeading: "TENTANG",
            aboutLyric: [
                ["SAYA", "LULUS", "DARI"],
                ["SMK", "MARHAS", "MARGAHAYU"],
                ["JURUSAN", "TEKNIK", "KOMPUTER"],
                ["&", "SAYA", "DAPAT", "BEKERJA", "DALAM", "TIM"],
                ["DAN", "MAHIR", "MENGOPERASIKAN"],
                ["KOMPUTER", "SERTA", "BERBAGAI", "PERANGKAT", "LUNAK."]
            ],
            skillLabels: ["Desain UI/UX", "Pemrograman", "Penyuntingan"],
            projectsKicker: "KARYA PILIHAN / 01—04",
            projectsTitle: "PROYEK.",
            projectsIntro: "Kumpulan antarmuka, pengalaman web, dan karya digital. Tata letak ini sengaja memecah pola grid portofolio agar tampil lebih visual dan editorial.",
            cardName: "NAMA PROYEK",
            contactKicker: "MARI TERHUBUNG",
            contactTitle: ["MARI", "BICARA."],
            contactCopy: "Ceritakan sedikit tentang proyek, ide, atau kolaborasi yang kamu miliki. Saya akan menghubungi kembali melalui detail kontak yang kamu berikan.",
            labels: ["Nama", "Email", "Subjek", "Pesan"],
            placeholders: ["Nama kamu", "kamu@example.com", "Proyek / kolaborasi", "Ceritakan tentang proyek kamu..."],
            send: "Kirim pesan",
            footer: "© 2026 Akmal's. Seluruh hak dilindungi.",
            modalMeta: ["Alat", "Peran", "Status"],
            modalRole: "Desainer UI/UX · Frontend",
            modalStatus: "Karya pilihan",
            modalClose: "Tutup detail proyek",
            title: "Andika Akmal Ramadhan — Desainer UI/UX & Frontend Engineer"
        }
    };

    const projectTranslations = {
        en: {
            1: {
                title: "Web Experience",
                kicker: "01 / UI · WEB",
                tags: "UI/UX · Figma · Frontend",
                description: "A digital interface focused on hierarchy, visual rhythm, and responsive interaction.",
                aria: "Open Web Experience project details"
            },
            2: {
                title: "Visual Identity",
                kicker: "02 / BRAND",
                tags: "Identity · Visual Design",
                description: "A visual direction exploring typography, composition, and a consistent digital identity.",
                aria: "Open Visual Identity project details"
            },
            3: {
                title: "Frontend Build",
                kicker: "03 / FRONTEND",
                tags: "HTML · CSS · JavaScript",
                description: "A frontend implementation translating a visual concept into a polished interactive web page.",
                aria: "Open Frontend Build project details"
            },
            4: {
                title: "Creative Project",
                kicker: "04 / OTHER",
                tags: "Creative · Digital",
                description: "An experimental digital piece combining layout, motion, and visual storytelling.",
                aria: "Open Creative Project project details"
            }
        },
        id: {
            1: {
                title: "Pengalaman Web",
                kicker: "01 / UI · WEB",
                tags: "UI/UX · Figma · Frontend",
                description: "Antarmuka digital yang berfokus pada hierarki, ritme visual, dan interaksi responsif.",
                aria: "Buka detail proyek Pengalaman Web"
            },
            2: {
                title: "Identitas Visual",
                kicker: "02 / MEREK",
                tags: "Identitas · Desain Visual",
                description: "Eksplorasi arah visual melalui tipografi, komposisi, dan identitas digital yang konsisten.",
                aria: "Buka detail proyek Identitas Visual"
            },
            3: {
                title: "Implementasi Frontend",
                kicker: "03 / FRONTEND",
                tags: "HTML · CSS · JavaScript",
                description: "Implementasi frontend yang menerjemahkan konsep visual menjadi halaman web interaktif yang rapi.",
                aria: "Buka detail proyek Implementasi Frontend"
            },
            4: {
                title: "Proyek Kreatif",
                kicker: "04 / LAINNYA",
                tags: "Kreatif · Digital",
                description: "Eksperimen digital yang menggabungkan tata letak, gerakan, dan storytelling visual.",
                aria: "Buka detail proyek Proyek Kreatif"
            }
        }
    };

    const setAnimatedNavText = (element, value) => {
        if (!element) return;
        element.setAttribute("aria-label", value);
        element.innerHTML = [...value].map((char, index) => {
            const safe = char === " " ? "&nbsp;" : char;
            return `<span class="nav-letter" aria-hidden="true" style="--i:${index}">${safe}</span>`;
        }).join("");
    };

    const setAboutLyric = (linesData) => {
        if (!aboutLyric) return;

        aboutLyric.innerHTML = linesData.map(line =>
            `<span class="lyric-line">${
                line.map(word => `<span class="lyric-word">${word}</span>`).join("")
            }</span>`
        ).join("");

        aboutLyric.querySelectorAll(".lyric-word").forEach((word, index) => {
            word.style.setProperty("--lyric-index", index);
        });
    };

    const applyLanguage = language => {
        const t = translations[language] || translations.en;

        document.documentElement.lang = language;
        document.title = t.title;

        navLinks.forEach((link, index) => setAnimatedNavText(link, t.nav[index]));
        mobileLinks.forEach((link, index) => {
            link.textContent = t.nav[index];
        });

        if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;

        roles.forEach((role, index) => {
            if (t.roles[index]) role.textContent = t.roles[index];
        });

        if (aboutHeading) aboutHeading.textContent = t.aboutHeading;
        setAboutLyric(t.aboutLyric);

        skillLabels.forEach((label, index) => {
            if (t.skillLabels[index]) label.textContent = t.skillLabels[index];
        });

        if (projectsKicker) projectsKicker.textContent = t.projectsKicker;
        if (projectsTitle) projectsTitle.textContent = t.projectsTitle;
        if (projectsIntro) projectsIntro.textContent = t.projectsIntro;

        originalProjectCards.forEach(({card, number, name, tags}, index) => {
            const project = projectTranslations[language][index + 1];
            if (!project) return;

            number.textContent = project.kicker;
            name.textContent = t.cardName;
            tags.textContent = project.tags;

            card.dataset.title = project.title;
            card.dataset.kicker = project.kicker;
            card.dataset.tags = project.tags;
            card.dataset.description = project.description;
            card.setAttribute("aria-label", project.aria);
        });

        if (contactKicker) contactKicker.textContent = t.contactKicker;
        if (contactTitle) {
            const spans = contactTitle.querySelectorAll("span");
            spans.forEach((span, index) => {
                if (t.contactTitle[index]) span.textContent = t.contactTitle[index];
            });
        }
        if (contactCopy) contactCopy.textContent = t.contactCopy;

        const labelValues = Object.values(formLabels);
        labelValues.forEach((label, index) => {
            if (label && t.labels[index]) label.textContent = t.labels[index];
        });

        inputs.name?.setAttribute("placeholder", t.placeholders[0]);
        inputs.email?.setAttribute("placeholder", t.placeholders[1]);
        inputs.subject?.setAttribute("placeholder", t.placeholders[2]);
        inputs.message?.setAttribute("placeholder", t.placeholders[3]);

        if (submitButton) submitButton.textContent = t.send;
        if (toastClose) toastClose.setAttribute("aria-label", language === "id" ? "Tutup notifikasi" : "Close notification");
        if (footerCopy) footerCopy.textContent = t.footer;

        projectModalMetaLabels.forEach((label, index) => {
            if (t.modalMeta[index]) label.textContent = t.modalMeta[index];
        });
        if (projectModalRole) projectModalRole.textContent = t.modalRole;
        if (projectModalStatus) projectModalStatus.textContent = t.modalStatus;
        if (projectModalClose) projectModalClose.setAttribute("aria-label", t.modalClose);

        // Keep an already-open project modal synchronized with the selected language.
        if (projectModal?.classList.contains("is-open")) {
            const activeCard = appState.activeProjectCard;
            if (activeCard) {
                const projectIndex = Number(activeCard.dataset.project);
                const current = projectTranslations[language][projectIndex];
                if (current) {
                    if (projectModalKicker) projectModalKicker.textContent = current.kicker;
                    if (projectModalTitle) projectModalTitle.textContent = current.title;
                    if (projectModalDescription) projectModalDescription.textContent = current.description;
                    if (projectModalTags) projectModalTags.textContent = current.tags;
                }
            }
        }

        options.forEach(option => {
            const active = option.dataset.lang === language;
            option.classList.toggle("is-active", active);
            option.setAttribute("aria-pressed", active ? "true" : "false");
        });

        languageSwitch.setAttribute(
            "aria-label",
            language === "id" ? "Pilih bahasa, Indonesia aktif" : "Language selector, English active"
        );
    };

    options.forEach(option => {
        option.addEventListener("click", () => {
            const language = option.dataset.lang;
            if (!translations[language]) return;
            applyLanguage(language);
        });
    });

    // Default language remains English on each fresh page load.
    applyLanguage("en");
});
