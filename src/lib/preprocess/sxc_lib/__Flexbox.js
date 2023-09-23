export let flexbox =(direction = "row", align = "center", justify="space-around", wrap = false, gap="0px", extra = {})=> ({
    display:"flex",
    flexDirection:direction,
    alignItems:align,
    justifyContent:justify,
    flexWrap:wrap ? "wrap" : "nowrap",
    gap:gap,
    ...extra
})


export let extraStyle = {
    bgc: "red",
    h_:{
        bgc:"black"
    },
    sm: {
        width: '100%',
    },

    md: {
        width: '50%',
    },

    lg: {
        width: '50%',
    }
}
