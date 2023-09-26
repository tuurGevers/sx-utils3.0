import {hexToRgb} from "./__Buttons.js";

export const glass = (opacity = '0.2', blur = '100px', color = "#fff") => ({
    background: `rgba(${hexToRgb(color)}, ${opacity})`, // White background with given opacity. Adjust color if needed.
    backdropFilter: `blur(${blur})`,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    border: '1px solid rgba(255, 255, 255, 0.2)', // Optional: Adds a bit of border for that frosted effect.
    borderRadius:"5px"
});
export const glassStyle = ({opacity = '0.4', blur = '10px',color = "#fff"}) => ({
    background: `rgba(255, 255, 255, ${opacity})`, // White background with given opacity. Adjust color if needed.
    backdropFilter: `blur(${blur})`,
    border: '1px solid rgba(255, 255, 255, 0.2)', // Optional: Adds a bit of border for that frosted effect.
});
