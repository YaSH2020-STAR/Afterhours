export const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export const stagger = (delay = 0.06) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: delay },
  },
});
