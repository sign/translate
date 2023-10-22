# Text-Normalization

Normalizes the given text for sign language translation.

Takes in a text that might contain misspellings, incorrect capitalization,
missing hyphenation, numbers, units, or other phenomena requiring special
vocalization. Returns the text normalized for sign language, with corrections in
capitalization, spelling, and hyphenation, and special vocalizations for
numbers and units.

## Parameters:

| Parameter | Type     | Description               |
| --------- | -------- | ------------------------- |
| `lang`    | `string` | Language code of the text |
| `text`    | `string` | Text to be normalized     |

## Example Call:

```bash
curl "https://sign.mt/api/text-normalization?lang=en&text=test"
```

## Response (Success, 200):

```json
{
  "lang": "en",
  "text": "Test"
}
```

## Response (Failure, 400):

```
{
    "message": "Failure",
    "error": "Missing \"text\" query parameter"
}
```
