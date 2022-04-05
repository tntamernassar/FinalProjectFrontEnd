
let UsersManagement = {

    network_adapter: MockNetworkAdapter,

    view_users: () => {
        ControlPanel.resent_inner_container();

        let organization_chart_builder = ChartBuilder.organization_chart_builder();
        let inner_container = document.getElementById("inner_container");
        let chart_div = document.createElement("div");
        chart_div.id = "organization_chart";
        inner_container.appendChild(chart_div);

        UsersManagement.network_adapter.send({
            "action": "get_users",
            "department": "TGR"
        }, (response)=>{
            /** response format : { users: list of users } **/
            let nodes = [], links = [], levels = [ organization_chart_builder.make_level(0, '#980104') ];
            let all = response["users"];
            let admins = all.filter(user => user.admin);
            let users = all.filter(user => ! user.admin);

            admins.forEach(admin => {
                let name = admin["first_name"] + " " + admin["last_name"];
                let email = admin["email"];
                let uid = admin["uid"];
                nodes.push(organization_chart_builder.make_node(uid, email, name + " - Admin"));
            });

            users.forEach(user => {
                let name = user["first_name"] + " " + user["last_name"];
                let email = user["email"];
                let uid = user["uid"];
                nodes.push(organization_chart_builder.make_node(uid, email, name));
            });

            admins.forEach(admin => {
                users.forEach(user => {
                    let admin_uid = admin["uid"];
                    let user_uid = user["uid"];
                    links.push(organization_chart_builder.make_link(admin_uid, user_uid));
                });
            });

            organization_chart_builder.builder(chart_div.id, "TGR Users", nodes, links, levels);
        });
    },

    add_admin: () => {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        let checkboxes_div = document.createElement("div");
        checkboxes_div.className = "checkboxes_div";
        inner_container.appendChild(checkboxes_div);
        UsersManagement.network_adapter.send({
            "action": "get_users",
            "department": "TGR"
        }, (response) => {
            /** response format : { users: list of users } **/
            let all = response["users"];
            let users = all.filter(user => ! user.admin);
            let names = users.map(user => user["first_name"] + " " + user["last_name"] + " - " + user["username"]);
            let new_admins = [];

            ControlPanel.create_checklist(checkboxes_div, names, (i, checked)=>{
                let username = users[i]["username"];
                if (checked){
                    new_admins.push(username);
                }else{
                    new_admins = new_admins.filter(a => a !== username);
                }
            }, ()=>{
                if (new_admins.length == 0){
                    alert("Please choose at least one admin");
                }else {
                    UsersManagement.network_adapter.send({
                        "action": "add_admin",
                        "usernames": new_admins
                    }, (response) => {
                        // TODO: Display success/fail message
                        console.log("Add Admin response : ", JSON.stringify(response));
                        UsersManagement.add_admin();
                    });
                }
            });
        });
    },

    remove_admin: () => {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        let checkboxes_div = document.createElement("div");
        checkboxes_div.className = "checkboxes_div";
        inner_container.appendChild(checkboxes_div);
        UsersManagement.network_adapter.send({
            "action": "get_users",
            "department": "TGR"
        }, (response) => {
            /** response format : { users: list of users } **/
            let all = response["users"];
            let admins = all.filter(user => user.admin);
            let names = admins.map(admin => admin["first_name"] + " " + admin["last_name"] + " - " + admin["username"]);
            let to_remove = [];

            ControlPanel.create_checklist(checkboxes_div, names, (i, checked)=>{
                let username = admins[i]["username"];
                if (checked){
                    to_remove.push(username);
                }else{
                    to_remove = to_remove.filter(a => a !== username);
                }
            }, ()=>{
                if (to_remove.length == 0){
                    alert("Please choose at least one admin");
                }else {
                    UsersManagement.network_adapter.send({
                        "action": "remove_admin",
                        "usernames": to_remove
                    }, (response) => {
                        // TODO: Display success/fail message
                        console.log("Remove Admin response : ", JSON.stringify(response));
                        UsersManagement.remove_admin();
                    });
                }
            });
        });
    },

    View_User_Permissions: () => {
        ControlPanel.resent_inner_container();
        let table_builder = TableBuilder.simple_table_builder();
        let inner_container = document.getElementById("inner_container");
        let tabs_div = document.createElement("div");
        inner_container.appendChild(tabs_div);

        let tabs_content_div = document.createElement("div");
        inner_container.appendChild(tabs_content_div);

        UsersManagement.network_adapter.send({
            "action": "get_users",
            "department": "TGR"
        }, (user_response) => {
            UsersManagement.network_adapter.send({
                "action": "get_permissions",
                "department": "TGR"
            }, (permissions_response) => {
                UsersManagement.network_adapter.send({
                    "action": "get_user_permissions",
                    "department": "TGR"
                }, (user_permissions_response) => {

                    let users = user_response["users"];
                    let permissions = permissions_response["permissions"];
                    let permissionsuser = user_permissions_response["user_permissions"];


                    let tabs = [];
                    users.forEach(user => {
                        let name = user["first_name"] + " " + user["last_name"];
                        let username = user["username"];
                        let id_per = permissionsuser.filter((row) => row["user_name"] == username);

                        let after = id_per.map((x) => permissions.filter((row) => row["Permissions_id"] == x["Permissions_id"])[0] );
                        console.log(after)

                        tabs.push(
                            {
                                "name": name,
                                "cont": () => {
                                    console.log(id_per);
                                    document.getElementById(name).innerHTML="";
                                    table_builder(
                                        document.getElementById(name),
                                        ["Permission ID", "description","name"],
                                        ["Permissions_id", "Permissions_description","Name"],
                                        after,
                                        "permissions_table",
                                        (r) => {
                                            console.log(r);
                                        });
                                },
                                "content_classname": "user_permissions_content"
                            })
                    });
                    Utils.build_tabs(tabs_div, tabs, inner_container);

                })
            })
        });
    },


};