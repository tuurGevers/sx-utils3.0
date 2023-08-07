import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export default function sxPreprocessor() {
    // Get the current file and directory paths
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sxcDir = path.join(__dirname, '../../sxc/');

    // Read all files in the sxc directory
    const files = fs.readdirSync(sxcDir);

    // Object to store all the imported sx classes
    const allSxClasses = {};

    // Dynamically import all the files
    files.forEach(file => {
        if (file.endsWith('.js')) {
            const modulePath = pathToFileURL(path.join(sxcDir, file));
            import(modulePath).then(module => {
                // Merge the imported sx classes into allSxClasses object
                Object.assign(allSxClasses, module);
            });
        }
    });

    return {
        markup({ content }) {
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
                    const isHoverClass = name.startsWith('H_') || name.startsWith('h_');
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
                                const styleString = `${key.split(/(?=[A-Z])/).join('-').toLowerCase()}: ${value};\n`;

                                // Handle media queries for each style property
                                if (breakpoints[key]) {
                                    let mediaStyles = '';
                                    for (const [mediaKey, mediaValue] of Object.entries(value)) {
                                        mediaStyles += `${mediaKey.split(/(?=[A-Z])/).join('-').toLowerCase()}: ${mediaValue};\n`;
                                    }
                                    mediaStylesMap[key] += `.${uniqueClassName} {\n${mediaStyles}\n}`;
                                    individualStyleContent += `@media ${breakpoints[key]} {\n${mediaStyles}\n}`;
                                }

                                // Separate styles for hover classes
                                if (isHoverClass) {
                                    hoverStyleContent += styleString;
                                } else {
                                    individualStyleContent += styleString;
                                }
                            }

                            // Generate reactive statements for inline styles
                            params.forEach((param, index) => {
                                reactiveStatements += `$: if(browser) document.documentElement.style.setProperty('--${actualClassName}-param${index + 1}', ${param});\n`;
                            });
                        } else {
                            // Handle static style objects
                            for (const [key, value] of Object.entries(allSxClasses[actualClassName])) {
                                const styleString = `${key.split(/(?=[A-Z])/).join('-').toLowerCase()}: ${value};\n`;

                                // Handle media queries for each style property
                                if (breakpoints[key]) {
                                    let mediaStyles = '';
                                    for (const [mediaKey, mediaValue] of Object.entries(value)) {
                                        mediaStyles += `${mediaKey.split(/(?=[A-Z])/).join('-').toLowerCase()}: ${mediaValue};\n`;
                                    }
                                    mediaStylesMap[key] += `.${uniqueClassName} {\n${mediaStyles}\n}`;
                                    individualStyleContent += `@media ${breakpoints[key]} {\n${mediaStyles}\n}`;
                                }

                                // Separate styles for hover classes
                                if (isHoverClass) {
                                    hoverStyleContent += styleString;
                                } else {
                                    individualStyleContent += styleString;
                                }
                            }
                        }

                        // Combine individual and hover styles
                        if (hoverStyleContent) {
                            individualStyleContent += `&:hover {\n${hoverStyleContent}\n}`;
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
            }

            // Append reactive statements inside the <script> tag
            if (reactiveStatements) {
                modifiedContent = modifiedContent.replace('<script>', `<script>\n${reactiveStatements}`);
            }

            // Return the modified content
            return { code: modifiedContent };
        },
    };
}
