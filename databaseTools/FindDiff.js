const fs = require('fs')

const firstJson = JSON.parse(fs.readFileSync('./grade7.json', {encoding: 'utf-8'}))
const secondJson = JSON.parse(fs.readFileSync('./grade8.json', {encoding: 'utf-8'}))

console.log(firstJson.words.length)

const wordsInSecond = [];
for (const w of secondJson.words) {
    wordsInSecond.push(w.word)
}

const noDups = firstJson.words.filter((w) => {
    if (wordsInSecond.includes(w.word)) {
        console.log(`Found duplicate: ${w.word}`)
        return false;
    } else {
        return true;
    }
})

firstJson.words = noDups;

console.log(firstJson.words.length)

fs.writeFile('./grade7.json', JSON.stringify(firstJson), 'utf-8', (err)=>{
    if (err) {
        console.log(err)
    } else {
        console.log('File written successfully')
    }
})





