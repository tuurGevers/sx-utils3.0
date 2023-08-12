<script>
    import { onMount } from "svelte";
    import {browser} from "$app/environment";

    export let color = "red";
    let width = "30%"

    // This function will update the color
    function changeColor() {
        color = "blue";
    }

</script>

<div sxClass="buttonVariant:color:width">
    {color}
    Hello World
</div>

<button sxClass="button" on:click={changeColor}>Change Color</button>
<button on:click={()=>width = parseInt(width.split("%")[0])+10+"%"}>Change Color</button>
