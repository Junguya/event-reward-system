// 로그인 시 필요한 유틸 함수
export function parseExpiryToMs(exp: string): number {
  const match = /^(\d+)([smhd])$/.exec(exp);
  if (!match) throw new Error('Invalid expiresIn format: ' + exp);

  const [, amountStr, unit] = match;
  const amount = parseInt(amountStr, 10);
  const unitMs = { s: 1000, m: 60000, h: 3600000, d: 86400000 };

  return amount * unitMs[unit as keyof typeof unitMs];
}

export function toKSTString(date: Date): string {
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + 9 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
}
