
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

    add_user: () => {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        inner_container.className = "report_card login_card";
        let h =document.createElement("H1");
        let t = document.createTextNode("Add New User");
        h.appendChild(t);
        inner_container.appendChild(h);
        let login_form =document.createElement("div");
        login_form.className = "login_form";
        let firstname = document.createElement("INPUT");
        firstname.setAttribute("type", "text");
        firstname.placeholder = "first name";
        let lastname = document.createElement("INPUT");
        lastname.setAttribute("type", "text");
        lastname.placeholder = "last name";
        let email = document.createElement("INPUT");
        email.setAttribute("type", "text");
        email.placeholder = "email";

        inner_container.appendChild(login_form);
        login_form.appendChild(firstname);
        login_form.appendChild(lastname);
        login_form.appendChild(email);


        let save = Utils.make_button("Save");
        save.style.float = "right";
        save.onclick = ()=> {

            let email1 = email.value;
            let fname=firstname.value;
            let lname=lastname.value;

            if (email1.length == 0) {
                alert("Please insert email");
            }
            else if (fname.length == 0) {
                alert("Please insert first name");
            }
            else if (lname.length == 0) {
                alert("Please insert last name");
            }
            else {
                UsersManagement.network_adapter.send({
                    "action": "add_user",
                    "email": email1,
                    "fname": fname,
                    "lname": lname
                }, (response) => {
                    // TODO: Display success/fail message
                    console.log("add user response : ", JSON.stringify(response));
                    UsersManagement.add_user();
                });
            }
        };
        login_form.appendChild(save);





    },

    remove_user: () => {
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
            let names = all.map(user => user["first_name"] + " " + user["last_name"] + " - " + user["username"]);
            let to_remove = [];

            ControlPanel.create_checklist(checkboxes_div, names, (i, checked)=>{
                let username = all[i]["username"];
                if (checked){
                    to_remove.push(username);
                }else{
                    to_remove = to_remove.filter(a => a !== username);
                }
            }, ()=>{
                if (to_remove.length == 0){
                    alert("Please choose at least one user");
                }else {
                    console.log(to_remove);
                    UsersManagement.network_adapter.send({
                        "action": "remove_user",
                        "usernames": to_remove
                    }, (response) => {
                        // TODO: Display success/fail message
                        console.log("Remove user response : ", JSON.stringify(response));
                        UsersManagement.remove_user();
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
        UsersManagement.network_adapter.send({
            "action": "get_machines",
            "department": "BGU"
        }, (response) => {

            let machines = response["machines"];
            let machines_container = inner_container;


            /** Group by parent entities **/
            let parent_entities = Utils.distinct(machines.map(machine => machine["name"].split("_")[0]));
            parent_entities.forEach((parent_entity)=>{
                let children_entities = machines.filter(machine => machine["name"].indexOf(parent_entity) >= 0);

                let up_children = children_entities.filter(machine => machine["state"] == 'UP');
                let down_children = children_entities.filter(machine => machine["state"] == 'DOWN');
                let pm_children = children_entities.filter(machine => machine["state"] == 'PM');

                let parent_entity_container = document.createElement("div");
                parent_entity_container.className = "report_card parent_entity_container";
                parent_entity_container.innerHTML = "<b>" + parent_entity + "</b>";

                let description_container = document.createElement("div");
                description_container.className = "description_container";

                description_container.innerHTML = ` 
            <b class="state_UP">Up :  $up_children </b><br />
            <b class="state_DOWN">Down : $down_children </b> <br />
            <b class="state_PM">PM : $pm_children </b> <br/>
            `.replace("$up_children", up_children.length.toString())
                    .replace("$down_children", down_children.length.toString())
                    .replace("$pm_children", pm_children.length.toString());

                machines_container.appendChild(parent_entity_container);
                parent_entity_container.appendChild(description_container);

            });

        });

    },

    add_machine() {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        let checkboxes_div = document.createElement("div");
        checkboxes_div.className = "checkboxes_div";
        inner_container.appendChild(checkboxes_div);
        UsersManagement.network_adapter.send({
            "action": "get_machines",
            "department": "BGU"
        }, (response1) => {

            UsersManagement.network_adapter.send({
                "action": "getAll_machines",
                "department": "BGU"
            }, (response2) => {

                let database_machine = response1["machines"];
                let All_machine = response2["machines"];

                arr1 =[];
                names = []
                for (let i = 0; i < All_machine.length; i++) {
                    let x = false;
                    for (let j = 0; j< database_machine.length; j++) {
                        if(All_machine[i]["machine"] == database_machine[j]["name"]){
                            x = true;
                        }
                    }
                    if (!x){
                        arr1.push(All_machine[i]);
                        names.push(All_machine[i]["machine"])
                    }
                }

                let new_machines=[];

                ControlPanel.create_checklist(checkboxes_div, names, (i, checked) => {
                      let machinename = arr1[i];
                    if (checked) {
                        new_machines.push(arr1[i]);
                    } else {
                        new_machines = new_machines.filter(a => a !== machinename);
                    }
                  }, () => {
                      if (new_machines.length == 0) {
                          alert("Please choose at least one machine");
                      } else {
                          UsersManagement.network_adapter.send({
                              "action": "add_machine",
                              "new_machines": new_machines
                          }, (response) => {
                              // TODO: Display success/fail message
                              alert("Success !");
                              UsersManagement.add_machine();
                          });
                      }
                  });
            });
        });
    },
    remove_machine() {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        let checkboxes_div = document.createElement("div");
        checkboxes_div.className = "checkboxes_div";
        inner_container.appendChild(checkboxes_div);
        UsersManagement.network_adapter.send({
            "action": "get_machines",
            "department": "BGU"
        }, (response1) => {

            let database_machine = response1["machines"];
            let names = database_machine.map(x => x["name"])

            let remove_machines = [];

            ControlPanel.create_checklist(checkboxes_div, names, (i, checked) => {
                let machinename = database_machine[i];
                if (checked) {
                    remove_machines.push(database_machine[i]);
                } else {
                    remove_machines = remove_machines.filter(a => a !== machinename);
                }
            }, () => {
                if (remove_machines.length == 0) {
                    alert("Please choose at least one machine");
                } else {
                    UsersManagement.network_adapter.send({
                        "action": "remove_machines",
                        "remove_machines": remove_machines
                    }, (response) => {
                        // TODO: Display success/fail message
                        alert("Success !");
                        UsersManagement.remove_machine();
                    });
                }
            });
        });
    },
    add_machine_attributes() {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        let checkboxes_div = document.createElement("div");
        checkboxes_div.className = "checkboxes_div";
        inner_container.appendChild(checkboxes_div);
        UsersManagement.network_adapter.send({
            "action": "get_machines",
            "department": "BGU"
        }, (response1) => {

            let database_machine = response1["machines"];
            let names = database_machine.map(x => x["name"])

            let list_machines = [];

            ControlPanel.create_checklist2(checkboxes_div, names, (i, checked) => {
                let machinename = database_machine[i];
                if (checked) {
                    list_machines.push(database_machine[i]);
                } else {
                    list_machines = list_machines.filter(a => a !== machinename);
                }
            }, () => {
                if (list_machines.length != 1) {
                    alert("Please choose one machine");
                } else {
                    UsersManagement.network_adapter.send({
                        "action": "getAll_machines",
                        "department": "BGU"
                    }, (response2) => {
                        let All_machine = response2["machines"];
                        let machine_1 = list_machines[0];

                        All_machine=All_machine.filter(x => x["machine"] === machine_1["name"]);

                        let attributes_machine1 = [];
                        for([key,value] of Object.entries(machine_1["attributes"])){
                            attributes_machine1.push(key);
                        }

                        let arr1 = [];
                        for (let i = 0; i < All_machine[0]["attributes"].length; i++) {
                            let x = false;
                            for (let j = 0; j< attributes_machine1.length; j++) {
                                if(All_machine[0]["attributes"][i]["name"] == attributes_machine1[j]){
                                    x = true;
                                }
                            }
                            if (!x){
                                arr1.push(All_machine[0]["attributes"][i]["name"]);
                            }
                        }

                        let new_attributes = [];
                        ControlPanel.resent_inner_container();
                        let inner_container = document.getElementById("inner_container");
                        let checkboxes_div = document.createElement("div");
                        checkboxes_div.className = "checkboxes_div";
                        inner_container.appendChild(checkboxes_div);
                        ControlPanel.create_checklist(checkboxes_div, arr1, (i, checked) => {
                            if (checked) {
                                new_attributes.push(arr1[i]);
                            } else {
                                new_attributes = new_attributes.filter(a => a !== arr1[i]);
                            }
                        }, () => {
                            if (new_attributes.length == 0) {
                                alert("Please choose at least one machine");
                            } else {
                                UsersManagement.network_adapter.send({
                                    "action": "add_machine_attributes",
                                    "machine" : All_machine[0],
                                    "new_attributes": new_attributes
                                }, (response) => {
                                    // TODO: Display success/fail message
                                    alert("Success !");
                                    UsersManagement.add_machine_attributes();
                                });
                            }
                        })

                    });
                }
            });
        });

    },
    remove_machine_attributes() {
        ControlPanel.resent_inner_container();
        let inner_container = document.getElementById("inner_container");
        let checkboxes_div = document.createElement("div");
        checkboxes_div.className = "checkboxes_div";
        inner_container.appendChild(checkboxes_div);
        UsersManagement.network_adapter.send({
            "action": "get_machines",
            "department": "BGU"
        }, (response1) => {

            let database_machine = response1["machines"];
            let names = database_machine.map(x => x["name"])

            let list_machines = [];

            ControlPanel.create_checklist2(checkboxes_div, names, (i, checked) => {
                let machinename = database_machine[i];
                if (checked) {
                    list_machines.push(database_machine[i]);
                } else {
                    list_machines = list_machines.filter(a => a !== machinename);
                }
            }, () => {
                if (list_machines.length != 1) {
                    alert("Please choose one machine");
                } else {
                    console.log(list_machines[0]);
                    let attributes_machine1 = [];
                    for ([key, value] of Object.entries(list_machines[0]["attributes"])) {
                        attributes_machine1.push(key);
                    }

                    ControlPanel.resent_inner_container();
                    let inner_container = document.getElementById("inner_container");
                    let checkboxes_div = document.createElement("div");
                    checkboxes_div.className = "checkboxes_div";
                    inner_container.appendChild(checkboxes_div);
                    let remove_attributes = [];
                    ControlPanel.create_checklist(checkboxes_div, attributes_machine1, (i, checked) => {
                        if (checked) {
                            remove_attributes.push(attributes_machine1[i]);
                        } else {
                            remove_attributes = remove_attributes.filter(a => a !== attributes_machine1[i]);
                        }
                    }, () => {
                        if (remove_attributes.length == 0) {
                            alert("Please choose at least one machine");
                        } else {
                            UsersManagement.network_adapter.send({
                                "action": "remove_machine_attributes",
                                "machine": list_machines[0],
                                "remove_attributes": remove_attributes
                            }, (response) => {
                                // TODO: Display success/fail message
                                alert("Success !");
                                UsersManagement.remove_machine_attributes();
                            });
                        }
                    })
                }
            });
        });
    }
};