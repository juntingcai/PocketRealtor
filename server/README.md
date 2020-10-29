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

### 10/18
1. Change conditions in searching listings

### 10/22
1. Users are able to see their history of exploring tenants and listings
2. Tenants are able to like a listing, and delete it
3. Modify some structures

### 10/27
1. Implemented grouping functionalities. [See Here](https://github.com/sfdevshop/PocketRealtorApp/tree/serverBuilding/server/document#tenant-group)

### 10/28
1. Add a filed "status" in listing table.(About status, see [ListingStatus.js](https://github.com/sfdevshop/PocketRealtorApp/blob/serverBuilding/common/Constans/ListingStatus.js))
2. Listing owner can update liting's status now.

### 10/29
1. Add "isFavorite" field into [GET-LISTING](https://github.com/sfdevshop/PocketRealtorApp/blob/serverBuilding/server/document/Listing.md#get-a-listing)


## Set up

- Input your database's setting in database/config.js
- Install moduels (package PR may need to be installed manaually)
- Set up the listening port and tables reset in config.js 

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

## API
See [documant/Readme.md](https://github.com/sfdevshop/PocketRealtorApp/tree/serverBuilding/server/document).
