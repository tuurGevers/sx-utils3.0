export let text = (size = "16px", color = "inherit", weight = "normal", align = "left", font = "sans-serif") => ({
    fontSize: size,
    color: color,
    fontWeight: weight,
    textAlign: align,
    fontFamily: font,
});
export let textStyle = ({
                              size = "16px",
                              color = "inherit",
                              weight = "normal",
                              align = "left",
                              font = "sans-serif",
                              lineHeight = '1.5',
                              letterSpacing = 'normal',
                              textTransform = 'none',
                              textDecoration = 'none',
                              whiteSpace = 'normal',
                              overflowWrap = 'break-word',
                              textShadow = 'none'
                          }) => ({
    fontSize: size,
    color: color,
    fontWeight: weight,
    textAlign: align,
    fontFamily: font,
    lineHeight: lineHeight,
    letterSpacing: letterSpacing,
    textTransform: textTransform,
    textDecoration: textDecoration,
    whiteSpace: whiteSpace,
    overflowWrap: overflowWrap,
    textShadow: textShadow
});
