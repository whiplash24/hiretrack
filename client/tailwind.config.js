export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#3A1212",
        "bg-elev": "#4A1818",
        "bg-elev-2": "#5A1F1F",
        rule: "#6E2828",
        silver: "#C9C3C0",
        ink: "#F5EDEA",
        "ink-dim": "#B8A6A2",
        "ink-mute": "#8A7A76",
        accent: "#F2C14E",
        "status-applied": "#B8A6A2",
        "status-oa": "#8FB4C7",
        "status-interview": "#F2C14E",
        "status-offer": "#7FA97E",
        "status-rejected": "#8A7A76",
      },
      fontFamily: {
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "1.3", letterSpacing: "0.08em" }],
        xs: ["11px", { lineHeight: "1.4", letterSpacing: "0.06em" }],
        sm: ["13px", { lineHeight: "1.5" }],
        base: ["15px", { lineHeight: "1.55" }],
        lg: ["18px", { lineHeight: "1.5" }],
        xl: ["22px", { lineHeight: "1.35" }],
        "2xl": ["28px", { lineHeight: "1.2" }],
        "3xl": ["40px", { lineHeight: "1.1" }],
        "4xl": ["60px", { lineHeight: "1.02" }],
        "5xl": ["96px", { lineHeight: "0.95" }],
      },
      spacing: {
        18: "72px",
        30: "120px",
      },
      borderRadius: {
        none: "0",
        DEFAULT: "0",
      },
    },
  },
  corePlugins: {
    boxShadow: false,
  },
  plugins: [],
}
