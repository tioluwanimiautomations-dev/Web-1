/**
 * PracticeOp site-wide behaviour (vanilla).
 * Mobile menu · scroll reveal · example phones · pinned walkthrough
 * Based on ST AI Agency (StrivioThemes, MIT).
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- mobile menu ---------- */
const menu = document.getElementById('mob');
const burger = document.getElementById('burger');
const closeBtn = document.getElementById('mobX');

if (menu && burger && closeBtn) {
  const focusables = () =>
    Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter((el) => el.offsetParent !== null);

  let hideTimer: number | undefined;

  const open = () => {
    window.clearTimeout(hideTimer);
    menu.hidden = false;
    // force a style flush so the opacity/transform transition runs from the closed state,
    // and so the close button is visible (focusable) before we move focus to it
    void menu.offsetWidth;
    menu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    closeBtn.focus();
  };

  const close = (returnFocus = true) => {
    if (menu.hidden) return;
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    hideTimer = window.setTimeout(() => (menu.hidden = true), reduceMotion.matches ? 0 : 350);
    if (returnFocus) burger.focus();
  };

  burger.addEventListener('click', open);
  closeBtn.addEventListener('click', () => close());
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => close(false)));

  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    // keep keyboard focus inside the open dialog
    if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // menu is only for narrow screens — close it if the viewport grows past the breakpoint
  window.matchMedia('(min-width: 1201px)').addEventListener('change', (mq) => mq.matches && close(false));
}

/* ---------- scroll reveal ---------- */
const reveal = document.querySelectorAll<HTMLElement>('.rv');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' },
  );
  reveal.forEach((el) => io.observe(el));
} else {
  reveal.forEach((el) => el.classList.add('in'));
}

/* ---------- example phones: language switch and Approve / Decline ----------
 * Without JavaScript both languages and both outcomes stay visible.
 */
document.querySelectorAll<HTMLElement>('[data-caller-phone]').forEach((phone) => {
  const buttons = phone.querySelectorAll<HTMLButtonElement>('[data-lang]');
  const show = (lang: string) => {
    phone.querySelectorAll<HTMLElement>('[data-greet]').forEach((el) => (el.hidden = el.dataset.greet !== lang));
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  };
  buttons.forEach((b) => b.addEventListener('click', () => show(b.dataset.lang ?? 'en')));
  show('en');
});

document.querySelectorAll<HTMLElement>('[data-attorney-phone]').forEach((phone) => {
  const buttons = phone.querySelectorAll<HTMLButtonElement>('[data-choice]');
  const outcomes = phone.querySelectorAll<HTMLElement>('[data-outcome]');
  outcomes.forEach((o) => (o.hidden = true));
  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      outcomes.forEach((o) => (o.hidden = o.dataset.outcome !== b.dataset.choice));
      buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }),
  );
});

/* ---------- pinned walkthrough ----------
 * Ported from Lapse (agnilem/lapse-astro, MIT, src/scripts/fx/step-scroll.js) with a calmer
 * entry: smaller travel and tilt. While the stage is sticky, each card enters from the right,
 * holds, then leaves to the left, and its step number lights up.
 */
const IN_END = 0.34;
const OUT_START = 0.84;
const ENTER_X = 220;
const EXIT_X = -200;
const TILT = 6;

function lerp(u: number, stops: number[], values: number[]): number {
  if (u <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (u <= stops[i]) {
      const t = (u - stops[i - 1]) / (stops[i] - stops[i - 1] || 1);
      return values[i - 1] + (values[i] - values[i - 1]) * t;
    }
  }
  return values[values.length - 1];
}

document.querySelectorAll<HTMLElement>('[data-walk]').forEach((section) => {
  const stage = section.querySelector<HTMLElement>('.walk__stage');
  const slides = Array.from(section.querySelectorAll<HTMLElement>('[data-slide]'));
  const nums = Array.from(section.querySelectorAll<HTMLElement>('[data-num]'));
  if (!stage || !slides.length) return;
  const count = slides.length;
  const tracks = slides.map((_, i) => {
    const first = i === 0;
    const last = i === count - 1;
    return {
      stops: first ? [OUT_START, 1] : last ? [0, IN_END] : [0, IN_END, OUT_START, 1],
      xs: first ? [0, EXIT_X] : last ? [ENTER_X, 0] : [ENTER_X, 0, 0, EXIT_X],
      rs: first ? [0, -TILT] : last ? [TILT, 0] : [TILT, 0, 0, -TILT],
      fadeStops: first ? [OUT_START, 1] : last ? [0, 0.2] : [0, 0.2, OUT_START, 1],
      fades: first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0],
    };
  });

  let frame = 0;
  const update = () => {
    frame = 0;
    const pinned = getComputedStyle(stage).position === 'sticky';
    section.classList.toggle('is-pinned', pinned);
    if (!pinned) return;
    const rect = section.getBoundingClientRect();
    const travel = rect.height - stage.getBoundingClientRect().height;
    if (travel <= 0) return;
    const p = Math.min(1, Math.max(0, -rect.top / travel));
    slides.forEach((el, i) => {
      const u = p * count - i;
      const k = tracks[i];
      const op = lerp(u, k.fadeStops, k.fades);
      el.style.opacity = String(op);
      el.style.visibility = op < 0.02 ? 'hidden' : 'visible';
      el.style.transform = 'translateX(' + lerp(u, k.stops, k.xs) + 'px) rotate(' + lerp(u, k.stops, k.rs) + 'deg)';
      if (nums[i]) nums[i].style.opacity = String(op);
    });
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
});
