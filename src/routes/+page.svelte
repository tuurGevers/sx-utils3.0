<script>
    import Pre_Linegraph from "../lib/components/grids/Pre_Linegraph.svelte";
    import {onMount} from "svelte";
    let data = {
        dataPoints: [
            { "x": 1, "y": 5 },
            { "x": 2, "y": 25 },
            { "x": 3, "y": 7 },
            { "x": 4, "y": 7 },
            //... more data points
        ]
    };
    let index = 5
    onMount(() => {
        setInterval(() => {
            // Push new data point
            data.dataPoints.push({ x: index, y: index });

            // This step is crucial. Create a new object and spread the old one into it.
            data = { ...data, dataPoints: [...data.dataPoints] };
            index++;
        }, 1000);
    });

</script>

<Pre_Linegraph dataPoints={data} spacing={1}/>
