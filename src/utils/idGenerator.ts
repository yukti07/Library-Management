export function generateBookId(): string {
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `BK${randomNum}`;
}

export function generateUserId(): string {
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `US${randomNum}`;
}
