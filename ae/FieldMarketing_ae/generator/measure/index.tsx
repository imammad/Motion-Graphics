// Measurement entry: renders the real EventsScene and logs the layout of every element and text run,
// so the After Effects rebuild uses the browser's own positions instead of hand-estimated ones.
//   npx remotion still ae/FieldMarketing_ae/generator/measure/index.tsx Measure out.png --frame=134 --log=verbose
import { useEffect, useRef, useState } from "react";
import { AbsoluteFill, Composition, continueRender, delayRender, registerRoot } from "remotion";
import { EventsScene } from "../../../../src/FieldMarketing/EventsScene";

const Measure: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("measure"));
  useEffect(() => {
    document.fonts.ready.then(() => {
      setTimeout(() => {
        const out: unknown[] = [];
        const walk = (el: Element, path: string) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          const texts: unknown[] = [];
          el.childNodes.forEach((n) => {
            if (n.nodeType === 3 && n.textContent && n.textContent.trim()) {
              const range = document.createRange();
              range.selectNodeContents(n);
              const rr = range.getBoundingClientRect();
              texts.push({ text: n.textContent, x: rr.x, y: rr.y, w: rr.width, h: rr.height });
            }
          });
          out.push({
            path, tag: el.tagName, x: r.x, y: r.y, w: r.width, h: r.height,
            ow: (el as HTMLElement).offsetWidth, oh: (el as HTMLElement).offsetHeight,
            bg: cs.backgroundColor, bgi: cs.backgroundImage, radius: cs.borderTopLeftRadius,
            border: cs.borderTopWidth + " " + cs.borderTopColor, bb: cs.borderBottomWidth,
            fs: cs.fontSize, fw: cs.fontWeight, color: cs.color, ls: cs.letterSpacing, lh: cs.lineHeight,
            op: cs.opacity, tr: cs.transform, translate: cs.translate, scale: cs.scale, rotate: cs.rotate,
            origin: cs.transformOrigin, texts,
          });
          Array.from(el.children).forEach((c, i) => walk(c, path + "." + i));
        };
        walk(ref.current!, "0");
        console.log("MEASURE_JSON " + JSON.stringify(out));
        continueRender(handle);
      }, 300);
    });
  }, [handle]);
  return (
    <AbsoluteFill ref={ref}>
      <EventsScene />
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <Composition id="Measure" component={Measure} durationInFrames={135} fps={30} width={1920} height={1080} />
));
