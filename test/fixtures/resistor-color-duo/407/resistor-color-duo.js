export const value = ([color1, color2]) => {
    const colors = 
        {'black': '0', 
        'brown': '1', 
        'red': '2', 
        'orange': '3', 
        'yellow': '4', 
        'green': '5', 
        'blue': '6', 
        'violet': '7', 
        'grey': '8', 
        'white': '9'

    }
    return parseInt(colors[color1] + colors[color2])
}
