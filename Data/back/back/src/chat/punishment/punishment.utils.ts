export function getTimeDiff(start: Date, end: Date): number {
  const msInMin = 1000 * 60;
  return Math.round(Math.abs(Number(end) - Number(start)) / msInMin);
}
