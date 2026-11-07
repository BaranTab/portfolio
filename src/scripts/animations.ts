import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

// Kullanıcı "hareketi azalt" ayarını açtıysa animasyon yapma
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  // ---------- 1. Yumuşak kaydırma ----------
  const lenis = new Lenis({ anchors: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

    if (document.querySelector(".hero")) {
    const intro = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    intro
      .from(".hero .circle", { scale: 0.6, opacity: 0, duration: 1.2 })
      .from(".hero .ring", { opacity: 0 }, "-=0.6")
      .from(".hero .name span", { y: 80, opacity: 0, stagger: 0.12 }, "-=0.9")
      .from(
        [".hero .hello", ".hero .intro", ".hero .actions", ".hero .note", ".hero .scroll"],
        { y: 20, opacity: 0, stagger: 0.06, duration: 0.7 },
        "-=0.6"
      );
  }

  // ---------- 3. Kaydırınca beliren öğeler ----------
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  // ---------- 4. Sayaç gibi artan rakamlar ----------
  gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const counter = { value: 0 };
    el.textContent = "0";
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
      onUpdate: () => {
        el.textContent = String(Math.round(counter.value));
      },
    });
  });
}

// ---------- 5. Fareyi takip eden proje önizlemesi ----------
gsap.utils.toArray<HTMLElement>(".projects .row").forEach((row) => {
  const preview = row.querySelector<HTMLElement>(".preview");
  if (!preview) return;

  gsap.set(preview, { xPercent: -50, yPercent: -50, rotate: 4 });
  const xTo = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3" });
  const yTo = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3" });

  const position = (e: MouseEvent) => {
    const box = row.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  row.addEventListener("mouseenter", (e) => gsap.set(preview, position(e)));
  row.addEventListener("mousemove", (e) => {
    const { x, y } = position(e);
    xTo(x);
    yTo(y);
  });
});

// ---------- 6. Daktilo efekti ----------

// Bir başlığın içindeki metni harf harf <span> etiketlerine böler.
// İç içe etiketleri (örn. .outline) korur, <br> etiketlerine dokunmaz.
function splitForTyping(el: HTMLElement): HTMLElement[] {
  const units: HTMLElement[] = [];

  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        for (const ch of Array.from(child.textContent ?? "")) {
          if (/\s/.test(ch)) {
            fragment.append(document.createTextNode(ch)); // boşluklar satır kırılımı için düz metin kalır
            continue;
          }
          const span = document.createElement("span");
          span.className = "tw-char";
          span.textContent = ch;
          fragment.append(span);
          units.push(span);
        }
        child.replaceWith(fragment);
      } else if (child instanceof HTMLElement) {
        if (child.tagName === "BR") return;
        if (child.hasAttribute("data-type-unit")) {
          child.classList.add("tw-char");
          units.push(child); // bölünmeden tek parça olarak yazılır
          return;
        }
        walk(child); // iç içe etiketlerin içine de gir
      }
    });
  };

  walk(el);
  return units;
}

if (!reduceMotion) {
  gsap.utils.toArray<HTMLElement>("[data-type], .prose h2").forEach((el) => {
    // Ekran okuyucular başlığı harf harf değil, bütün olarak okusun
    el.setAttribute("aria-label", (el.textContent ?? "").replace(/\s+/g, " ").trim());

    const chars = splitForTyping(el);
    let caret: HTMLElement | null = null;

    gsap.set(chars, { opacity: 0 });
    gsap.to(chars, {
      opacity: 1,
      duration: 0.01,
      ease: "none",
      stagger: {
        each: 0.045, // harf başına süre: hızlandırmak için küçült
        onStart: function (this: gsap.core.Tween) {
          caret?.classList.remove("is-caret");
          caret = this.targets()[0] as HTMLElement;
          caret.classList.add("is-caret");
        },
      },
      scrollTrigger: { trigger: el, start: "top 80%" },
      onComplete: () => {
        gsap.delayedCall(1.5, () => caret?.classList.remove("is-caret"));
      },
    });
  });
}