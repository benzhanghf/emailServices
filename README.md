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
	"to": ["ben_zhanghf@hotmail.com"],
	"cc": ["benzhanghf@gmail.com"],
	"bcc": ["ben@example.com"],
	"subject": "This is a test email",
	"content": "This is me testing. Hello World."
}
```

## Production testing
endpoints:
  POST - https://nwwfk4s9ji.execute-api.ap-southeast-2.amazonaws.com/dev/email/send

You will need x-api-key to access this function as this repo is public will send you the access token via email if required to test it
