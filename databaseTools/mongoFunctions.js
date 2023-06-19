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

async function main() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect()
        await addAllFromFile(client.db("SpellingBeeWords").collection("words"), './5ext.json')
        // await findDuplicates(client.db("SpellingBeeWords").collection("words"))
        // await deleteDup(client.db("SpellingBeeWords").collection("words"))

    } catch (err) {
        console.error(err);
    } finally {
        await client.close()
    }
    
}

main().catch(console.error)