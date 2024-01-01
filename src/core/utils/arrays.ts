export const rotateNA: (array: number[]) => number[] = (
  array: number[],
): number[] => {
  return [array[0], ...array.slice(-1), ...array.slice(1, -1)];
};
