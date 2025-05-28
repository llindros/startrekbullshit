d3.csv("TNG.csv").then(data => {
  const counts = {};

  data.forEach(d => {
    const ep = d.episode;
    const character = d.who.trim();
    if (!ep || !character) return;

    const key = `${ep}||${character}`;
    if (!counts[key]) counts[key] = 0;
    counts[key]++;
  });

  // Aggregate total lines per character
  const totalLinesPerCharacter = {};
  Object.entries(counts).forEach(([key, lines]) => {
    const [, character] = key.split("||");
    if (!totalLinesPerCharacter[character]) totalLinesPerCharacter[character] = 0;
    totalLinesPerCharacter[character] += lines;
  });

  // Get top 40 characters, omitting "NA"
  const topCharacters = new Set(
    Object.entries(totalLinesPerCharacter)
      .filter(([character]) => character !== "NA")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([character]) => character)
  );

  // Convert to array and filter to top 40 characters, omitting "NA"
  const aggregated = Object.entries(counts)
    .map(([key, lines]) => {
      const [episode, character] = key.split("||");
      return { episode, character, lines };
    })
    .filter(d => topCharacters.has(d.character) && d.character !== "NA");



  drawHeatmap(aggregated);
});
