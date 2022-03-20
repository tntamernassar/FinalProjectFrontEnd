

let MockDB = {

    USERS: [
        { "username": "tamernas", "email": "tamer.nassar@mock.com", "first_name": "Tamer", "last_name": "Nassar", "uid": "ABCDEF", "admin": true },
        { "username": "adnansal", "email": "adnan.salem@mock.com", "first_name": "Adnan", "last_name": "Salem", "uid": "KHASAS", "admin": false },
        { "username": "aboomar", "email": "mohamad.eghbaria@mock.com", "first_name": "Mohammed", "last_name": "Eghbareia", "uid": "SFGWRK", "admin": false },
        { "username": "ahmadfad", "email": "ahmad.fadila@mock.com", "first_name": "Adhmad", "last_name": "Fadila", "uid": "F867LF", "admin": false },
    ],

    PERMISSIONS: [],

}

let MockNetworkAdapter = {

    responses: {
        "get_users": {"users": MockDB.USERS, "success": true},
        "add_admin": {"success": true},
        "remove_admin": {"success": true}
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