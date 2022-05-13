
let Dashboard = {

    display_parent_popup:(parent_entity, children_entities)=>{
        let body = document.createElement("div");
        let simple_table_builder = TableBuilder.simple_table_builder();
        body.className = "parent_entity_popup";
        body.innerHTML = "<H1>"+parent_entity+"</H1>";

        let children_container = document.createElement("div");
        body.appendChild(children_container);

        let attributes_div = document.createElement("div");
        attributes_div.className = "attributes_div";
        body.appendChild(attributes_div);

        children_entities.forEach((entity) => {
            let child_div = document.createElement("div");
            child_div.innerHTML = entity["name"];
            child_div.className = "machine_container bg_state_"+entity["state"];

            let attributes_rows = [];
            for (let attribute in  entity["attributes"]){
                attributes_rows.push({ "a": attribute, "v": entity["attributes"][attribute] });
            }

            child_div.onclick = () => {
                attributes_div.innerHTML = '';
                simple_table_builder(attributes_div,
                    ["Attribute", "Value"],
                    ["a", "v"],
                    attributes_rows,
                    "attributes_table", ()=>{});
            };
            children_container.appendChild(child_div);
        });

        Utils.display_pop_up(body)
    },

    /** TO-DO: Split machine by groups **/
    display_machines: (machines)=>{
        let overview_container = document.getElementById("overview_container");
        let machines_container = document.getElementById("machines_container");
        let machine_loading = document.getElementById("machine_loading");

        /** Remove loading GIF **/
        overview_container.removeChild(machine_loading);

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

            parent_entity_container.onclick=() => {
                Dashboard.display_parent_popup(parent_entity, children_entities);
            };
        });
    },

    init: ()=>{
        const onConnection = ()=>{
            console.log("connected");
            NetworkAdapter.send({
                "action": "get_machines",
                "department": "BGU"
            }, (response)=>{
                console.log(response);
                Dashboard.display_machines(response["machines"]);
            });
        };

        NetworkAdapter.init(onConnection, console.error);
    }


}