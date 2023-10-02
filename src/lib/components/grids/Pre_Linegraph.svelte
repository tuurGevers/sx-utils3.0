<script>

    import {onMount} from "svelte";
    import {browser} from "$app/environment";
    let ctx
    onMount(()=>{
        const c = document.getElementById("myCanvas");
        ctx = c.getContext("2d");
        drawGrid()
    })
    function drawGrid() {
        const padding = 20;  // Define padding
        const drawWidth = parseInt(width) - padding;
        const drawHeight = parseInt(height) - padding;

        const gridWidth = drawWidth / dataPoints.dataPoints.length;
        const maxY = Math.max(...dataPoints.dataPoints.map(p => p.y));
        const gridHeight = drawHeight / (maxY + spacing);

        ctx.strokeStyle = "#ddd"; // Color for the grid lines
        ctx.lineWidth = 0.5;

        // Drawing horizontal grid lines
        for (let i = 0; i <= maxY; i += spacing) {
            const yPos = drawHeight - (gridHeight * i) - gridHeight * spacing;
            ctx.beginPath();
            ctx.moveTo(padding, yPos); // Begin from padding
            ctx.lineTo(parseInt(width), yPos);
            ctx.stroke();
        }

        // Drawing vertical grid lines
        dataPoints.dataPoints.forEach((_, index) => {
            const xPos = gridWidth * index + padding;
            ctx.beginPath();
            ctx.moveTo(xPos, padding);  // Begin from padding
            ctx.lineTo(xPos, parseInt(height));
            ctx.stroke();
        });

        // Reset styles for labels
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";

        // Drawing X axis labels
        dataPoints.dataPoints.forEach((point, index) => {
            const xPos = gridWidth * index + padding;  // Add padding
            ctx.fillText(point.x, xPos, parseInt(height)-padding);
        });

        // Drawing Y axis labels
        for (let i = 0; i <= maxY + spacing; i += spacing) {
            const yPos = drawHeight - (gridHeight * i) - gridHeight * spacing;
            ctx.fillText(i, padding - 15, yPos);  // Deduct 15 to ensure Y labels are aligned well
        }

        // Plotting data points
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";  // Color for the line connecting data points
        ctx.lineWidth = 1;  // Line width

        dataPoints.dataPoints.forEach((point, index) => {
            const xPos = gridWidth * (point.x - 1) + padding;
            const yPos = drawHeight - gridHeight * point.y - gridHeight * spacing;
            ctx.beginPath();
            ctx.arc(xPos, yPos, 3, 0, 2 * Math.PI);
            ctx.fill();

            if (index < dataPoints.dataPoints.length - 1) {
                // Get the next point's x and y coordinates
                const nextPoint = dataPoints.dataPoints[index + 1];
                const nextX = gridWidth * (nextPoint.x - 1) + padding;
                const nextY = drawHeight - gridHeight * nextPoint.y - gridHeight * spacing;

                ctx.beginPath();
                ctx.moveTo(xPos, yPos);
                ctx.lineTo(nextX, nextY);
                ctx.stroke();
            }
        });

    }
    function drawDataPoint(point, index) {
        const padding = 20;  // Define padding
        const drawWidth = parseInt(width) - padding;
        const drawHeight = parseInt(height) - padding;

        const gridWidth = drawWidth / dataPoints.dataPoints.length;
        const maxY = Math.max(...dataPoints.dataPoints.map(p => p.y));
        const gridHeight = drawHeight / (maxY + spacing);

        const xPos = gridWidth * (point.x - 1) + padding;
        const yPos = drawHeight - gridHeight * point.y - gridHeight * spacing;

        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";  // Color for the line connecting data points
        ctx.lineWidth = 1;  // Line width

        ctx.beginPath();
        ctx.arc(xPos, yPos, 3, 0, 2 * Math.PI);
        ctx.fill();

        if (index < dataPoints.dataPoints.length - 1) {
            // Get the next point's x and y coordinates
            const nextPoint = dataPoints.dataPoints[index + 1];
            const nextX = gridWidth * (nextPoint.x - 1) + padding;
            const nextY = drawHeight - gridHeight * nextPoint.y - gridHeight * spacing;

            ctx.beginPath();
            ctx.moveTo(xPos, yPos);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();
        }
    }

    export let height ="500"
    export let width = "500"
    export let spacing = 2
    export let dataPoints = {}
    $:if(ctx) {
        console.log(dataPoints)
        ctx.clearRect(0, 0, width, height);
        drawGrid()
    }
</script>
<canvas id="myCanvas" width={width} height={height} style="border:1px solid #000000;">
</canvas>

<style>
    canvas{
        margin:4%;
    }
</style>
