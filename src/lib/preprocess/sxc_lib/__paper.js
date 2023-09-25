export let paperStyle = ({
                             bgColor = "#FFFFFF",
                             borderRadius = "8px",
                             boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)",
                             padding = "20px",
                             width = "auto",
                             height = "auto",
                             transition = "all 0.3s ease",
                             hoverShadow = "0px 6px 12px rgba(0, 0, 0, 0.15)"
                         }) => {
    const baseStyle = {
        bgc: bgColor,
        borderRadius: borderRadius,
        boxShadow: boxShadow,
        padding: padding,
        width: width,
        height: height,
        transition: transition,
        "_:hover": {
            boxShadow: hoverShadow
        }
    };

    return {
        ...baseStyle,
    };
};
export let paper = (
                             bgColor = "#FFFFFF",
                             borderRadius = "8px",
                             boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)",
                             padding = "20px",
                             width = "auto",
                             height = "auto",
                             transition = "all 0.3s ease",
                             hoverShadow = "0px 6px 12px rgba(0, 0, 0, 0.15)"
                         ) => {
    const baseStyle = {
        bgc: bgColor,
        borderRadius: borderRadius,
        boxShadow: boxShadow,
        padding: padding,
        width: width,
        height: height,
        transition: transition,
        "_:hover": {
            boxShadow: hoverShadow
        }
    };

    return {
        ...baseStyle,
    };
};
