
let MockDB = {

    USERS: [
        { "username": "tamernas", "email": "tamer.nassar@mock.com", "first_name": "Tamer", "last_name": "Nassar", "uid": "ABCDEF", "admin": true },
        { "username": "adnansal", "email": "adnan.salem@mock.com", "first_name": "Adnan", "last_name": "Salem", "uid": "KHASAS", "admin": true },
        { "username": "aboomar", "email": "mohamad.eghbaria@mock.com", "first_name": "Mohammed", "last_name": "Eghbareia", "uid": "SFGWRK", "admin": false },
        { "username": "ahmadfad", "email": "ahmad.fadila@mock.com", "first_name": "Adhmad", "last_name": "Fadila", "uid": "F867LF", "admin": false },
    ],

    PERMISSIONS: [
        {"Permissions_id": 1 ,"Name": "Add Admin","Permission_description":"Allow User To Add Admin" },
        {"Permissions_id": 2 ,"Name": "Add Machine","Permission_description":"Allow User To Add Machine" },
        {"Permissions_id": 3 ,"Name": "View report","Permission_description":"Allow User To View report" },
    ],

    USER_PERMISSIONS: [
        {"Permissions_id": 1 ,"user_name":"tamernas"},
        {"Permissions_id": 2 ,"user_name":"tamernas"},
        {"Permissions_id": 1 ,"user_name":"adnansal" },
        {"Permissions_id": 2 ,"user_name":"aboomar" },
    ],

    Machines: [
        {"name": "t1" , "state": "UP" , "attributes":{"a": 1 ,"b": 2 }},
        {"name": "t2" , "state": "PM" , "attributes":{"a": 21 ,"b": 2 }},
        {"name": "t3" , "state": "UP" , "attributes":{"a": 1344 ,"b": 232 }},
        {"name": "t4" , "state": "DOWN" , "attributes":{"a": 32 ,"b": 24 }},
    ],

}

let MockNetworkAdapter = {

    responses: {
        "get_users": {"users": MockDB.USERS, "success": true},
        "add_admin": {"success": true},
        "remove_admin": {"success": true},
        "get_permissions": {"permissions": MockDB.PERMISSIONS, "success": true},
        "get_user_permissions": {"user_permissions": MockDB.USER_PERMISSIONS, "success": true},
        "get_machines": {"machines": MockDB.Machines, "success": true},

    },

    send: (request, response_cb)=>{
        let action = request["action"];
        if (action in MockNetworkAdapter.responses){
            response_cb(MockNetworkAdapter.responses[action]);
        }else{
            response_cb({"success": false, "error": "Mock error message"});
        }
    },


}