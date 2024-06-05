(() => {
  let csvString = 'data:text/csv;charset=utf-8,'
  
  const scores = []

  const liList = document.querySelectorAll('ul.recently_playeList > li');

  liList.forEach((scoreElement) => {
    const typeUrl = scoreElement.querySelector('.tw > img')?.getAttribute('src');
      const type = typeUrl?.includes('s_text')
        ? 'single'
        : typeUrl?.includes('d_text')
          ? 'double'
          : 'ERROR';

      if (type === 'ERROR') throw new Error('Type element not found.');

      // Get level
      const levelNums = Array.from(scoreElement.querySelectorAll('.numw img')).map(
        img =>
          img
            ?.getAttribute('src')
            ?.match(/num_\d/)?.[0]
            ?.match(/\d/)?.[0],
      );

      const firstDigitLevel = levelNums?.[0];
      const secondDigitLevel = levelNums?.[1];
      if (firstDigitLevel == undefined || secondDigitLevel == undefined) throw new Error('Level number not found.');

      const level = Number(`${firstDigitLevel}${secondDigitLevel}`);

      // Get song name
      const name = scoreElement.querySelector('.song_name p')?.textContent;
      if (!name) throw new Error('Song name not found.');

      // Get score
      const scoreString = scoreElement
        .querySelector('.tx')
        ?.textContent
        ?.replace(',', '');

      if (!scoreString) throw new Error('Score not found.');
      const score = scoreString === 'STAGE BREAK' ? 'STAGE BREAK' : Number(scoreString);

      // Grade
      const grade = scoreElement.querySelector('.li_in.ac img')
          ?.getAttribute('src')
          ?.match(/[a-z_]+.png/)?.[0]
          .replace('.png', '')
          .replace('_p', '+')
          .replace('x_', '') ?? 'STAGE BREAK'

      if (grade == undefined) throw new Error('Plate not found.');

      const plate = scoreElement.querySelector('.li_in.st1 img')
          ?.getAttribute('src')
          ?.match(/[a-z_]+.png/)?.[0]
          .replace('.png', '') ?? 'FAIL'

      if (plate == undefined) throw new Error('Plate not found.');

      // Add to scores array
      scores.push({
        type,
        level,
        name,
        score,
        grade,
        plate,
      });
  })

  csvString += 'Musica, Tipo, Level, Score, Grade, Plate\r\n'
  scores.forEach(score => {
    csvString += `${score.name},${score.type},${score.level},${score.score},${score.grade},${score.plate}\r\n`
  }) 
  const encodedUri = encodeURI(csvString)
  window.open(encodedUri)

  // return scores
})()
