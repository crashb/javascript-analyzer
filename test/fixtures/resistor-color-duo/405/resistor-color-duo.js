export const COLORS = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'grey',
  'white'
];

export const value = (arrayOfColors) => {
  let sum = '';
  arrayOfColors.forEach(color => {
    sum += String(COLORS.indexOf(color));
  });
  return parseInt(sum);
}