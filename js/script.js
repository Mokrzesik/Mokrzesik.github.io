// Call the function to load the data and create visualization
let current_generation = 2;
let gen1_numbers = null;
let gen2_numbers = null;
let gen3_numbers = null;
let gen4_numbers = null;
let gen5_numbers = null;
let gen6_numbers = null;
let gen7_numbers = null;
let gen8_numbers = null;
let gen1_avg = null;
let gen2_avg = null;
let gen3_avg = null;
let gen4_avg = null;
let gen5_avg = null;
let gen6_avg = null;
let gen7_avg = null;
let gen8_avg = null;
const delay = ms => new Promise(res => setTimeout(res, ms));
let max_numbers = null;



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

    [gen1_numbers, gen1_avg] = extractGenData(gen1);
    [gen2_numbers, gen2_avg] = extractGenData(gen2);
    [gen3_numbers, gen3_avg] = extractGenData(gen3);
    [gen4_numbers, gen4_avg] = extractGenData(gen4);
    [gen5_numbers, gen5_avg] = extractGenData(gen5);
    [gen6_numbers, gen6_avg] = extractGenData(gen6);
    [gen7_numbers, gen7_avg] = extractGenData(gen7);
    [gen8_numbers, gen8_avg] = extractGenData(gen8);

    createVisualization(gen1_numbers, '#Gen1'); // Call the graph making
    setStatTotal(gen1_avg, 'Gen1_statTotal');
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

function createVisualization(gen, graphID) {
  const attributes = ['attack', 'hp', 'defense', 'sp_attack', 'sp_defense', 'speed']
  const height = 400;
  const width = 400;
  const margin = 25;
  const yScale = d3.scaleLinear().domain([60,90]).range([height, 0]);
  const xScale = d3.scaleBand().domain(attributes).range([0, width]);

  d3.select(graphID)
    .selectAll('rect')
    .data(gen)
    .enter()
    .append('rect')
    .attr('width', 60)
    .attr('height', function(d) {return height - yScale(d);})
    .attr('x', function(d,i){return 68 * i + 5;})
    .attr('y', function(d) {return yScale(d) + 5;})
    .attr('transform', "translate(20,20)");

  d3.select(graphID)
    .append('g')
    .attr('transform', "translate("+margin+","+margin+")")
    .call(d3.axisLeft(yScale));

  d3.select(graphID)
    .append('g')
    .attr('transform', "translate("+margin+","+(height+margin)+")")
    .call(d3.axisBottom(xScale));

  d3.select(graphID)
    .selectAll('.bar-text')
    .data(gen)
    .enter().append('text')
    .attr("class", "bar-text")
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) { return 68 * i + 50; })
    .attr("y", function(d) { return yScale(d) + 15; })
    .text(function(d) { return d; });

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

function setRightStatTotal(avg, boxID, text) {
  numberBox = document.getElementById(boxID);
  numberBox.textContent = `${text} ${avg}`;
  numberBox.style.display = 'flex';
}

function shrinkAndMove(graphID, buttonID, statID, titleID, newButtonID) {
  actuallyShrinkAndMove(graphID, buttonID, statID, titleID, newButtonID);
  if (current_generation == 2) {
    createVisualization(gen2_numbers, '#Gen2');
    setStatTotal(gen2_avg, 'Gen2_statTotal');
    setRightStatTotal(gen1_avg, 'Gen1_rightStatTotal', 'Gen 1:')
    next_graph = document.getElementById('SecondGraph');
    next_graph.style.display = 'flex';
    current_generation++;
    createVisualization(gen1_numbers, '#AllGens');
    container = document.getElementById('CombinedGraph');
    container.style.transform = 'translate(-450px, -160px)';
    setTimeout(() => {
      container.style.display = 'flex';
    }, 1000);
    container = document.getElementById("FirstGraph");
    container.style.display = 'none';
    container = document.querySelector('#Gen1 text');
    container.style.display = 'none';
    max_numbers = gen1_numbers;


  } else if (current_generation == 3) {
    createVisualization(gen3_numbers, '#Gen3');
    setStatTotal(gen3_avg, 'Gen3_statTotal');
    setRightStatTotal(gen2_avg, 'Gen2_rightStatTotal', 'Gen 2:')
    next_graph = document.getElementById('ThirdGraph');
    current_generation++;
    next_graph.style.display = 'flex';

    setTimeout(() => {
      mergeGraphs(gen2_numbers, '#Gen2', 'Gen2');
    }, 1000);

  } else if (current_generation == 4) {
    current_generation++;
    createVisualization(gen4_numbers, '#Gen4');
    setStatTotal(gen4_avg, 'Gen4_statTotal');
    setRightStatTotal(gen3_avg, 'Gen3_rightStatTotal', 'Gen 3:')
    next_graph = document.getElementById('FourthGraph');
    next_graph.style.display = 'flex';

    setTimeout(() => {
      mergeGraphs(gen3_numbers, '#Gen3', 'Gen3');
    }, 1000);

  } else if (current_generation == 5) {
    current_generation++;
    createVisualization(gen5_numbers, '#Gen5');
    setStatTotal(gen5_avg, 'Gen5_statTotal');
    setRightStatTotal(gen4_avg, 'Gen4_rightStatTotal', 'Gen 4:')
    next_graph = document.getElementById('FifthGraph');
    next_graph.style.display = 'flex';

    setTimeout(() => {
      mergeGraphs(gen4_numbers, '#Gen4', 'Gen4');
    }, 1000);

  } else if (current_generation == 6) {
    current_generation++;
    createVisualization(gen6_numbers, '#Gen6');
    setStatTotal(gen6_avg, 'Gen6_statTotal');
    setRightStatTotal(gen5_avg, 'Gen5_rightStatTotal', 'Gen 5:')
    next_graph = document.getElementById('SixthGraph');
    next_graph.style.display = 'flex';

    setTimeout(() => {
      mergeGraphs(gen5_numbers, '#Gen5', 'Gen5');
    }, 1000);


  } else if (current_generation == 7) {
    current_generation++;
    createVisualization(gen7_numbers, '#Gen7');
    setStatTotal(gen7_avg, 'Gen7_statTotal');
    setRightStatTotal(gen6_avg, 'Gen6_rightStatTotal', 'Gen 6:')
    next_graph = document.getElementById('SeventhGraph');
    next_graph.style.display = 'flex';

    setTimeout(() => {
      mergeGraphs(gen6_numbers, '#Gen6', 'Gen6');
    }, 1000);


  } else if (current_generation == 8) {
    current_generation++;
    createVisualization(gen8_numbers, '#Gen8');
    setStatTotal(gen8_avg, 'Gen8_statTotal');
    setRightStatTotal(gen7_avg, 'Gen7_rightStatTotal', 'Gen 7:')
    next_graph = document.getElementById('EigthGraph');
    next_graph.style.display = 'flex';
    setTimeout(() => {
      mergeGraphs(gen7_numbers, '#Gen7', 'Gen7');
    }, 1000);

  }



}

function actuallyShrinkAndMove(graphID, buttonID, statID, titleID, newButtonID) {
  // move graph
  container = document.getElementById(graphID);
  container.style.transform = 'translate(-450px, -160px)';

  // remove button
  button = document.getElementById(buttonID);
  button.style.display = 'none';

  // remove stat
  stat = document.getElementById(statID);
  stat.style.display = 'none';

  // remove title
  title = document.getElementById(titleID);
  title.style.display = "none";

  // display next button
  next_button = document.getElementById(newButtonID);
  next_button.style.display = "flex";
}

function mergeGraphs(secondGen_numbers, secondGen, secondGenID) {
  for (let i = 1; i < 7; i++) {
    let firstChildRect = document.querySelector(`#AllGens rect:nth-child(${i})`);
    let secondChildRect = document.querySelector(`${secondGen} rect:nth-child(${i})`);
    let firstChildText = document.querySelector(`#AllGens text.bar-text:nth-of-type(${i})`);
    let secondChildText = document.querySelector(`${secondGen} text.bar-text:nth-of-type(${i})`);

    if (max_numbers[i-1] >= secondGen_numbers[i-1]) {
      secondChildRect.style.display = 'none';
      secondChildText.style.display = 'none';
    } else {
      firstChildText.style.display = 'none';
      const cloneRect = secondChildRect.cloneNode(true);
      const cloneText = secondChildText.cloneNode(true);

      firstChildRect.replaceWith(cloneRect);
      firstChildText.replaceWith(cloneText);
      secondChildRect.style.display = 'none';
      secondChildText.style.display = 'none';

      
      let rect1 = document.getElementById('AllGens').querySelector(`rect:nth-child(${i})`);
      let rect2 = document.getElementById(secondGenID).querySelector(`rect:nth-child(${i})`);
      let styles = window.getComputedStyle(rect2);
      let fillStyle = styles.getPropertyValue('fill');
      rect1.style.fill = fillStyle;

      max_numbers[i-1] = secondGen_numbers[i-1];
    }
  }
}

loadCSV();