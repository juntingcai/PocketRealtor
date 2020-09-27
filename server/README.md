# Server usage

## Set up 
* Input your database's setting in database/config.js
* Install moduels
```
npm install
```
### Start Server
```
DEBUG=express-locallibrary-tutorial:* npm run devstart
```

## User Register

```
Post: localhost:3000/user/register
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
Post: localhost:3000/user/login
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

## Change password (Token needed)
To update user's passoword, please include the user's token in Header
"Authorization":"USER'S TOKEN", and make a post request:
```
Post: localhost:3000/user/updatePassword
{
    "oldPassword": "Ee123456789",
    "newPassword": "Ee123456100"
}
```

## Update password (Token needed)
To update user's profole, please include the user's token in Header
"Authorization":"USER'S TOKEN", and make a put request:
```
Put: localhost:3000/user/updateProfile
{
    "firstname": "Jerry",
    "lastname": "Chen",
    "nickname": "JC",
    "intro" : "Hi I am Jerry"
}
```

## Get someone's profile
To get someone's profile, please make a get request and provide the user's id
```
GET: localhost:3000/user/:userId
```
If the user exists, a json will be returned like: 
```
{
    "success": true,
    "data": {
        "email": "member2@gmail.com",
        "firstname": "Jerry",
        "lastname": "Chen",
        "nickname": "JC",
        "birthday": null,
        "intro": "Hi I am Jerry"
    }
}
```
If the user does not exist, a json will be returned like:
```
{
    "success": false,
    "message": "Cannot find the user"
}
```

