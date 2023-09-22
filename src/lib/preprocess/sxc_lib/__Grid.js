export const grid = (
    columns = "auto-fill",
    rows = "auto",
    gap = "16px",
    minColumnWidth = "200px",
    alignItems = "stretch",
    justifyItems = "stretch",
    area = "none"
) => {
    // Function implementation goes here
    return {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(${minColumnWidth}, 1fr))`,
        gridTemplateRows: rows,
        gap: gap,
        alignItems: alignItems,
        justifyItems: justifyItems,
        gridTemplateAreas: area
    };
}
