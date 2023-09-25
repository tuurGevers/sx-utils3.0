export let bgImage = (imgUrl = "", size = "cover", position = "center", repeat = "no-repeat") => ({
    backgroundImage: imgUrl,
    backgroundSize: size,
    backgroundPosition: position,
    backgroundRepeat: repeat,
});
export let bgImageStyle = ({imgUrl = "", size = "cover", position = "center", repeat = "no-repeat"}) => ({
    backgroundImage: imgUrl,
    backgroundSize: size,
    backgroundPosition: position,
    backgroundRepeat: repeat,
});
