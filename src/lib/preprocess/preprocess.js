import fs from 'fs-extra';
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
    let animations = {}
    // Dynamically import all the files
    files.forEach(file => {
        if (file.endsWith('.js')) {
            const modulePath = pathToFileURL(path.join(sxcDir, file));
            import(modulePath).then(module => {
                // Add the unique class name as a prop to each component
                for (const key in module) {
                    if (key.startsWith('kf_')) {
                        const value = module[key];
                        console.log(value)
                        const name = key.substring(3);
                        let lines = ""
                        for (const [kfKey, kfValue] of Object.entries(value)) {
                            let properties = Object.entries(kfValue).map(([prop, val]) => `${prop}:${JSON.stringify(val).replaceAll("'", "").replaceAll('"', "")}`).join("; ");
                            lines += `${kfKey} { ${properties} } `;
                        }
                        animations[name] = `@keyframes ${name} 
                                                { ${lines}\n}
                                                `
                    }
                }


                // Merge the imported sx classes into allSxClasses object
                Object.assign(allSxClasses, module);
            });
        }
    });
    const seoTagsPath = path.join(process.cwd(), 'src/seoTags.json');

    const exists = fs.pathExistsSync(seoTagsPath);

    function addGen() {

        return "";
    }

    return {
        markup({content, filename}) {
            let modifiedContent = content;
            let allStyles = '';
            let reactiveStatements = '';
            let uniqueClassName = '';
            let specialStyles = '';

            // Breakpoints for media queries
            const breakpoints = {
                sm: 'only screen and (max-width: 640px)',
                md: 'only screen and (max-width: 1200px) and (min-width: 641px)',
                lg: 'only screen and (min-width: 1201px)',
            };

            // Map to store media query styles for each breakpoint
            const mediaStylesMap = {
                sm: '', md: '', lg: '',
            };

            // Regular expression to match sxClass attribute in the content
            const regex = /sxClass="([^"]+)"/g;
            let matches;
            let count = 0;
            let keyframes = ""
            if (!filename.includes("Pre_")) {
                return
            } else if (exists) {
                addSeo()
            } else if (filename.includes("gen_")) {
                specialStyles = addGen()
            }


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
                            const styles = allSxClasses[actualClassName](...params.map((param, index) => `var(--${actualClassName}-param${index + 1})`));
                            processStyles(styles)

                            // Generate reactive statements for inline styles
                            params.forEach((param, index) => {
                                reactiveStatements += `--${actualClassName}-param${index + 1}: {${param}};`;
                            });
                        } else {
                            processStyles(allSxClasses[actualClassName])
                        }

                        styleContent += individualStyleContent;
                    }


                    function processStyles(styles) {
                        for (const [key, value] of Object.entries(styles)) {
                            const styleString = checkSpecial(key, value);
                            if (key === "animation") {
                                let anim = animations[value.split(' ')[0]]
                                keyframes += anim
                            }

                            if (key.startsWith("_")) {
                                let tagStyle = ""
                                for (const [tagKey, tagValue] of Object.entries(value)) {
                                    if (tagKey === "animation") {
                                        let anim = animations[tagValue.split(' ')[0]]
                                        keyframes += anim
                                    }
                                    let tagHoverContent = ""
                                    if (!breakpoints[tagKey]) {
                                        const isHoverClass = (tagKey === "H_" || tagKey === "h_");
                                        // Separate styles for hover classes
                                        if (isHoverClass) {
                                            let hoverStyle = "";
                                            for (const [hoverKey, hoverValue] of Object.entries(tagValue)) {

                                                hoverStyle += `${checkSpecial(hoverKey, hoverValue)}\n`;
                                            }
                                            tagHoverContent += hoverStyle;
                                            // Combine individual and hover styles
                                            if (tagHoverContent) {
                                                tagStyle += `&:hover {\n${tagHoverContent}\n}`;
                                            }
                                        } else {
                                            tagStyle += `${checkSpecial(tagKey, tagValue)}\n`;
                                        }
                                    } else {
                                        let mediaStyles = '';
                                        let hoverMediaStyles = '';
                                        for (const [mediaKey, mediaValue] of Object.entries(tagValue)) {
                                            if (mediaKey === "H_" || mediaKey === "h_") {
                                                for (const [hoverKey, hoverValue] of Object.entries(mediaValue)) {
                                                    hoverMediaStyles += `${checkSpecial(hoverKey, hoverValue)}\n`;
                                                }
                                            } else {
                                                mediaStyles += `${checkSpecial(mediaKey, mediaValue)}\n`;
                                            }
                                        }

                                        // Generate the media query outside of the class selector
                                        if (mediaStyles) {
                                            allStyles += `@media ${breakpoints[tagKey]} {\n.${uniqueClassName}.${uniqueClassName} ${key.substring(1)} {\n${mediaStyles}\n}\n}`;
                                        }
                                        if (hoverMediaStyles) {
                                            allStyles += `@media ${breakpoints[tagKey]} {\n.${uniqueClassName}${uniqueClassName} ${key.substring(1)}:hover {\n${hoverMediaStyles}\n}\n}`;
                                        }
                                    }
                                }
                                if (key.startsWith("_:")) {
                                    allStyles += `\n.${uniqueClassName}${key.substring(1)} {\n${tagStyle}\n}\n`;
                                } else {
                                    allStyles += `\n.${uniqueClassName} ${key.substring(1)} {\n${tagStyle}\n}\n`;

                                }
                            } else if (!breakpoints[key]) {
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

                                // Generate the media query outside of the class selector
                                if (mediaStyles) {
                                    allStyles += `@media ${breakpoints[key]} {\n.${uniqueClassName}.${uniqueClassName} {\n${mediaStyles}\n}\n}`;
                                }
                                if (hoverMediaStyles) {
                                    allStyles += `@media ${breakpoints[key]} {\n.${uniqueClassName}:hover.${uniqueClassName} {\n${hoverMediaStyles}\n}\n}`;
                                }
                            }


                        }
                    }

                });

                allStyles += `.${uniqueClassName} {\n${styleContent}\n}`;
                // Replace the original sxClass attribute with the generated class name
                modifiedContent = modifiedContent.replace(matches[0],` class="${uniqueClassName}"`);
                count++;

            }

            // Add all styles in a single <style> tag at the end of modified content
            if (allStyles) {
                console.log(keyframes)
                if (modifiedContent.includes("<style")) {
                    modifiedContent= modifiedContent.replace("</style>", `\n\n${allStyles}\n\n</style>`)
                    console.log(modifiedContent)
                } else {
                    modifiedContent += `<style>${allStyles}\n\n${keyframes}</style>`;
                }
            }

            // Append reactive statements inside the <script> tag
            if (reactiveStatements) {
                if(modifiedContent.includes("style=")){
                    modifiedContent = modifiedContent.replace("style=", `style="${reactiveStatements}`);
                }else{
                    modifiedContent = modifiedContent.replace('class=', `style="${reactiveStatements}" class=`);
                }
            }

            // Return the modified content
            return {code: modifiedContent};


            function addSeo() {
                const seoTags = fs.readJsonSync(seoTagsPath);
                // Extract the parent directory and filename from the full path
                const parentDir = path.basename(path.dirname(filename));
                const baseName = path.basename(filename, '.svelte');
                const key = `${parentDir}/${baseName}`;

                const seoTag = seoTags[key];

                if (seoTag) {
                    modifiedContent = modifiedContent.replace('</script>', `</script>\n${seoTag}`);
                }
            }
        },
    }
};


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
        case "border": {
            valid = true
            translate = "border: " + value + ";";
            break
        }
        case "animation": {
            valid = true
            translate = "animation: " + value + ";";
            break
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
            if (validNumbers.length > 1 && validNumbers.length <= 4) {
                return numbers.map(num => {
                    if (!isNaN(Number(num)) && !/[^0-9]/.test(num)) {
                        return Number(num) * 8 + "px";
                    } else {
                        return num;
                    }
                }).join(" ");
            } else {
                return value;
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

