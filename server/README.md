# Server usage

## Set up 
* Input your database's setting in database/config.js

### Start Server
```
DEBUG=express-locallibrary-tutorial:* npm run devstart
```

## User Register

```
Post: localhost:3000/register
{
    "email": "youremail@gmail.com",
    "password": "EE123456ee",
    "firstname": "Jerry",
    "lastname": "Chen"
}
```
No matter success or fail, the server will return a json in {code: code, msg: message} where code and message are in static/Constant.js

## User Login
```
Post: localhost:3000/login
{
    "email": "bnb1083@gmail.com",
    "password": "EE123456ee"
}
```
If user's login inputed correctly, it will return the json with "token".
```
{
    "code": 10000,
    "msg": "Request Success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6ImJuYjEwODNAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6IkplcnJ5IiwibGFzdF9uYW1lIjoiQ2hlbiIsInBhc3N3b3JkX3NhbHQiOiJjYzMyN2QwMDBmNWIxN2JmYWNmMTFlYjRhN2RhMTQ0NCIsInBhc3N3b3JkX2hhc2hlZCI6ImY2OTYzYzFmZTQxNmFkZWY0YTI0MDY1NzEyYmYzYWY4YjU2M2Y5Zjk0MTQ4ODQ4NjJmNDI5ZWRlMWJlZWNiODAiLCJ0b2tlbnMiOm51bGx9LCJpYXQiOjE2MDEwODM1MDUsImV4cCI6MTYwMTY4ODMwNX0.hdKH5wdAnJTTyrd7nzgQX7G0IMr3o8n2Uk94GyGXqm8"
}
```
Otherwise, the fail code and message will show as in static/Constant.js

## Token
To test if your token is valid
make a post request with HEADER key-value -> "Authorization":"YOUR TOKEN"
```
Post: localhost:3000/testUserToken
```


