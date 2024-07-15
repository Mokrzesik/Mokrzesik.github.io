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

      let [gen1_attackAvg, gen1_hpAvg, gen1_defenseAvg, gen1_sp_attackAvg, gen1_sp_defenseAvg, gen1_speedAvg] = extractGenData(gen1);
      let [gen2_attackAvg, gen2_hpAvg, gen2_defenseAvg, gen2_sp_attackAvg, gen2_sp_defenseAvg, gen2_speedAvg] = extractGenData(gen2);
      let [gen3_attackAvg, gen3_hpAvg, gen3_defenseAvg, gen3_sp_attackAvg, gen3_sp_defenseAvg, gen3_speedAvg] = extractGenData(gen3);
      let [gen4_attackAvg, gen4_hpAvg, gen4_defenseAvg, gen4_sp_attackAvg, gen4_sp_defenseAvg, gen4_speedAvg] = extractGenData(gen4);
      let [gen5_attackAvg, gen5_hpAvg, gen5_defenseAvg, gen5_sp_attackAvg, gen5_sp_defenseAvg, gen5_speedAvg] = extractGenData(gen5);
      let [gen6_attackAvg, gen6_hpAvg, gen6_defenseAvg, gen6_sp_attackAvg, gen6_sp_defenseAvg, gen6_speedAvg] = extractGenData(gen6);
      let [gen7_attackAvg, gen7_hpAvg, gen7_defenseAvg, gen7_sp_attackAvg, gen7_sp_defenseAvg, gen7_speedAvg] = extractGenData(gen7);
      let [gen8_attackAvg, gen8_hpAvg, gen8_defenseAvg, gen8_sp_attackAvg, gen8_sp_defenseAvg, gen8_speedAvg] = extractGenData(gen8);


      createVisualization(gen1); // Call the graph making
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

function createVisualization(data) {

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

  return [gen_attackAvg, gen_hpAvg, gen_defenseAvg, gen_sp_attackAvg, gen_sp_defenseAvg, gen_speedAvg];
}
  
// Call the function to load the data and create visualization
loadCSV();