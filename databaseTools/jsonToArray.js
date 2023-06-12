const fs = require('fs')

const oldJson = JSON.parse(fs.readFileSync('./grade8.json', {encoding: 'utf-8'}))
const newArray = [];

for (let word in oldJson) {
    newArray.push({...oldJson[word], gradeLevel: 8})
}

const newJson = {words: newArray}

fs.writeFile('./grade8new.json', JSON.stringify(newJson), 'utf-8', (err)=>{
    if (err) {
        console.log(err)
    } else {
        console.log('File written successfully')
    }
})





