export function createId(prefix = "id"): string {
  const randomPart = Math.random().toString(16).slice(2);
  return `${prefix}-${Date.now()}-${randomPart}`;
}
