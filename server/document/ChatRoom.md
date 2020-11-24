## Chat Room API
This api is for both personal and group chat room.   
Tokne is needed in the all routes here.   

### Find or create a personal chat
This route will return a conversactionId between two users.  
```
GET: localhost:3000/conversaction/find/:targetUserId
```
returns
```
{
    "conversactionId": "86f10db1-3589-475c-bf1f-34367fe6a7c0"
}
```


### Get all existing chat room for a user
This route returns all chat rooms a user has.   
When "isGroupChat" is true, the target id and name means the group's id and name.  
On the other hand, when "isGroupChat"  is false, the target id and name means the target-user's id and name.  

```
GET: localhost:3000/conversaction/all
```
returns: 
```
[
    {
        "conversactionId": "e43f572c-2cce-411c-b3a4-6ffec57125df",
        "targetId": 10,
        "targetName": "Prince Saynor",
        "messgaes": [],
        "img": "https://i.imgur.com/0avxl7q.jpg",
        "isGroupChat": false
    },
    {
        "conversactionId": "321b0ea8-24b2-4663-b48f-09bfd8cf0363",
        "targetId": 448,
        "targetName": "Corilla Sidney",
        "messgaes": [],
        "img": "https://i.imgur.com/0avxl7q.jpg",
        "isGroupChat": false
    },
    {
        "conversactionId": "420bb7e3-79cd-4094-88d1-73df9e90e25c",
        "targetId": 921,
        "targetName": "Enrique Schruyers",
        "messgaes": [],
        "img": "https://i.imgur.com/0avxl7q.jpg",
        "isGroupChat": false
    },
    {
        "conversactionId": "8c3d34fc-a073-4670-a7d3-3c3ed279e627",
        "targetId": 4,
        "targetName": "Group 11",
        "messgaes": [],
        "img": "/",
        "isGroupChat": true
    },
    {
        "conversactionId": "e6ebed34-9eb7-40fb-967f-a17fdd9e1867",
        "targetId": 1,
        "targetName": "Hello world",
        "messgaes": [],
        "img": "/",
        "isGroupChat": true
    },
    {
        "conversactionId": "d1ff6040-e0d5-4647-aa9a-1b36cc532fff",
        "targetId": 2,
        "targetName": "Group 20",
        "messgaes": [],
        "img": "/",
        "isGroupChat": true
    },
    {
        "conversactionId": "8d7be07c-fb02-4301-b31f-a7edd035e2ad",
        "targetId": 99999,
        "targetName": "Finding New Your House",
        "messgaes": [
            {
                "senderId": 300,
                "content": "Hello world1",
                "date": "2020-11-24T05:48:56.444Z"
            },
            {
                "senderId": 300,
                "content": "Hello world2",
                "date": "2020-11-24T05:49:07.676Z"
            },
            {
                "senderId": 300,
                "content": "Hello world3",
                "date": "2020-11-24T05:49:12.056Z"
            },
            {
                "senderId": 300,
                "content": "Hello world3",
                "date": "2020-11-24T06:06:58.696Z"
            }
        ],
        "img": "/",
        "isGroupChat": true
    }
]
```

### Get a chat room 
Given a chat room id(and user's id from token), this route returns it's information. 
```
GET localhost:3000/conversaction/get/e43f572c-2cce-411c-b3a4-6ffec57125df
```
returns: 
```
{
    "targetId": 10,
    "targetName": "undefined Saynor",
    "img": "https://i.imgur.com/0avxl7q.jpg",
    "messages": [
            {
                "senderId": 300,
                "content": "Hello world3",
                "date": "2020-11-24T06:06:58.696Z"
            }
    ],
    "isGropuChat": false
}
```

### Send a message
This route allows user to send a message into a chat room.   

Note: Needs to provide 3 fileds : 
1. isGropuChat : if the chat room you are sending is a group chat, it's true. Otherwise, false.   
2. conversactionId: the chat room id
3. message: the message you want to send, cannot be empty
```
PUT localhost:3000/conversaction/message
{
    "isGroupChat" : false,
    "conversactionId" : "e43f572c-2cce-411c-b3a4-6ffec57125df",
    "message" : "Hello worl11111"
}
```
If the messaged is successcully send, it returns 
```
{
    "code": 10000,
    "msg": "Request Success"
}
```

