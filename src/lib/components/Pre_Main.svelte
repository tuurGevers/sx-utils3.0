<script>
    import {animation, animation2} from "../../sxc/test.js";
    import {container} from "../preprocess/sxc_lib/__Container.js";

    let color = "blue"
</script>

<div sxClass={[container("red",color,"relative"), animation2, animation("20%")]}>
    <h1>test</h1>
    <h1>test</h1>
    <h1>test</h1>
    <h1>test</h1>
    <button>test</button>
    <h1>test</h1>
</div>
