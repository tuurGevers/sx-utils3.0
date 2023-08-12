export const buttonVariant = (color = 'blue', width = "100px") => ({
    bgc: color,
    width: width,
    height: 30,
    borderRadius: '5px',
    sm: {
        width: 40
    },
    md: {
        width: '70%'
    },
    lg: {
        width: '50%'
    },
    h_: {
        bgc: "blue"
    },
    _button: {
        bgc: "black",
        h_: {
            bgc: "red"
        },
        sm: {
            width: 40,
            h_: {
                bgc: "orange"
            },
        },
        md: {
            width: '70%'
        },
        lg: {
            width: '50%'
        },
    }
});
