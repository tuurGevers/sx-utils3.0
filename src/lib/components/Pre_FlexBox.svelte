<script>
    export let direction = "row"
    export let align = "center"
    export let justify = "space-around"
    export let wrap = false
    export let gap = "0px"
</script>

<div sxClass="flexbox:$direction:$align:$justify:wrap:8px" style="width:100%; color:#377c7c">
    <slot></slot>
</div>

