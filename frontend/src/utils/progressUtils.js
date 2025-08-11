export const saveProgress = (progress) => {
  try {
    localStorage.setItem('wordleProgress', JSON.stringify(progress));
    return true;
  } catch (e) {
    console.error("Failed to save progress", e);
    return false;
  }
};

export const loadProgress = () => {
  try {
    const saved = localStorage.getItem('wordleProgress');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error("Failed to load progress", e);
    return null;
  }
};