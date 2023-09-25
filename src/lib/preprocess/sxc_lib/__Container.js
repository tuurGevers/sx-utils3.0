export let container = (
    bgColor = "transparent", // Optional background color
    color = "#000", // Optional text color
    position = "relative"
) => ({
        backgroundColor: bgColor,
        color: color,
        position: position,
    }
);
export let containerStyle = ({
                                 bgColor = "transparent", // Optional background color
                                 color = "#000", // Optional text color
                                 position = "relative"
                             }
) => ({
        backgroundColor: bgColor,
        color: color,
        position: position,
    }
);
