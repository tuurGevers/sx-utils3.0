<script>
    export let direction = "row"
    export let align = "center"
    export let justify = "space-around"
    export let wrap = false
    export let gap = "0px"
    export let sxExtra = "FlexBoxStyle"
    export let id
</script>

<div sxClass={"flexbox:$direction:$align:$justify:wrap:8px:$$id"} id={id}>
    <slot></slot>
</div>

