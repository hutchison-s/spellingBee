const fs = require('fs')

const oldJson = JSON.parse(fs.readFileSync('./verbs.json', {encoding: 'utf-8'}))
const newArray = [];

const noDups = oldJson.words.filter((w) => {
    if (newArray.includes(w.word)) {
        console.log(`Found duplicate: ${w.word}`)
        return false;

    } else {
        newArray.push(w.word);
        return true;
    }
})
console.log(`Trimmed ${oldJson.words.length - noDups.length} duplicates`)

oldJson.words = noDups;

console.log(oldJson.words.length)

fs.writeFile('./verbs.json', JSON.stringify(oldJson), 'utf-8', (err)=>{
    if (err) {
        console.log(err)
    } else {
        console.log('File written successfully')
    }
})





