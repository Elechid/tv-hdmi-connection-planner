export function hdmi(ports, high, shared, consoles, other) {
  if (high > ports || (shared && !high) || (!shared && high === ports)) throw new RangeError();
  const totalRemaining = ports - 1 - consoles - other;
  const highRemaining = high - shared - consoles;
  return [Math.min(highRemaining, Math.max(0, totalRemaining)), totalRemaining];
}
