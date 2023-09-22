<script>
    import { onMount } from "svelte";
    import {browser} from "$app/environment";

    export let color = "green";
    let width = "30%"

    // This function will update the color
    function changeColor() {
        color = "blue";
        console.log(color)
    }

</script>

<div sxClass="buttonVariant:color:width">
    {color}
    Hello World
    <button  on:click={()=>changeColor()}>Change Color</button>

</div>
