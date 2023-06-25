const fs = require('fs')

const oldJson = JSON.parse(fs.readFileSync('./addComparatives.json', {encoding: 'utf-8'}))

for (let j = 0; j<oldJson.words.length; j++) {
    if (oldJson.words[j].antonyms.length < 3) {
        console.log("--->>>  Skipped", oldJson.words[j].word, '\n')
        continue;
    }
    for (let i=0; i<oldJson.words[j].synonyms.length; i++) {
        const arr = oldJson.words[j].synonyms[i].split('');
        arr[0] = arr[0].toUpperCase();
        oldJson.words[j].synonyms[i] = arr.join('')
    }
    for (let i=0; i<oldJson.words[j].antonyms.length; i++) {
        const arr = oldJson.words[j].antonyms[i].split('');
        arr[0] = arr[0].toUpperCase();
        oldJson.words[j].antonyms[i] = arr.join('')
    }
    
}

fs.writeFile('./addComparatives.json', JSON.stringify(oldJson), 'utf-8', (err)=>{
    if (err) {
        console.log(err)
    } else {
        console.log('File written successfully')
    }
})





