async function loadCSV() {
    try {
      const response = await fetch('/pokemon.csv');
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
      const gen1 = data.filter(item => item.gen === 'I');
      const gen2 = data.filter(item => item.gen === 'II');
      const gen3 = data.filter(item => item.gen === 'III');
      const gen4 = data.filter(item => item.gen === 'IV');
      const gen5 = data.filter(item => item.gen === 'V');
      const gen6 = data.filter(item => item.gen === 'VI');
      const gen7 = data.filter(item => item.gen === 'VII');
      const gen8 = data.filter(item => item.gen === 'VIII');

      let gen1_attack = 0;
      let gen1_hp = 0;
      let gen1_defense = 0;
      let gen1_sp_attack = 0;
      let gen1_sp_defense = 0;
      let gen1_speed = 0;
      const total_gen1_pokemon = gen1.length;

      for (let i = 0; i < total_gen1_pokemon; i++) {
        gen1_attack += gen1[i].attack;
        gen1_hp += gen1[i].hp;
        gen1_defense += gen1[i].defense;
        gen1_sp_attack += gen1[i].sp_attack;
        gen1_sp_defense += gen1[i].sp_defesnse;
        gen1_sp_speed += gen1[i].speed;
      }
      gen1_attack = gen1_attack / total_gen1_pokemon;
      gen1_hp = gen1_hp / total_gen1_pokemon;
      gen1_defense = gen1_defense / total_gen1_pokemon;
      gen1_sp_attack = gen1_sp_attack / total_gen1_pokemon;
      gen1_sp_defense = gen1_sp_defense / total_gen1_pokemon;
      gen1_speed = gen1_speed / total_gen1_pokemon;

      console.log(gen1_attack);
      console.log(gen1_hp);
      console.log(gen1_defense);
      console.log(gen1_sp_attack);
      console.log(gen1_sp_defense);
      console.log(gen1_speed);

      createVisualization(gen1); // Call the graph making
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

function createVisualization(data) {

  const svg = d3.select("svg").append("g").attr("transform", "translate(50,50)");

  const xScale = d3.scaleLog().domain([10,150]).range([0,300]);
  const yScale = d3.scaleLog().domain([10,150]).range([300,0]);

  svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
      return (xScale(parseInt(d.national_number)))
      })
      .attr("cy", function(d) {
      return (yScale(parseInt(d.attack)))
      })
      .attr("r", function(d) {
      return (2 + d.weight_kg)
      });

  var xAxis = d3.axisBottom(xScale).tickValues([0,,50,100,150,200,250,300]).tickFormat(d3.format("~s"));
  var yAxis = d3.axisLeft(yScale).tickValues([0,50,100,150,200,250,300]).tickFormat(d3.format("~s"));

  d3.select("svg").append("g").attr("transform", "translate(50,50)").call(yAxis);
  d3.select("svg").append("g").attr("transform", "translate(50,250)").call(xAxis);
  console.log("Got to the end of the visualization function")
}
  
// Call the function to load the data and create visualization
loadCSV();