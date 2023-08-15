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
    <button  on:click={changeColor}>Change Color</button>

</div>

<button sxClass="example1" on:click={()=>width = parseInt(width.split("%")[0])+10+"%"}>Change Color</button>
