# Text-to-Text Translation

```
GET /translate/api/spoken-to-signed
or
GET /translate/api/signed-to-spoken
```

## Description:

Provide a brief description of what this endpoint does.

## Parameters:

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `from`    | `string` | Language code to translate from |
| `to`      | `string` | Language code to translate to   |
| `text`    | `string` | Text to be translated           |

## Example Call:

```bash
curl "https://sign.mt/api/spoken-to-signed?from=en&to=ase&text=test"
```

## Response (Success, 200):

```json
{
  "direction": "spoken-to-signed",
  "from": "en",
  "to": "ase",
  "text": "M518x518S10620487x465S2ff00482x483S21700497x464"
}
```

## Response (Failure, 400):

```
{
    "message": "Failure",
    "error": "Invalid \"direction\" requested"
}
```
