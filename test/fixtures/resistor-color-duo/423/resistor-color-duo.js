const COLORS = {
  'black' : 0,
  'brown' : 1,
  'red' : 2,
  'orange' : 3,
  'yellow' : 4,
  'green' : 5,
  'blue' : 6,
  'violet' : 7,
  'grey' : 8,
  'white' : 9
}
export const value = ([color1, color2]) => {
  return(Number(String(COLORS[color1]) + String(COLORS[color2])))
}
