<script>
    export let maxWidth = "1200px";
    export let padding = "0 15px";
    export let margin = "0 auto";
    export let bgColor = "transparent";
    export let sxExtra = "FlexBoxStyle"
    export let id

</script>

<div sxClass={"container:$maxWidth:$padding:$margin:$bgColor:$$id"} id={id}>
    <slot></slot>
</div>
