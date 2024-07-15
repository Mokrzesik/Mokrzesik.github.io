async function loadCSV() {
    try {
      const response = await fetch('https://www.kaggle.com/datasets/cristobalmitchell/pokedex?select=pokemon.csv');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const csvText = await response.text();
      
      // Now, you can parse the CSV data as needed
      const parsedData = Papa.parse(csvText, {
        header: true, // Use headers as keys
        skipEmptyLines: true
      });
  
      const data = parsedData.data; // This is your constant with the loaded data
      console.log(data[0]);

      createVisualization(data); // Call the 
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

function createVisualization(data) {
  const svg = d3.select("svg").append("g").attr("transform", "translate(50,50)");

  const xScale = d3.scaleLog().domain([10,150]).range([0,200]);
  const yScale = d3.scaleLog().domain([10,150]).range([200,0]);

  svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
      return (xScale(parseInt(d.Hepatitis_B)))
      })
      .attr("cy", function(d) {
      return (yScale(parseInt(d.Infant_deaths)))
      })
      .attr("r", function(d) {
      return (2 + 2)
      });

  var xAxis = d3.axisBottom(xScale).tickValues([10,20,50,100]).tickFormat(d3.format("~s"));
  var yAxis = d3.axisLeft(yScale).tickValues([10,20,50,100]).tickFormat(d3.format("~s"));

  d3.select("svg").append("g").attr("transform", "translate(50,50)").call(yAxis);
  d3.select("svg").append("g").attr("transform", "translate(50,250)").call(xAxis);
  console.log("Got to the end of the visualization function")
}
  
// Call the function to load the data and create visualization
loadCSV();

//test0.0.10