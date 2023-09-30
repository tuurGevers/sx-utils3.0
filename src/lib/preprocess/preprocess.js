import fs from 'fs-extra';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';

let componentsMap = new Map();

export function sxPreprocessor(dir = '../../sxc/') {
    // Get the current file and directory paths
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sxcDir = path.join(__dirname, dir);
    const libDir = path.join(__dirname, "sxc_lib/")

    const sxcFiles = fs.readdirSync(sxcDir);
    const libFiles = fs.readdirSync(libDir);

    // Read all files in the sxc directory
    const allFiles = [
        ...sxcFiles.map(file => ({dir: sxcDir, file})),
        ...libFiles
            .filter(file => !file.endsWith(".ts")) // Exclude .ts files
            .map(file => ({dir: libDir, file}))
    ];


    // Object to store all the imported sx classes
    let allSxClasses = {};
    let count = 0
    let animations = {}
    // Dynamically import all the files

    const seoTagsPath = path.join(process.cwd(), 'src/seoTags.json');

    const exists = fs.pathExistsSync(seoTagsPath);

    function addGen() {

        return "";
    }

    return {
        markup({content, filename}) {
            let componentMapId
            let extraClass
            let modifiedContent = content;
            let allStyles = '';
            let reactiveStatements = '';
            let uniqueClassName = '';
            let specialStyles = '';
            let filesToInclude = filterFilesToInclude(content);
            filesToInclude.length === 0 ? filesToInclude = allFiles.map(af => af.file) : filesToInclude
            allFiles.forEach(({dir, file}) => {
                const modulePath = pathToFileURL(path.join(dir, file));
                import(/*@vite-ignore*/ modulePath).then(module => {
                    // Add the unique class name as a prop to each component
                    for (const key in module) {
                        if (key.startsWith('kf_')) {
                            const value = module[key];
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
                    allSxClasses[file] = module


                });

            });

            const includedSxClasses = filesToInclude.map((file) => {
                return allSxClasses[file]
            })
            const flattenedSxClasses = Object.assign({}, ...includedSxClasses);


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
            const regex = /sxClass=\{?"(.*?)"(?:\s*\+\s*\{([^\}]+)\})?\}?/g;
            let varRegex = /sxClass=\{\[(.*?)\]\}/g;

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
            if (filename.includes("Pre_")) {
                componentMapId = filename.split("/").pop().split(".")[0].split("Pre_")[1];
                try {
                    const compMap = componentsMap.get(componentMapId);

                    if (compMap) {
                        const classes = Array.from(compMap.values());

                        classes.forEach((c) => {

                            if (flattenedSxClasses[c]) {
                                const proccesed = processExtraStyles(flattenedSxClasses[c], animations, breakpoints, c)
                                allStyles += `\n${proccesed.allStyles}\n`;

                            } else {
                            }
                        });
                    }
                } catch (e) {
                    console.error("Error:", e);
                }
            }
            let match
            while ((match = varRegex.exec(content)) !== null) {
                const functionName = match[1].replaceAll("(","").replaceAll(")","");  // Assuming the function name is captured in the first capture group.
                console.log(functionName)
                // Transform the matched string
                const transformed = match[0]
                    .split(", ")
                    .map(sxClass => sxClass
                        .replaceAll('{', '')
                        .replaceAll("}", "")
                        .split(",").map(param => {
                            if (param.includes('"') || param.includes("'") || !sxClass.includes(",")) {
                                return param
                            } else {
                                return "$" + param
                            }
                        }).join(":")
                        .replaceAll("(", ":")
                        .replaceAll(")", "")
                        .replaceAll('"', "")
                        .replaceAll("]", '"')
                        .replaceAll("[", '"')
                    )
                    .join(" ");

                // Replace the original matched string in modifiedContent with the transformed string
                modifiedContent = modifiedContent.replace(match[0], transformed);
                const importRegex = new RegExp(`import {[^}]*${functionName}[^}]*} from "[^"]+";`, 'g');
                modifiedContent = modifiedContent.replace(importRegex, "");
                console.log(modifiedContent)
            }


            // Loop through all instances of sxClass in the content
            while ((matches = regex.exec(modifiedContent)) !== null) {
                let styleContent = '';
                let inlineStyles = ''; // For generating the inline styles for variables
                uniqueClassName = `sxClassGenerated${count}`;
                const classNames = matches[1].split(' ').map(name => name.trim());
                classNames.forEach((item, index) => {
                    let individualStyleContent = '';
                    let hoverStyleContent = '';
                    const [name, ...params] = item.split(':');
                    const actualClassName = name;
                    let defaultValues
                    if (typeof flattenedSxClasses[actualClassName] === 'function')
                        defaultValues = getDefaultParams(flattenedSxClasses[actualClassName])
                    // Generate inline styles for the variables
                    params.forEach((param, pIndex) => {
                        let newParam = param
                        if (param.length === 0) {
                            newParam = defaultValues[pIndex]
                            param = newParam.replaceAll("'", "").replaceAll('"', "")
                        }
                        if (param.startsWith("$")) {
                            // If the parameter is "extra", handle it separately
                            if (param.startsWith("$id")) {
                                extraClass = "{id}"
                            } else {
                                inlineStyles += `--${uniqueClassName}-${actualClassName}-param${pIndex + 1}: {${param.replace("$", "")}};`;
                                reactiveStatements += `--${uniqueClassName}-${actualClassName}-param${pIndex + 1}: {${param.replace("$", "")}};`;
                            }
                        } else {
                            inlineStyles += `--${uniqueClassName}-${actualClassName}-param${pIndex + 1}: ${param};`;
                            reactiveStatements += `--${uniqueClassName}-${actualClassName}-param${pIndex + 1}: ${param};`;

                        }
                    });


                    if (flattenedSxClasses[actualClassName]) {
                        if (typeof flattenedSxClasses[actualClassName] === 'function') {
                            const styles = flattenedSxClasses[actualClassName](...params.map((param, index) => {
                                if (param.startsWith("$$")) return
                                return `var(--${uniqueClassName}-${actualClassName}-param${index + 1})`
                            }));
                            processStyles(styles);
                        } else {
                            processStyles(flattenedSxClasses[actualClassName]);
                        }

                        styleContent += individualStyleContent;
                    }


                    function processStyles(styles) {
                        const results = generateStyles(styles, uniqueClassName);
                        if (results.styles) {
                            allStyles += `.${uniqueClassName} {\n${results.styles}\n}\n\n`;
                            allStyles += `\n${results.individualStyles}\n`;
                        }
                        if (results.hoverContent) {
                            allStyles += `${results.hoverContent}\n`;
                        }
                        keyframes += results.keyframesContent;
                    }

                });

                allStyles += `.${uniqueClassName} {\n${styleContent}\n}`;
                if (extraClass) {
                    uniqueClassName += " " + extraClass
                }
                // Replace the original sxClass attribute with the generated class name
                modifiedContent = modifiedContent.replace(matches[0], ` class="${uniqueClassName}"`);
                count++;

            }

            // Add all styles in a single <style> tag at the end of modified content
            if (allStyles) {
                if (modifiedContent.includes("<style")) {
                    modifiedContent = modifiedContent.replace("</style>", `\n\n${allStyles}\n\n</style>`)
                } else {
                    modifiedContent += `<style>${allStyles}\n\n${keyframes}</style>`;
                }
            }

            // Append reactive statements inside the <script> tag
            if (reactiveStatements) {
                if (modifiedContent.includes("style=")) {
                    if (modifiedContent.includes("style={")) {
                        const styleRegex = /style=\{([^}]+)\}/g;
                        modifiedContent = content.replace(styleRegex, (match, styleContent) => {
                            return `style={'${reactiveStatements}'+${styleContent}}`;
                        });
                    } else {
                        const styleContentHere = modifiedContent.split('style="')[1].split('"')[0];
                        modifiedContent = modifiedContent.replace(`style="`, `style="${reactiveStatements} ${styleContentHere}`);
                    }
                } else {
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

            function generateStyles(obj, prefix = '') {
                let styles = '';
                let hoverContent = '';
                let keyframesContent = '';
                let individualStyles = '';

                for (const [key, value] of Object.entries(obj)) {
                    if (key.startsWith("_")) {
                        if (key.startsWith("_:")) {
                            let pseudoClassStyles = '';
                            for (const [pseudoKey, pseudoValue] of Object.entries(value)) {
                                pseudoClassStyles += checkSpecial(pseudoKey, pseudoValue);
                            }
                            const pseudoClass = key.split(':')[1];
                            hoverContent += `.${uniqueClassName} ${prefix}:${pseudoClass} {\n${pseudoClassStyles}\n}\n`;

                        } else {
                            const nestedStyles = generateStyles(value, key.substring(1));
                            individualStyles += `.${prefix} ${key.substring(1)} { ${nestedStyles.styles} }\n`;
                            hoverContent += nestedStyles.hoverContent;
                            keyframesContent += nestedStyles.keyframesContent;
                        }
                    } else if (key === "H_" || key === "h_") {
                        let hoverStyles = '';
                        for (const [hoverKey, hoverValue] of Object.entries(value)) {
                            hoverStyles += checkSpecial(hoverKey, hoverValue);
                        }
                        hoverContent += `.${prefix}${key.substring(1).replaceAll("_", "")}:hover {\n${hoverStyles}\n}\n`;
                    } else if (key === "animation") {
                        let anim = animations[value.split(' ')[0]];
                        styles += "animation:" + value + ";\n"

                        keyframesContent += anim;
                    } else if (breakpoints[key]) {
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
                        const c = uniqueClassName === prefix ? `@media ${breakpoints[key]} {\n.${uniqueClassName}.${uniqueClassName}` : `@media ${breakpoints[key]} {\n.${uniqueClassName}.${uniqueClassName} ${prefix}`;
                        if (mediaStyles) {
                            allStyles += `${c} {\n${mediaStyles}\n}}\n\n`;
                        }
                        if (hoverMediaStyles) {
                            allStyles += `${c}:hover {\n${hoverMediaStyles}\n}}\n\n`;
                        }
                    } else {
                        styles += `${checkSpecial(key, value)}\n`;
                    }
                }
                return {
                    styles: styles,
                    individualStyles: individualStyles,
                    hoverContent: hoverContent,
                    keyframesContent: keyframesContent
                };
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

function filterFilesToInclude(content) {
    const stylesCommentMatch = content.match(/<!--\s*styles:\s*([^>]+(?!->))\s*-->/);
    if (stylesCommentMatch) {
        return stylesCommentMatch[1].split(',').map(file => file.trim());
    }
    return [];  // if no files are specified, return an empty array or default to include all files.
}

function convertMapToObject(map) {
    let obj = {};
    for (let [key, value] of map) {
        obj[key] = typeof value === 'object' ? convertMapToObject(value) : value;
    }
    return obj;
}

function insertGeneratedObjectIntoContent(content) {

    const sxGeneratedObject = convertMapToObject(componentsMap);
    const generatedCode = `const sxGenerated = ${JSON.stringify(sxGeneratedObject)};`;
    return content.replace('</script>', `${generatedCode}\n</script>`);
}

function replaceSxPlaceholders({content, fileName}) {
    const regex = /\$\$(\w+)/g;
    return content.replace(regex, `$$id`);
}


function processExtraStyles(styles, animations, breakpoints, uniqueClassName) {
    let allStyles = ''; // Initialize allStyles variable to store generated styles
    let keyframes = ''; // Initialize keyframes variable to store generated keyframes
    let individualStyleContent = ''; // Initialize individualStyleContent
    let hoverStyleContent = ''; // Initialize hoverStyleContent

    for (const [key, value] of Object.entries(styles)) {
        const styleString = checkSpecial(key, value);
        if (key === "animation") {
            let anim = animations[value.split(' ')[0]];
            keyframes += anim;
        }

        if (key.startsWith("_")) {
            let tagStyle = "";
            for (const [tagKey, tagValue] of Object.entries(value)) {
                if (tagKey === "animation") {
                    let anim = animations[tagValue.split(' ')[0]];
                    keyframes += anim;
                }
                let tagHoverContent = "";
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

    allStyles += `\n.${uniqueClassName} {\n${individualStyleContent}\n}\n`;

    return {
        allStyles,
        name: uniqueClassName
    };


}


function getDefaultParams(func) {
    // Convert the function to its string representation
    const funcStr = func.toString();

    // Extract everything between the first pair of parentheses
    const paramsStr = funcStr.match(/\(([^)]+)\)/)[1];

    // Split the parameters by comma and map over each param
    return paramsStr.split(',').map(param => {
        // Check if the param has a default value
        const parts = param.trim().split('=');
        if (parts.length > 1) {
            return parts[1].trim();  // Return the default value
        } else {
            return undefined;  // Return undefined for no default
        }
    });
}

export function preprocessSxExtra({content, filename}) {
    const regex = /<Pre_(.*?)\s.*?sxExtra\s?=\s?["'](.*?)["'].*?id\s?=\s?["'](.*?)["']/g;
    let matches;

    while ((matches = regex.exec(content)) !== null) {
        const componentName = matches[1];
        const sxExtraValue = matches[2];
        const idValue = matches[3];

        if (!componentsMap.has(componentName)) {
            componentsMap.set(componentName, new Map());
        }
        let idMap = componentsMap.get(componentName);
        idMap.set(idValue, sxExtraValue);
    }
    // Insert the generated object into content after building the map


    // Replace the $$ placeholders
    content = replaceSxPlaceholders({content, filename});

    return {code: content};
}

export function replaceSxExtraPlaceholder({content, filename}) {
    for (let [componentName, idMap] of componentsMap.entries()) {
        for (let [id, sxExtraValue] of idMap.entries()) {
            const placeholderRegex = new RegExp(`\\$\\$${sxExtraValue}`, 'g');
            content = content.replace(placeholderRegex, id);
        }
    }

    return {code: content};
}

export function sxExtraPreprocessor() {
    return {
        markup({content, filename}) {
            const processedContent = preprocessSxExtra({content, filename});
            return replaceSxExtraPlaceholder({content: processedContent.code, filename});
        }
    };
}
