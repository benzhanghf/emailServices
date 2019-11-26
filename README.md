# Demo emailServices
Demo email services Restful API to send dynamic plain text email to people
Support multiple to emails and cc emails and bcc emails using multiple services

## Installation
```
npm install -g serverless
npm install
```

## Run Testing
```
npm run test
```

## Run Restful Locally
```
npm run start
```
or
```
sls offline
```

## API Usage
using postman to test the Restful API locally
```
sls offline
```
Post request to the following endpoint, with content-type application/json

http://localhost:4000/email/send

Body example: (cc and bcc field are optional)
```
{
	"to": ["xxxxx@hotmail.com"],
	"cc": ["aaaaa@gmail.com"],
	"bcc": ["info@haifengzhang.me"],
	"subject": "This is a test email",
	"content": "This is me testing. Hello World."
}
```
For testing fallback and without fallback you could add another test field like "ses" or "sendgrid" to choose which one to send email first and the other one will be the fallback provider. Default sequence is SES first then fallback to sendgrid, as SES will failed without increase limit in AWS contact, but sendgrid works without human approval.
```
{
	"to": ["xxxxx@hotmail.com"],
	"cc": ["bbbbb@gmail.com"],
	"bcc": ["info@haifengzhang.me"],
	"subject": "This is a test email",
	"content": "This is me testing. Hello World.",
	"test": "sendgrid"
}
```

## example response
when fallback there will be debug message showing like the following:
```
{
    "success": true,
    "provider": "SendGrid",
    "response": "",
    "debug": [
        "Email address is not verified. The following identities failed the check in region AP-SOUTHEAST-2: bbbbb@gmail.com, xxxxx@hotmail.com"
    ]
}
```


## Production testing
endpoints:
  POST - https://nwwfk4s9ji.execute-api.ap-southeast-2.amazonaws.com/dev/email/send

You will need x-api-key to access this function as this repo is public will send you the access token via email if required to test it
