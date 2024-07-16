async function loadCSV() {
    try {
      const response = await fetch('/pokemon.csv');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      let csvText = await response.text();
      // Remove null characters
      csvText = csvText.replace(/\u0000/g, '');
      
      // Now, you can parse the CSV data as needed
      const parsedData = Papa.parse(csvText, {
        header: true, // Use headers as keys
        skipEmptyLines: true,
        transformHeader: header => header.trim().toLowerCase()
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

      let [gen1_attackAvg, gen1_hpAvg, gen1_defenseAvg, gen1_sp_attackAvg, gen1_sp_defenseAvg, gen1_speedAvg, gen1_avg] = extractGenData(gen1);
      let [gen2_attackAvg, gen2_hpAvg, gen2_defenseAvg, gen2_sp_attackAvg, gen2_sp_defenseAvg, gen2_speedAvg, gen2_avg] = extractGenData(gen2);
      let [gen3_attackAvg, gen3_hpAvg, gen3_defenseAvg, gen3_sp_attackAvg, gen3_sp_defenseAvg, gen3_speedAvg, gen3_avg] = extractGenData(gen3);
      let [gen4_attackAvg, gen4_hpAvg, gen4_defenseAvg, gen4_sp_attackAvg, gen4_sp_defenseAvg, gen4_speedAvg, gen4_avg] = extractGenData(gen4);
      let [gen5_attackAvg, gen5_hpAvg, gen5_defenseAvg, gen5_sp_attackAvg, gen5_sp_defenseAvg, gen5_speedAvg, gen5_avg] = extractGenData(gen5);
      let [gen6_attackAvg, gen6_hpAvg, gen6_defenseAvg, gen6_sp_attackAvg, gen6_sp_defenseAvg, gen6_speedAvg, gen6_avg] = extractGenData(gen6);
      let [gen7_attackAvg, gen7_hpAvg, gen7_defenseAvg, gen7_sp_attackAvg, gen7_sp_defenseAvg, gen7_speedAvg, gen7_avg] = extractGenData(gen7);
      let [gen8_attackAvg, gen8_hpAvg, gen8_defenseAvg, gen8_sp_attackAvg, gen8_sp_defenseAvg, gen8_speedAvg, gen8_avg] = extractGenData(gen8);

      console.log(gen1_attackAvg);
      console.log(gen2_attackAvg);
      console.log(gen3_attackAvg);
      console.log(gen4_attackAvg);
      console.log(gen5_attackAvg);
      console.log(gen6_attackAvg);
      console.log(gen7_attackAvg);
      console.log(gen8_attackAvg);

      console.log(" ");

      console.log(gen1_hpAvg);
      console.log(gen2_hpAvg);
      console.log(gen3_hpAvg);
      console.log(gen4_hpAvg);
      console.log(gen5_hpAvg);
      console.log(gen6_hpAvg);
      console.log(gen7_hpAvg);
      console.log(gen8_hpAvg);

      console.log(" ");

      console.log(gen1_defenseAvg);
      console.log(gen2_defenseAvg);
      console.log(gen3_defenseAvg);
      console.log(gen4_defenseAvg);
      console.log(gen5_defenseAvg);
      console.log(gen6_defenseAvg);
      console.log(gen7_defenseAvg);
      console.log(gen8_defenseAvg);

      console.log(" ");

      console.log(gen1_sp_attackAvg);
      console.log(gen2_sp_attackAvg);
      console.log(gen3_sp_attackAvg);
      console.log(gen4_sp_attackAvg);
      console.log(gen5_sp_attackAvg);
      console.log(gen6_sp_attackAvg);
      console.log(gen7_sp_attackAvg);
      console.log(gen8_sp_attackAvg);

      console.log(" ");

      console.log(gen1_sp_defenseAvg);
      console.log(gen2_sp_defenseAvg);
      console.log(gen3_sp_defenseAvg);
      console.log(gen4_sp_defenseAvg);
      console.log(gen5_sp_defenseAvg);
      console.log(gen6_sp_defenseAvg);
      console.log(gen7_sp_defenseAvg);
      console.log(gen8_sp_defenseAvg);

      console.log(" ");

      console.log(gen1_speedAvg);
      console.log(gen2_speedAvg);
      console.log(gen3_speedAvg);
      console.log(gen4_speedAvg);
      console.log(gen5_speedAvg);
      console.log(gen6_speedAvg);
      console.log(gen7_speedAvg);
      console.log(gen8_speedAvg);

      console.log(" ");

      console.log(gen1_avg);
      console.log(gen2_avg);
      console.log(gen3_avg);
      console.log(gen4_avg);
      console.log(gen5_avg);
      console.log(gen6_avg);
      console.log(gen7_avg);
      console.log(gen8_avg);


      createVisualization([gen1_attackAvg, gen1_hpAvg, gen1_defenseAvg, gen1_sp_attackAvg, gen1_sp_defenseAvg, gen1_speedAvg]); // Call the graph making
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

function createVisualization(gen) {
  const attributes = ['attack', 'hp', 'defense', 'sp_attack', 'sp_defense', 'speed']
  const height = 400;
  const width = 400;
  const margin = 20;
  const yScale = d3.scaleLinear().domain([60,90]).range([height, 0]);
  const xScale = d3.scaleBand().domain(attributes).range([0, width]);

  d3.select('#Gen1')
    .selectAll('rect')
    .data(gen)
    .enter()
    .append('rect')
    .attr('width', 40)
    .attr('height', function(d) {return height - yScale(d);})
    .attr('x', function(d,i){return 68 * i;})
    .attr('y', function(d) {return yScale(d);})
    .attr('transform', "translate(30,20)");

  d3.select('#Gen1')
    .append('g')
    .attr('transform', "translate("+margin+","+margin+")")
    .call(d3.axisLeft(yScale));

  d3.select('#Gen1')
    .append('g')
    .attr('transform', "translate("+margin+","+(height+margin)+")")
    .call(d3.axisBottom(xScale));

}

function extractGenData(gen) {
  let gen_attack = 0;
  let gen_hp = 0;
  let gen_defense = 0;
  let gen_sp_attack = 0;
  let gen_sp_defense = 0;
  let gen_speed = 0;
  const total_gen_pokemon = gen.length;

  for (let i = 0; i < total_gen_pokemon; i++) {
    gen_attack += parseInt(gen[i].attack);
    gen_hp += parseInt(gen[i].hp);
    gen_defense += parseInt(gen[i].defense);
    gen_sp_attack += parseInt(gen[i].sp_attack);
    gen_sp_defense += parseInt(gen[i].sp_defense);
    gen_speed += parseInt(gen[i].speed);
  }

  gen_attack = gen_attack / total_gen_pokemon;
  gen_hp = gen_hp / total_gen_pokemon;
  gen_defense = gen_defense / total_gen_pokemon;
  gen_sp_attack = gen_sp_attack / total_gen_pokemon;
  gen_sp_defense = gen_sp_defense / total_gen_pokemon;
  gen_speed = gen_speed / total_gen_pokemon;

  gen_attackAvg = parseInt(gen_attack);
  gen_hpAvg = parseInt(gen_hp);
  gen_defenseAvg = parseInt(gen_defense);
  gen_sp_attackAvg = parseInt(gen_sp_attack);
  gen_sp_defenseAvg = parseInt(gen_sp_defense);
  gen_speedAvg = parseInt(gen_speed);

  gen_avg = gen_attackAvg + gen_hpAvg + gen_defenseAvg + gen_sp_attackAvg + gen_sp_defenseAvg + gen_speedAvg;

  return [gen_attackAvg, gen_hpAvg, gen_defenseAvg, gen_sp_attackAvg, gen_sp_defenseAvg, gen_speedAvg, gen_avg];
}
  
// Call the function to load the data and create visualization
loadCSV();