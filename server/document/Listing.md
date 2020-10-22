
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
Given a center from coordinate and radius(mile), this api will provides the house listings in the range.  

Required parameters
- lat // latitude
- lng // longitude
- radius // in miles
- type // 1 = rent, 2 = sale

Optional parameters
- minPrice // rent/sale price >= minPrice
- maxPrice // rent/sale price <= maxPrice
- bedrooms // least bedroom number
- bathrooms // least bathrooms number

Here are some examples:
```
localhost:3000/listings?lat=45.015900&lng=-93.471900&radius=3&type=1
localhost:3000/listings?lat=45.015900&lng=-93.471900&radius=100&type=1&minPrice=202&maxPrice=5000&bedrooms=1&bathrooms=1
```

## GET A LISTING
```
GET localhost:3000/listing/:id
```