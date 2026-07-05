"use client";

import { useEffect, useRef, useState } from "react";

function TypewriterInner({
  text,
  speed,
  className,
}: {
  text: string;
  speed: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [revealCount, setRevealCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setRevealCount((count) => {
        if (count >= text.length) {
          clearInterval(id);
          return count;
        }
        return count + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [inView, text, speed]);

  const done = revealCount >= text.length;

  return (
    <span ref={ref} className={className}>
      {text.slice(0, revealCount)}
      {!done && <span className="cursor-blink" />}
    </span>
  );
}

export function Typewriter({
  text,
  speed = 12,
  className,
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  return <TypewriterInner key={text} text={text} speed={speed} className={className} />;
}
