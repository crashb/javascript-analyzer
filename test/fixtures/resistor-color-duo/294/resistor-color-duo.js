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

export const value = colorArr => {
  return parseInt(
    colorArr.reduce((acc, next) => acc + COLORS.indexOf(next), '')
  );
};
