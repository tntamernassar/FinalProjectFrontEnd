

let PMs = {

    error: (e)=>{
        console.log(e);
    },

    calculate_attributes: (PMs, config)=> {
        let checklists_titles = config["checklists_titles"];
        PMs.forEach((PM) => {
            let checklist = PM["checklist"];
            /** calculate G2G **/
            PM["g2g"] = (Utils.str_date_diff(PM["checklist_open"], PM["end"]) / 60).toFixed(1);

            /** set PM Checklist title **/
            PM["checklist_title"] = checklists_titles[checklist] ? checklists_titles[checklist] : checklist;

            /** set Main entity **/
            PM["parent_entity"] = PM["entity"].substr(0, 6);
        });
    },

    draw_table: (PMs) => {
        let container = document.getElementById("container");

        let table_builder = TableBuilder.simple_table_builder();

        table_builder(container,
            ["Entity", "Sub Entity", "Checklist", "PM", "Checklist Open", "G2G Start", "G2G End", "G2G (hours)"],
            ["parent_entity", "entity", "checklist", "checklist_title", "checklist_open", "start", "end", "g2g"],
            PMs,
            "table",
            (row)=>{}
            )
    },

    init: ()=>{
        ConfigManager.read_json("PMs", config => {
            NetworkAdapter.init(() => {
                NetworkAdapter.send({
                    "action": "get_report",
                    "report": "PMs"
                }, (response) => {
                    console.log(response);
                    let filter_pms = response["data"]["filter_pms"];
                    let pms = [...filter_pms];
                    PMs.calculate_attributes(pms, config);
                    PMs.draw_table(pms);
                });
            }, PMs.error);
        });
    }

};