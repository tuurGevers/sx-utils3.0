export let flexbox =(direction = "row", align = "center", justify="space-around", wrap = false, gap="0px")=> ({
    display:"flex",
    flexDirection:direction,
    alignItems:align,
    justifyContent:justify,
    flexWrap:wrap ? "wrap" : "nowrap",
    gap:gap,
})

export let flexboxStyle =({direction = "row", align = "center", justify = "space-around", wrap = false, gap = "0px"})=> ({
    display:"flex",
    flexDirection:direction,
    alignItems:align,
    justifyContent:justify,
    flexWrap:wrap ? "wrap" : "nowrap",
    gap:gap,
})

