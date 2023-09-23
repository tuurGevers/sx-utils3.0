<script>
 let direction = "row"
import Pre_FlexBox from "../lib/components/Pre_FlexBox.svelte";
</script>



<Pre_FlexBox direction={direction} sxExtra="FlexBoxStyle" id="FlexBoxStyle">
    <h1>test</h1>
    <h1>test</h1>
    <h1>test</h1>
    <h1>test</h1>
</Pre_FlexBox>

<Pre_FlexBox direction={direction} sxExtra="red" id="red">
    <h1>test</h1>
    <h1>test</h1>
    <h1>test</h1>
    <h1>test</h1>
</Pre_FlexBox>


<button on:click={()=>direction==="row"?direction="column":direction="row"}></button>

