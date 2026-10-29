// Reader feedback numbers as text, for the admin (Overview, posts list, editor).

const number = new Intl.NumberFormat("en-US");

export const formatCount = (n) => number.format(n);

/** "123 reads · 8 likes · 1 dislike" */
export function feedbackLine({ reads, likes, dislikes }) {
  const plural = (n, word) => `${number.format(n)} ${word}${n === 1 ? "" : "s"}`;
  return `${plural(reads, "read")} · ${plural(likes, "like")} · ${plural(dislikes, "dislike")}`;
}
