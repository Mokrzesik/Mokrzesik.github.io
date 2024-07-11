// Define dataset (can be dynamic data from an API or static)
const dataset = [10, 20, 30, 40, 50];

// Set up dimensions for the chart
const width = 500;
const height = 300;
const barPadding = 5;

// Create SVG element
const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Create bars
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (width / dataset.length))
    .attr("y", d => height - d * 5) // Scale the height of bars
    .attr("width", width / dataset.length - barPadding)
    .attr("height", d => d * 5) // Scale the height of bars
    .attr("fill", "teal");

// Optional: Add labels to bars
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(d => d)
    .attr("x", (d, i) => i * (width / dataset.length) + (width / dataset.length - barPadding) / 2)
    .attr("y", d => height - d * 5 + 15) // Adjust position for better alignment
    .attr("text-anchor", "middle")
    .attr("fill", "white");
