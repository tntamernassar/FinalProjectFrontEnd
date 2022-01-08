
let Dashboard = {

    display_attributes_popup:(machine)=>{
        let body = document.createElement("div");
        let div=document.createElement("div");
        div.innerHTML=" <span class='column_name'> machine name:</span> " +
            "<span class='machine_name_value'>" + machine["name"]+"</span>";
        let div_state=document.createElement("div");
        div_state.innerHTML=" <span class='machine_state'> machine state:</span> " +
            "<span class='machine_state_value'>" + machine["state"]+"</span>";

        body.appendChild(div)
        body.appendChild(div_state)

        for (const [key, value] of Object.entries(machine["attributes"])) {
            let div_att=document.createElement("div");
            div_att.innerHTML=" <span class='att_name'>"+key+": </span> " +
                "<span class='att_value'>" + value+"</span>";
            body.appendChild(div_att)
        }

        Utils.display_pop_up(body)
    },



    display_machines: (machines)=>{
        let container = document.getElementById("overview_container");
        let machine_leading = document.getElementById("machine_leading");
        container.removeChild(machine_leading);
        machines.forEach((machine)=>{
            let name = machine["name"];
            let state = machine["state"];

            let machine_container = document.createElement("div");
            machine_container.innerHTML = name;

            machine_container.className = "report_card machine_container state_"+state;
            machine_container.onclick=()=>{
                Dashboard.display_attributes_popup(machine);
            };
            container.appendChild(machine_container);
        });
    },

    init: ()=>{

        const onConnection = ()=>{
            console.log("connected");
            NetworkAdapter.send({
                "action": "get_machines",
                "department": "TGR"
            }, (response)=>{
                console.log(response);
                Dashboard.display_machines(response["machines"]);
            });
        };

        const onError = (error)=>{
            console.error(error);
        };

        NetworkAdapter.init(onConnection, onError);
    },
    const: NewTab= (link)=> {
        console.log('hello');
        window.location=link;
    }


}