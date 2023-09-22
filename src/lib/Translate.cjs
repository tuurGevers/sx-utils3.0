#!/usr/bin/env node

const {program} = require('commander');
const fs = require('fs-extra');
const path = require('path');
const axios = require("axios");
const { parse } = require('node-html-parser');

program
    .command('create-lang')
    .description('Create a new language')
    .action(async (cmdObj) => {
        await generateJson()
    });


program.parse(process.argv);

async function generateJson() {
    const srcPath = path.join(process.cwd(), 'src');
    const outputDir = path.join(process.cwd(), 'sx-langs', 'base');

    const allFiles = await getFilesRecursively(srcPath);
    const preFiles = allFiles.filter(file => path.basename(file).startsWith('Pre_'));

    for (const file of preFiles) {
        const baseName = path.basename(file, '.svelte');
        const content = await fs.readFile(file, 'utf-8');
        const root = parse(content);
        const tags = root.querySelectorAll('*');

        const seoTags = {};
        tags.forEach((tag, index) => {
            // Exclude script tags
            if (tag.tagName.toLowerCase() !== 'script') {
                let rawText = tag.rawText.trim();
                // Only add tags with content
                if (rawText) {
                    rawText = rawText.includes(">")? rawText.split(">")[1].split("<")[0] : rawText;
                    seoTags[`${tag.tagName.toLowerCase()}${index}`] = rawText;
                }
            }
        });
        console.log('Ok')
        await fs.writeFile(path.join(outputDir, `${baseName}.json`), JSON.stringify(seoTags, null, 2));
    }
}



async function getFilesRecursively(directory) {
    const files = await fs.readdir(directory);
    const directories = await Promise.all(files.map(async (file) => {
        const absolute = path.join(directory, file);
        const stat = await fs.stat(absolute);
        if (stat.isDirectory()) return getFilesRecursively(absolute);
        else return [absolute];
    }));

    return directories.flat();
}



program
    .command('translate')
    .description('Translate the base JSON files to different languages')
    .option('-k, --key <type>', 'API Key')
    .option('-l, --lang <type>', 'Target language code (e.g., nl, fr)')
    .action(async (cmdObj) => {
        const API_KEY = cmdObj.key;
        const targetLang = cmdObj.lang;
        console.log(`API Key: ${API_KEY}, Target Language: ${targetLang}`);

        if (!API_KEY || !targetLang) {
            console.error("API Key and target language are required. Use the -k, --key and -l, --lang options to provide them.");
            process.exit(1);
        }
        console.log("Translating to " + targetLang)

        await translateJsonFiles(API_KEY, targetLang);
    });

async function translateJsonFiles(key, lang) {
    const baseDir = path.join(process.cwd(), 'sx-langs', 'base');
    const targetDir = path.join(process.cwd(), 'sx-langs', lang);

    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    const jsonFiles = await fs.readdir(baseDir);

    for (const file of jsonFiles) {
        const filePath = path.join(baseDir, file);
        const content = await fs.readJson(filePath);

        // Translate the entire JSON content
        const translatedContent = await gptTranslate(content, key, lang);

        await fs.writeJson(path.join(targetDir, file), translatedContent, { spaces: 2 });
    }
}

async function gptTranslate(json, key) {
    // Convert the JSON object to a string
    const jsonString = JSON.stringify(json);

    // Use the gptRequest function to get the translated JSON
    const translatedJsonString = await gptRequest(jsonString, key);

    // Convert the translated JSON string back to an object and return
    return JSON.parse(translatedJsonString);
}



async function gptRequest(json, key) {

    const res = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key
        },
        data: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    content: "your task is translating this json to another json"
                },
                {
                    "role": "user",
                    content: "take this json and return the german version" +
                        "\n" +
                        '{"div0": "This is a sample text for translation. Another line of text. Yet another line. More text here. Keep reading. Last line of this section.", "p1": "This is a paragraph.", "p2": "Another sample paragraph.", "p3": "Did you know translation can be fun?", "p4": "Yet another random sentence.", "p5": "Reading this might be interesting.", "p6": "Final piece of text here."}'
                },
                {
                    role: "assistant",
                    content: "Here's the translated JSON in German:\n" +
                        '{"div0": "Dies ist ein Beispieltext zur Übersetzung. Eine weitere Zeile Text. Noch eine Zeile. Mehr Text hier. Weiterlesen. Letzte Zeile dieses Abschnitts.", "p1": "Das ist ein Absatz.", "p2": "Ein weiterer Beispielabsatz.", "p3": "Wussten Sie, dass Übersetzen Spaß machen kann?", "p4": "Noch ein zufälliger Satz.", "p5": "Das Lesen könnte interessant sein.", "p6": "Letzter Text hier."}'
                },
                {
                    "role": "user",
                    "content": "take this json and return the german version\n" + json
                }
            ],
            'temperature': 0.8,
            'max_tokens': 800,
        })
    })

    console.log(res.data.choices[0].message.content)
    return res.data.choices[0].message.content;
}
