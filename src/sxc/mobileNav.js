
export let mobileNav = {
    position:"fixed",
    top:"0",
    left:"0",
    flex:"col",
    alignItems:"center",
    pt:"6rem",
    height:"100vh",
    zIndex: "2",
    width:"80%",
    animation:"showNav 0.3s ease-in-out forwards",
    "_ #closeButton":{
        position:"absolute",
        top:"2rem",
        right:"2rem",
    },

}

export let overlay = {
    position:"fixed",
    top:"0",
    left:"0",
    width:"100%",
    height:"100vh",
    backgroundColor:"rgba(0,0,0,0.5)",
    zIndex:"1",
}

export let openButton = {
    position:"fixed",
    top:"2rem",
    left:"2rem",
    zIndex:"3"
}

export let navRow = {
    _img:{
        width:"2rem",
        height:"auto",
    },
    _a:{
        width:"90%",
        transition: "all 0.4s ease-in-out",
    },
    flex:"row",
    justifyContent:"space-between",
    alignItems:"center",
    width:"100%",
    ml:"1rem",
    gap:"1rem"
}


export let kf_showNav = {
    "0%":{
        transform: "translateX(-100%)",
    },
    "100%":{
        transform: "translateX(0%)",
    }
}
