export const getFeedback = (guess, target) =>
  guess.split("").map((ch, i) =>
    ch === target[i]
      ? { letter: ch, color: "green" }
      : target.includes(ch)
      ? { letter: ch, color: "yellow" }
      : { letter: ch, color: "gray" }
  );
