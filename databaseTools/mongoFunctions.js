const fs = require('fs')
const { MongoClient } = require('mongodb')
require('dotenv').config()

// Adds all words from a JSON file with a property "words" that has a value of an array of word objects"
async function addAllFromFile(collection, fileName) {
    const file = await JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    for await (const word of file.words) {
        let regex = new RegExp('^'+word.word+'$', "i")
        const exists = await collection.findOne({word: regex})
        if (!exists) {
            const result = await collection.insertOne(word);
            console.log(`Adding ${word.word}`)
        } else {
            console.log(`Skipping ${word.word} because it already exists.`)
        }
    }
}

// Update all matching documents

async function updateAll(collection, filter, update) {
    await collection.updateMany(filter, {$set: update})
}

// Change first letter of each property value to upper case

function toTitleCase(string) {
    if (!string) {return string}
    const arr = string.split('');
    arr[0] = arr[0].toUpperCase();
    for (let i = 1; i<arr.length; i++) {
      arr[i] = arr[i].toLowerCase()
    }
    return arr.join('')
  }

async function capitalizeValues(collection) {
    const allWords = await collection.find().toArray();
    console.log(allWords)
    for await (const w of allWords) {
        let word = toTitleCase(w.word);
        let def = toTitleCase(w.definition);
        let part = toTitleCase(w.part_of_speech);
        let ety = toTitleCase(w.etymology);
        let examp = toTitleCase(w.example_sentence);
        await collection.updateOne({_id: w._id}, {$set: {word: word, definition: def, part_of_speech: part, etymology: ety, example_sentence: examp}})    
        // await collection.updateOne({_id: w._id}, {$set: {definition: def}})    
        // await collection.updateOne({_id: w._id}, {$set: {part_of_speech: part}})    
        // await collection.updateOne({_id: w._id}, {$set: {etymology: ety}})    
        // await collection.updateOne({_id: w._id}, {$set: {example_sentence: examp}})    
        console.log('Updated', w)
    }
}


// Finds and reports duplicate words in the collection
async function findDuplicates(collection) {
    const totalWords = await collection.distinct("word");
    const totalDocs = await collection.find().toArray()
    console.log(`There are ${totalDocs.length} documents and ${totalWords.length} unique words.`)
    if (totalWords.length !== totalDocs.length) {
        console.log(`Here are the ${totalDocs.length - totalWords.length} duplicated words:`)
        for await (let word of totalWords) {
            const array = await collection.find({word: word}).toArray();
            if (await array.length > 1) {
                console.log(`Found duplicate: ${word}`)
            }
        }
    } else {
        console.log("No duplicates found.")
    }
}

async function checkDup(collection) {
    const allWords = [];
    const arr = await collection.find().toArray()
    for await (const {word} of arr) {
        allWords.push(word.toLowerCase())
    }
    const newSet = new Set(allWords);
    allWords.length === newSet.size
        ? console.log('No duplicates found')
        : console.log(`${allWords.length - newSet.size} duplicates found. Run deleteDup function to remove duplicates.`)
}

async function deleteDup(collection) {
    const allWords = [];
    const count = {}
    const arr = await collection.find().toArray()
    for await (const {word} of arr) {
        if (count[word.toLowerCase()]) {
            count[word.toLowerCase()] = count[word.toLowerCase()] + 1;
        } else {
            count[word.toLowerCase()] = 1;
        }
    }
    for (let each in count) {
        console.log(each)
        // if (count[each] > 1) {
        //     console.log(each+" has "+count[each]+" entries")
            // let reg = new RegExp(each, 'i')
            // let result = await collection.findOneAndDelete({word: reg})
            // console.log('Deleted '+result.deletedCount)
        // }
    }
}

// Delete all documents matching the provided filter criteria
async function deleteMatches(collection, match) {
    const result = await collection.deleteMany(match)
    console.log(`${result.deletedCount} records deleted.`)
}

// Change name of collection
async function changeName(collection, newName) {
    const result = await collection.rename(newName)
    console.log(result)
}

// Console Log the matching words
async function logWords(collection, filter) {
    const matches = await collection.find(filter);
    for await (const w of matches) {
        console.log(w.word)
    }
}

async function main() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect()
        await logWords(client.db("SpellingBeeWords").collection("words"), {part_of_speech: "Adjective"})
        // await addAllFromFile(client.db("SpellingBeeWords").collection("words"), './span.json')
        // await findDuplicates(client.db("SpellingBeeWords").collection("words"))
        // await deleteDup(client.db("SpellingBeeWords").collection("words"))
        // await updateAll(client.db("SpellingBeeWords").collection("words"), {part_of_speech: "Number"}, {part_of_speech: 'Noun'})
    } catch (err) {
        console.error(err);
    } finally {
        await client.close()
    }
    
}

main().catch(console.error)