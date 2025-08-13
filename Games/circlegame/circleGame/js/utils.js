// utils.js
export function weightedPick(list, weightKey) {
  if (!list?.length) return null;
  const total = list.reduce((a, it) => a + (Number(it[weightKey]) || 0), 0);
  if (total <= 0) return list[Math.floor(Math.random() * list.length)];
  let r = Math.random() * total;
  for (const it of list) {
    r -= (Number(it[weightKey]) || 0);
    if (r <= 0) return it;
  }
  return list[list.length - 1];
}
