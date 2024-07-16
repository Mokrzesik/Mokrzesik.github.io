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

      const [gen1_numbers, gen1_avg] = extractGenData(gen1);
      const [gen2_numbers, gen2_avg] = extractGenData(gen2);
      const [gen3_numbers, gen3_avg] = extractGenData(gen3);
      const [gen4_numbers, gen4_avg] = extractGenData(gen4);
      const [gen5_numbers, gen5_avg] = extractGenData(gen5);
      const [gen6_numbers, gen6_avg] = extractGenData(gen6);
      const [gen7_numbers, gen7_avg] = extractGenData(gen7);
      const [gen8_numbers, gen8_avg] = extractGenData(gen8);

      createVisualization(gen1_numbers, '#Gen1'); // Call the graph making
      setStatTotal(gen1_avg, 'Gen1_statTotal');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }

    return [gen2_numbers, gen3_numbers, gen4_numbers, gen5_numbers, gen6_numbers, gen7_numbers, gen8_numbers, gen2_avg, gen3_avg, gen4_avg, gen5_avg, gen6_avg, gen7_avg, gen8_avg];
  }

function createVisualization(gen, graphID) {
  const attributes = ['attack', 'hp', 'defense', 'sp_attack', 'sp_defense', 'speed']
  const height = 400;
  const width = 400;
  const margin = 20;
  const yScale = d3.scaleLinear().domain([60,90]).range([height, 0]);
  const xScale = d3.scaleBand().domain(attributes).range([0, width]);

  d3.select(graphID)
    .selectAll('rect')
    .data(gen)
    .enter()
    .append('rect')
    .attr('width', 60)
    .attr('height', function(d) {return height - yScale(d);})
    .attr('x', function(d,i){return 68 * i;})
    .attr('y', function(d) {return yScale(d);})
    .attr('transform', "translate(20,20)");

  d3.select(graphID)
    .append('g')
    .attr('transform', "translate("+margin+","+margin+")")
    .call(d3.axisLeft(yScale));

  d3.select(graphID)
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

  return [[gen_attackAvg, gen_hpAvg, gen_defenseAvg, gen_sp_attackAvg, gen_sp_defenseAvg, gen_speedAvg], gen_avg];
}

function setStatTotal(avg, boxID) {
  numberBox = document.getElementById(boxID);
  numberBox.textContent = `Total Stats: ${avg}`;
}

function shrinkAndMove() {
  container = document.getElementById('FirstGraph');
  container.style.transform = 'translate(-450px, -160px)';

  // setup for next graph
  button = document.getElementById('nextGenButton');
  button.textContent = 'Gen 3';

  stat = document.getElementById('Gen1_statTotal');
  stat.style.display = "none";

  title = document.getElementById('Gen1_Title');
  title.style.display = "none";

}

// Call the function to load the data and create visualization
[gen2_numbers, gen3_numbers, gen4_numbers, gen5_numbers, gen6_numbers, gen7_numbers, gen8_numbers, gen2_avg, gen3_avg, gen4_avg, gen5_avg, gen6_avg, gen7_avg, gen8_avg] = loadCSV();


