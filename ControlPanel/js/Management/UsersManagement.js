
let UsersManagement = {

    network_adapter: MockNetworkAdapter,

    view_users: () => {

        UsersManagement.network_adapter.send({
            "action": "get_users",
            "department": "TGR"
        }, (response)=>{
            console.log(response);
        });

    }

};