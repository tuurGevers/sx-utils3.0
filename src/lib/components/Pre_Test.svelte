<script>
    import {onMount} from "svelte";

    let maxWidth = 400;
    let maxWidthPX = maxWidth +"px";

    onMount(()=>setInterval(()=> {
        maxWidth+=1
        maxWidthPX = maxWidth + "px"
    } ,100 ),)
</script>

<div sxClass={"flexbox:column:center:space-around:wrap:8px container:$maxWidthPX::20vh:green"}>
    <slot></slot>
</div>
