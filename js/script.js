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
let max_numbers = null;
let current_display = 'stats';



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
    container = document.getElementById('Gen2_color');
    container.style.display = 'block';


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
    container = document.getElementById('Gen3_color');
    container.style.display = 'block';

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
    container = document.getElementById('Gen4_color');
    container.style.display = 'block';

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
    container = document.getElementById('Gen5_color');
    container.style.display = 'block';

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
    container = document.getElementById('Gen6_color');
    container.style.display = 'block';


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
    container = document.getElementById('Gen7_color');
    container.style.display = 'block';


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
    container = document.getElementById('Gen8_color');
    container.style.display = 'block';
  } else if (current_generation == 9) {
    current_generation++;
    setRightStatTotal(gen8_avg, 'Gen8_rightStatTotal', 'Gen 8:')
    setTimeout(() => {
      mergeGraphs(gen8_numbers, '#Gen8', 'Gen8');
    }, 1000);
    moveStatsCenter();

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
  if (newButtonID != null) {
    next_button = document.getElementById(newButtonID);
    next_button.style.display = "flex";
  }
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

function moveStatsCenter() {

  title = document.getElementById('sumStats');
  title.style.transform = 'translate(-535px, 150px)';
  title.style.fontSize = '40px';

  text = document.getElementById('ClickHere');
  text.style.display = 'none';

  setTimeout(() => {
    gens = document.getElementById('Gen1_rightStatTotal');
    gens.style.transform = 'translate(-580px, 175px)';
    gens.style.fontSize = '32px';
  }, 500);

  setTimeout(() => {
    gens = document.getElementById('Gen2_rightStatTotal');
    gens.style.transform = 'translate(-580px, 200px)';
    gens.style.fontSize = '32px';
  }, 500);

  setTimeout(() => {
    gens = document.getElementById('Gen3_rightStatTotal');
    gens.style.transform = 'translate(-580px, 225px)';
    gens.style.fontSize = '32px';
  }, 500);

  setTimeout(() => {
    gens = document.getElementById('Gen4_rightStatTotal');
    gens.style.transform = 'translate(-580px, 250px)';
    gens.style.fontSize = '32px';
  }, 500);

  setTimeout(() => {
    gens = document.getElementById('Gen5_rightStatTotal');
    gens.style.transform = 'translate(-580px, 275px)';
    gens.style.fontSize = '32px';
  }, 500);

  setTimeout(() => {
    gens = document.getElementById('Gen6_rightStatTotal');
    gens.style.transform = 'translate(-580px, 300px)';
    gens.style.fontSize = '32px';
  }, 500);

  setTimeout(() => {
    gens = document.getElementById('Gen7_rightStatTotal');
    gens.style.transform = 'translate(-580px, 325px)';
    gens.style.fontSize = '32px';
  }, 500);

  setTimeout(() => {
    test = document.getElementById('Gen8_rightStatTotal');
    test.style.transform = 'translate(-580px, 350px)';
    test.style.fontSize = '32px';
  }, 500);

  setTimeout(() => {
    arrow = document.getElementById('arrow');
    arrow.style.display = 'flex';

    click = document.getElementById('Click');
    click.style.display = 'flex';

    increase = document.getElementById('increase');
    increase.style.display = 'flex';

    gen1button = document.getElementById('CenterGen1Graph');
    gen1button.style.display = 'flex';

    gen2button = document.getElementById('CenterGen2Graph');
    gen2button.style.display = 'flex';

    gen3button = document.getElementById('CenterGen3Graph');
    gen3button.style.display = 'flex';

    gen4button = document.getElementById('CenterGen4Graph');
    gen4button.style.display = 'flex';

    gen5button = document.getElementById('CenterGen5Graph');
    gen5button.style.display = 'flex';

    gen6button = document.getElementById('CenterGen6Graph');
    gen6button.style.display = 'flex';

    gen7button = document.getElementById('CenterGen7Graph');
    gen7button.style.display = 'flex';

    gen8button = document.getElementById('CenterGen8Graph');
    gen8button.style.display = 'flex';

    statbutton = document.getElementById('CenterStats');
    statbutton.style.display = 'flex';

    bigGraphButton = document.getElementById('CenterCombined');
    bigGraphButton.style.display = 'flex';
  }, 1000)

  createVisualization(gen1_numbers, '#Gen1Center');
  createVisualization(gen2_numbers, '#Gen2Center');
  createVisualization(gen3_numbers, '#Gen3Center');
  createVisualization(gen4_numbers, '#Gen4Center');
  createVisualization(gen5_numbers, '#Gen5Center');
  createVisualization(gen6_numbers, '#Gen6Center');
  createVisualization(gen7_numbers, '#Gen7Center');
  createVisualization(gen8_numbers, '#Gen8Center');

  graph = document.getElementById('FirstGraph');
  graph.style.display = 'none';
  graph = document.getElementById('SecondGraph');
  graph.style.display = 'none';
  graph = document.getElementById('ThirdGraph');
  graph.style.display = 'none';
  graph = document.getElementById('FourthGraph');
  graph.style.display = 'none';
  graph = document.getElementById('FifthGraph');
  graph.style.display = 'none';
  graph = document.getElementById('SixthGraph');
  graph.style.display = 'none';
  graph = document.getElementById('SeventhGraph');
  graph.style.display = 'none';
  graph = document.getElementById('EigthGraph');
  graph.style.display = 'none';
}

function DisplayGen1() {
  removeCenter();
  title = document.getElementById('Gen1_TitleCenter');
  title.style.display = 'flex';

  total = document.getElementById('FirstGraphCenter');
  total.style.display = 'flex';

  rects = document.querySelectorAll('#Gen1Center rect');
  rects.forEach(element => {
    element.style.display = 'flex';
  });

  setStatTotal(gen1_avg, 'Gen1_statTotalCenter');
  stat = document.getElementById('Gen1_statTotalCenter');
  stat.style.display = 'flex';

  texts = document.querySelectorAll('#FirstGraphCenter text');
  texts.forEach(element => {
    element.style.display = 'flex';
  });
  current_display = 'gen1';
}
function DisplayGen2() {
  removeCenter();
  title = document.getElementById('Gen2_TitleCenter');
  title.style.display = 'flex';

  total = document.getElementById('SecondGraphCenter');
  total.style.display = 'flex';

  rects = document.querySelectorAll('#Gen2Center rect');
  rects.forEach(element => {
    element.style.display = 'flex';
  });

  setStatTotal(gen1_avg, 'Gen2_statTotalCenter');
  stat = document.getElementById('Gen2_statTotalCenter');
  stat.style.display = 'flex';

  texts = document.querySelectorAll('#SecondGraphCenter text');
  texts.forEach(element => {
    element.style.display = 'flex';
  });
  current_display = 'gen2';
}
function DisplayGen3() {
  removeCenter();
  title = document.getElementById('Gen3_TitleCenter');
  title.style.display = 'flex';

  total = document.getElementById('ThirdGraphCenter');
  total.style.display = 'flex';

  rects = document.querySelectorAll('#Gen3Center rect');
  rects.forEach(element => {
    element.style.display = 'flex';
  });

  setStatTotal(gen1_avg, 'Gen3_statTotalCenter');
  stat = document.getElementById('Gen3_statTotalCenter');
  stat.style.display = 'flex';

  texts = document.querySelectorAll('#ThirdGraphCenter text');
  texts.forEach(element => {
    element.style.display = 'flex';
  });
  current_display = 'gen3';
}
function DisplayGen4() {
  removeCenter();
  title = document.getElementById('Gen4_TitleCenter');
  title.style.display = 'flex';

  total = document.getElementById('FourthGraphCenter');
  total.style.display = 'flex';

  rects = document.querySelectorAll('#Gen4Center rect');
  rects.forEach(element => {
    element.style.display = 'flex';
  });

  setStatTotal(gen1_avg, 'Gen4_statTotalCenter');
  stat = document.getElementById('Gen4_statTotalCenter');
  stat.style.display = 'flex';

  texts = document.querySelectorAll('#FourthGraphCenter text');
  texts.forEach(element => {
    element.style.display = 'flex';
  });
  current_display = 'gen4';
}
function DisplayGen5() {
  removeCenter();
  title = document.getElementById('Gen5_TitleCenter');
  title.style.display = 'flex';

  total = document.getElementById('FifthGraphCenter');
  total.style.display = 'flex';

  rects = document.querySelectorAll('#Gen5Center rect');
  rects.forEach(element => {
    element.style.display = 'flex';
  });

  setStatTotal(gen1_avg, 'Gen5_statTotalCenter');
  stat = document.getElementById('Gen5_statTotalCenter');
  stat.style.display = 'flex';

  texts = document.querySelectorAll('#FifthGraphCenter text');
  texts.forEach(element => {
    element.style.display = 'flex';
  });
  current_display = 'gen5';
}
function DisplayGen6() {
  removeCenter();
  title = document.getElementById('Gen6_TitleCenter');
  title.style.display = 'flex';

  total = document.getElementById('SixthGraphCenter');
  total.style.display = 'flex';

  rects = document.querySelectorAll('#Gen6Center rect');
  rects.forEach(element => {
    element.style.display = 'flex';
  });

  setStatTotal(gen1_avg, 'Gen6_statTotalCenter');
  stat = document.getElementById('Gen6_statTotalCenter');
  stat.style.display = 'flex';

  texts = document.querySelectorAll('#SixthGraphCenter text');
  texts.forEach(element => {
    element.style.display = 'flex';
  });
  current_display = 'gen6';
}
function DisplayGen7() {
  removeCenter();
  title = document.getElementById('Gen7_TitleCenter');
  title.style.display = 'flex';

  total = document.getElementById('SeventhGraphCenter');
  total.style.display = 'flex';

  rects = document.querySelectorAll('#Gen7Center rect');
  rects.forEach(element => {
    element.style.display = 'flex';
  });

  setStatTotal(gen1_avg, 'Gen7_statTotalCenter');
  stat = document.getElementById('Gen7_statTotalCenter');
  stat.style.display = 'flex';

  texts = document.querySelectorAll('#SeventhGraphCenter text');
  texts.forEach(element => {
    element.style.display = 'flex';
  });
  current_display = 'gen7';
}
function DisplayGen8() {
  removeCenter();
  title = document.getElementById('Gen8_TitleCenter');
  title.style.display = 'flex';

  total = document.getElementById('EigthGraphCenter');
  total.style.display = 'flex';

  rects = document.querySelectorAll('#Gen8Center rect');
  rects.forEach(element => {
    element.style.display = 'flex';
  });

  setStatTotal(gen1_avg, 'Gen8_statTotalCenter');
  stat = document.getElementById('Gen8_statTotalCenter');
  stat.style.display = 'flex';

  texts = document.querySelectorAll('#EigthGraphCenter text');
  texts.forEach(element => {
    element.style.display = 'flex';
  });
  current_display = 'gen8';
}
function DisplayTotals() {
  removeCenter();
  unReverseStat();
  current_display = 'stats';
}
function DisplayCombined() {
  removeCenter();
  container = document.getElementById('CombinedGraph');
  container.style.transform = 'translate(0px, 0px)';
  current_display = 'combined';

}

function removeCenter() {
  if (current_display == 'stats') {
    reverseStat()
  } else if (current_display == 'gen1') {
    title = document.getElementById('Gen1_TitleCenter');
    title.style.display = 'none';

    total = document.getElementById('FirstGraphCenter');
    total.style.display = 'none';

    rects = document.querySelectorAll('#Gen1Center rect');
    rects.forEach(element => {
      element.style.display = 'none';
    });

    setStatTotal(gen1_avg, 'Gen1_statTotalCenter');
    stat = document.getElementById('Gen1_statTotalCenter');
    stat.style.display = 'none';

    texts = document.querySelectorAll('#FirstGraphCenter text');
    texts.forEach(element => {
      element.style.display = 'none';
    });
  } else if (current_display == 'gen2') {
    title = document.getElementById('Gen2_TitleCenter');
    title.style.display = 'none';

    total = document.getElementById('SecondGraphCenter');
    total.style.display = 'none';

    rects = document.querySelectorAll('#Gen2Center rect');
    rects.forEach(element => {
      element.style.display = 'none';
    });

    setStatTotal(gen1_avg, 'Gen2_statTotalCenter');
    stat = document.getElementById('Gen2_statTotalCenter');
    stat.style.display = 'none';

    texts = document.querySelectorAll('#SecondGraphCenter text');
    texts.forEach(element => {
      element.style.display = 'none';
    });
  } else if (current_display == 'gen3') {
    title = document.getElementById('Gen3_TitleCenter');
    title.style.display = 'none';

    total = document.getElementById('ThirdGraphCenter');
    total.style.display = 'none';

    rects = document.querySelectorAll('#Gen3Center rect');
    rects.forEach(element => {
      element.style.display = 'none';
    });

    setStatTotal(gen1_avg, 'Gen3_statTotalCenter');
    stat = document.getElementById('Gen3_statTotalCenter');
    stat.style.display = 'none';

    texts = document.querySelectorAll('#ThirdGraphCenter text');
    texts.forEach(element => {
      element.style.display = 'none';
    });
  } else if (current_display == 'gen4') {
    title = document.getElementById('Gen4_TitleCenter');
    title.style.display = 'none';

    total = document.getElementById('FourthGraphCenter');
    total.style.display = 'none';

    rects = document.querySelectorAll('#Gen4Center rect');
    rects.forEach(element => {
      element.style.display = 'none';
    });

    setStatTotal(gen1_avg, 'Gen4_statTotalCenter');
    stat = document.getElementById('Gen4_statTotalCenter');
    stat.style.display = 'none';

    texts = document.querySelectorAll('#FourthGraphCenter text');
    texts.forEach(element => {
      element.style.display = 'none';
    });
  } else if (current_display == 'gen5') {
    title = document.getElementById('Gen5_TitleCenter');
    title.style.display = 'none';

    total = document.getElementById('FifthGraphCenter');
    total.style.display = 'none';

    rects = document.querySelectorAll('#Gen5Center rect');
    rects.forEach(element => {
      element.style.display = 'none';
    });

    setStatTotal(gen1_avg, 'Gen5_statTotalCenter');
    stat = document.getElementById('Gen5_statTotalCenter');
    stat.style.display = 'none';

    texts = document.querySelectorAll('#FifthGraphCenter text');
    texts.forEach(element => {
      element.style.display = 'none';
    });
  } else if (current_display == 'gen6') {
    title = document.getElementById('Gen6_TitleCenter');
    title.style.display = 'none';

    total = document.getElementById('SixthGraphCenter');
    total.style.display = 'none';

    rects = document.querySelectorAll('#Gen6Center rect');
    rects.forEach(element => {
      element.style.display = 'none';
    });

    setStatTotal(gen1_avg, 'Gen6_statTotalCenter');
    stat = document.getElementById('Gen6_statTotalCenter');
    stat.style.display = 'none';

    texts = document.querySelectorAll('#SixthGraphCenter text');
    texts.forEach(element => {
      element.style.display = 'none';
    });
  } else if (current_display == 'gen7') {
    title = document.getElementById('Gen7_TitleCenter');
    title.style.display = 'none';

    total = document.getElementById('SeventhGraphCenter');
    total.style.display = 'none';

    rects = document.querySelectorAll('#Gen7Center rect');
    rects.forEach(element => {
      element.style.display = 'none';
    });

    setStatTotal(gen1_avg, 'Gen7_statTotalCenter');
    stat = document.getElementById('Gen7_statTotalCenter');
    stat.style.display = 'none';

    texts = document.querySelectorAll('#SeventhGraphCenter text');
    texts.forEach(element => {
      element.style.display = 'none';
    });
  } else if (current_display == 'gen8') {
    title = document.getElementById('Gen8_TitleCenter');
    title.style.display = 'none';

    total = document.getElementById('EigthGraphCenter');
    total.style.display = 'none';

    rects = document.querySelectorAll('#Gen8Center rect');
    rects.forEach(element => {
      element.style.display = 'none';
    });

    setStatTotal(gen1_avg, 'Gen8_statTotalCenter');
    stat = document.getElementById('Gen8_statTotalCenter');
    stat.style.display = 'none';

    texts = document.querySelectorAll('#EigthGraphCenter text');
    texts.forEach(element => {
      element.style.display = 'none';
    });
  } else if (current_display == 'combined') {
    container = document.getElementById('CombinedGraph');
    container.style.transform = 'translate(-450px, -160px)';
  }
}

function reverseStat() {
  title = document.getElementById('sumStats');
  title.style.transform = 'translate(0px, 0px)';
  title.style.fontSize = '16px';

  gens = document.getElementById('Gen1_rightStatTotal');
  gens.style.transform = 'translate(0px, 0px)';
  gens.style.fontSize = '16px';
  
  gens = document.getElementById('Gen2_rightStatTotal');
  gens.style.transform = 'translate(0px, 0px)';
  gens.style.fontSize = '16px';

  gens = document.getElementById('Gen3_rightStatTotal');
  gens.style.transform = 'translate(0px, 0px)';
  gens.style.fontSize = '16px';

  gens = document.getElementById('Gen4_rightStatTotal');
  gens.style.transform = 'translate(0px, 0px)';
  gens.style.fontSize = '16px';

  gens = document.getElementById('Gen5_rightStatTotal');
  gens.style.transform = 'translate(0px, 0px)';
  gens.style.fontSize = '16px';

  gens = document.getElementById('Gen6_rightStatTotal');
  gens.style.transform = 'translate(0px, 0px)';
  gens.style.fontSize = '16px';

  gens = document.getElementById('Gen7_rightStatTotal');
  gens.style.transform = 'translate(0px, 0px)';
  gens.style.fontSize = '16px';

  test = document.getElementById('Gen8_rightStatTotal');
  test.style.transform = 'translate(0px, 0px)';
  test.style.fontSize = '16px';

  arrow = document.getElementById('arrow');
  arrow.style.display = 'none';

  increase = document.getElementById('increase');
  increase.style.display = 'none';
}

function unReverseStat() {
  title = document.getElementById('sumStats');
  title.style.transform = 'translate(-535px, 150px)';
  title.style.fontSize = '40px';

  gens = document.getElementById('Gen1_rightStatTotal');
  gens.style.transform = 'translate(-580px, 175px)';
  gens.style.fontSize = '32px';

  gens = document.getElementById('Gen2_rightStatTotal');
  gens.style.transform = 'translate(-580px, 200px)';
  gens.style.fontSize = '32px';

  gens = document.getElementById('Gen3_rightStatTotal');
  gens.style.transform = 'translate(-580px, 225px)';
  gens.style.fontSize = '32px';

  gens = document.getElementById('Gen4_rightStatTotal');
  gens.style.transform = 'translate(-580px, 250px)';
  gens.style.fontSize = '32px';

  gens = document.getElementById('Gen5_rightStatTotal');
  gens.style.transform = 'translate(-580px, 275px)';
  gens.style.fontSize = '32px';

  gens = document.getElementById('Gen6_rightStatTotal');
  gens.style.transform = 'translate(-580px, 300px)';
  gens.style.fontSize = '32px';

  gens = document.getElementById('Gen7_rightStatTotal');
  gens.style.transform = 'translate(-580px, 325px)';
  gens.style.fontSize = '32px';

  test = document.getElementById('Gen8_rightStatTotal');
  test.style.transform = 'translate(-580px, 350px)';
  test.style.fontSize = '32px';

  arrow = document.getElementById('arrow');
  arrow.style.display = 'flex';

  increase = document.getElementById('increase');
  increase.style.display = 'flex';
}


loadCSV();