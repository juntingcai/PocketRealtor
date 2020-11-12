
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
        "age" : 30,
        "status" : 1
    }
}
```

## Duplicate a house listing(Owner token needed)

**The duplicated owner will be the one who calls this api(by given token)**

```
PUT: localhost:3000/listing/duplicate/:listingId
```

## Update a house listing property(Owner token needed)
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

## Update a house listing status
The status Id can be found in common/Constants/ListingStatus.js
```
PUT: localhost:3000/listing/update/status
{   
    "id": 3004,
    "statud" : 2
}
```

## Delete a house listing(Owner token needed)

**Note: The user calling this api must be the owner of the house.**

```
DELETE localhost:3000/listing/delete/:listingid
```

## Search for listings
Given a center from coordinate and radius(mile), this api will provides the house listings in the range.  
Also, it returns the listings that the status is 1 (i.e. Available)
Required parameters
- lat // latitude
- lng // longitude
- radius // in kilometers
- type // 0 = all, 1 = rent, 2 = sale

Optional parameters
- minPrice // rent/sale price >= minPrice
- maxPrice // rent/sale price <= maxPrice
- bedrooms // least bedroom number
- bathrooms // least bathrooms number

Here are some examples:
```
GET localhost:3000/listings?lat=45.015900&lng=-93.471900&radius=3&type=1
GET localhost:3000/listings?lat=45.015900&lng=-93.471900&radius=100&type=1&minPrice=202&maxPrice=5000&bedrooms=1&bathrooms=1

The reuslt is an json array having all fitting listings.
[
    {
        "id": 113,
        "title": "vulputate vitae nisl",
        "type": "Sonsing",
        "age": 69,
        "description": "Sed ante. Vivamus tortor. Duis mattis egestas metus.",
        "address": "27 Darwin Lane",
        "city": "Kimberton",
        "state": "PA",
        "zip_code": 19442,
        "latitude": "45.015900",
        "longitude": "-93.471900",
        "sale_price": "10116973.32",
        "rent_price": "4479.71",
        "area": "8939.00",
        "rooms": 8,
        "bath_rooms": 3,
        "image_links": "",
        "status": 1,
        "owner_id": 83
    },
    {
        "id": 614,
        "title": "dui vel",
        "type": "Alpha",
        "age": 63,
        "description": "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
        "address": "2608 Artisan Trail",
        "city": "San Jose",
        "state": "CA",
        "zip_code": 95136,
        "latitude": "45.015900",
        "longitude": "-93.471900",
        "sale_price": "23590178.69",
        "rent_price": "1631.60",
        "area": "5973.78",
        "rooms": 9,
        "bath_rooms": 4,
        "image_links": "link1",
        "status": 1,
        "owner_id": 218
    }
]
```

## GET A LISTING
```
GET localhost:3000/listing/:id
```
The following example shows the listing with id 202
```
For example : 
GET localhost:3000/listing/300

{
    "id": 300,
    "title": "amet",
    "type": "Cookley",
    "age": 85,
    "description": "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\r\n\r\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
    "address": "8071 Forest Drive",
    "city": "Kansas City",
    "state": "KS",
    "zip_code": 66160,
    "latitude": "47.432300",
    "longitude": "-121.803400",
    "sale_price": "14794255.84",
    "rent_price": "1632.35",
    "area": "691.59",
    "rooms": 5,
    "bath_rooms": 4,
    "image_links": [
        "link1",
        "link2",
        "",
        "",
        ""
    ],
    "status": 1,
    "owner_id": 53,
    "isFavorite": false
}
```
