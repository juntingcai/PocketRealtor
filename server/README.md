# Server usage

## Update

### 10/7

1. Add create/delete and search for listings

### 10/15

1.  Add More properties in listing (type, rent_price, sale_price, bath_rooms, area, age)
2.  change listing property name : introduction -> description
3.  Add tenants preference functions (add, update, search, get)
4.  User's profile updated: add gender and occupation
5.  Add get/copy/update listing functionality

## Set up

- Input your database's setting in database/config.js
- Install moduels (package PR may need to bed installed manaually)

```
npm install
```

### Start Server

```
DEBUG=express-locallibrary-tutorial:* npm run devstart
```

## Server Response

- No matter requests success or fail, the server will return a json in {code: code, msg: message} (sometimes with token) where code and message are in static/ResponseTemplate.js
- Note: Currently response code and message are not stable, so please do not rely on it.

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

- Password has to be between 6 to 20 characters and contain at least one numeric digit, one uppercase and one lowercase letter
- If registered successfully, the server will return the token (see "User Login" response).

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

- To test if your token is valid, make a post request with HEADER key-value -> "Authorization":"YOUR TOKEN"
- If the token is valid, it will return the user's info in Json.
- If you'd like to see the token's value(user's id), check out https://jwt.io, and enter the token you got.

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
    "gender": "JC",
    "occupation" : "Hi I am Jerry"
}
```

## Update user's role (Token needed)

```
PUT: localhost:3000/user/updateRole
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

```
PUT: localhost:3000/user/updateAvatar
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

## GET User's role

To get a user's role, please make a GET request and provide the user's id

```
GET: localhost:3000/user/role/:userId
```

Response will be a json array  
One role

```
[
    {
        "user_id": 1,
        "role_id": 1,
        "role_name": "Renter"
    }
]
```

Two roles

```
[
    {
        "user_id": 1,
        "role_id": 2,
        "role_name": "Host"
    },
    {
        "user_id": 1,
        "role_id": 1,
        "role_name": "Renter"
    }
]
```

## Create a house listing(Host user token needed)

Before a user creating a listing, the user must be a Host.
(See [Update user's role](https://github.com/sfdevshop/PocketRealtorApp/tree/master/server#update-users-role-token-needed))

```
POST: localhost:3000/listing/create
{
    "property": {
        "title": "My house",
        "description": "This is a good house",
        "address": "2312 Cool Stree.",
        "city": "San Jose",
        "state": "CA",
        "latitude": 37.776339,
        "longitude": -122.450672,
        "rooms": 5,
        "zip_code" : 94117,
        "type" : "Apartment",
        "rent_price": 2500,
        "sale_price" : 999999,
        "bath_rooms" : 2,
        "area" : 55000.12,
        "age" : 30
    }
}
```

## Duplicate a house listing(Owner token needed)

**The duplicated owner will be the one who calls this api(by given token)**

```
PUT: localhost:3000/listing/duplicate/:listingId
```

## Update a house listing(Owner token needed)

```
PUT: localhost:3000/listing/update
{   "id": 3004,
    "property": {
        "title": "My house",
        "description": "This is a good house",
        "address": "2312 Cool Stree.",
        "city": "San Jose",
        "state": "CA",
        "latitude": 37.776339,
        "longitude": -122.450672,
        "rooms": 5,
        "zip_code" : 94117,
        "type" : "Apartment",
        "rent_price": 2500,
        "sale_price" : 999999,
        "bath_rooms" : 2,
        "area" : 55000.12,
        "age" : 30
    }
}
```

## Delete a house listing(Owner token needed)

**Note: The user calling this api must be the owner of the house.**

```
DELETE localhost:3000/listing/delete/:listingid
```

## Search for listings

This is a GET api which supports searching listings.  
Parameters can be (all of them are optional):

- state (2 chars)
- city
- zipcode (5-digit integer)
- minprice
- maxprice

Here are some examples:

```
GET localhost:3000/listings  // find all listings
```

```
GET localhost:3000/listings?state=CA  // find all listings in CA
```

```
GET localhost:3000/listings?state=CA&city=San Francisco  // find listings in San Francisco
```

```
GET localhost:3000/listings?zipcode=94118  // find listings having zip code 94118
```

```
GET localhost:3000/listings?minprice=1000&maxprice=20000  // find listings which's price is the range of 1,000 to 20,000
```

## GET A LISTING

```
GET localhost:3000/listing/:id
```

## Add Tenant's living location preference (Tenant token needed)

A tenant has two ways to add an area where s/he would like to live.

1. Provide a zip code

```
PUT: localhost:3000/tenant/preference/:zip
```

2. Provde city & state

```
PUT: localhost:3000/tenant/preference/
{
    "city" : "San Francisco",
    "state" : "CA"
}
```

## Update Tenant's living location preference (Tenant token needed)

A tenant could also update locations where s/he would like to live.  
**You can give cities or zipcodes, but you cannot give both.**
**Important: this will remove previous preference and get it updated by what you input**

```
POST: localhost:3000/tenant/preference/update
{
    "cities" : [
        {"city" : "San Francisco", "state": "CA"},
        {"city" : "San Jose", "state": "CA"},
        {"city" : "New York", "state": "NY"}
    ]
}
```

**OR**

```
{
    "zipcodes" : [
        "94117",
        "30005",
        "60002",
        "70001",
        "90087"
    ]
}
```

## Search tenants

Users can find other tenants who are interested in certain city,
A request could be :
**(NOTE: Must give both city and state)**

```
GET: localhost:3000/tenants?city=San Francisco&state=CA
```

If one of city or state is missing, it will find all tanants.  
Also you can find all users(with tenant's role) by:

```
GET: localhost:3000/tenants
```

## Get a tenant's preference

You can find a tenant preference on both city and zips

```
GET: localhost:3000/tenant/preference/:userId
```

A json would be return like(sorted):

```
{
    "userId": "2",
    "preferedZips": [
        "30005",
        "60002",
        "70001",
        "90087",
        "94117"
    ],
    "preferredCities": [
        "Alpharetta, GA",
        "Antioch, IL",
        "Los Angeles, CA",
        "Metairie, LA",
        "San Francisco, CA"
    ]
}
```
