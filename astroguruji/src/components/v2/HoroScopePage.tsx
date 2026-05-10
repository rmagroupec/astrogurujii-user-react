import React, { useState } from "react";

import Navbar from "@/components/v2/Navbar";
import Footer from "@/components/v2/Footer";
import BreadcrumbHeader from "@/components/v2/BreadcrumbHeader";

// ─── SVG Icons for Theme Consistency ─────────────────────────────────────────

const LoveIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const CareerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const HealthIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

const FinanceIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const NumberIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);

const ColorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
    <circle cx="15.5" cy="7.5" r=".5" fill="currentColor"></circle>
    <circle cx="12" cy="11.5" r=".5" fill="currentColor"></circle>
  </svg>
);

const TimeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const CompatibleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 10a2 2 0 0 0-2 2c0 1.1.9 2 2 2s2-.9 2-2a2 2 0 0 0-2-2Z"></path>
    <path d="M21 12c0 1.66-4 6-9 6s-9-4.34-9-6 4-6 9-6 9 4.34 9 6Z"></path>
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-orange mt-0.5 shrink-0">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

type Period = "today" | "tomorrow" | "weekly" | "monthly";

type ScoreStat = {
  label: string;
  value: number; // 0–100
  color: string;
};

type HoroscopeEntry = {
  overview: string;
  love: string;
  career: string;
  health: string;
  finance: string;
  luckyNumber: string;
  luckyColor: string;
  luckyTime: string;
  compatibleSign: string;
  tip: string;
  scores: ScoreStat[];
};

type ZodiacSign = {
  id: string;
  name: string;
  symbol: string;
  emoji: string;
  dateRange: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  horoscope: Record<Period, HoroscopeEntry>;
};

// ─── Hardcoded Data ───────────────────────────────────────────────────────────

const SIGNS: ZodiacSign[] = [
  {
    id: "aries",
    name: "Aries",
    symbol: "♈",
    emoji: "🐏",
    dateRange: "Mar 21 – Apr 19",
    element: "Fire",
    horoscope: {
      today: {
        overview:
          "Today brings a surge of fiery energy, Aries. The Sun's alignment with Mars in your chart pushes you to take bold initiatives. Don't hold back — your instincts are razor-sharp. A conversation you've been avoiding can finally take place, and it will go better than expected. Trust your gut, act decisively, and let your natural leadership shine through.",
        love: "Romance feels electric today. If you're in a relationship, plan something spontaneous — your partner will love the surprise. Singles may find a meaningful connection in an unexpected place, possibly through a friend's introduction.",
        career:
          "Your assertive energy impresses superiors. A project you've been pushing for could get the green light. Avoid rushing through details — thoroughness will set you apart from the competition.",
        health:
          "High energy levels today — channel them into a rigorous workout. Watch for tension in the neck and shoulders; a short stretching routine in the evening will help. Stay hydrated.",
        finance:
          "Avoid impulsive purchases. A financial opportunity may present itself — take time to analyze before committing. Short-term investments look promising but require careful review.",
        luckyNumber: "9",
        luckyColor: "Crimson Red",
        luckyTime: "7:00 AM – 9:00 AM",
        compatibleSign: "Leo",
        tip: "Channel your fire into creativity, not confrontation.",
        scores: [
          { label: "Love", value: 82, color: "#e74c8b" },
          { label: "Career", value: 75, color: "#FF6F00" },
          { label: "Health", value: 68, color: "#34a853" },
          { label: "Finance", value: 60, color: "#4a90d9" },
          { label: "Luck", value: 88, color: "#9b59b6" },
        ],
      },
      tomorrow: {
        overview:
          "Tomorrow calls for patience, Aries. Mercury retrograde energy lingers, making communication tricky. Double-check emails and plans before sending. The evening brings clarity and a moment of genuine connection with someone close.",
        love: "A misunderstanding from the past resurfaces, but you have the wisdom to handle it gracefully now. Express yourself clearly and listen with an open heart.",
        career:
          "Avoid major launches or decisions tomorrow. Use the day for research, planning, and tying up loose ends. Your groundwork today will pay dividends next week.",
        health:
          "Rest and recovery are your priorities. Your body is asking for gentler movement — consider yoga or a walk in nature instead of intense training.",
        finance:
          "Refrain from signing contracts or making large purchases. Wait until you have complete information before committing funds.",
        luckyNumber: "3",
        luckyColor: "Gold",
        luckyTime: "2:00 PM – 4:00 PM",
        compatibleSign: "Sagittarius",
        tip: "Slow down — tomorrow rewards preparation over action.",
        scores: [
          { label: "Love", value: 70, color: "#e74c8b" },
          { label: "Career", value: 55, color: "#FF6F00" },
          { label: "Health", value: 78, color: "#34a853" },
          { label: "Finance", value: 50, color: "#4a90d9" },
          { label: "Luck", value: 65, color: "#9b59b6" },
        ],
      },
      weekly: {
        overview:
          "This week is a power week for Aries. The first half is highly productive — use Monday through Wednesday to push your biggest goals forward. The weekend brings social opportunities and a chance to deepen important relationships.",
        love: "Mid-week sparks romance. A heartfelt conversation on Wednesday can strengthen your bond significantly. Weekend brings social gatherings where singles find intriguing prospects.",
        career:
          "Thursday is your peak career day. A presentation or proposal gets enthusiastic reception. Collaboration is your secret weapon this week — don't go it alone.",
        health:
          "Energy peaks Tuesday and Wednesday. Schedule your toughest workouts then. Friday calls for rest and mental recharging.",
        finance:
          "A positive week for finances. An unexpected bonus or reimbursement arrives mid-week. Avoid weekend shopping impulses.",
        luckyNumber: "18",
        luckyColor: "Orange",
        luckyTime: "Morning hours",
        compatibleSign: "Aquarius",
        tip: "Collaboration unlocks doors solo effort cannot open this week.",
        scores: [
          { label: "Love", value: 79, color: "#e74c8b" },
          { label: "Career", value: 85, color: "#FF6F00" },
          { label: "Health", value: 72, color: "#34a853" },
          { label: "Finance", value: 74, color: "#4a90d9" },
          { label: "Luck", value: 80, color: "#9b59b6" },
        ],
      },
      monthly: {
        overview:
          "April is your month to shine, Aries. Your birthday season brings renewed purpose and a powerful reset of your solar cycle. The first two weeks are ideal for setting intentions and launching new ventures. The last week of the month brings a full moon that illuminates your relationship sector — expect clarity on where you truly stand with people.",
        love: "Relationships transform this month. Early April is ideal for heart-to-heart conversations. A full moon near month's end reveals important truths in your closest bonds.",
        career:
          "Career acceleration is the theme of April. New opportunities emerge around the 10th. A mentor figure offers invaluable guidance — be open to receiving it.",
        health:
          "Focus on building sustainable habits this month. Start a new fitness routine in the first week. By month's end, you'll feel the difference in your energy levels.",
        finance:
          "Financial planning is favored in April. Review budgets around the 5th. An investment made early in the month shows promising returns by month's close.",
        luckyNumber: "1",
        luckyColor: "Saffron",
        luckyTime: "Sunrise hours",
        compatibleSign: "Gemini",
        tip: "This is your year's reset button — use it wisely.",
        scores: [
          { label: "Love", value: 76, color: "#e74c8b" },
          { label: "Career", value: 90, color: "#FF6F00" },
          { label: "Health", value: 70, color: "#34a853" },
          { label: "Finance", value: 80, color: "#4a90d9" },
          { label: "Luck", value: 85, color: "#9b59b6" },
        ],
      },
    },
  },
  {
    id: "taurus",
    name: "Taurus",
    symbol: "♉",
    emoji: "🐂",
    dateRange: "Apr 20 – May 20",
    element: "Earth",
    horoscope: {
      today: {
        overview:
          "Taurus, Venus blesses your chart today with warmth and abundance. You're in your element — savoring life's comforts while making steady, practical progress. A financial matter that was unclear begins to resolve. Your calm steadiness is your superpower today; others look to you for grounding.",
        love: "Deep connection is on the cards. A quiet evening with your partner or a meaningful conversation with someone special brings genuine comfort. Singles should stay open — a grounded, reliable person enters your orbit.",
        career:
          "Steady progress on long-term projects. Your patience and thoroughness impress a senior figure. This is not a day for risks — stay the course and trust the process.",
        health:
          "Your body craves nourishment. Choose wholesome meals and enjoy a leisurely walk outdoors. Nature recharges you better than any supplement.",
        finance:
          "A good day to review savings and budget. A small investment in quality pays off long-term. Avoid lending money today.",
        luckyNumber: "6",
        luckyColor: "Forest Green",
        luckyTime: "10:00 AM – 12:00 PM",
        compatibleSign: "Virgo",
        tip: "Slow and steady builds empires — keep your pace.",
        scores: [
          { label: "Love", value: 88, color: "#e74c8b" },
          { label: "Career", value: 72, color: "#FF6F00" },
          { label: "Health", value: 80, color: "#34a853" },
          { label: "Finance", value: 85, color: "#4a90d9" },
          { label: "Luck", value: 70, color: "#9b59b6" },
        ],
      },
      tomorrow: {
        overview:
          "Tomorrow brings a chance to realign priorities. Taurus, you may feel a pull toward the familiar — honor that instinct. A home or family matter requires your attention, and your thoughtful approach will resolve it beautifully.",
        love: "Family and home take center stage. Quality time with loved ones recharges your soul. Singles find comfort in their closest friendships.",
        career:
          "A creative idea you've been sitting on deserves attention. Write it down, sketch it out — it has real potential. Don't discount your instincts.",
        health:
          "Digestive health needs attention. Eat lightly and choose warm, nourishing foods. An early bedtime tonight will set you up for a brilliant week ahead.",
        finance:
          "Home-related expenses may arise. Budget carefully and avoid unnecessary splurges on luxury items.",
        luckyNumber: "2",
        luckyColor: "Ivory",
        luckyTime: "6:00 PM – 8:00 PM",
        compatibleSign: "Cancer",
        tip: "Your home is your sanctuary — invest in its peace today.",
        scores: [
          { label: "Love", value: 75, color: "#e74c8b" },
          { label: "Career", value: 65, color: "#FF6F00" },
          { label: "Health", value: 72, color: "#34a853" },
          { label: "Finance", value: 68, color: "#4a90d9" },
          { label: "Luck", value: 60, color: "#9b59b6" },
        ],
      },
      weekly: {
        overview:
          "A week of beauty and productivity for Taurus. Venus enhances your charm and magnetism all week. Professional achievements are highlighted mid-week, and the weekend is perfect for artistic or creative pursuits.",
        love: "Your warmth draws people in all week. A romantic gesture on Thursday creates a beautiful memory. Singles: put yourself out there — the stars strongly favor new connections.",
        career:
          "Creativity and reliability make you the MVP this week. Your work gets noticed. A raise or recognition conversation feels imminent.",
        health:
          "Indulgence needs balance. Enjoy the good things in moderation and keep movement in your daily routine.",
        finance:
          "Financial picture brightens mid-week. A pending payment arrives. Avoid impulse luxury purchases over the weekend.",
        luckyNumber: "15",
        luckyColor: "Rose Gold",
        luckyTime: "Afternoon hours",
        compatibleSign: "Capricorn",
        tip: "Beauty and effort go hand in hand — bring both to everything.",
        scores: [
          { label: "Love", value: 90, color: "#e74c8b" },
          { label: "Career", value: 80, color: "#FF6F00" },
          { label: "Health", value: 74, color: "#34a853" },
          { label: "Finance", value: 78, color: "#4a90d9" },
          { label: "Luck", value: 82, color: "#9b59b6" },
        ],
      },
      monthly: {
        overview:
          "April asks Taurus to bloom. The month's energy supports personal transformation — shed habits that no longer serve you. Career growth accelerates after the 15th, and a full moon at month's end lights up your financial sector with welcome revelations.",
        love: "Deep, meaningful connection defines your love life this month. Established relationships deepen. Singles may meet someone special around the 12th.",
        career:
          "April is a career turning point. Pursue promotions or new opportunities confidently. Your reputation is at an all-time high.",
        health:
          "Spring is your season to thrive. Begin an outdoor fitness routine and embrace fresh, seasonal foods. Your vitality builds steadily all month.",
        finance:
          "Finances stabilize beautifully in April. A long-awaited payment or return materializes. Reinvest wisely.",
        luckyNumber: "7",
        luckyColor: "Emerald",
        luckyTime: "Late morning",
        compatibleSign: "Scorpio",
        tip: "Bloom where you're planted — April is your season.",
        scores: [
          { label: "Love", value: 85, color: "#e74c8b" },
          { label: "Career", value: 88, color: "#FF6F00" },
          { label: "Health", value: 82, color: "#34a853" },
          { label: "Finance", value: 86, color: "#4a90d9" },
          { label: "Luck", value: 79, color: "#9b59b6" },
        ],
      },
    },
  },
  {
    id: "gemini",
    name: "Gemini",
    symbol: "♊",
    emoji: "👯",
    dateRange: "May 21 – Jun 20",
    element: "Air",
    horoscope: {
      today: {
        overview:
          "Your mind is a whirlwind of brilliant ideas today, Gemini. Mercury, your ruler, amplifies your communication skills to near-superhuman levels. Use this gift to articulate something you've struggled to express. A social interaction leads to an unexpected opportunity — stay present in every conversation.",
        love: "Witty banter and intellectual connection are your love language today. A meaningful exchange with your partner deepens understanding. Singles: your charm is irresistible — let it flow naturally.",
        career:
          "Words are your currency today. A pitch, proposal, or presentation lands perfectly. Collaboration with a creative colleague sparks something genuinely exciting.",
        health:
          "Mental fatigue may creep in by evening. Unplug from screens an hour before bed. Breathing exercises calm your ever-active mind.",
        finance:
          "A short-term financial opportunity appears. Analyze quickly but don't overthink — your instincts are usually right. Diversification is your financial friend.",
        luckyNumber: "5",
        luckyColor: "Yellow",
        luckyTime: "11:00 AM – 1:00 PM",
        compatibleSign: "Libra",
        tip: "Your words carry magic today — choose them with intention.",
        scores: [
          { label: "Love", value: 78, color: "#e74c8b" },
          { label: "Career", value: 92, color: "#FF6F00" },
          { label: "Health", value: 65, color: "#34a853" },
          { label: "Finance", value: 70, color: "#4a90d9" },
          { label: "Luck", value: 84, color: "#9b59b6" },
        ],
      },
      tomorrow: {
        overview: "Tomorrow invites you to slow down and reflect, Gemini. The noise of daily life fades, allowing deeper insights to surface. Journaling or meditation in the morning sets a powerful tone for the day.",
        love: "Emotional depth over surface-level fun is the theme. A vulnerable moment with someone close strengthens your bond immeasurably.",
        career: "Behind-the-scenes work pays off. Research, planning, and quiet preparation set the stage for next week's wins.",
        health: "Mental health takes priority. Step away from social media and enjoy solitude. Your nervous system will thank you.",
        finance: "Review long-term financial goals. Small, consistent contributions to savings make a bigger difference than you realize.",
        luckyNumber: "11",
        luckyColor: "Silver",
        luckyTime: "7:00 AM – 9:00 AM",
        compatibleSign: "Aquarius",
        tip: "Silence is where your best ideas are born.",
        scores: [
          { label: "Love", value: 72, color: "#e74c8b" },
          { label: "Career", value: 68, color: "#FF6F00" },
          { label: "Health", value: 80, color: "#34a853" },
          { label: "Finance", value: 65, color: "#4a90d9" },
          { label: "Luck", value: 70, color: "#9b59b6" },
        ],
      },
      weekly: {
        overview: "A socially electric week for Gemini. Your schedule fills with meaningful interactions, and every conversation has the potential to open new doors. Wednesday brings a pivotal professional exchange.",
        love: "Love is playful and light this week. Laughter heals old wounds. Plan something fun and spontaneous with your partner.",
        career: "Networking is your superpower this week. Attend that event, make that call, send that email. Opportunities multiply through connection.",
        health: "Keep moving — restless Gemini energy needs an outlet. Dance, cycling, or a new sport keeps your body and mind engaged.",
        finance: "Multiple small income streams show potential. Diversify your efforts this week for financial resilience.",
        luckyNumber: "14",
        luckyColor: "Sky Blue",
        luckyTime: "Midday",
        compatibleSign: "Aries",
        tip: "Every connection this week is a seed — water them well.",
        scores: [
          { label: "Love", value: 80, color: "#e74c8b" },
          { label: "Career", value: 87, color: "#FF6F00" },
          { label: "Health", value: 75, color: "#34a853" },
          { label: "Finance", value: 72, color: "#4a90d9" },
          { label: "Luck", value: 83, color: "#9b59b6" },
        ],
      },
      monthly: {
        overview: "April activates your communication sector in a big way, Gemini. Writing, speaking, teaching, or creating content — any form of expression flourishes. The new moon on the 1st opens a fresh chapter in your personal relationships.",
        love: "Communication transforms your love life this month. Say what you feel — your partner (or potential partner) needs to hear it.",
        career: "Your expertise gets recognized in April. Speaking opportunities, publishing, or content creation brings new professional visibility.",
        health: "Focus on lung health and mobility. Breathwork and stretching routines complement your active lifestyle.",
        finance: "Multiple income opportunities arise in April. Stay organized and track everything — your financial picture is more complex than usual.",
        luckyNumber: "3",
        luckyColor: "Turquoise",
        luckyTime: "Morning",
        compatibleSign: "Sagittarius",
        tip: "Express yourself fully in April — the world is listening.",
        scores: [
          { label: "Love", value: 82, color: "#e74c8b" },
          { label: "Career", value: 91, color: "#FF6F00" },
          { label: "Health", value: 73, color: "#34a853" },
          { label: "Finance", value: 77, color: "#4a90d9" },
          { label: "Luck", value: 86, color: "#9b59b6" },
        ],
      },
    },
  },
  {
    id: "cancer",
    name: "Cancer",
    symbol: "♋",
    emoji: "🦀",
    dateRange: "Jun 21 – Jul 22",
    element: "Water",
    horoscope: {
      today: { overview: "The Moon, your ruler, is in a harmonious position today, Cancer. Your intuition is extraordinarily sharp — trust those gut feelings completely. Home and family matters feel warm and comforting. A nurturing gesture you extend today returns to you tenfold.", love: "Deep emotional bonds strengthen today. Your empathy makes your partner feel truly seen and valued. Singles: your emotional authenticity is your most attractive quality.", career: "Your emotional intelligence navigates a tricky workplace dynamic beautifully. Your colleagues feel your supportive presence and reciprocate with loyalty.", health: "Emotional and physical wellbeing are closely linked for you today. A relaxing bath, good music, and an early night do wonders.", finance: "Home-related investments look favorable. A family financial matter resolves in your favor.", luckyNumber: "2", luckyColor: "Pearl White", luckyTime: "8:00 PM – 10:00 PM", compatibleSign: "Scorpio", tip: "Your sensitivity is your strength — never suppress it.",
        scores: [{ label: "Love", value: 92, color: "#e74c8b" }, { label: "Career", value: 70, color: "#FF6F00" }, { label: "Health", value: 75, color: "#34a853" }, { label: "Finance", value: 72, color: "#4a90d9" }, { label: "Luck", value: 78, color: "#9b59b6" }] },
      tomorrow: { overview: "A reflective tomorrow for Cancer. The emotional undercurrents of recent days surface and demand acknowledgment. Giving yourself permission to feel is not weakness — it's wisdom.", love: "Vulnerability deepens connection. Share something personal with your partner.", career: "Creative projects flourishes. Your imagination is a professional asset today.", health: "Extra rest is non-negotiable tonight. Honor your need for recuperation.", finance: "Avoid emotional spending. Make financial decisions from logic, not feeling.", luckyNumber: "7", luckyColor: "Silver Blue", luckyTime: "9:00 AM – 11:00 AM", compatibleSign: "Pisces", tip: "Rest is productive — you're processing more than you realize.",
        scores: [{ label: "Love", value: 80, color: "#e74c8b" }, { label: "Career", value: 72, color: "#FF6F00" }, { label: "Health", value: 68, color: "#34a853" }, { label: "Finance", value: 60, color: "#4a90d9" }, { label: "Luck", value: 65, color: "#9b59b6" }] },
      weekly: { overview: "Emotional growth and professional achievement go hand in hand this week for Cancer. The full moon mid-week illuminates your career sector with startling clarity — an important decision becomes obvious.", love: "Deep intimacy defines your week. Make time for genuine connection beyond surface conversation.", career: "Career full moon brings recognition or an important decision point. Trust your instincts.", health: "Water is your element — swimming, baths, or water-based exercise rejuvenates you.", finance: "A property or home-related financial matter progresses positively.", luckyNumber: "22", luckyColor: "Aqua", luckyTime: "Evening", compatibleSign: "Taurus", tip: "Let your emotions guide your decisions — they're your compass.",
        scores: [{ label: "Love", value: 88, color: "#e74c8b" }, { label: "Career", value: 80, color: "#FF6F00" }, { label: "Health", value: 78, color: "#34a853" }, { label: "Finance", value: 75, color: "#4a90d9" }, { label: "Luck", value: 82, color: "#9b59b6" }] },
      monthly: { overview: "April is a month of profound emotional healing and professional triumph for Cancer. The new moon invites you to release old wounds and open your heart to new possibilities. By month's end, you'll barely recognize the limitations you once accepted.", love: "April transforms your love life. Old patterns dissolve; authentic connection takes their place.", career: "Your emotional intelligence becomes your greatest professional asset this month. Leadership roles emerge.", health: "Healing is your April theme. Body, mind, and spirit all benefit from intentional self-care rituals.", finance: "Financial stability improves steadily. A home purchase or renovation decision made in April brings long-term happiness.", luckyNumber: "4", luckyColor: "Moonstone White", luckyTime: "Evenings", compatibleSign: "Virgo", tip: "Your healing is your power — April accelerates it.",
        scores: [{ label: "Love", value: 90, color: "#e74c8b" }, { label: "Career", value: 82, color: "#FF6F00" }, { label: "Health", value: 85, color: "#34a853" }, { label: "Finance", value: 78, color: "#4a90d9" }, { label: "Luck", value: 80, color: "#9b59b6" }] },
    },
  },
  {
    id: "leo",
    name: "Leo",
    symbol: "♌",
    emoji: "🦁",
    dateRange: "Jul 23 – Aug 22",
    element: "Fire",
    horoscope: {
      today: { overview: "The spotlight is yours today, Leo. The Sun amplifies your natural charisma and magnetism to extraordinary levels. Step forward, speak your truth, and let your authentic self dazzle. A creative project reaches a milestone that deserves celebration.", love: "Passion ignites! Your warmth and generosity make your partner feel like royalty. Singles: your radiant energy attracts admirers — enjoy the attention.", career: "Leadership opportunities arise naturally. Your vision inspires your team. A creative proposal gets enthusiastic support from decision-makers.", health: "Vitality is off the charts today. Physical activity — especially something performative like dance or sports — channels your solar energy beautifully.", finance: "Creative income sources look promising. A side project or artistic venture shows real financial potential.", luckyNumber: "1", luckyColor: "Royal Gold", luckyTime: "12:00 PM – 2:00 PM", compatibleSign: "Aries", tip: "Shine bright — the world needs your light today.",
        scores: [{ label: "Love", value: 90, color: "#e74c8b" }, { label: "Career", value: 88, color: "#FF6F00" }, { label: "Health", value: 85, color: "#34a853" }, { label: "Finance", value: 75, color: "#4a90d9" }, { label: "Luck", value: 92, color: "#9b59b6" }] },
      tomorrow: { overview: "A quieter day follows the brilliance, Leo. Tomorrow invites introspection. Recharge your solar batteries in solitude before your next grand performance.", love: "Quiet quality time over grand gestures tomorrow. Depth over drama.", career: "Behind-the-scenes strategizing pays off. Plan your next move carefully.", health: "Heart health — both literal and emotional — deserves attention. Rest and a heart-healthy meal.", finance: "Review spending from recent weeks. Recalibrate your budget.", luckyNumber: "5", luckyColor: "Amber", luckyTime: "4:00 PM – 6:00 PM", compatibleSign: "Gemini", tip: "Even the sun sets — recharging makes you brighter.",
        scores: [{ label: "Love", value: 74, color: "#e74c8b" }, { label: "Career", value: 70, color: "#FF6F00" }, { label: "Health", value: 80, color: "#34a853" }, { label: "Finance", value: 68, color: "#4a90d9" }, { label: "Luck", value: 72, color: "#9b59b6" }] },
      weekly: { overview: "A royal week for Leo. Your natural authority commands respect in every room you enter. Mid-week brings a creative breakthrough that could redefine a major project or relationship.", love: "Romance is theatrical and beautiful this week. Grand gestures land perfectly. Love yourself fiercely and it radiates outward.", career: "Your leadership week. A major presentation or meeting goes in your favor. Your confidence is genuinely contagious.", health: "Energy peaks Tuesday through Thursday. Maximize those days with purposeful physical activity.", finance: "Creative and performance-based income surges. Invest in your personal brand.", luckyNumber: "8", luckyColor: "Burnt Orange", luckyTime: "Late morning", compatibleSign: "Libra", tip: "Lead with heart this week — it's your most powerful tool.",
        scores: [{ label: "Love", value: 86, color: "#e74c8b" }, { label: "Career", value: 90, color: "#FF6F00" }, { label: "Health", value: 80, color: "#34a853" }, { label: "Finance", value: 78, color: "#4a90d9" }, { label: "Luck", value: 88, color: "#9b59b6" }] },
      monthly: { overview: "April is Leo's stage, and what a performance it will be. The month opens with your creativity at its absolute peak. Relationships, career, and personal growth all benefit from your irresistible solar glow. A major recognition or achievement arrives around the 20th.", love: "Love deepens and becomes more authentic this month. A relationship milestone is reached.", career: "Career highlights include a major achievement around the 20th and consistent recognition throughout the month.", health: "Vitality and physical confidence are your April gifts. Try a new physical challenge.", finance: "Creative income expands. Performance and presentation-based opportunities bring financial reward.", luckyNumber: "19", luckyColor: "Sunflower Yellow", luckyTime: "Noon", compatibleSign: "Sagittarius", tip: "April is your encore — give the performance of your life.",
        scores: [{ label: "Love", value: 88, color: "#e74c8b" }, { label: "Career", value: 93, color: "#FF6F00" }, { label: "Health", value: 84, color: "#34a853" }, { label: "Finance", value: 82, color: "#4a90d9" }, { label: "Luck", value: 90, color: "#9b59b6" }] },
    },
  },
  {
    id: "virgo",
    name: "Virgo",
    symbol: "♍",
    emoji: "👧",
    dateRange: "Aug 23 – Sep 22",
    element: "Earth",
    horoscope: {
      today: { overview: "Your analytical mind is at its most refined today, Virgo. Mercury sharpens your already impressive attention to detail. A problem that has stumped others yields elegantly to your methodical approach. Your service to others today creates lasting goodwill.", love: "Acts of service speak louder than words in your love life today. Small, thoughtful gestures mean everything. Your partner feels deeply cared for.", career: "Problem-solving is your superpower today. You see solutions others miss. A health or wellness project gains momentum.", health: "Your body gives you clear signals today — honor them. A nutritional adjustment you've been considering is worth implementing.", finance: "Meticulous financial review uncovers a saving you'd overlooked. Small optimizations compound into significant gains.", luckyNumber: "5", luckyColor: "Sage Green", luckyTime: "9:00 AM – 11:00 AM", compatibleSign: "Taurus", tip: "Perfection is your gift to the world — share it generously.",
        scores: [{ label: "Love", value: 75, color: "#e74c8b" }, { label: "Career", value: 90, color: "#FF6F00" }, { label: "Health", value: 82, color: "#34a853" }, { label: "Finance", value: 88, color: "#4a90d9" }, { label: "Luck", value: 72, color: "#9b59b6" }] },
      tomorrow: { overview: "A socially connected tomorrow for Virgo. Step outside your usual careful circles and engage with new people. An unexpected conversation reveals a fresh perspective that genuinely excites you.", love: "Social settings bring romantic possibility tomorrow. Be less analytical and more spontaneous in love.", career: "Networking unlocks a professional door. Attend that event or accept that invitation.", health: "Balance analysis with physical movement. A walk with a friend combines both your social and wellness needs.", finance: "A collaborative financial opportunity deserves careful consideration. Due diligence is your natural gift.", luckyNumber: "3", luckyColor: "Navy Blue", luckyTime: "3:00 PM – 5:00 PM", compatibleSign: "Capricorn", tip: "Trust serendipity tomorrow — it works in your favor.", scores: [{ label: "Love", value: 72, color: "#e74c8b" }, { label: "Career", value: 78, color: "#FF6F00" }, { label: "Health", value: 75, color: "#34a853" }, { label: "Finance", value: 70, color: "#4a90d9" }, { label: "Luck", value: 68, color: "#9b59b6" }] },
      weekly: { overview: "A week of refinement and relationship harmony for Virgo. Your partnerships — personal and professional — benefit enormously from your thoughtful attention. Thursday brings a health and wellness revelation worth acting on.", love: "Partnership is your week's theme. Deep, honest conversation with your partner brings surprising clarity and closeness.", career: "Quality over quantity defines your professional week. One excellent piece of work speaks louder than ten mediocre ones.", health: "A new health routine implemented this week sticks. Your commitment to wellness is admirable and effective.", finance: "Detailed financial planning pays off. A savings strategy implemented now shows results by summer.", luckyNumber: "17", luckyColor: "Olive", luckyTime: "Morning hours", compatibleSign: "Cancer", tip: "Refinement is not perfectionism — it's love made visible.", scores: [{ label: "Love", value: 82, color: "#e74c8b" }, { label: "Career", value: 85, color: "#FF6F00" }, { label: "Health", value: 88, color: "#34a853" }, { label: "Finance", value: 84, color: "#4a90d9" }, { label: "Luck", value: 76, color: "#9b59b6" }] },
      monthly: { overview: "April is a month of beautiful partnership for Virgo. Your one-on-one relationships — romantic, professional, and platonic — deepen and flourish. The full moon mid-month illuminates your creative sector, unlocking an artistic or innovative side you may have suppressed.", love: "Partnership transforms in April. A commitment deepens or a significant new connection forms.", career: "Collaboration leads to your best work of the year. Trust others as much as you trust your own meticulous standards.", health: "Digestive health benefits from a dietary reset this month. Simple, clean eating yields remarkable results.", finance: "Financial partnerships look promising in April. A joint venture or shared investment deserves exploration.", luckyNumber: "8", luckyColor: "Dusty Rose", luckyTime: "Early morning", compatibleSign: "Pisces", tip: "Your greatest work in April is done alongside others.", scores: [{ label: "Love", value: 86, color: "#e74c8b" }, { label: "Career", value: 88, color: "#FF6F00" }, { label: "Health", value: 90, color: "#34a853" }, { label: "Finance", value: 82, color: "#4a90d9" }, { label: "Luck", value: 78, color: "#9b59b6" }] },
    },
  },
  {
    id: "libra",
    name: "Libra",
    symbol: "♎",
    emoji: "⚖️",
    dateRange: "Sep 23 – Oct 22",
    element: "Air",
    horoscope: {
      today: { overview: "Balance and beauty surround you today, Libra. Venus, your ruler, enhances your charm, aesthetic sense, and diplomatic skills. A social situation that felt tense finds elegant resolution through your thoughtful mediation. Beauty — in art, nature, or people — especially moves you today.", love: "Your romantic charm is at its peak today. Plan something aesthetically beautiful — a beautiful dinner, a gallery visit, a sunset walk. Your partner is captivated.", career: "Diplomacy wins the day in a workplace challenge. Your ability to see all sides and find common ground makes you invaluable.", health: "Balance your social activity with quiet restoration. Your kidneys and lower back benefit from adequate hydration and gentle stretching.", finance: "A fair financial agreement or settlement is reached. Your negotiation skills ensure you get what you deserve.", luckyNumber: "6", luckyColor: "Blush Pink", luckyTime: "4:00 PM – 6:00 PM", compatibleSign: "Gemini", tip: "Beauty is not superficial for you — it is spiritual.",
        scores: [{ label: "Love", value: 94, color: "#e74c8b" }, { label: "Career", value: 80, color: "#FF6F00" }, { label: "Health", value: 72, color: "#34a853" }, { label: "Finance", value: 76, color: "#4a90d9" }, { label: "Luck", value: 85, color: "#9b59b6" }] },
      tomorrow: { overview: "Tomorrow challenges your famous indecision, Libra. A decision you've been weighing demands resolution. Trust that you have enough information — choose and commit without looking back.", love: "Decisiveness in love is unexpectedly attractive tomorrow. Make a clear, loving choice and watch the response.", career: "Stop deliberating and start executing. The plan is good enough — launch it.", health: "Decision fatigue is real. Simplify your choices tomorrow to preserve mental energy.", finance: "Choose between two financial paths and commit fully. Half-measures dilute results.", luckyNumber: "9", luckyColor: "Lavender", luckyTime: "11:00 AM – 1:00 PM", compatibleSign: "Leo", tip: "A decisive Libra is an unstoppable Libra.", scores: [{ label: "Love", value: 78, color: "#e74c8b" }, { label: "Career", value: 75, color: "#FF6F00" }, { label: "Health", value: 70, color: "#34a853" }, { label: "Finance", value: 68, color: "#4a90d9" }, { label: "Luck", value: 74, color: "#9b59b6" }] },
      weekly: { overview: "A harmonious and productive week for Libra. Your social intelligence opens professional doors while your aesthetic vision impresses everyone around you. Wednesday brings a creative breakthrough.", love: "Love is beautiful this week. Shared aesthetic experiences — art, music, fine dining — deepen your bond.", career: "Your creative vision is in high demand. A design, proposal, or artistic project gets exceptional feedback.", health: "Beauty rituals double as health rituals this week. Massage, spa, quality skincare — all genuinely beneficial.", finance: "A partnership or collaborative financial venture looks very promising. Your negotiation secures favorable terms.", luckyNumber: "11", luckyColor: "Champagne", luckyTime: "Afternoon", compatibleSign: "Aquarius", tip: "Harmony you create ripples outward and comes back multiplied.", scores: [{ label: "Love", value: 88, color: "#e74c8b" }, { label: "Career", value: 84, color: "#FF6F00" }, { label: "Health", value: 76, color: "#34a853" }, { label: "Finance", value: 80, color: "#4a90d9" }, { label: "Luck", value: 86, color: "#9b59b6" }] },
      monthly: { overview: "April centers Libra's relational world. Partnerships of all kinds — romantic, professional, creative — are under a powerful, transformative influence. Make fair agreements and honor your commitments; the universe is watching and rewarding integrity.", love: "A relationship milestone of significance arrives this month. Deepen, commit, or honestly evaluate — April demands clarity.", career: "Joint ventures and collaborations define your professional April. Choose partners wisely and build something lasting.", health: "Balance is your health mantra in April. Equal parts activity and rest, social engagement and solitude.", finance: "Partnership finances improve. A fair settlement or shared financial goal progresses beautifully.", luckyNumber: "6", luckyColor: "Soft Coral", luckyTime: "Late afternoon", compatibleSign: "Aries", tip: "In April, your relationships become your greatest asset.", scores: [{ label: "Love", value: 92, color: "#e74c8b" }, { label: "Career", value: 86, color: "#FF6F00" }, { label: "Health", value: 78, color: "#34a853" }, { label: "Finance", value: 82, color: "#4a90d9" }, { label: "Luck", value: 88, color: "#9b59b6" }] },
    },
  },
  {
    id: "scorpio",
    name: "Scorpio",
    symbol: "♏",
    emoji: "🦂",
    dateRange: "Oct 23 – Nov 21",
    element: "Water",
    horoscope: {
      today: { overview: "Your perception reaches extraordinary depths today, Scorpio. You see through illusions that fool everyone else, and this gift serves you powerfully in both personal and professional spheres. A secret or hidden piece of information comes to light — handle it with your characteristic discretion and wisdom.", love: "Intensity defines your love life today. A deep conversation transforms your relationship. Vulnerability, though uncomfortable, unlocks profound connection.", career: "Your investigative instincts uncover something important at work. Trust your suspicions — follow the thread wherever it leads.", health: "Emotional detox is as important as physical. Release resentments you've been holding — they affect your body more than you realize.", finance: "A financial mystery resolves in your favor. Shared finances or inheritances look favorable.", luckyNumber: "8", luckyColor: "Deep Burgundy", luckyTime: "10:00 PM – 12:00 AM", compatibleSign: "Cancer", tip: "Truth is your superpower — wield it with compassion.",
        scores: [{ label: "Love", value: 86, color: "#e74c8b" }, { label: "Career", value: 88, color: "#FF6F00" }, { label: "Health", value: 70, color: "#34a853" }, { label: "Finance", value: 82, color: "#4a90d9" }, { label: "Luck", value: 78, color: "#9b59b6" }] },
      tomorrow: { overview: "Tomorrow calls for strategic patience, Scorpio. You can see exactly where things are heading — resist the urge to force the timeline. What you wait for arrives more completely than what you chase.", love: "Let love unfold at its own pace tomorrow. Your intensity is beautiful but overwhelming — soften the grip and enjoy the flow.", career: "Strategic withdrawal from a situation allows others to reveal their hands. Information you gather tomorrow is pure gold.", health: "Deep sleep is your greatest health investment tonight. Create a ritual that guarantees it.", finance: "Hold your position on a financial matter. Your patience will be rewarded when others capitulate.", luckyNumber: "0", luckyColor: "Onyx Black", luckyTime: "Midnight hours", compatibleSign: "Virgo", tip: "Power waits. Power doesn't chase.", scores: [{ label: "Love", value: 76, color: "#e74c8b" }, { label: "Career", value: 82, color: "#FF6F00" }, { label: "Health", value: 78, color: "#34a853" }, { label: "Finance", value: 74, color: "#4a90d9" }, { label: "Luck", value: 70, color: "#9b59b6" }] },
      weekly: { overview: "A transformative week for Scorpio. Pluto's influence intensifies your already remarkable focus and determination. What you commit to this week has the power to completely change your trajectory.", love: "Intensity brings breakthrough. A conversation you've avoided has the potential to completely transform your most important relationship.", career: "Power moves this week. A strategic decision made Tuesday changes the professional game in your favor.", health: "Transformation extends to your body. Commit to a detox, elimination diet, or deep wellness practice.", finance: "Research reveals a high-potential investment. Your due diligence this week precedes a significant financial decision.", luckyNumber: "13", luckyColor: "Magenta", luckyTime: "Late evening", compatibleSign: "Pisces", tip: "Transformation is your birthright — embrace it fully this week.", scores: [{ label: "Love", value: 84, color: "#e74c8b" }, { label: "Career", value: 90, color: "#FF6F00" }, { label: "Health", value: 76, color: "#34a853" }, { label: "Finance", value: 86, color: "#4a90d9" }, { label: "Luck", value: 82, color: "#9b59b6" }] },
      monthly: { overview: "April is a month of profound transformation and empowerment for Scorpio. Old versions of yourself are shed like a skin. The phoenix energy that defines your sign reaches its annual peak. An important financial or shared resource matter reaches resolution.", love: "Deep love transformation. Either existing bonds reach new intimacy or old ones finally release. Either way, you emerge freer.", career: "April brings a power shift in your professional life. You emerge stronger and more influential.", health: "Detox and renewal are April's health themes. A significant physical transformation is possible with commitment.", finance: "Shared finances, investments, and inheritances feature prominently. April brings important financial clarity and positive resolution.", luckyNumber: "9", luckyColor: "Crimson", luckyTime: "Evening and night", compatibleSign: "Taurus", tip: "April is your rebirth — rise from the ashes magnificently.", scores: [{ label: "Love", value: 88, color: "#e74c8b" }, { label: "Career", value: 92, color: "#FF6F00" }, { label: "Health", value: 80, color: "#34a853" }, { label: "Finance", value: 90, color: "#4a90d9" }, { label: "Luck", value: 86, color: "#9b59b6" }] },
    },
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    symbol: "♐",
    emoji: "🏹",
    dateRange: "Nov 22 – Dec 21",
    element: "Fire",
    horoscope: {
      today: { overview: "Adventure calls your name today, Sagittarius! Jupiter, your generous ruler, expands every opportunity in your path. A chance to learn something extraordinary, travel somewhere new, or meet a mind-expanding person presents itself. Say yes to the unexpected today.", love: "Love is expansive and philosophical today. A deep conversation about life, meaning, and dreams brings you closer to your partner. Singles: someone from a different background or culture intrigues you.", career: "Your big-picture thinking solves a problem that detail-focused colleagues couldn't crack. Your optimism is infectious and motivating for your entire team.", health: "Movement and freedom are your health medicine today. A run, hike, or bike ride in nature does more than any gym session.", finance: "An international or educational financial opportunity looks promising. Invest in expanding your knowledge base.", luckyNumber: "3", luckyColor: "Royal Purple", luckyTime: "1:00 PM – 3:00 PM", compatibleSign: "Aries", tip: "The arrow finds its mark — trust your aim today.",
        scores: [{ label: "Love", value: 80, color: "#e74c8b" }, { label: "Career", value: 82, color: "#FF6F00" }, { label: "Health", value: 88, color: "#34a853" }, { label: "Finance", value: 72, color: "#4a90d9" }, { label: "Luck", value: 90, color: "#9b59b6" }] },
      tomorrow: { overview: "Tomorrow asks Sagittarius to look inward before leaping outward. A quiet, reflective morning reveals an important truth about your direction and purpose.", love: "Philosophical depth in love tomorrow. Share your beliefs and values — a partner who aligns with them is your perfect match.", career: "A mentor's wisdom is available if you ask. Seek guidance from an experienced figure in your field.", health: "Hips and thighs — Sagittarius' body zones — benefit from stretching and mindful movement.", finance: "Review financial goals with honest eyes. Are you on the right trajectory?", luckyNumber: "7", luckyColor: "Cobalt Blue", luckyTime: "Dawn", compatibleSign: "Leo", tip: "The wisest arrows are aimed in silence before they fly.", scores: [{ label: "Love", value: 74, color: "#e74c8b" }, { label: "Career", value: 76, color: "#FF6F00" }, { label: "Health", value: 82, color: "#34a853" }, { label: "Finance", value: 68, color: "#4a90d9" }, { label: "Luck", value: 78, color: "#9b59b6" }] },
      weekly: { overview: "An expansive, freedom-loving week for Sagittarius. Jupiter activates travel, education, and philosophical exploration. A learning opportunity or journey mid-week could genuinely change your worldview.", love: "Love flourishes when you share adventures. Plan something exciting with your partner. Singles: travel or education environments bring romantic possibility.", career: "Your vision and optimism inspire your team to achieve more than they thought possible. A presentation or speech this week is genuinely moving.", health: "Outdoor adventure is your health prescription this week. The further from urban life, the better you'll feel.", finance: "A foreign or international financial connection shows promise. Legal and educational investments pay dividends.", luckyNumber: "21", luckyColor: "Turquoise", luckyTime: "Midday", compatibleSign: "Gemini", tip: "Expand in every direction this week — the universe supports it.", scores: [{ label: "Love", value: 82, color: "#e74c8b" }, { label: "Career", value: 86, color: "#FF6F00" }, { label: "Health", value: 90, color: "#34a853" }, { label: "Finance", value: 74, color: "#4a90d9" }, { label: "Luck", value: 92, color: "#9b59b6" }] },
      monthly: { overview: "April is a month of philosophical revolution for Sagittarius. Your beliefs, worldview, and understanding of life evolve significantly. Travel — physical or intellectual — brings the transformation. A commitment to higher learning or a meaningful journey shapes the rest of your year.", love: "Love takes on spiritual and philosophical depth this month. Relationships with intellectual and spiritual compatibility thrive.", career: "International connections, publishing, teaching, or speaking opportunities define your professional April.", health: "Adventure and outdoor activity are your health solutions this month. Challenge yourself physically.", finance: "International financial opportunities and educational investments yield strong returns in April.", luckyNumber: "12", luckyColor: "Sapphire", luckyTime: "Afternoon", compatibleSign: "Aries", tip: "The world is your classroom — let April expand your mind.", scores: [{ label: "Love", value: 84, color: "#e74c8b" }, { label: "Career", value: 88, color: "#FF6F00" }, { label: "Health", value: 92, color: "#34a853" }, { label: "Finance", value: 76, color: "#4a90d9" }, { label: "Luck", value: 94, color: "#9b59b6" }] },
    },
  },
  {
    id: "capricorn",
    name: "Capricorn",
    symbol: "♑",
    emoji: "🐐",
    dateRange: "Dec 22 – Jan 19",
    element: "Earth",
    horoscope: {
      today: { overview: "Your ambition and discipline are rewarded today, Capricorn. Saturn, your ruler, brings tangible recognition for your persistent hard work. A career achievement you've been climbing toward comes into clear view — you're almost there. Your reputation as reliable, excellent, and trustworthy pays dividends today.", love: "Stability and commitment define your love life today. Your reliability makes your partner feel deeply secure. Singles are drawn to someone equally ambitious and grounded.", career: "A promotion, recognition, or professional breakthrough feels imminent. Your consistent excellence is undeniable. A senior figure goes to bat for you.", health: "Bone and joint health benefit from calcium-rich foods and weight-bearing exercise. Don't neglect your knees — Capricorn's sensitive zone.", finance: "A long-term investment strategy you committed to begins showing meaningful returns. Your patient approach to wealth-building is unmatched.", luckyNumber: "10", luckyColor: "Charcoal Grey", luckyTime: "6:00 AM – 8:00 AM", compatibleSign: "Taurus", tip: "The mountain summit is in sight — your next step is the one that matters.",
        scores: [{ label: "Love", value: 74, color: "#e74c8b" }, { label: "Career", value: 95, color: "#FF6F00" }, { label: "Health", value: 76, color: "#34a853" }, { label: "Finance", value: 90, color: "#4a90d9" }, { label: "Luck", value: 80, color: "#9b59b6" }] },
      tomorrow: { overview: "Tomorrow invites Capricorn to connect socially — a rare and refreshing shift from your usual solitary ambition. The connections you make tomorrow have the potential to advance your long-term goals in ways you can't yet anticipate.", love: "Social settings bring surprising romantic warmth tomorrow. Let yourself be seen beyond your serious exterior.", career: "Networking is surprisingly fruitful. A casual conversation leads to a significant professional opportunity.", health: "Social laughter is genuinely healing. Allow yourself the luxury of enjoying people.", finance: "A social connection leads to an interesting financial introduction. Due diligence is still necessary.", luckyNumber: "4", luckyColor: "Dark Green", luckyTime: "7:00 PM – 9:00 PM", compatibleSign: "Virgo", tip: "Your network is your net worth — invest in it tomorrow.", scores: [{ label: "Love", value: 72, color: "#e74c8b" }, { label: "Career", value: 80, color: "#FF6F00" }, { label: "Health", value: 74, color: "#34a853" }, { label: "Finance", value: 76, color: "#4a90d9" }, { label: "Luck", value: 70, color: "#9b59b6" }] },
      weekly: { overview: "A career-defining week for Capricorn. Saturn's discipline and Jupiter's expansion work together in rare harmony to create professional opportunities of real significance. What you build this week has lasting foundations.", love: "Stability deepens into genuine warmth this week. A shared goal or plan creates beautiful partnership energy.", career: "The career week you've been working toward. A major opportunity or recognition arrives. Don't downplay your achievements.", health: "Structure your rest as carefully as your work this week. Sleep schedules and meal timing matter more than usual.", finance: "Significant financial progress this week. A long-term investment strategy locks in at favorable terms.", luckyNumber: "26", luckyColor: "Deep Brown", luckyTime: "Early morning", compatibleSign: "Scorpio", tip: "This week, your discipline becomes your destiny.", scores: [{ label: "Love", value: 76, color: "#e74c8b" }, { label: "Career", value: 96, color: "#FF6F00" }, { label: "Health", value: 78, color: "#34a853" }, { label: "Finance", value: 88, color: "#4a90d9" }, { label: "Luck", value: 82, color: "#9b59b6" }] },
      monthly: { overview: "April is potentially the most significant professional month of Capricorn's year. Saturn and Jupiter align to create a rare window of accelerated achievement. Goals that seemed years away become reachable. Commit fully and work with your characteristic excellence.", love: "Professional achievement makes you more attractive and confident in love. Relationships benefit from your April success energy.", career: "Career peak month. Summit achievements, recognition, and promotions all feature prominently in April.", health: "Manage work intensity with deliberate rest. Your body needs recovery time even when your ambition doesn't want to stop.", finance: "Significant financial milestones in April. Long-term wealth-building strategies reach important thresholds.", luckyNumber: "10", luckyColor: "Obsidian", luckyTime: "Predawn and early morning", compatibleSign: "Cancer", tip: "April is the summit month — plant your flag with pride.", scores: [{ label: "Love", value: 78, color: "#e74c8b" }, { label: "Career", value: 97, color: "#FF6F00" }, { label: "Health", value: 74, color: "#34a853" }, { label: "Finance", value: 92, color: "#4a90d9" }, { label: "Luck", value: 84, color: "#9b59b6" }] },
    },
  },
  {
    id: "aquarius",
    name: "Aquarius",
    symbol: "♒",
    emoji: "🏺",
    dateRange: "Jan 20 – Feb 18",
    element: "Air",
    horoscope: {
      today: { overview: "Your visionary mind operates on a frequency above the ordinary today, Aquarius. Uranus activates your most innovative thinking, and the ideas flowing through you are genuinely ahead of their time. Share them — the world needs your unique perspective. A humanitarian impulse leads to meaningful action.", love: "Friendship and intellectual connection power your love life today. Surprise your partner with an unconventional date idea that stimulates both your minds.", career: "Your innovative solutions impress colleagues who couldn't see outside the conventional box. A technology or social impact project gains momentum.", health: "Circulation and nervous system health are highlighted. Unusual movement — aerial yoga, cold therapy, dance — suits your unconventional energy.", finance: "Technology or innovation-sector investments look promising. A future-forward financial opportunity deserves attention.", luckyNumber: "11", luckyColor: "Electric Blue", luckyTime: "5:00 PM – 7:00 PM", compatibleSign: "Gemini", tip: "The future needs people who think like you — speak up today.",
        scores: [{ label: "Love", value: 76, color: "#e74c8b" }, { label: "Career", value: 90, color: "#FF6F00" }, { label: "Health", value: 74, color: "#34a853" }, { label: "Finance", value: 78, color: "#4a90d9" }, { label: "Luck", value: 86, color: "#9b59b6" }] },
      tomorrow: { overview: "Tomorrow deepens your social impact, Aquarius. Community, collective action, and shared vision bring you genuine fulfillment. A group project or social cause calls for your unique leadership.", love: "Your magnetism within a group draws someone special toward you. Shared values create strong romantic foundations.", career: "Group and community-focused professional activities flourish. Your ability to unite people around a vision is unparalleled.", health: "Community wellness activities — group fitness, team sports, or social yoga — energize you more than solo exercise.", finance: "Community investment or social enterprise financial models appeal to your values. Explore with due diligence.", luckyNumber: "22", luckyColor: "Aquamarine", luckyTime: "6:00 PM – 8:00 PM", compatibleSign: "Libra", tip: "Your tribe amplifies your light — surround yourself with visionaries.", scores: [{ label: "Love", value: 80, color: "#e74c8b" }, { label: "Career", value: 84, color: "#FF6F00" }, { label: "Health", value: 78, color: "#34a853" }, { label: "Finance", value: 72, color: "#4a90d9" }, { label: "Luck", value: 82, color: "#9b59b6" }] },
      weekly: { overview: "A revolutionary week for Aquarius. Uranus sparks unexpected breakthroughs that redefine what you thought was possible. Embrace disruption — what breaks this week was limiting you. What replaces it sets you free.", love: "Unconventional romance thrives. Break your usual patterns and see what surprising beauty emerges.", career: "An innovation or technology breakthrough at work makes you the person everyone wants to consult. Patent, document, or protect your ideas.", health: "Experiment with an unusual wellness modality this week — biohacking, breathwork, or sound healing. Aquarius thrives on the cutting edge.", finance: "Cryptocurrency, tech stocks, or innovation-sector investments show favorable movements. Stay informed.", luckyNumber: "77", luckyColor: "Violet", luckyTime: "Late afternoon", compatibleSign: "Sagittarius", tip: "Disruption this week is divinity in disguise.", scores: [{ label: "Love", value: 78, color: "#e74c8b" }, { label: "Career", value: 92, color: "#FF6F00" }, { label: "Health", value: 80, color: "#34a853" }, { label: "Finance", value: 76, color: "#4a90d9" }, { label: "Luck", value: 88, color: "#9b59b6" }] },
      monthly: { overview: "April activates Aquarius' most innovative and humanitarian impulses. A social impact project or technological innovation you've been developing reaches a critical and exciting stage. Community building, visionary leadership, and collective action define your most fulfilling April experiences.", love: "Friendship-based love deepens beautifully. The most romantic connection this April grows from genuine intellectual compatibility.", career: "Innovation, technology, and social impact work reach exciting milestones in April. Your forward-thinking approach attracts visionary collaborators.", health: "Your nervous system needs grounding amid April's exciting energy. Meditation, nature, and digital detox are your medicines.", finance: "Future-focused financial strategies — sustainable investing, tech sector — align with your values and show strong April performance.", luckyNumber: "11", luckyColor: "Indigo", luckyTime: "Late afternoon and evening", compatibleSign: "Leo", tip: "Your vision for April becomes the blueprint for tomorrow's world.", scores: [{ label: "Love", value: 80, color: "#e74c8b" }, { label: "Career", value: 94, color: "#FF6F00" }, { label: "Health", value: 76, color: "#34a853" }, { label: "Finance", value: 80, color: "#4a90d9" }, { label: "Luck", value: 90, color: "#9b59b6" }] },
    },
  },
  {
    id: "pisces",
    name: "Pisces",
    symbol: "♓",
    emoji: "🐟",
    dateRange: "Feb 19 – Mar 20",
    element: "Water",
    horoscope: {
      today: { overview: "Your intuition is a divine compass today, Pisces. Neptune heightens your spiritual sensitivity and creative imagination to extraordinary levels. An artistic or spiritual practice deepens profoundly. You see beauty where others see nothing — share this gift generously with the world.", love: "Soul-level connection defines your love life today. A moment of pure, wordless understanding between you and your partner. Singles may feel a mysterious but powerful pull toward someone — trust it.", career: "Creative and intuitive work flourishes. Your imagination solves problems that logic alone cannot. An artistic contribution is noticed and valued.", health: "Water in all forms heals you today — swimming, bathing, drinking, visualizing. Your sensitive feet deserve some care as well.", finance: "Intuitive financial decisions made today have a remarkable track record. Trust your gut, but verify the facts.", luckyNumber: "7", luckyColor: "Sea Green", luckyTime: "Dusk – Dawn", compatibleSign: "Scorpio", tip: "Your imagination is not escapism — it is prophecy.",
        scores: [{ label: "Love", value: 95, color: "#e74c8b" }, { label: "Career", value: 78, color: "#FF6F00" }, { label: "Health", value: 72, color: "#34a853" }, { label: "Finance", value: 70, color: "#4a90d9" }, { label: "Luck", value: 88, color: "#9b59b6" }] },
      tomorrow: { overview: "Tomorrow grounds Pisces beautifully. Dreams become plans; visions become actions. A creative project takes practical form. Someone in your life offers exactly the grounded perspective you need to hear.", love: "Love becomes practical and tangible tomorrow. Actions speak louder than feelings — do something concrete to show you care.", career: "Turn your creative vision into a concrete proposal or plan. The timing is perfect for practical implementation of imaginative ideas.", health: "Grounding practices — barefoot walking, earthing, root vegetables — connect your dreamy energy to solid earth.", finance: "A practical financial plan transforms a vague financial dream into an achievable goal.", luckyNumber: "12", luckyColor: "Seafoam", luckyTime: "10:00 AM – 12:00 PM", compatibleSign: "Taurus", tip: "Your dreams deserve the dignity of a plan.", scores: [{ label: "Love", value: 82, color: "#e74c8b" }, { label: "Career", value: 80, color: "#FF6F00" }, { label: "Health", value: 76, color: "#34a853" }, { label: "Finance", value: 72, color: "#4a90d9" }, { label: "Luck", value: 80, color: "#9b59b6" }] },
      weekly: { overview: "A week of creative magic and spiritual depth for Pisces. Your artistic and intuitive gifts are in peak form. Mid-week brings a spiritual insight or creative breakthrough that changes how you see a major life area.", love: "Mystical, deep connection defines your romantic week. Poetry, music, candlelight — create an atmosphere as beautiful as your soul.", career: "Creative output this week reaches a new standard of excellence. Submit, share, or present your work — it's ready.", health: "Spiritual wellness is physical wellness for Pisces. Meditation, prayer, or spiritual practice strengthens your entire system.", finance: "An artistic or creative venture shows financial potential this week. Your creativity is a genuine income source.", luckyNumber: "9", luckyColor: "Violet Blue", luckyTime: "Twilight hours", compatibleSign: "Cancer", tip: "This week, your art is your prayer and your power.", scores: [{ label: "Love", value: 90, color: "#e74c8b" }, { label: "Career", value: 84, color: "#FF6F00" }, { label: "Health", value: 78, color: "#34a853" }, { label: "Finance", value: 74, color: "#4a90d9" }, { label: "Luck", value: 86, color: "#9b59b6" }] },
      monthly: { overview: "April is Pisces' most spiritually and creatively fertile month of the year. Neptune activates your deepest gifts — artistic, intuitive, healing, and spiritual. A creative project reaches its highest expression. A spiritual practice deepens into something transformative. You are operating at a soul level this month.", love: "Soul-mate energy surrounds your love life in April. A connection of rare depth and understanding either deepens or arrives.", career: "Creative work reaches its annual peak in April. Publish, exhibit, perform, or share — your work is at its most powerful.", health: "Sleep quality and dream life are rich and meaningful. Honor them with adequate rest and a pre-sleep ritual.", finance: "Creative and spiritual services or products show strong financial performance in April. Your gifts are genuinely valuable.", luckyNumber: "3", luckyColor: "Amethyst", luckyTime: "Twilight and dawn", compatibleSign: "Capricorn", tip: "April awakens the mystic, artist, and healer in you — let them all speak.", scores: [{ label: "Love", value: 96, color: "#e74c8b" }, { label: "Career", value: 86, color: "#FF6F00" }, { label: "Health", value: 80, color: "#34a853" }, { label: "Finance", value: 76, color: "#4a90d9" }, { label: "Luck", value: 90, color: "#9b59b6" }] },
    },
  },
];

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#FF6F00",
  Earth: "#34a853",
  Air: "#4a90d9",
  Water: "#4ac9d9",
};

const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  tomorrow: "Tomorrow",
  weekly: "This Week",
  monthly: "This Month",
};

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, value, color }: ScoreStat) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="font-poppins text-[11px] font-semibold text-[#555]">
          {label}
        </span>
        <span className="font-poppins text-[11px] font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#F0E8DF]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Detail Card ──────────────────────────────────────────────────────────────

function DetailCard({
  icon,
  label,
  content,
}: {
  icon: React.ReactNode;
  label: string;
  content: string;
}) {
  return (
    <div className="rounded-xl border border-[#F0E8DF] bg-white p-4 shadow-sm hover:border-brand-orange/40 hover:shadow-md transition-all">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF5EC] text-brand-orange">
          {icon}
        </span>
        <span className="font-poppins text-[12px] font-bold uppercase tracking-wide text-brand-orange">
          {label}
        </span>
      </div>
      <p className="font-euclid text-[13px] leading-[1.7] text-gray-600">
        {content}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HoroscopePage() {

  const [activePeriod, setActivePeriod] = useState<Period>("today");
  const [activeSign, setActiveSign] = useState<ZodiacSign>(SIGNS[0]);

  const horoscope = activeSign.horoscope[activePeriod];
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <BreadcrumbHeader
        title="Daily Horoscope"
        highlight="Astrogurujii"
        description="Discover what the stars have in store for you today. Personalized cosmic guidance for all 12 zodiac signs."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Horoscope" },
        ]}
      />

      {/* ── Period Tabs ── */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-[#F0E8DF]">
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[94px]">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`shrink-0 rounded-[6px] px-5 py-[7px] font-poppins text-[13px] font-semibold transition-all ${
                  activePeriod === p
                    ? "bg-brand-orange text-white shadow-md"
                    : "border border-[#E0D5CC] text-[#666] hover:border-brand-orange hover:text-brand-orange"
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-[94px] lg:py-10">
        <div className="flex flex-col gap-8 lg:flex-row">

          {/* ── Left: Sign Selector ── */}
          <aside className="w-full shrink-0 lg:w-[220px]">
            <p className="mb-3 font-poppins text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Select Your Sign
            </p>
            <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
              {SIGNS.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => setActiveSign(sign)}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 transition-all ${
                    activeSign.id === sign.id
                      ? "border-brand-orange bg-[#FFF5EC] shadow-md"
                      : "border-transparent bg-[#FAFAFA] hover:border-brand-orange/40 hover:bg-[#FFF5EC]"
                  }`}
                >
                  <span className="text-[22px]">{sign.symbol}</span>
                  <span
                    className={`font-poppins text-[10px] font-semibold leading-tight ${
                      activeSign.id === sign.id
                        ? "text-brand-orange"
                        : "text-[#555]"
                    }`}
                  >
                    {sign.name}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* ── Right: Content ── */}
          <div className="flex-1 min-w-0">

            {/* Sign Hero Banner */}
            <div
              className="mb-6 overflow-hidden rounded-2xl p-6 sm:p-8"
              style={{
                background: `linear-gradient(135deg, #FFF5EC 0%, #FFE8CC 50%, #FFF5EC 100%)`,
                borderLeft: `4px solid #FF6F00`,
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                {/* Symbol circle */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-4 ring-brand-orange/20">
                  <span className="text-[40px]">{activeSign.symbol}</span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-poppins text-[28px] font-bold text-[#1A1A1A]">
                      {activeSign.name}
                    </h1>
                    <span
                      className="rounded-full px-3 py-0.5 font-poppins text-[11px] font-semibold text-white"
                      style={{
                        backgroundColor:
                          ELEMENT_COLORS[activeSign.element],
                      }}
                    >
                      {activeSign.element}
                    </span>
                  </div>
                  <p className="mt-1 font-euclid text-[13px] text-gray-500">
                    {activeSign.dateRange}
                  </p>
                  <p className="mt-2 font-euclid text-[12px] text-gray-400">
                    {today} · {PERIOD_LABELS[activePeriod]} Horoscope
                  </p>
                </div>

                {/* Lucky quick-stats */}
                <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end">
                  <div className="rounded-lg bg-white/80 px-3 py-2 text-center shadow-sm">
                    <p className="font-poppins text-[10px] text-gray-400">
                      Lucky No.
                    </p>
                    <p className="font-poppins text-[18px] font-bold text-brand-orange">
                      {horoscope.luckyNumber}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/80 px-3 py-2 text-center shadow-sm">
                    <p className="font-poppins text-[10px] text-gray-400">
                      Compatible
                    </p>
                    <p className="font-poppins text-[14px] font-bold text-brand-orange">
                      {horoscope.compatibleSign}
                    </p>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="mt-5 rounded-xl bg-white/70 p-4 backdrop-blur-sm">
                <p className="font-euclid text-[14px] leading-[1.8] text-gray-700">
                  {horoscope.overview}
                </p>
              </div>

              {/* Daily Tip */}
              <div className="mt-3 flex items-start gap-3 rounded-lg border border-brand-orange/30 bg-brand-orange/5 p-3">
                <SparkleIcon />
                <p className="font-poppins text-[12px] font-semibold italic text-brand-orange">
                  {horoscope.tip}
                </p>
              </div>
            </div>

            {/* Scores */}
            <div className="mb-6 rounded-2xl border border-[#F0E8DF] bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-poppins text-[14px] font-bold text-[#1A1A1A] flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF6F00" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                {PERIOD_LABELS[activePeriod]} Scores
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {horoscope.scores.map((s) => (
                  <ScoreBar key={s.label} {...s} />
                ))}
              </div>
            </div>

            {/* Detail Cards Grid */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailCard
                icon={<LoveIcon />}
                label="Love & Relationships"
                content={horoscope.love}
              />
              <DetailCard
                icon={<CareerIcon />}
                label="Career & Work"
                content={horoscope.career}
              />
              <DetailCard
                icon={<HealthIcon />}
                label="Health & Wellness"
                content={horoscope.health}
              />
              <DetailCard
                icon={<FinanceIcon />}
                label="Finance & Money"
                content={horoscope.finance}
              />
            </div>

            {/* Lucky Details Strip */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: <NumberIcon />, label: "Lucky Number", value: horoscope.luckyNumber },
                { icon: <ColorIcon />, label: "Lucky Color", value: horoscope.luckyColor },
                { icon: <TimeIcon />, label: "Lucky Time", value: horoscope.luckyTime },
                { icon: <CompatibleIcon />, label: "Compatible Sign", value: horoscope.compatibleSign },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-[#F0E8DF] bg-[#FAFAFA] p-4 text-center shadow-sm"
                >
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF5EC] text-brand-orange">
                    {item.icon}
                  </div>
                  <span className="font-poppins text-[10px] text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </span>
                  <span className="font-poppins text-[13px] font-bold text-brand-orange">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Other Signs Carousel */}
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-[3px] w-6 rounded-full bg-brand-orange" />
                <h3 className="font-poppins text-[13px] font-bold uppercase tracking-widest text-[#1A1A1A]">
                  Other Signs
                </h3>
                <span className="h-[3px] flex-1 rounded-full bg-[#F0E8DF]" />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {SIGNS.filter((s) => s.id !== activeSign.id).map((sign) => (
                  <button
                    key={sign.id}
                    onClick={() => setActiveSign(sign)}
                    className="group flex shrink-0 flex-col items-center gap-1.5 rounded-xl border border-[#F0E8DF] bg-white px-4 py-3 shadow-sm transition-all hover:border-brand-orange hover:shadow-md"
                  >
                    <span className="text-[28px]">{sign.symbol}</span>
                    <span className="font-poppins text-[11px] font-semibold text-[#555] group-hover:text-brand-orange">
                      {sign.name}
                    </span>
                    <span className="font-euclid text-[9px] text-gray-400">
                      {sign.dateRange}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}