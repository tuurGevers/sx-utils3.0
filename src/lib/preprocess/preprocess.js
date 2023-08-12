import fs from 'fs';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';

export default function sxPreprocessor(dir = '../../sxc/') {
    // Get the current file and directory paths
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sxcDir = path.join(__dirname, dir);

    // Read all files in the sxc directory
    const files = fs.readdirSync(sxcDir);

    // Object to store all the imported sx classes
    const allSxClasses = {};
    let count = 0
    // Dynamically import all the files
    files.forEach(file => {
        if (file.endsWith('.js')) {
            const modulePath = pathToFileURL(path.join(sxcDir, file));
            import(modulePath).then(module => {
                // Add the unique class name as a prop to each component
                Object.values(module).forEach(component => {
                    component.props = {
                        ...component.props,
                        uniqueClassName: `sxClassGenerated${count}`,
                    };
                });

                // Merge the imported sx classes into allSxClasses object
                Object.assign(allSxClasses, module);
            });
        }
    });

    return {
        markup({content, filename}) {
            if (!filename.includes("Pre_")) {
                return
            } else {
                console.log(filename)
            }
            let modifiedContent = content;
            let allStyles = '';
            let reactiveStatements = '';
            let uniqueClassName = '';

            // Breakpoints for media queries
            const breakpoints = {
                sm: 'only screen and (max-width: 640px)',
                md: 'only screen and (max-width: 768px) and (min-width: 641px)',
                lg: 'only screen and (min-width: 769px)',
            };

            // Map to store media query styles for each breakpoint
            const mediaStylesMap = {
                sm: '',
                md: '',
                lg: '',
            };

            // Regular expression to match sxClass attribute in the content
            const regex = /sxClass="([^"]+)"/g;
            let matches;
            let count = 0;

            // Loop through all instances of sxClass in the content
            while ((matches = regex.exec(content)) !== null) {
                let styleContent = '';
                let inlineStyles = ''; // For generating the inline styles for variables
                uniqueClassName = `sxClassGenerated${count}`;
                const classNames = matches[1].split(' ').map(name => name.trim());

                classNames.forEach((item, index) => {
                    let individualStyleContent = '';
                    let hoverStyleContent = '';
                    const [name, ...params] = item.split(':');
                    const actualClassName = name;

                    // Generate inline styles for the variables
                    params.forEach((param, pIndex) => {
                        inlineStyles += `--${actualClassName}-param${pIndex + 1}: ${param};`;
                    });

                    if (allSxClasses[actualClassName]) {
                        if (typeof allSxClasses[actualClassName] === 'function') {
                            // Call the dynamic function to get the styles
                            const styles = allSxClasses[actualClassName](
                                ...params.map((param, index) => `var(--${actualClassName}-param${index + 1})`)
                            );

                            for (const [key, value] of Object.entries(styles)) {
                                const styleString = checkSpecial(key, value);

                                if (!breakpoints[key]) {
                                    const isHoverClass = (key === "H_" || key === "h_");
                                    // Separate styles for hover classes
                                    if (isHoverClass) {
                                        let hoverStyle = "";
                                        for (const [hoverKey, hoverValue] of Object.entries(value)) {
                                            hoverStyle += `${checkSpecial(hoverKey, hoverValue)}\n`;
                                        }
                                        hoverStyleContent += hoverStyle;
                                        // Combine individual and hover styles
                                        if (hoverStyleContent) {
                                            individualStyleContent += `&:hover {\n${hoverStyleContent}\n}`;
                                        }
                                    } else {
                                        individualStyleContent += styleString;
                                    }
                                } else {
                                    let mediaStyles = '';
                                    let hoverMediaStyles = '';
                                    for (const [mediaKey, mediaValue] of Object.entries(value)) {
                                        if (mediaKey === "H_" || mediaKey === "h_") {
                                            for (const [hoverKey, hoverValue] of Object.entries(mediaValue)) {
                                                hoverMediaStyles += `${checkSpecial(hoverKey, hoverValue)}\n`;
                                            }
                                        } else {
                                            mediaStyles += `${checkSpecial(mediaKey, mediaValue)}\n`;
                                        }
                                    }
                                    mediaStylesMap[key] += `.${uniqueClassName} {\n${mediaStyles}\n}`;
                                    individualStyleContent += `@media ${breakpoints[key]} {\n${mediaStyles}\n}`;
                                    if (hoverMediaStyles) {
                                        individualStyleContent += `@media ${breakpoints[key]} {\n&:hover {\n${hoverMediaStyles}\n}\n}`;
                                    }

                                }
                            }

                            // Generate reactive statements for inline styles
                            params.forEach((param, index) => {
                                reactiveStatements += `$: if(browser) document.documentElement.style.setProperty('--${actualClassName}-param${index + 1}', ${param});\n`;
                            });
                        } else {
                            // Handle static style objects
                            for (const [key, value] of Object.entries(allSxClasses[actualClassName])) {
                                const styleString = checkSpecial(key, value);

                                if (!breakpoints[key]) {
                                    const isHoverClass = (key === "H_" || key === "h_");
                                    // Separate styles for hover classes
                                    if (isHoverClass) {
                                        let hoverStyle = "";
                                        for (const [hoverKey, hoverValue] of Object.entries(value)) {
                                            hoverStyle += `${checkSpecial(hoverKey, hoverValue)}\n`;
                                        }
                                        hoverStyleContent += hoverStyle;
                                        // Combine individual and hover styles
                                        if (hoverStyleContent) {
                                            individualStyleContent += `&:hover {\n${hoverStyleContent}\n}`;
                                        }
                                    } else {
                                        individualStyleContent += styleString;
                                    }
                                } else {
                                    let mediaStyles = '';
                                    let hoverMediaStyles = '';
                                    for (const [mediaKey, mediaValue] of Object.entries(value)) {
                                        if (mediaKey === "H_" || mediaKey === "h_") {
                                            for (const [hoverKey, hoverValue] of Object.entries(mediaValue)) {
                                                hoverMediaStyles += `${checkSpecial(hoverKey, hoverValue)}\n`;
                                            }
                                        } else {
                                            mediaStyles += `${checkSpecial(mediaKey, mediaValue)}\n`;
                                        }
                                    }
                                    mediaStylesMap[key] += `.${uniqueClassName} {\n${mediaStyles}\n}`;
                                    individualStyleContent += `@media ${breakpoints[key]} {\n${mediaStyles}\n}`;
                                    if (hoverMediaStyles) {
                                        individualStyleContent += `@media ${breakpoints[key]} {\n&:hover {\n${hoverMediaStyles}\n}\n}`;
                                    }

                                }
                            }
                        }


                        styleContent += individualStyleContent;
                    }
                });

                // Add the styles to the allStyles string with unique class name
                if (styleContent) {
                    allStyles += `.${uniqueClassName} {\n${styleContent}\n}`;
                    // Replace the original sxClass attribute with the generated class name
                    modifiedContent = modifiedContent.replace(matches[0], `class="${uniqueClassName}"`);
                    count++;
                }
            }

            // Add all styles in a single <style> tag at the end of modified content
            if (allStyles) {
                modifiedContent += `<style>${allStyles}</style>`;
                console.log(modifiedContent)
            }

            // Append reactive statements inside the <script> tag
            if (reactiveStatements) {
                modifiedContent = modifiedContent.replace('<script>', `<script>\n${reactiveStatements}`);
            }

            // Return the modified content
            return {code: modifiedContent};
        },
    };
}


function checkSpecial(key, value) {
    let translate = "";
    let valid = false;
    switch (key) {
        case "rounding":
            valid = true;
            translate = "border-radius:" + value * 8 + "px;";
            break;
        case "backgroundRepeat":
            valid = true;
            translate = "background-repeat: " + value + ";";
            break;
        case "backgroundSize":
            valid = true;
            translate = "background-size: " + value + ";";
            break;
        case "backgroundPosition":
            valid = true;
            translate = "background-position: " + value + ";";
            break;
        case "float":
            valid = true;
            translate = "box-shadow: 0 5px " + value * 8 + "px 0;";
            break;
        case "flex":
            switch (value) {
                case "row":
                    valid = true;
                    translate = "display:flex; flex-direction:row;";
                    break;
                case "col":
                    valid = true;
                    translate = "display:flex; flex-direction:column;";
                    break;
            }
            break;
        case "flexAlign":
            switch (value) {
                case "center":
                    valid = true;
                    translate = "align-items:center; justify-content:center;";
                    break;
                case "around":
                    valid = true;
                    translate = "align-items:center; justify-content:space-around;";
                    break;
            }
            break;
        case "m":
        case"margin": {
            valid = true
            translate = "margin: " + convertNumbers(value) + ";";
            break;
        }

        case "mt":
        case"marginTop": {
            valid = true
            translate = "margin-top: " + convertNumbers(value) + ";";
            break;
        }

        case "mr":
        case"marginRight": {
            valid = true
            translate = "margin-right: " + convertNumbers(value) + ";";
            break;
        }

        case "mb":
        case"marginBottom": {
            valid = true
            translate = "margin-bottom: " + convertNumbers(value) + ";";
            break;
        }

        case "ml":
        case"marginLeft": {
            valid = true
            translate = "margin-left: " + convertNumbers(value) + ";";
            break;
        }

        case "p":
        case"padding": {
            valid = true
            translate = "padding: " + convertNumbers(value) + ";";
            break;
        }

        case "pt":
        case"paddingTop": {
            valid = true
            translate = "padding-top: " + convertNumbers(value) + ";";
            break;
        }

        case "pr":
        case"paddingRight": {
            valid = true
            translate = "padding-right: " + convertNumbers(value) + ";";
            break;
        }

        case "pb":
        case"paddingBottom": {
            valid = true
            translate = "padding-bottom: " + convertNumbers(value) + ";";
            break;
        }

        case "pl":
        case"paddingLeft": {
            valid = true
            translate = "padding-left: " + convertNumbers(value) + ";";
            break;
        }

        case "bgc":
        case"bgColor": {
            valid = true
            translate = "background-color: " + convertNumbers(value) + ";";
            break;
        }
        default:
            if (containsUppercase(key)) {
                valid = true;
                let cssKey = key.split(/(?=[A-Z])/).join('-').toLowerCase();
                translate = cssKey + ":" + convertNumbers(value) + "; ";
            } else {
                valid = true;
                translate = key + ":" + convertNumbers(value) + "; ";
            }
    }

    return translate;
}

function convertNumbers(value) {
    if (typeof value === "string") {
        const numbers = value.split(" ");
        if (numbers.length > 1) {
            const validNumbers = numbers.filter(num => !isNaN(Number(num)) && !/[^0-9]/.test(num));
            if (validNumbers.length > 0 && validNumbers.length <= 4) {
                return numbers.map(num => {
                    if (!isNaN(Number(num)) && !/[^0-9]/.test(num)) {
                        return Number(num) * 8 + "px";
                    } else {
                        return num;
                    }
                }).join(" ");
            }
        } else {
            return value;
        }
    } else {
        return value * 8 + "px";
    }
}

function containsUppercase(str) {
    return /[A-Z]/.test(str);
}
