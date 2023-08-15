#!/usr/bin/env node

const {program} = require('commander');
const fs = require('fs-extra');
const path = require('path');
const axios = require("axios");

program
    .command('SEO')
    .description('Generate SEO tags for Svelte components')
    .option('-k, --key <type>', 'API Key')
    .action(async (cmdObj) => {
        // Access the API key from the command object
        const API_KEY = cmdObj.key;

        if (!API_KEY) {
            console.error("API Key is required. Use the -k or --key option to provide it.");
            process.exit(1);
        }

        // Logic to scan Svelte files and generate SEO tags
        const seoData = await generateSEOTags(API_KEY);

        // Save the generated tags to a JSON file in the src directory
        const projectRoot = process.cwd();
        fs.writeJson(path.join(projectRoot, 'src', 'seoTags.json'), seoData, {spaces: 2});
    });


program.parse(process.argv);

async function generateSEOTags(key) {
    const srcPath = path.join(process.cwd(), 'src');
    const API_KEY = key;

    const allFiles = await getFilesRecursively(srcPath);
    const preFiles = allFiles.filter(file => path.basename(file).startsWith('Pre_'));

    const seoTags = {};
    for (const file of preFiles) {
        const baseName = path.basename(file, '.svelte');
        const parentDir = path.basename(path.dirname(file));
        const key = `${parentDir}/${baseName}`;
        const content = await fs.readFile(file, 'utf-8');
        seoTags[key] = await gptRequest(content, API_KEY);
    }


    return seoTags;
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

async function gptRequest(content, key) {
    content = content.replace(/<script[\s\S]*?<\/script>/g, '');


    // Remove content between <style> and </style> tags
    content = content.replace(/<style[\s\S]*?<\/style>/g, '');
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
                    content: "your task is generating svelte seo content"
                },
                {
                    "role": "user",
                    content: "generate a svelte:head tag with good seo based on this component\n" +
                        "\n" +
                        "<script>\n" +
                        "    import chartjs from 'chart.js';\n" +
                        "    let chartData;\n" +
                        "    import { onMount } from 'svelte';\n" +
                        "    import {alerts, formatTime} from \"./index.js\";\n" +
                        "\n" +
                        "    let chartValues\n" +
                        "    let chartLabels\n" +
                        "    let ctx;\n" +
                        "    let chartCanvas;\n" +
                        "\n" +
                        "    onMount(async () => {\n" +
                        "        console.log($alerts)\n" +
                        "        chartValues = $alerts.map((a)=>a.price);\n" +
                        "        chartLabels = $alerts.map((a)=>formatTime(a.time));\n" +
                        "        ctx = chartCanvas.getContext('2d');\n" +
                        "        let chart = new chartjs(ctx, {\n" +
                        "            type: 'line',\n" +
                        "            data: {\n" +
                        "                labels: chartLabels,\n" +
                        "                datasets: [{\n" +
                        "                    label: 'Revenue',\n" +
                        "                    backgroundColor: 'rgb(255, 99, 132)',\n" +
                        "                    borderColor: 'rgb(255, 99, 132)',\n" +
                        "                    data: chartValues\n" +
                        "                }]\n" +
                        "            }\n" +
                        "        });\n" +
                        "\n" +
                        "    });\n" +
                        "\n" +
                        "</script>\n" +
                        "\n" +
                        "<canvas bind:this={chartCanvas} id=\"myChart\"></canvas>"
                },
                {
                    role: "assistant",
                    content: "<svelte:head>\n" +
                        "    <title>Revenue Visualization Chart</title>\n" +
                        "    <meta name=\"description\" content=\"A dynamic chart visualizing revenue data based on alerts. The chart plots revenue against time, providing insights into financial performance.\">\n" +
                        "    <meta name=\"keywords\" content=\"revenue, chart, visualization, chart.js, financial data, alerts, time series\">\n" +
                        "</svelte:head>"
                },
                {
                    "role": "user",
                    "content": "generate a svelte:head tag with good seo based on this component\n" + content
                }
            ],
            'temperature': 0.8,
            'max_tokens': 800,
        })
    })
    console.log(res.data.choices[0].message.content)
    return res.data.choices[0].message.content;
}
