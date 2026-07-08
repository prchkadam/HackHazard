export function generateGuestId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `guest_${timestamp}_${randomPart}`;
}

export function generateGuestName(): string {
  const adjectives = ['Curious', 'Calm', 'Bright', 'Steady', 'Hopeful'];
  const index = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[index]} Learner`;
}
