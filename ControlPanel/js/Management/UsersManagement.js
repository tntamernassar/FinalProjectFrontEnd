
let UsersManagement = {

    network_adapter: NetworkAdapter,

    view_users: () => {
        ControlPanel.resent_inner_container();

        let organization_chart_builder = ChartBuilder.organization_chart_builder();
        let inner_container = document.getElementById("inner_container");
        let chart_div = document.createElement("div");
        chart_div.id = "organization_chart";
        inner_container.appendChild(chart_div);

        UsersManagement.network_adapter.send({
            "action": "get_users",
            "department": "BGU"
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

            organization_chart_builder.builder(chart_div.id, "BGU Users", nodes, links, levels);
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
            "department": "BGU"
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
                        alert("Success !");
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
            "department": "BGU"
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

    view_user_permissions: () => {
        ControlPanel.resent_inner_container();
        let table_builder = TableBuilder.simple_table_builder();
        let inner_container = document.getElementById("inner_container");
        let tabs_div = document.createElement("div");
        inner_container.appendChild(tabs_div);

        let tabs_content_div = document.createElement("div");
        inner_container.appendChild(tabs_content_div);

        UsersManagement.network_adapter.send({
            "action": "get_users",
            "department": "BGU"
        }, (user_response) => {
            UsersManagement.network_adapter.send({
                "action": "get_permissions",
                "department": "BGU"
            }, (permissions_response) => {
                UsersManagement.network_adapter.send({
                    "action": "get_user_permissions",
                    "department": "BGU"
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

                        tabs.push(
                            {
                                "name": name,
                                "cont": () => {
                                    document.getElementById(name).innerHTML="";
                                    table_builder(
                                        document.getElementById(name),
                                        ["Permission ID", "description","name"],
                                        ["Permissions_id", "Permission_description","Name"],
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

    build_hash_map :(user_permissions_response) => {
        let hashMap = {};

        user_permissions_response.forEach(permission => {
            if (!hashMap[permission["user_name"]] ){
                hashMap[permission["user_name"]]=[]
            }
            hashMap[permission["user_name"]].push(permission["Permissions_id"])
        });

        return hashMap;


    },

    add_machine_management_permission: () => {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        let checkboxes_div = document.createElement("div");
        checkboxes_div.className = "checkboxes_div";
        inner_container.appendChild(checkboxes_div);
        UsersManagement.network_adapter.send({
            "action": "get_users",
            "department": "BGU"
        }, (response) => {

            UsersManagement.network_adapter.send({
                "action": "get_permissions",
                "department": "BGU"
            }, (permissions_response) => {

                UsersManagement.network_adapter.send({
                    "action": "get_user_permissions",
                    "department": "BGU"
                }, (user_permissions_response) => {

                    let all = response["users"];
                    let permissions = permissions_response["permissions"];
                    let permissionsuser = user_permissions_response["user_permissions"];

                    let num_Per_AddMachine=permissions.filter( x => x["Name"]=="Add Machine")[0]["Permissions_id"];

                    let hashMap = UsersManagement.build_hash_map(permissionsuser)

                    let not_have_permission = []
                    for (const [key, value] of Object.entries(hashMap)) {
                        if (!value.includes(num_Per_AddMachine)){
                            not_have_permission.push(key);
                        }
                    }

                    /** response format : { users: list of users } **/


                    let users = not_have_permission.map(x => all.filter(user => user["username"]==x));
                    let names = users.map(user => user.map(x=> x["first_name"] + " " + x["last_name"] + " - " + x["username"]));

                    let new_user = [];

                    ControlPanel.create_checklist(checkboxes_div, names, (i, checked) => {
                        let username = users[i][0]["username"];

                        if (checked) {
                            new_user.push(username);
                        } else {
                            new_user = new_user.filter(a => a !== username);
                        }
                    }, () => {
                        if (new_user.length == 0) {
                            alert("Please choose at least one user");
                        } else {
                            UsersManagement.network_adapter.send({
                                "action": "Add_machine_management_Permission",
                                "usernames": new_user,
                                "num_Per" : num_Per_AddMachine
                            }, (response) => {
                                // TODO: Display success/fail message
                                UsersManagement.add_machine_management_permission();
                                console.log("Add machine Permission response : ", JSON.stringify(response));
                            });
                        }
                    });
                });
            });
        });
    },

    remove_machine_management_permission :() => {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        let checkboxes_div = document.createElement("div");
        checkboxes_div.className = "checkboxes_div";
        inner_container.appendChild(checkboxes_div);
        UsersManagement.network_adapter.send({
            "action": "get_users",
            "department": "BGU"
        }, (response) => {

            UsersManagement.network_adapter.send({
                "action": "get_permissions",
                "department": "BGU"
            }, (permissions_response) => {

                UsersManagement.network_adapter.send({
                    "action": "get_user_permissions",
                    "department": "BGU"
                }, (user_permissions_response) => {

                    let all = response["users"];
                    let permissions = permissions_response["permissions"];
                    let permissionsuser = user_permissions_response["user_permissions"];

                    let num_Per_AddMachine=permissions.filter( x => x["Name"]=="Add Machine")[0]["Permissions_id"];

                    let hashMap = UsersManagement.build_hash_map(permissionsuser)

                    let not_have_permission = []
                    for (const [key, value] of Object.entries(hashMap)) {
                        if (value.includes(num_Per_AddMachine)){
                            not_have_permission.push(key);
                        }
                    };

                    /** response format : { users: list of users } **/


                    let users = not_have_permission.map(x => all.filter(user => user["username"]==x));
                    let names = users.map(user => user.map(x=> x["first_name"] + " " + x["last_name"] + " - " + x["username"]));

                    let new_user = [];

                    ControlPanel.create_checklist(checkboxes_div, names, (i, checked) => {
                        let username = users[i][0]["username"];
                        if (checked) {
                            new_user.push(username);
                        } else {
                            new_user = new_user.filter(a => a !== username);
                        }
                    }, () => {
                        if (new_user.length == 0) {
                            alert("Please choose at least one user");
                        } else {
                            UsersManagement.network_adapter.send({
                                "action": "remove_machine_management_permission",
                                "usernames": new_user,
                                "num_Per" : num_Per_AddMachine
                            }, (response) => {
                                UsersManagement.remove_machine_management_permission();
                                // TODO: Display success/fail message
                                console.log("remove machine Permission response : ", JSON.stringify(response));
                            });
                        }
                    });
                });
            });
        });
    },

    add_view_report_permission: () => {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        let checkboxes_div = document.createElement("div");
        checkboxes_div.className = "checkboxes_div";
        inner_container.appendChild(checkboxes_div);
        UsersManagement.network_adapter.send({
            "action": "get_users",
            "department": "BGU"
        }, (response) => {

            UsersManagement.network_adapter.send({
                "action": "get_permissions",
                "department": "BGU"
            }, (permissions_response) => {

                UsersManagement.network_adapter.send({
                    "action": "get_user_permissions",
                    "department": "BGU"
                }, (user_permissions_response) => {

                    let all = response["users"];
                    let permissions = permissions_response["permissions"];
                    let permissionsuser = user_permissions_response["user_permissions"];

                    let num_Per_AddMachine=permissions.filter( x => x["Name"]=="View report")[0]["Permissions_id"];

                    let hashMap = UsersManagement.build_hash_map(permissionsuser)

                    let not_have_permission = []
                    for (const [key, value] of Object.entries(hashMap)) {
                        if (!value.includes(num_Per_AddMachine)){
                            not_have_permission.push(key);
                        }
                    }

                    /** response format : { users: list of users } **/


                    let users = not_have_permission.map(x => all.filter(user => user["username"]==x));
                    let names = users.map(user => user.map(x=> x["first_name"] + " " + x["last_name"] + " - " + x["username"]));

                    let new_user = [];

                    ControlPanel.create_checklist(checkboxes_div, names, (i, checked) => {
                        let username = users[i][0]["username"];
                        if (checked) {
                            new_user.push(username);
                        } else {
                            new_user = new_user.filter(a => a !== username);
                        }
                    }, () => {
                        if (new_user.length == 0) {
                            alert("Please choose at least one user");
                        } else {
                            UsersManagement.network_adapter.send({
                                "action": "add_view_report_permission",
                                "usernames": new_user,
                                "num_Per" : num_Per_AddMachine
                            }, (response) => {
                                // TODO: Display success/fail message
                                UsersManagement.add_view_report_permission();
                                console.log("Add View Report Permission response : ", JSON.stringify(response));
                            });
                        }
                    });
                });
            });
        });
    },

    remove_view_report_permission: () => {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        let checkboxes_div = document.createElement("div");
        checkboxes_div.className = "checkboxes_div";
        inner_container.appendChild(checkboxes_div);
        UsersManagement.network_adapter.send({
            "action": "get_users",
            "department": "BGU"
        }, (response) => {

            UsersManagement.network_adapter.send({
                "action": "get_permissions",
                "department": "BGU"
            }, (permissions_response) => {

                UsersManagement.network_adapter.send({
                    "action": "get_user_permissions",
                    "department": "BGU"
                }, (user_permissions_response) => {

                    let all = response["users"];
                    let permissions = permissions_response["permissions"];
                    let permissionsuser = user_permissions_response["user_permissions"];

                    let num_Per_AddMachine = permissions.filter(x => x["Name"] == "View report")[0]["Permissions_id"];
                    let hashMap = UsersManagement.build_hash_map(permissionsuser)

                    let not_have_permission = []
                    for (const [key, value] of Object.entries(hashMap)) {
                        if (value.includes(num_Per_AddMachine)) {
                            not_have_permission.push(key);
                        }
                    }

                    /** response format : { users: list of users } **/


                    let users = not_have_permission.map(x => all.filter(user => user["username"] == x));
                    let names = users.map(user => user.map(x => x["first_name"] + " " + x["last_name"] + " - " + x["username"]));

                    let new_user = [];

                    ControlPanel.create_checklist(checkboxes_div, names, (i, checked) => {
                        let username = users[i][0]["username"];
                        if (checked) {
                            new_user.push(username);
                        } else {
                            new_user = new_user.filter(a => a !== username);
                        }
                    }, () => {
                        if (new_user.length == 0) {
                            alert("Please choose at least one user");
                        } else {
                            UsersManagement.network_adapter.send({
                                "action": "remove_view_report_permission",
                                "usernames": new_user,
                                "num_Per" : num_Per_AddMachine
                            }, (response) => {
                                // TODO: Display success/fail message
                                UsersManagement.remove_view_report_permission();
                                console.log("Remove View Report Permission response : ", JSON.stringify(response));
                            });
                        }
                    });
                });
            });
        });
    },

    view_machines: () => {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        let overview_container_div = document.createElement("div");
        overview_container_div.id = "overview_container";
        let machines_container_div = document.createElement("div");
        machines_container_div.id = "machines_container";
        let machine_loading_div = document.createElement("div");
        machine_loading_div.id = "machine_loading";

        inner_container.appendChild(overview_container_div);
        inner_container.appendChild(machines_container_div);
        inner_container.appendChild(machine_loading_div);

        UsersManagement.network_adapter.send({
            "action": "get_machines",
            "department": "BGU"
        }, (response) => {

            Dashboard.display_machines(response["machines"]);

        })

    },

};