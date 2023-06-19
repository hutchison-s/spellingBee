const fs = require('fs')

const oldJson = JSON.parse(fs.readFileSync('./5ext.json', {encoding: 'utf-8'}))

for (const w of oldJson.words) {
    const arr = w.word.split('');
    arr[0] = arr[0].toUpperCase();
    w.word = arr.join('')
}

fs.writeFile('./5ext.json', JSON.stringify(oldJson), 'utf-8', (err)=>{
    if (err) {
        console.log(err)
    } else {
        console.log('File written successfully')
    }
})





