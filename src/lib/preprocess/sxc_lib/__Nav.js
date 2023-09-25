import {flexbox} from "./__Flexbox.js";

export let hoverScale = (scaleFactor = 1.1) => ({
    "_ a:hover": {
        transform: `scale(${scaleFactor})`
    }
});
export let hoverColorChange = (color = "#666") => ({
    "_ a:hover": {
        backgroundColor: color
    }
});
export let hoverShadow = (shadow = "0px 4px 8px rgba(0, 0, 0, 0.1)") => ({
    "_ a:hover": {
        boxShadow: shadow
    }
});
export let hoverRotate = (degree = 15) => ({
    "_ a:hover": {
        transform: `rotate(${degree}deg)`
    }
});
export let hoverOpacity = (opacityLevel = 0.7) => ({
    "_ a:hover": {
        opacity: opacityLevel
    }
});

export let navbarStyle = (
    {bgColor = "#333"},
) => {
    return {
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 15px",
        cursor: "pointer",
    };
};export let navbar = (
    bgColor = "#333",
) => {
    return {
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 15px",
        cursor: "pointer",
    };
};

export let sidenavStyle = (
    {
        bgColor = "#333",
        width = "300px",
        smallWidth = "100px",
        justifyContent = "space-around",
        alignItems = "center",
        zIndex = "11",
    }
) => {
    return {
        backgroundColor: bgColor,
        flexDirection: "column",
        alignItems: alignItems,
        justifyContent: justifyContent,
        padding: "15px 0",
        width: width,
        height: "100%",
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: zIndex,
        overflowY: "auto",
        transition: "all 0.3s ease",
        sm: {
            width:smallWidth,
            minWidth:"50px",
        },
        "_ a": {
            sm: {
                display: "none"
            }
        },
        "_ div":{
            ...flexbox("row",  "center", "space-around"  ),
        }


    }
}
export let sidenav = (

        bgColor = "#333",
        width = "300px",
        smallWidth = "100px",
        justifyContent = "space-around",
        alignItems = "center",
        display = "true",
        zIndex = "11",

) => {
    return {
        display: display ? "flex" : "none",
        backgroundColor: bgColor,
        flexDirection: "column",
        alignItems: alignItems,
        justifyContent: justifyContent,
        padding: "15px 0",
        width: width,
        height: "100%",
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: zIndex,
        overflowY: "auto",
        transition: "all 0.3s ease",
        sm: {
            width:smallWidth,
            minWidth:"50px",
        },
        "_ a": {
            sm: {
                display: "none"
            }
        },
        "_ div":{
            ...flexbox("row",  "center", "space-around"  ),
        }


    }
}

