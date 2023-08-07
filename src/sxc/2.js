export const buttonVariant = (color = 'blue', width = "100px") => ({
    backgroundColor: color,
    width: width,
    height: '50px',
    borderRadius: '5px',
    sm: {
        width: '100%'
    },
    md: {
        width: '70%'
    },
    lg: {
        width: '50%'
    }
});
