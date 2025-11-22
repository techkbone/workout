async function parseMarkdown(markdown) {
  const { remark } = await import('remark');
  const { visit } = await import('unist-util-visit');

  const exercises = [];
  let currentExercise = null;

  const tree = remark().parse(markdown);

  visit(tree, (node) => {
    if (node.type === 'heading' && node.depth === 3) {
      if (node.children && node.children[0] && node.children[0].value) {
        const text = node.children[0].value;
        const match = text.match(/(?:\w\d\.\s)?(.*)/);
        if (match) {
          currentExercise = {
            name: match[1].trim(),
            sets: [],
          };
          exercises.push(currentExercise);
        }
      }
    }

    if (node.type === 'list' && currentExercise) {
      node.children.forEach((listItem) => {
        if (
          listItem.children &&
          listItem.children[0] &&
          listItem.children[0].children &&
          listItem.children[0].children[0] &&
          listItem.children[0].children[0].value
        ) {
          const text = listItem.children[0].children[0].value;
          const setMatch = text.match(/(\d+)\s*[x×]\s*(\d+|AMRAP)\s*@\s*~?(\d+)\s*(kg|%|lbs)/i);

          if (setMatch) {
            const setData = {
              sets: parseInt(setMatch[1], 10),
              reps: setMatch[2] === 'AMRAP' ? 'AMRAP' : parseInt(setMatch[2], 10),
            };
            if (setMatch[4].toLowerCase() === 'kg' || setMatch[4].toLowerCase() === 'lbs') {
              setData.weight = parseInt(setMatch[3], 10);
              setData.unit = setMatch[4].toLowerCase();
            } else {
              setData.percentage = parseInt(setMatch[3], 10);
            }
            currentExercise.sets.push(setData);
          }
        }
      });
    }
  });

  return exercises;
}

module.exports = {
  parseMarkdown,
};
