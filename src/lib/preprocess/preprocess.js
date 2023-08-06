// sxPreprocessor.js
import * as sxClasses from '../../sxClass.js';

export default function sxPreprocessor() {
    return {
        markup({ content }) {
            let modifiedContent = content;
            let styleContent = '';
            let reactiveStatements = '';

            const sxClassMatch = /sxClass="([^"]+)"/.exec(content);

            if (sxClassMatch) {
                const classNames = sxClassMatch[1].split(' ').map(name => name.trim());

                classNames.forEach((item) => {
                    const [name, ...params] = item.split(':');

                    if (sxClasses[name]) {
                        if (typeof sxClasses[name] === 'function') {
                            const styles = sxClasses[name](...params.map((param, index) => `var(--${name}-param${index + 1})`));
                            for (const [key, value] of Object.entries(styles)) {
                                styleContent += `${key.split(/(?=[A-Z])/).join('-').toLowerCase()}: ${value};\n`;
                            }
                            params.forEach((param, index) => {
                                reactiveStatements += `$: if(browser) document.documentElement.style.setProperty('--${name}-param${index + 1}', ${param});\n`;
                            });
                        } else {
                            for (const [key, value] of Object.entries(sxClasses[name])) {
                                styleContent += `${key.split(/(?=[A-Z])/).join('-').toLowerCase()}: ${value};\n`;
                            }
                        }
                    }

                });

                if (styleContent) {
                    styleContent = `.sxClassGenerated {\n${styleContent}\n}`;
                    modifiedContent = content.replace(sxClassMatch[0], 'class="sxClassGenerated"') + `<style>${styleContent}</style>`;
                }

                if (reactiveStatements) {
                    modifiedContent = modifiedContent.replace('<script>', `<script>\n${reactiveStatements}`);
                }
            }

            return { code: modifiedContent };
        }
    };
}
