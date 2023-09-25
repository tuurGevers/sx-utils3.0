export let m = (...args) => {
    return {
        margin: args.join(" ")
    }
}
export let mt = (mt="0") => {
    return {
        marginTop: mt
    }
}
export let mr = (mr="0") => {
    return {
        marginRight: mr
    }
}

export let mb = (mb="0") => {
    return {
        marginBottom: mb
    }
}
export let ml = (ml="0") => {
    return {
        marginLeft: ml
    }
}


export let p = (...args) => {
    return {
        padding: args.join(" ")
    }

}

export let pt = (pt="0") => {
    return {
        paddingTop: pt
    }
}

export let pr = (pr="0") => {
    return {
        paddingRight: pr
    }
}

export let pb = (pb="0") => {
    return {
        paddingBottom: pb
    }
}

export let pl = (pl="0") => {

    return {
        paddingLeft: pl
    }
}



export let size = (width = "100%", height= "100%", minWidth = "unset", minHeight = "unset",maxWidth = "100%", maxHeight = "100%") => {
    return {
        width: width,
        height: height,

        maxWidth: maxWidth,
        maxHeight: maxHeight,

        minWidth: minWidth,
        minHeight: minHeight,
    }
}

export let border = (width = "0px", color = "inherit", radius = "Opx") => {
    return {
        border: `${width} solid ${color}`,
        borderRadius: radius
    }
}

export let overflow = (x = "visible", y = "visible") => {
    return {
        overflowX: x,
        overflowY: y
    }
}

export let shadow = (x = "0px", y = "0px", blur = "0px", spread = "0px", color = "rgba(0,0,0,0.5)") => {
    return {
        boxShadow: `${x} ${y} ${blur} ${spread} ${color}`
    }
}
