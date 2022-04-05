

let MockDB = {

    USERS: [
        { "username": "tamernas", "email": "tamer.nassar@mock.com", "first_name": "Tamer", "last_name": "Nassar", "uid": "ABCDEF", "admin": true },
        { "username": "adnansal", "email": "adnan.salem@mock.com", "first_name": "Adnan", "last_name": "Salem", "uid": "KHASAS", "admin": false },
        { "username": "aboomar", "email": "mohamad.eghbaria@mock.com", "first_name": "Mohammed", "last_name": "Eghbareia", "uid": "SFGWRK", "admin": false },
        { "username": "ahmadfad", "email": "ahmad.fadila@mock.com", "first_name": "Adhmad", "last_name": "Fadila", "uid": "F867LF", "admin": false },
    ],

    PERMISSIONS: [
        {"Permissions_id": 1 ,"Name": "Add Admin","Permissions_description":"Allow User To Add Admin" },
        {"Permissions_id": 2 ,"Name": "Add Machine","Permissions_description":"Allow User To Add Machine" },
    ],

    USER_PERMISSIONS: [
        {"Permissions_id": 1 ,"user_name":"tamernas"},
        {"Permissions_id": 2 ,"user_name":"tamernas"},
        {"Permissions_id": 1 ,"user_name":"adnansal" },
        {"Permissions_id": 2 ,"user_name":"aboomar" },
    ],

}

let MockNetworkAdapter = {

    responses: {
        "get_users": {"users": MockDB.USERS, "success": true},
        "add_admin": {"success": true},
        "remove_admin": {"success": true},
        "get_permissions": {"permissions": MockDB.PERMISSIONS, "success": true},
        "get_user_permissions": {"user_permissions": MockDB.USER_PERMISSIONS, "success": true},

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