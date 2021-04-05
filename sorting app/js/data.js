let data = {
    "data": [
        // {"name": "John", "email": "john2@mail.com"},
        // {"name": "John", "email": "john1@mail.com", "age": 30},
        // {"name": "Jane", "email": "jane@mail.com"}
        {"user": "mike@mail.com", "rating": 20, "disabled": false},
        {"user": "greg@mail.com", "rating": 14, "disabled": false},
        {"user": "john@mail.com", "rating": 25, "disabled": true}
    ],
    // "condition": {
    //     "include": [
    //         {"name": "John"}
    //     ],
    //     "sort_by": ["email"]
    // }
    "condition": {
        "exclude": [
            {"disabled": true}
        ],
        "sort_by": ["rating"]
    }
};
