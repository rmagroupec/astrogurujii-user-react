/**
 * FilterBar.tsx — Final Fix
 *
 * API returns: { id: "64116f88...", name: "Remedies", ... }
 * NOT _id — using `id` field for comparison and cat_id param
 */

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://admin.astrogurujii.com";

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface Props {
  activeTab: string;
  onTabChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortValue?: string;
  onSortChange?: (v: string) => void;
}

const SORT_OPTIONS = [
  { label: "Relevance",          value: "" },
  { label: "Price: Low to High", value: "low_to_high" },
  { label: "Price: High to Low", value: "high_to_low" },
  { label: "Experience",         value: "experience" },
  { label: "Rating",             value: "rating" },
  { label: "Orders",             value: "orders" },
];

export default function FilterBar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  sortValue: externalSort,
  onSortChange,
}: Readonly<Props>) {
  const [categories,     setCategories]     = useState<Category[]>([]);
  const [localSort,      setLocalSort]      = useState("");
  const [showSort,       setShowSort]       = useState(false);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const sortRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const sortValue    = externalSort !== undefined ? externalSort : localSort;
  const setSortValue = (v: string) => { if (onSortChange) onSortChange(v); else setLocalSort(v); };

  // ── Fetch categories ──────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/user_api/category_list`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      .then((res) => {
        if (res.data?.status && Array.isArray(res.data.results)) {
          setCategories(res.data.results);
        }
      })
      .catch(() => {});
  }, []);

  // ── Scroll arrow visibility ───────────────────────────────
  const checkScroll = () => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollTabs = (dir: "left" | "right") => {
    const el = tabsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });
    setTimeout(checkScroll, 320);
  };

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]); // re-check when categories load

  // ── Scroll selected tab into view ─────────────────────────
  useEffect(() => {
    if (!tabsRef.current || !activeTab) return;
    const btn = tabsRef.current.querySelector<HTMLElement>(`[data-tabid="${activeTab}"]`);
    btn?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }, [activeTab]);

  // ── Close sort on outside click ───────────────────────────
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSort(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortValue)?.label ?? "Sort";
  const activeCatName   = categories.find((c) => c.id === activeTab)?.name?.trim() ?? "";

  const clearAll = () => { onTabChange(""); onSearchChange(""); setSortValue(""); };

  // ── Tab button style ──────────────────────────────────────
  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    height: 36,
    padding: "0 16px",
    borderRadius: 6,
    flexShrink: 0,
    whiteSpace: "nowrap",
    fontFamily: "Poppins, sans-serif",
    fontSize: 13,
    fontWeight: isActive ? 700 : 500,
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    border: "none",
    outline: "none",
    background: isActive ? "#FF6F00" : "rgba(0,0,0,0.08)",
    color:       isActive ? "#fff"    : "#333",
    boxShadow:   isActive ? "0 2px 8px rgba(255,111,0,0.3)" : "none",
  });

  // ── Scroll arrow button style ─────────────────────────────
  const arrowStyle: React.CSSProperties = {
    flexShrink: 0,
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "none",
    background: "rgba(0,0,0,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.15s, transform 0.1s",
    outline: "none",
  };

  return (
    <div style={{ width: "100%", background: "#FED402", position: "sticky", top: 0, zIndex: 30, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 16px" }}>

        {/* ── Main row ─────────────────────────────────────── */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0" }}>

          {/* Category tabs + scroll arrows */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>

            {/* Left arrow */}
            <button
              onClick={() => scrollTabs("left")}
              style={{
                ...arrowStyle,
                opacity: canScrollLeft ? 1 : 0,
                pointerEvents: canScrollLeft ? "auto" : "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.32)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.18)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.92)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
              aria-label="Scroll categories left"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="#333" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Scrollable tabs */}
            <div
              ref={tabsRef}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                overflowX: "auto", flex: 1, paddingBottom: 2,
                scrollbarWidth: "none",
              }}
            >
              {/* ALL */}
              <button data-tabid="" onClick={() => onTabChange("")} style={tabStyle(activeTab === "")}>
                All
              </button>

              {/* Dynamic from API */}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  data-tabid={cat.id}
                  onClick={() => onTabChange(cat.id)}
                  style={tabStyle(activeTab === cat.id)}
                >
                  {cat.name.trim()}
                </button>
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scrollTabs("right")}
              style={{
                ...arrowStyle,
                opacity: canScrollRight ? 1 : 0,
                pointerEvents: canScrollRight ? "auto" : "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.32)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.18)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.92)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
              aria-label="Scroll categories right"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="#333" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Search + Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#fff", borderRadius: 6, padding: "0 12px",
              height: 38, border: "1.5px solid rgba(255,111,0,0.3)",
              width: 220,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search astrologer..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "Poppins, sans-serif", fontSize: 13, color: "#222" }}
              />
              {searchQuery && (
                <button onClick={() => onSearchChange("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 18, lineHeight: 1, padding: 0, display: "flex", alignItems: "center" }}>×</button>
              )}
            </div>

            {/* Sort dropdown */}
            <div ref={sortRef} style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => setShowSort((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  height: 38, padding: "0 14px", borderRadius: 6,
                  background: "#FF6F00", color: "#fff", border: "none",
                  fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(255,111,0,0.3)",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M7 12h10M11 18h2" />
                </svg>
                {sortValue ? activeSortLabel : "Sort"}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: showSort ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {showSort && (
                <div style={{
                  position: "absolute", right: 0, top: 44, zIndex: 999,
                  width: 210, background: "#fff", borderRadius: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)", border: "1px solid #eee", overflow: "hidden",
                }}>
                  {SORT_OPTIONS.map((opt) => {
                    const isSel = sortValue === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => { setSortValue(opt.value); setShowSort(false); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          width: "100%", textAlign: "left", padding: "10px 16px",
                          background: isSel ? "#FFF5EE" : "#fff",
                          color: isSel ? "#FF6F00" : "#333",
                          fontFamily: "Poppins, sans-serif", fontSize: 13,
                          fontWeight: isSel ? 600 : 400,
                          border: "none", borderBottom: "1px solid #f5f5f5",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ width: 16, color: "#FF6F00", opacity: isSel ? 1 : 0 }}>✓</span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Active filter chips ───────────────────────────── */}
        {(activeTab || searchQuery || sortValue) && (
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, paddingBottom: 8 }}>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: "rgba(0,0,0,0.45)" }}>Active:</span>

            {activeTab && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#fff", borderRadius: 999, padding: "3px 10px", fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "#FF6F00", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                {activeCatName}
                <button onClick={() => onTabChange("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
              </span>
            )}

            {searchQuery && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#fff", borderRadius: 999, padding: "3px 10px", fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 500, color: "#333", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                🔍 "{searchQuery}"
                <button onClick={() => onSearchChange("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
              </span>
            )}

            {sortValue && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#fff", borderRadius: 999, padding: "3px 10px", fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 500, color: "#333", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                ↕ {activeSortLabel}
                <button onClick={() => setSortValue("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
              </span>
            )}

            <button onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif", fontSize: 11, color: "rgba(0,0,0,0.5)", textDecoration: "underline" }}>
              Clear all
            </button>
          </div>
        )}

      </div>
    </div>
  );
}