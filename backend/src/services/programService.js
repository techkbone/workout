const fs = require('fs').promises
const path = require('path')

const dataPath = path.join(__dirname, '..', '..', 'data', 'program.json')

let programData = null

async function getProgramData() {
  if (programData) {
    return programData
  }
  const data = await fs.readFile(dataPath, 'utf-8')
  programData = JSON.parse(data)
  return programData
}

async function getTodaysWorkout(date) {
  // This is a placeholder. The actual logic to find today's workout would be more complex.
  // It would involve parsing the date and finding the corresponding session in the program.
  const program = await getProgramData()
  // For now, just return the first exercise of the first session of the first phase.
  return program[0].sets
}

module.exports = {
  getProgramData,
  getTodaysWorkout,
}
