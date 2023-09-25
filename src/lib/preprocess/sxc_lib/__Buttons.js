export let buttonStyle = ({
                              bgColor = "#007BFF",
                              textColor = "#FFFFFF",
                              hoverBgColor = "#0056b3",
                              hoverTextColor = "#FFFFFF",
                              padding = "40px 20px",
                              borderRadius = "4px",
                              borderWidth = "1px",
                              borderStyle = "solid",
                              borderColor = "#007BFF",
                              hoverBorderColor = "#0056b3",
                              fontSize = "2rem",
                              fontWeight = "400",
                              transition = "all 0.3s",
                              margin = "0",
                          }
) => ({
    backgroundColor: bgColor,
    color: textColor,
    padding: padding,
    borderRadius: borderRadius,
    borderWidth: borderWidth,
    borderStyle: borderStyle,
    borderColor: borderColor,
    fontSize: fontSize,
    fontWeight: fontWeight,
    transition: transition,
    cursor: "pointer",
    outline: "none",
    margin: margin,
    "_:hover": {
        backgroundColor: hoverBgColor,
        color: hoverTextColor,
        borderColor: hoverBorderColor
    },
    "_:focus": {
        boxShadow: `0 0 0 0.2rem rgba(${hexToRgb(bgColor)}, 0.25)`
    }
});

// Utility to convert HEX color to RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return `${r},${g},${b}`;
}
