# BeeyondWords API

This API accesses a database of words and their corresponding properties created by ChatGPT.

<br><br>

## Results format

Responses are formatted as JSON.

The structure of each word is an object with the following properties: 

```json
{
    "_id": String,
    "word": String,
    "part_of_speech": String,
    "definition": String,
    "etymology": String,
    "example_sentence": String,
    "gradeLevel": Number
}
```

If the endpoint you call can return multiple results, results will be stored in an array, even if there is only one matching result.

```json
{
    [
        {first word},
        {second word},
        {third word}
    ]
}
```
<br>

## Endpoints

## /

  - Returns an array of all words in the database

<br>

### /words

- If no query paramaters are present ('/words'), all words are returned in results.
- All parameters are optional and may occur in any order.
- All parameters are case-insensitive.

| Parameter    | Argument |
| -------- | ----- |
| word     | string to search within **word** property of results<br>Example: /words?word=qui |
| origin   | string to search within **etymology** property of results<br>Example: /words?origin=greek |
| part     | string to search within **part_of_speech** property of results<br>Example: /words?part=adjective |
| limit   | number of maximum results to return<br>Example: /words?limit=6 |

Example:
```
    /words?word=at&part=noun&origin=latin&limit=2
```
Returns:
```json    
    {
      [
        {
          "_id": "6485e65c2d1d917088c51b11",
          "word": "trepidation",
          "part_of_speech": "noun",
          "definition": "a feeling of fear or agitation about something that may happen",
          "etymology": "Latin",
          "example_sentence": "She entered the haunted house with trepidation.",
          "gradeLevel": 8
        },
        {
          "_id": "6485e65e2d1d917088c51b4c",
          "word": "Interpretation",
          "part_of_speech": "noun",
          "definition": "The action of explaining the meaning or significance of something, often based on personal understanding or analysis.",
          "etymology": "Latin",
          "example_sentence": "Literary critics often provide different interpretations of the same poem.",
          "gradeLevel": 8
        }
      ]
    }
```
<br>

### /words/:word


  - Return one result for a specific word.
  - If the word doesn't exist in the database, a 404 status is returned with an error message indicating the word does not exist in the database.

Example:
```
/words/resilient
```
Returns:
```json
{
  "_id": "6485e65b2d1d917088c51af5",
  "word": "resilient",
  "part_of_speech": "adjective",
  "definition": "able to withstand or recover quickly from difficult conditions",
  "etymology": "Latin",
  "example_sentence": "The community showed resilience in rebuilding after the devastating storm.",
  "gradeLevel": 8
}
```
<br>

### /random

  - Return one randome result from query parameter results
  - If no query paramaters are present ('/random'), one random word from the entire database is returned.
  - All parameters are optional and may occur in any order.
  - All parameters are case-insensitive.

| Parameter    | Argument |
| -------- | ----- |
| origin   | string to search within **etymology** property of results<br>Example: /random?origin=arabic |
| part     | string to search within **part_of_speech** property of results<br>Example: /random?part=verb |

Example:
```
/random?part=verb
```
Returns:
```json
{
  "_id": "64862d48529728b8f6b47408",
  "word": "Realize",
  "part_of_speech": "Verb",
  "definition": "Become fully aware of or understand something",
  "etymology": "Latin",
  "example_sentence": "She suddenly realized that she had forgotten her keys.",
  "gradeLevel": 5
}
```