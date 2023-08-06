<script>
    import { onMount } from "svelte";
    import {browser} from "$app/environment";

    let color = "green";
    let width = "30%"

    // This function will update the color
    function changeColor() {
        color = "blue";
    }

</script>

<div sxClass="buttonVariant:color:width example1">
    {color}
    Hello World
</div>

<button on:click={changeColor}>Change Color</button>
<button on:click={()=>width = parseInt(width.split("%")[0])+10+"%"}>Change Color</button>
