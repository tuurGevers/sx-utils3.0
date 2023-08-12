<script>
    import { onMount } from "svelte";
    import {browser} from "$app/environment";
    export let direction = "row"
    export let align = "center"
    export let justify="space-around"
    export let wrap = false
    export let gap="4px"
</script>


<div sxClass="flexbox:direction:align:justify:wrap:gap">
    <slot/>
</div>
