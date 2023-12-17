export function ageFromBirthday(birthday: Date): number {
  const today: Date = new Date();
  const age: number = today.getFullYear() - birthday.getFullYear();
  const m: number = today.getMonth() - birthday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
    return age - 1;
  }
  return age;
}
