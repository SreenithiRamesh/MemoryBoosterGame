export const particleConfig = {
  background: {
    color: { value: "#0F172A" },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
    },
  },
  particles: {
    color: {
      value: ["#00FFF7", "#FF00FF", "#FFC300"],
    },
    links: {
      color: "#00FFF7",
      distance: 130,
      enable: true,
      opacity: 0.3,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      speed: 2,
      outModes: { default: "bounce" },
    },
    number: {
      value: 50,
      density: { enable: true, area: 800 },
    },
    opacity: {
      value: 0.6,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 2, max: 4 },
    },
  },
  detectRetina: true,
};
