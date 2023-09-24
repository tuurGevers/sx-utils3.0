export let container = (
    maxWidth = "1200px", // A common max width for larger screens
    padding = "0 15px",  // Common padding to ensure content doesn't stick to the edge on small screens
    margin = "0 auto",   // Centers the content
    bgColor = "transparent", // Optional background color
) => ({
    width: "100%", // Ensures it takes full width on small screens
    maxWidth: maxWidth,
    padding: padding,
    margin: margin,
    backgroundColor: bgColor,
});
