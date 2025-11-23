const { remark } = require('remark');
const { visit } = require('unist-util-visit');

function parseDate(dateString, year) {
  if (!dateString || !year) return null;
  const parts = dateString.split(' ');
  if (parts.length < 2) return null;

  const day = parts[0];
  const monthName = parts[1];

  const monthMap = {
    'Jan': '01', 'Fév': '02', 'Mar': '03', 'Avr': '04', 'Mai': '05', 'Juin': '06',
    'Juil': '07', 'Août': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Déc': '12'
  };

  const month = monthMap[monthName];
  if (!month) return null;

  return `${year}-${month}-${String(day).padStart(2, '0')}`;
}

function parseExercise(text) {
    if (!text) return null;

    const exercise = { sets: [] };

    // Extract name (bolded part or from start)
    const nameMatch = text.match(/\*\*(.*?)\*\*/);
    if (nameMatch) {
        exercise.name = nameMatch[1].trim();
    } else {
        const nameEnd = text.indexOf(':');
        if (nameEnd !== -1) {
            exercise.name = text.substring(0, nameEnd).replace(/^\d+\.\s*/, '').trim();
        } else {
            exercise.name = text.trim();
        }
    }

    // Extract details
    const detailsMatch = text.match(/:\s*(.*)/);
    if (detailsMatch) {
        exercise.details = detailsMatch[1].trim();

        // Further parse details into structured data
        const structuredMatch = exercise.details.match(/(\d+)\s*[x×]\s*(\d+|AMRAP|[\d\/]+)\s*@\s*([\d\.]+\s*(?:lbs|kg|%))/i);
        if (structuredMatch) {
            const setData = {
                sets: parseInt(structuredMatch[1], 10),
                reps: structuredMatch[2],
            };
            const measurement = structuredMatch[3].trim();
            const unitMatch = measurement.match(/(\d+\.?\d*)\s*(lbs|kg|%)/i);
            if (unitMatch) {
                const value = parseFloat(unitMatch[1]);
                const unit = unitMatch[2].toLowerCase();
                if (unit === '%') {
                    setData.percentage = value;
                } else {
                    setData.weight = value;
                    setData.unit = unit;
                }
            }
            exercise.sets.push(setData);
        } else {
            // Handle cases with no structured data but with details
            const simpleDetailsMatch = exercise.details.match(/(\d+)\s*[x×]\s*(\d+|[\w\s\/]+)/i);
            if(simpleDetailsMatch) {
                 const setData = {
                    sets: parseInt(simpleDetailsMatch[1], 10),
                    reps: simpleDetailsMatch[2].trim(),
                    details: exercise.details
                };
                exercise.sets.push(setData);
            }
        }
    }

    return exercise;
}


async function parseMarkdown(markdown) {
  const { remark } = await import('remark');
  const { visit } = await import('unist-util-visit');

  const program = { phases: [] };
  let currentPhase = null;
  let currentWeek = null;
  let currentSession = null;
  let currentSection = null;
  let currentYear = null;

  const tree = remark().parse(markdown);

  visit(tree, (node) => {
    if (node.type === 'heading') {
      const headingText = node.children[0]?.value || '';
      if (node.depth === 3 && headingText.startsWith('PHASE')) {
        currentPhase = { name: headingText, weeks: [] };
        program.phases.push(currentPhase);
        currentWeek = null;
        currentSession = null;
        currentSection = null;
      } else if (node.depth === 4 && headingText.startsWith('Semaine')) {
        if (currentPhase) {
          const yearMatch = headingText.match(/(\d{4})/);
          currentYear = yearMatch ? yearMatch[1] : currentYear;
          currentWeek = { name: headingText, sessions: [] };
          currentPhase.weeks.push(currentWeek);
          currentSession = null;
          currentSection = null;
        }
      } else if (node.depth === 5) {
        if (currentWeek) {
          // Match date with accented characters like "Déc", "Fév"
          const dateMatch = headingText.match(/(\d{1,2}\s+[A-Za-zÀ-ÿ]{3,})/);
          const date = parseDate(dateMatch ? dateMatch[1] : null, currentYear);
          currentSession = { name: headingText, date: date, sections: [] };
          currentWeek.sessions.push(currentSession);
          currentSection = null;
        }
      }
    }

    if (currentSession && node.type === 'paragraph' && node.children[0]?.type === 'strong') {
        const sectionName = node.children[0]?.children[0]?.value;
        if (sectionName) {
            currentSection = { name: sectionName.replace(':', '').trim(), exercises: [], items: [] };
            currentSession.sections.push(currentSection);
        }
    }

    if (currentSection && node.type === 'list') {
        node.children.forEach(listItem => {
            let textContent = '';
            visit(listItem, 'text', (textNode) => {
                textContent += textNode.value;
            });

            if (textContent) {
                // If it looks like an exercise, parse it. Otherwise, just add as a text item.
                if (textContent.match(/\d+\s*[x×]\s*\d+/)) {
                    const exercise = parseExercise(textContent);
                    if (exercise) {
                        currentSection.exercises.push(exercise);
                    }
                } else {
                    currentSection.items.push(textContent.trim());
                }
            }
        });
    }
  });

  return program;
}

module.exports = {
  parseMarkdown,
};
