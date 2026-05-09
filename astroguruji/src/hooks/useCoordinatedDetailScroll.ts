import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MutableRefObject } from "react";

interface CoordinatedDetailScrollOptions {
  breakpointPx?: number;
  topOffsetPx?: number;
  lockThresholdBufferPx?: number;
  releaseDeltaFactor?: number;
}

interface CoordinatedDetailScrollResult {
  isDesktop: boolean;
  isScrollLocked: boolean;
  sidebarRef: MutableRefObject<HTMLDivElement | null>;
  mainContentRef: MutableRefObject<HTMLDivElement | null>;
  sidebarWrapperStyle?: CSSProperties;
  sidebarClassName: string;
  mainContentClassName: string;
  mainContentStyle?: CSSProperties;
}

const DEFAULT_OPTIONS: Required<CoordinatedDetailScrollOptions> = {
  breakpointPx: 1024,
  topOffsetPx: 24,
  lockThresholdBufferPx: 20,
  releaseDeltaFactor: 0.35,
};

function canElementScroll(el: HTMLElement, deltaY: number): boolean {
  if (deltaY > 0) {
    return el.scrollTop + el.clientHeight < el.scrollHeight;
  }

  if (deltaY < 0) {
    return el.scrollTop > 0;
  }

  return false;
}

function findNestedScrollable(
  target: EventTarget | null,
  stopAt: HTMLElement,
): HTMLElement | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  let current: HTMLElement | null = target;
  while (current && current !== stopAt) {
    const style = globalThis.getComputedStyle(current);
    const canScrollY =
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight;

    if (canScrollY) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

export function useCoordinatedDetailScroll(
  options?: CoordinatedDetailScrollOptions,
): CoordinatedDetailScrollResult {
  const {
    breakpointPx,
    topOffsetPx,
    lockThresholdBufferPx,
    releaseDeltaFactor,
  } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const lockAnchorRef = useRef(0);
  const releaseAnchorRef = useRef(0);
  const releaseDirectionRef = useRef<"none" | "down" | "up">("none");
  const [isDesktop, setIsDesktop] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  const mainLockedHeight = `calc(100vh - ${topOffsetPx * 2}px)`;

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia(`(min-width: ${breakpointPx}px)`);

    const updateFromBreakpoint = (matches: boolean) => {
      setIsDesktop(matches);
      if (!matches) {
        setIsScrollLocked(false);
        if (mainContentRef.current) {
          mainContentRef.current.scrollTop = 0;
        }
      }
    };

    updateFromBreakpoint(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      updateFromBreakpoint(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [breakpointPx]);

  useEffect(() => {
    const sidebarEl = sidebarRef.current;
    if (!isDesktop || !sidebarEl) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setSidebarHeight(sidebarEl.getBoundingClientRect().height);
    });

    observer.observe(sidebarEl);
    setSidebarHeight(sidebarEl.getBoundingClientRect().height);

    return () => {
      observer.disconnect();
    };
  }, [isDesktop]);

  useEffect(() => {
    const sidebarEl = sidebarRef.current;
    const mainEl = mainContentRef.current;
    if (!isDesktop || !sidebarEl || !mainEl) {
      return;
    }

    const getLockStart = () => {
      const sidebarRect = sidebarEl.getBoundingClientRect();
      const sidebarTopAbs = globalThis.scrollY + sidebarRect.top;
      const viewportBottomTarget = globalThis.innerHeight - topOffsetPx;
      return Math.max(
        0,
        sidebarTopAbs + sidebarRect.height - viewportBottomTarget,
      );
    };

    const canLockMainPhase = () => {
      const mainHeight = mainEl.getBoundingClientRect().height;
      const viewportRoom = globalThis.innerHeight - topOffsetPx * 2;
      return mainHeight > viewportRoom;
    };

    const releaseDownToPage = (delta: number) => {
      const maxScroll = mainEl.scrollHeight - mainEl.clientHeight;
      const smoothedDelta = Math.max(0, delta * releaseDeltaFactor);
      const releasedY =
        lockAnchorRef.current + Math.max(maxScroll, 0) + smoothedDelta;
      releaseAnchorRef.current = lockAnchorRef.current;
      releaseDirectionRef.current = "down";
      setIsScrollLocked(false);

      requestAnimationFrame(() => {
        mainEl.scrollTop = 0;
        globalThis.scrollTo({ top: releasedY, behavior: "auto" });
      });
    };

    const releaseUpToPage = (delta: number) => {
      const smoothedDelta = Math.min(0, delta * releaseDeltaFactor);
      const releasedY = Math.max(0, lockAnchorRef.current + smoothedDelta);
      releaseAnchorRef.current = lockAnchorRef.current;
      releaseDirectionRef.current = "up";
      setIsScrollLocked(false);

      requestAnimationFrame(() => {
        globalThis.scrollTo({ top: releasedY, behavior: "auto" });
      });
    };

    const onWindowScroll = () => {
      if (isScrollLocked || !canLockMainPhase()) {
        return;
      }

      if (releaseDirectionRef.current === "down") {
        if (
          globalThis.scrollY >=
          releaseAnchorRef.current - lockThresholdBufferPx
        ) {
          return;
        }

        releaseDirectionRef.current = "none";
      }

      if (releaseDirectionRef.current === "up") {
        if (
          globalThis.scrollY <=
          releaseAnchorRef.current + lockThresholdBufferPx
        ) {
          return;
        }

        releaseDirectionRef.current = "none";
      }

      const lockStart = getLockStart();
      if (globalThis.scrollY >= lockStart + lockThresholdBufferPx) {
        lockAnchorRef.current = lockStart;
        globalThis.scrollTo({ top: lockStart, behavior: "auto" });
        setIsScrollLocked(true);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!isScrollLocked) {
        return;
      }

      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return;
      }

      const nestedScrollable = findNestedScrollable(event.target, mainEl);
      if (
        nestedScrollable &&
        canElementScroll(nestedScrollable, event.deltaY)
      ) {
        return;
      }

      const delta = event.deltaY;
      const maxScroll = mainEl.scrollHeight - mainEl.clientHeight;
      if (maxScroll <= 0) {
        setIsScrollLocked(false);
        return;
      }

      if (delta > 0) {
        const remaining = maxScroll - mainEl.scrollTop;
        if (remaining > 0) {
          event.preventDefault();
          mainEl.scrollTop = Math.min(maxScroll, mainEl.scrollTop + delta);
          return;
        }

        event.preventDefault();
        releaseDownToPage(delta);
      }

      if (delta < 0) {
        if (mainEl.scrollTop > 0) {
          event.preventDefault();
          mainEl.scrollTop = Math.max(0, mainEl.scrollTop + delta);
          return;
        }

        event.preventDefault();
        releaseUpToPage(delta);
      }
    };

    const onResize = () => {
      if (!isScrollLocked) {
        return;
      }

      lockAnchorRef.current = getLockStart();
    };

    globalThis.addEventListener("scroll", onWindowScroll, { passive: true });
    globalThis.addEventListener("wheel", onWheel, { passive: false });
    globalThis.addEventListener("resize", onResize);

    return () => {
      globalThis.removeEventListener("scroll", onWindowScroll);
      globalThis.removeEventListener("wheel", onWheel);
      globalThis.removeEventListener("resize", onResize);
    };
  }, [
    isDesktop,
    isScrollLocked,
    lockThresholdBufferPx,
    releaseDeltaFactor,
    topOffsetPx,
  ]);

  return {
    isDesktop,
    isScrollLocked,
    sidebarRef,
    mainContentRef,
    sidebarWrapperStyle:
      isDesktop && isScrollLocked && sidebarHeight > 0
        ? { height: `${sidebarHeight}px` }
        : undefined,
    sidebarClassName:
      isDesktop && isScrollLocked
        ? `flex flex-col gap-5 lg:fixed lg:top-6 lg:w-[393px]`
        : "flex flex-col gap-5",
    mainContentClassName:
      isDesktop && isScrollLocked
        ? "flex min-w-0 flex-1 flex-col gap-6 lg:overflow-y-auto"
        : "flex min-w-0 flex-1 flex-col gap-6 lg:overflow-visible",
    mainContentStyle:
      isDesktop && isScrollLocked ? { maxHeight: mainLockedHeight } : undefined,
  };
}
