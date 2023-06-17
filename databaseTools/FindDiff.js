const fs = require('fs')

const firstJson = JSON.parse(fs.readFileSync('./12ext.json', {encoding: 'utf-8'}))
const secondJson = JSON.parse(fs.readFileSync('./grade8.json', {encoding: 'utf-8'}))

console.log(firstJson.words.length)

const wordsInSecond = [];
for (const w of secondJson.words) {
    wordsInSecond.push(w.word.toLowerCase())
}

const noDups = firstJson.words.filter((w) => {
    if (wordsInSecond.includes(w.word.toLowerCase())) {
        console.log(`Found duplicate: ${w.word}`)
        return false;
    } else {
        return true;
    }
})

firstJson.words = noDups;

console.log(firstJson.words.length)

// fs.writeFile('./12ext.json', JSON.stringify(firstJson), 'utf-8', (err)=>{
//     if (err) {
//         console.log(err)
//     } else {
//         console.log('File written successfully')
//     }
// })





