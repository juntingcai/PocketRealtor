# Server usage

## Set up 
* Input your database's setting in database/config.js
* Install moduels (package PR may need to bed installed manaually)
```
npm install
```
### Start Server
```
DEBUG=express-locallibrary-tutorial:* npm run devstart
```

## Server Response
* No matter requests success or fail, the server will return a json in {code: code, msg: message} (sometimes with token) where code and message are in static/ResponseTemplate.js
* Note: Currently response code and message are not stable, so please do not rely on it.

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
* Password has to be between 6 to 20 characters and contain at least one numeric digit, one uppercase and one lowercase letter
* If registered successfully, the server will return the token (see "User Login" response).

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
Otherwise, the fail code and reason will show as in static/ResponseTemplate.js

## Token
* To test if your token is valid, make a post request with HEADER key-value -> "Authorization":"YOUR TOKEN"
* If the token is valid, it will return the user's info in Json.
* If you'd like to see the token's value(user's id), check out https://jwt.io, and enter the token you got.
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

## Update profile (Token needed)
To update user's profole, please include the user's token in Header
"Authorization":"USER'S TOKEN", and make a put request:
```
Put: localhost:3000/user/updateProfile
{
    "firstname": "Jerry",
    "lastname": "Chen",
    "birthday" "2001-01-01",
    "nickname": "JC",
    "intro" : "Hi I am Jerry"
}
```

## Update user's role (Token needed)

PUT: localhost:3000/user/updateRole
```
{
    "isAgent" : false,
    "isRenter" : true,
    "isHost" : false
}
```
You do not need to give every role field. It's still working if you input: 
```
{
    "isRenter" : true,
}
```
Also, renter and host and be true simultaneously.  
```
{
    "isRenter" : true,
    "isHost" : true
}
```
However, if 3 roles are all true, the server will ignore the agent.  
And if all roles are false or undefined, no data will be updated, but the server is still going to return SUCCESS.  

## Update user's avatar (Token needed)
PUT: localhost:3000/user/updateAvatar
```
{
    "avatar" : AVATAR
}
```
where AVATAR will be stored in database as Blob.  
See example response in "Get someone's profile" 

## Get someone's profile
To get someone's profile, please make a GET request and provide the user's id
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
        "birthday": 2001-01-01,
        "intro": "Hi I am Jerry",
        "avatar": {
            "type": "Buffer",
            "data": [
                100,
                49,
                50,
                51,
                52,
                53,
                54,
                55,
                56,
                57,
                48
            ]
        }
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

