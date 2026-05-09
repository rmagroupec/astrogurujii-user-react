import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ── Spacing (dimension scale: xs*2 chain) ── */
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "32px",
        xl: "64px",
      },

      /* ── Border Radius ── */
      borderRadius: {
        sm: "4px",
        lg: "8px",
        xl: "16px",
      },

      /* ── Font Families (token + Figma design) ── */
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        instrument: ["Instrument Sans", "sans-serif"],
        euclid: ["DM Sans", "sans-serif"], // Euclid Circular A substitute
      },

      /* ── Font Sizes (modular scale 1.25, base 16) ── */
      fontSize: {
        xs: "10px",
        sm: "14px",
        base: "16px",
        "review-name": ["19px", { lineHeight: "20px" }],
        "review-date": ["12px", { lineHeight: "20px" }],
        h6: "16px",
        h5: "20px",
        h4: "25px",
        h3: "31px",
        h2: "39px",
        h1: "49px",
      },

      /* ── Line Heights ── */
      lineHeight: {
        heading: "110%",
        body: "140%",
      },

      /* ── Letter Spacing ── */
      letterSpacing: {
        default: "0",
        increased: "0.15em",
        decreased: "-0.05em",
      },

      /* ── Opacity ── */
      opacity: {
        low: "0.1",
        md: "0.5",
        high: "0.9",
      },

      /* ── Colors (full token palette + Figma design colors) ── */
      colors: {
        black: "#000000",
        white: "#ffffff",
        gray: {
          100: "#f7fafc",
          200: "#edf2f7",
          300: "#e2e8f0",
          400: "#cbd5e0",
          500: "#a0aec0",
          600: "#718096",
          700: "#4a5568",
          800: "#2d3748",
          900: "#1a202c",
        },
        red: {
          100: "#fff5f5",
          200: "#fed7d7",
          300: "#feb2b2",
          400: "#fc8181",
          500: "#f56565",
          600: "#e53e3e",
          700: "#c53030",
          800: "#9b2c2c",
          900: "#742a2a",
        },
        orange: {
          100: "#fffaf0",
          200: "#feebc8",
          300: "#fbd38d",
          400: "#f6ad55",
          500: "#ed8936",
          600: "#dd6b20",
          700: "#c05621",
          800: "#9c4221",
          900: "#7b341e",
        },
        yellow: {
          100: "#fffff0",
          200: "#fefcbf",
          300: "#faf089",
          400: "#f6e05e",
          500: "#ecc94b",
          600: "#d69e2e",
          700: "#b7791f",
          800: "#975a16",
          900: "#744210",
        },
        green: {
          100: "#f0fff4",
          200: "#c6f6d5",
          300: "#9ae6b4",
          400: "#68d391",
          500: "#48bb78",
          600: "#38a169",
          700: "#2f855a",
          800: "#276749",
          900: "#22543d",
        },
        teal: {
          100: "#e6fffa",
          200: "#b2f5ea",
          300: "#81e6d9",
          400: "#4fd1c5",
          500: "#38b2ac",
          600: "#319795",
          700: "#2c7a7b",
          800: "#285e61",
          900: "#234e52",
        },
        blue: {
          100: "#ebf8ff",
          200: "#bee3f8",
          300: "#90cdf4",
          400: "#63b3ed",
          500: "#4299e1",
          600: "#3182ce",
          700: "#2b6cb0",
          800: "#2c5282",
          900: "#2a4365",
        },
        indigo: {
          100: "#ebf4ff",
          200: "#c3dafe",
          300: "#a3bffa",
          400: "#7f9cf5",
          500: "#667eea",
          600: "#5a67d8",
          700: "#4c51bf",
          800: "#434190",
          900: "#3c366b",
        },
        purple: {
          100: "#faf5ff",
          200: "#e9d8fd",
          300: "#d6bcfa",
          400: "#b794f4",
          500: "#9f7aea",
          600: "#805ad5",
          700: "#6b46c1",
          800: "#553c9a",
          900: "#44337a",
        },
        pink: {
          100: "#fff5f7",
          200: "#fed7e2",
          300: "#fbb6ce",
          400: "#f687b3",
          500: "#ed64a6",
          600: "#d53f8c",
          700: "#b83280",
          800: "#97266d",
          900: "#702459",
        },
        /* ── Semantic color tokens (shared with figma-convert) ── */
        primary: {
          DEFAULT: "#FF6F00",
          light: "#FFF7F0",
        },
        secondary: {
          DEFAULT: "#1976D2",
          light: "#2196F3",
          pale: "#67A9FF",
        },
        accent: {
          yellow: "#FFCC33",
          "yellow-light": "#FFFEEA",
          "yellow-warm": "#FFFDEC",
          green: "#34A853",
          teal: "#34CFB6",
          pink: "#FF81CA",
          red: "#FF0000",
        },
        /* ── Figma design-specific accent colors ── */
        brand: {
          orange: "#ff6f00",
          green: "#34a853",
          red: "#d41000",
          pink: "#ff81ca",
          teal: "#34cfb6",
          blue: "#67a9ff",
          gold: "#ffcc33",
          coral: "#f26633",
          amber: "#ee802c",
        },
        surface: {
          peach: "#fff7f0",
          cream: "#fffdec",
          lemon: "#fffeea",
          light: "#fffcee",
        },
        text: {
          primary: "#000000",
          secondary: "#2c2c2c",
          muted: "#575757",
          subtle: "#4d4d4d",
          light: "#7e7e7e",
          disabled: "#cccccc",
        },
      },
    },
  },
  plugins: [],
};

export default config;
