const colorCode = (color) => {
  const COLORS = [
    'black', 'brown', 'red', 'orange', 'yellow',
    'green', 'blue', 'violet', 'grey', 'white'
  ];
  return COLORS.indexOf(color);
};

export const value = (colors) => {
  return parseInt(colors.map(colorCode).join(""));
};
