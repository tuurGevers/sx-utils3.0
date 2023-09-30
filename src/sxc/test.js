import {gridStyle} from "../lib/index.js";

export const color_scheme = {
    primary: '#6fb3cc',
    accent: "#5aa3a3",
    white: "#ffffff",
    black: "#3d3d3d",
    action: "#F8B500"
}


export let profileGrid = {
    ...gridStyle({
        columns: "4",
        minColumnWidth: "300px",
        gap: "2rem",
    }),
    height: "100%",
    width: "30%",
    m: "4vh auto 0 auto",
    md: {
        gridTemplateColumns: "repeat(2, 1fr)",
    },
    sm: {
        gridTemplateColumns: "repeat(1, 1fr)",
    }

}
