// __Icons.js

// Basic utility for common icon adjustments.
export const icon = (
    width = '24px',
    height = '24px',
    fill = 'currentColor',
    stroke = 'none',
    strokeWidth = '1',
    display = 'inline-block'
) => ({
    width: width,
    height: height,
    fill: fill,
    stroke: stroke,
    strokeWidth: strokeWidth,
    display: display
});

// More detailed utility for edge cases and additional styling.
export const iconStyle = ({
                              width = '24px',
                              height = '24px',
                              fill = 'currentColor',
                              stroke = 'none',
                              strokeWidth = '1',
                              display = 'inline-block',
                              transition = 'unset',
                              transform = 'unset',
                              opacity = 'unset',
                              margin = 'unset',
                              padding = 'unset',
                              borderRadius = 'unset',
                              boxShadow = 'unset',
                              filter = 'unset',
                              cursor = 'unset'
                          }) => ({
    width: width,
    height: height,
    fill: fill,
    stroke: stroke,
    strokeWidth: strokeWidth,
    display: display,
    transition: transition,
    transform: transform,
    opacity: opacity,
    margin: margin,
    padding: padding,
    borderRadius: borderRadius,
    boxShadow: boxShadow,
    filter: filter,
    cursor: cursor
});
