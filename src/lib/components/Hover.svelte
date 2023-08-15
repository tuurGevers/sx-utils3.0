<style>
    .test{
        background-color:blue;
        animation: expand 2s ease-in ;

    }
    .test button{
         color:red;
     }

    @keyframes expand {
        0%{
            width:80%
        }
        100%{
            width: 100%;
           }
    }
</style>

<div class="test">
    <button>test</button>
</div>
