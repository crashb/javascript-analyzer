const COLORS = ['black','brown','red','orange','yellow','green','blue','violet','grey','white'];

let value = ([color1, color2]) => {
    let colorTotal = COLORS.indexOf(color1) + '' + COLORS.indexOf(color2);

    return Number(colorTotal);
}


export { value }; 