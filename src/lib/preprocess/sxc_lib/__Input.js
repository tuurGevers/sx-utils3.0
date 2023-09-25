export let inputStyle = ({
                             bgColor = "#FFFFFF",
                             textColor = "#333",
                             padding = "10px 15px",
                             borderRadius = "4px",
                             borderWidth = "1px",
                             borderStyle = "solid",
                             borderColor = "#ccc",
                             fontSize = "1rem",
                             fontWeight = "400",
                             transition = "all 0.3s",
                             borderColorFocus = "#0056b3",
                             shadowColor = "0,0,0",
                             margin = "0",
                         }) => ({
    bgc: bgColor,
    color: textColor,
    padding: padding,
    borderRadius: borderRadius,
    borderWidth: borderWidth,
    borderStyle: borderStyle,
    borderColor: borderColor,
    fontSize: fontSize,
    fontWeight: fontWeight,
    transition: transition,
    outline: "none",
    margin: margin,
    "_:focus": {
        borderColor: borderColorFocus,
        boxShadow: `0 0 0 0.2rem rgba(${shadowColor}, 0.25)`
    }
});
