/**
 * PracticeOp site-wide behaviour (vanilla).
 * Mobile menu · scroll reveal · example phones and hero deck · walkthrough · sticky booking bar
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
  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      show(b.dataset.lang ?? 'en');
      // switching language mid-playback simply shows the whole call
      phone.querySelectorAll('.seq').forEach((el) => el.classList.add('on'));
      phone.querySelector('.typing')?.classList.remove('show');
    }),
  );
  show('en');
});

document.querySelectorAll<HTMLElement>('[data-attorney-phone]').forEach((phone) => {
  const buttons = phone.querySelectorAll<HTMLButtonElement>('[data-choice]');
  const outcomes = phone.querySelectorAll<HTMLElement>('[data-outcome]');
  outcomes.forEach((o) => (o.hidden = true));
  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      outcomes.forEach((o) => (o.hidden = o.dataset.outcome !== b.dataset.choice));
      // inside a scrolling app screen, bring the result into view like the app would
      const pane = b.closest<HTMLElement>('.slack__feed, .mail__msg, .sms__thread');
      if (pane) pane.scrollTo({ top: pane.scrollHeight, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
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

  // phones: swipe carousel with a step bar
  const track = section.querySelector<HTMLElement>('[data-slides]');
  const stepBtns = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-step-btn]'));
  const stepBar = section.querySelector<HTMLElement>('[data-step-bar]');
  const setStep = (i: number) => {
    stepBtns.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
    if (stepBar) stepBar.style.transform = 'scaleX(' + (i + 1) / count + ')';
  };
  if (track) {
    track.addEventListener(
      'scroll',
      () => {
        if (section.classList.contains('is-pinned')) return;
        const step = slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth;
        setStep(Math.max(0, Math.min(count - 1, Math.round(track.scrollLeft / step))));
      },
      { passive: true },
    );
    stepBtns.forEach((b, i) =>
      b.addEventListener('click', () =>
        track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: reduceMotion.matches ? 'auto' : 'smooth' }),
      ),
    );
  }
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

/* ---------- hero deck: the approval arrives in each app, once ----------
 * Phones see the two screens as a swipe deck with two tabs; desktop sees them side by side.
 * Without JavaScript, or with reduced motion, every line is simply there.
 */
const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

async function playCaller(phone: HTMLElement) {
  const typing = phone.querySelector<HTMLElement>('.typing');
  for (const el of Array.from(phone.querySelectorAll<HTMLElement>('.seq'))) {
    if (el.classList.contains('on')) continue;
    if (el.hidden) {
      el.classList.add('on');
      continue;
    }
    const isBubble = el.classList.contains('bubble');
    if (isBubble && typing) {
      typing.classList.toggle('out', el.classList.contains('bubble--out'));
      typing.style.top = el.offsetTop + 'px';
      typing.classList.add('show');
      await wait(750);
      typing.classList.remove('show');
    }
    el.classList.add('on');
    await wait(isBubble ? 500 : 220);
  }
}

document.querySelectorAll<HTMLElement>('[data-deck]').forEach((deck) => {
  const track = deck.querySelector<HTMLElement>('[data-deck-track]');
  const cards = Array.from(deck.querySelectorAll<HTMLElement>('.door'));
  const tabs = Array.from(deck.querySelectorAll<HTMLButtonElement>('[data-deck-tab]'));
  const caller = deck.querySelector<HTMLElement>('[data-caller-phone]');
  const inboxes = Array.from(deck.querySelectorAll<HTMLElement>('[data-attorney-phone]'));
  if (!track || cards.length < 2) return;

  const offset = (i: number) => cards[i].offsetLeft - cards[0].offsetLeft;
  const goTo = (i: number) => track.scrollTo({ left: offset(i), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  const setTab = (i: number) => tabs.forEach((t, j) => t.setAttribute('aria-pressed', String(i === j)));

  // which tab is lit follows the scroll, except right after a tap (the last card can't scroll to the left edge)
  let pinnedTab = -1;
  let pinTimer = 0;
  track.addEventListener(
    'scroll',
    () => {
      if (pinnedTab >= 0) return;
      const step = offset(1) || 1;
      setTab(Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / step))));
    },
    { passive: true },
  );

  let touched = false;
  const arriveAll = () => inboxes.forEach((el) => el.classList.add('arrived'));
  const markTouched = () => {
    touched = true;
    arriveAll();
    caller?.querySelectorAll('.seq').forEach((el) => el.classList.add('on'));
    caller?.querySelector('.typing')?.classList.remove('show');
  };
  ['pointerdown', 'touchstart', 'wheel'].forEach((type) => track.addEventListener(type, markTouched, { passive: true }));
  tabs.forEach((t, i) =>
    t.addEventListener('click', () => {
      markTouched();
      pinnedTab = i;
      setTab(i);
      window.clearTimeout(pinTimer);
      pinTimer = window.setTimeout(() => (pinnedTab = -1), 900);
      goTo(i);
    }),
  );

  if (reduceMotion.matches || !('IntersectionObserver' in window)) return;
  caller?.classList.add('is-seq');
  inboxes.forEach((el) => el.classList.add('is-seq'));

  // the call timer ticks while the transcript plays
  const timer = caller?.querySelector<HTMLElement>('[data-call-timer]');
  let seconds = 38;

  const play = async () => {
    const tick = window.setInterval(() => {
      seconds += 1;
      if (timer) timer.textContent = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
    }, 1000);
    await wait(caller ? 500 : 300);
    if (caller) await playCaller(caller);
    window.clearInterval(tick);
    for (let i = 0; i < inboxes.length && !touched; i++) {
      await wait(i === 0 ? (caller ? 900 : 200) : 2200);
      if (touched) break;
      const card = inboxes[i].closest<HTMLElement>('.door');
      const index = card ? cards.indexOf(card) : -1;
      // scroll only if that phone isn't already fully on screen
      if (index > 0) {
        const left = card!.offsetLeft - track.scrollLeft - cards[0].offsetLeft;
        if (left < 0 || left + card!.offsetWidth > track.clientWidth - cards[0].offsetLeft + 1) {
          goTo(index);
          await wait(450);
        }
      }
      inboxes[i].classList.add('arrived');
    }
  };
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        play();
      }
    },
    { threshold: 0.55 },
  );
  // start when the first phone is mostly on screen, so the visitor actually sees it play
  io.observe(cards[0]);
});

/* ---------- sticky booking bar (phones) ----------
 * Shows once the page's first call to action (or the page hero) has scrolled away,
 * hides while the closing call to action or the footer is on screen.
 */
const stickyBar = document.querySelector<HTMLElement>('[data-sticky-cta]');
if (stickyBar && 'IntersectionObserver' in window) {
  const top = document.querySelector<HTMLElement>('main .hero .btn, main .phero');
  const ends = document.querySelectorAll<HTMLElement>('.close, .ftr');
  let topVisible = !!top;
  const endsVisible = new Set<Element>();
  const sync = () => {
    const show = !topVisible && endsVisible.size === 0;
    stickyBar.classList.toggle('show', show);
    stickyBar.toggleAttribute('inert', !show);
  };
  if (top) {
    new IntersectionObserver((entries) => {
      topVisible = entries[0].isIntersecting || entries[0].boundingClientRect.top > 0;
      sync();
    }).observe(top);
  }
  const endIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? endsVisible.add(e.target) : endsVisible.delete(e.target)));
    sync();
  });
  ends.forEach((el) => endIo.observe(el));
  sync();
}
