// sxc_test.js
export const example1 = {
    color: "Red",
    _p:{
        animation: "expand 1s ease-in-out",

    }
};

export const example2 = {
    height: "100vh"
};

// sxc_test.js


export const button = {
    color: "blue",
    h_: {
        color: "orange"
    },
    sm: {
        width: '100%',

    },
    md: {
        width: '70%',
        h_: {
            color: "red"
        }
    },
    lg: {
        width: '50%',
        h_: {
            color: "black"
        }
    },


}
export const kf_expand = {
    "0%": {
        transform: "translate(0,4)",
        opacity: 0,
    },
    "50%": {
        transform: "scale(1.5)",
        opacity: 0.5,
    },
    "100%": {
        transform: "scale(1)",
        opacity: 1,
    }
}

export const div = {
    bgc:"black",

    sm:{
        bgc:"green !important"
    },
    md:{
        bgc:"blue"
    },

    lg:{
        bgc:"yellow"
    },
    "_p:nth-child(2)": {
        color: "green"

    },

    "_p:nth-child(3)": {
        color: "blue",
        bgc: "yellow"
    },
    "_::before": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgc: "rgba(0,0,0,0.2)",
        BlendMode: "multiply",
    },
}
