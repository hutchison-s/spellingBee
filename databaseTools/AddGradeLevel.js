const fs = require('fs')

const oldJson = JSON.parse(fs.readFileSync('./grade7.json', {encoding: 'utf-8'}))

for (const w of oldJson.words) {
    w.gradeLevel = 5
}

fs.writeFile('./grade7.json', JSON.stringify(oldJson), 'utf-8', (err)=>{
    if (err) {
        console.log(err)
    } else {
        console.log('File written successfully')
    }
})





