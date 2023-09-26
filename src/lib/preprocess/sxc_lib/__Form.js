import {buttonStyle} from "./__Buttons.js";
import {inputStyle} from "./__Input.js";
import {textStyle} from "./__Text.js";
import {flexboxStyle} from "./__Flexbox.js";
import {container, containerStyle} from "./__Container.js";

export let formStyle = (color = "#eee") => {

    return {
        ...containerStyle({
            bgColor:color
        }),
        ...flexboxStyle({  // For potential layout adjustments
            direction: "column",
            gap: "16px"
        }),
        _label: {
            ...textStyle({
                size: "1rem",
                weight: "500",
                color: "#333",
            }),
            marginBottom: "4px"
        },
        _input: {
            ...inputStyle({  // Using the inputStyle utility you provided
                padding: "10px 15px",
                borderRadius: "5px",
                fontSize: "1rem",
                margin: "0 0 15px 0",
                borderColorFocus: "#0056b3",
            }),
        },
        _button: {
            ...buttonStyle({  // Assuming you have a buttonStyle utility
                padding: "10px 20px",
                borderRadius: "5px",
                textColor: "#fff",
                bgColor: "#7ca6d9",
                fontSize: "1rem",
                hoverBgColor: "#0056b3",
            }),
            cursor: "pointer",
            width:"200px",
            transition: "all 0.3s ease-in-out",

        }
    }
}
