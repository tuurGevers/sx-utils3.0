export const image = (width = 'auto', height = 'auto', fit = 'cover', position = 'center', repeat = 'no-repeat') => ({
    width: width,
    height: height,
    objectFit: fit,
    objectPosition: position,
    backgroundRepeat: repeat,
});

export const imageStyle = ({
                               width = 'auto',
                               height = 'auto',
                               fit = 'cover',
                               position = 'center',
                               repeat = 'no-repeat',
                               border = 'unset',
                               borderRadius = 'unset',
                               boxShadow = 'unset',
                               filter = 'unset',
                               transform = 'unset',
                               transition = 'unset',
                               opacity = 'unset',
                               clipPath = 'unset',
                           }) => ({
    width: width,
    height: height,
    objectFit: fit,
    objectPosition: position,
    backgroundRepeat: repeat,
    border: border,
    borderRadius: borderRadius,
    boxShadow: boxShadow,
    filter: filter,
    transform: transform,
    transition: transition,
    opacity: opacity,
    clipPath: clipPath,
});
