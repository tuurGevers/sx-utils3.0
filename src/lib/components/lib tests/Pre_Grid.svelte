<script>
    export let columns = "auto-fill";
    export let rows = "auto";
    export let gap = "16px";
    export let minColumnWidth = "200px";
    export let alignItems = "stretch";
    export let justifyItems = "stretch";
    export let area = "none";

    export let style = ""
</script>

<div sxClass="grid:columns:rows:gap:minColumnWidth:alignItems:justifyItems:area" {...$$props} style={style}>
    <slot></slot>
</div>

<!--styles:__Grid.js,extra.js-->
