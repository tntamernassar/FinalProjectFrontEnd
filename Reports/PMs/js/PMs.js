

let PMs = {

    error: (e)=>{
        console.log(e);
    },

    draw_summary_table: (parent, pms)=>{
        let table_builder = TableBuilder.simple_table_builder();
        table_builder(parent,
            ["Entity", "Sub Entity", "Shift", "Checklist Open", "G2G Start", "G2G End", "G2G (hours)"],
            ["parent_entity", "entity", "shift", "checklist_open", "start", "end", "g2g"],
            pms,
            "pms_summary_table",
            (row)=>{}
        )
    },

    build_shift_distribution_pie_chart: (parent, pm_type, pms)=>{
        let div = document.createElement("div");
        div.id = "shift_distribution_pie_"+pm_type;
        div.className = "shift_distribution_pie";
        let pie_chart_builder = ChartBuilder.pie_chart_builder();
        parent.appendChild(div);

        let shifts = Utils.distinct(pms.map(pm => pm["shift"]));

        pie_chart_builder.builder(div.id, pm_type + " Shifts Distribution", shifts.map(shift => {
            let shift_data = pms.filter(row => row["shift"] == shift);
            return pie_chart_builder.make_pie(
                "Shift " + shift + " - " + shift_data.length + " PMs",
                shift_data.length / pms.length
            );
        }));
    },

    build_shift_g2g_average_bar_chart: (parent, pm_type, pms)=> {
        let div = document.createElement("div");
        div.id = "shift_g2g_bar_" + pm_type;
        div.className = "shift_g2g_bar";
        let bar_chart_builder = ChartBuilder.bar_chart_builder();
        parent.appendChild(div);

        let shifts = Utils.distinct(pms.map(pm => pm["shift"])).sort();
        let g2g_map = {};
        /** calculate total g2g average **/
        let g2g_sum = pms.reduce((acc, curr)=> acc + Number(curr["g2g"]), 0);
        g2g_map["Total"] = g2g_sum / pms.length;
        /** calculate  g2g average per shift **/
        shifts.forEach(shift => {
            let shift_data = pms.filter(row => row["shift"] == shift);
            let g2g_sum = shift_data.reduce((acc, curr)=> acc + Number(curr["g2g"]), 0);
            g2g_map["Shift " + shift] = g2g_sum / shift_data.length;
        });

        bar_chart_builder.builder(div.id,
            pm_type + " G2G Average",
            "Hours",
            [],
            "G2G Average",
            Object.keys(g2g_map).map(shift => {
                return bar_chart_builder.make_bar(shift, g2g_map[shift], "")
            })
        )
    },

    build_shift_g2g_median_bar_chart: (parent, pm_type, pms)=> {
        let div = document.createElement("div");
        div.id = "shift_g2g_median_bar_" + pm_type;
        div.className = "shift_g2g_bar";
        let bar_chart_builder = ChartBuilder.bar_chart_builder();
        parent.appendChild(div);

        let shifts = Utils.distinct(pms.map(pm => pm["shift"])).sort();
        let g2g_map = {};
        /** calculate total g2g average **/
        let g2gs = pms.map(row => Number(row["g2g"])).sort((a, b) => a - b);
        g2g_map["Total"] = g2gs[Math.floor(g2gs.length / 2)];
        /** calculate  g2g average per shift **/
        shifts.forEach(shift => {
            let shift_data = pms.filter(row => row["shift"] == shift);
            let g2gs = shift_data.map(row => Number(row["g2g"])).sort();
            g2g_map["Shift " + shift] = g2gs[Math.floor(g2gs.length / 2)];
        });

        bar_chart_builder.builder(div.id,
            pm_type + " G2G Median",
            "Hours",
            [],
            "G2G Median",
            Object.keys(g2g_map).map(shift => {
                return bar_chart_builder.make_bar(shift, g2g_map[shift], "green")
            })
        )
    },

    calculate_attributes: (data, config)=> {
        let checklists_titles = config["checklists_titles"];

        for (let pm_type in data) {
            let PMs = data[pm_type];
            PMs.forEach((PM) => {
                let checklist = PM["checklist"];
                /** calculate G2G **/
                PM["g2g"] = (Utils.str_date_diff(PM["checklist_open"], PM["end"]) / 60).toFixed(1);

                /** set PM Checklist title **/
                PM["checklist_title"] = checklists_titles[checklist] ? checklists_titles[checklist] : checklist;

                /** set Main entity **/
                PM["parent_entity"] = PM["entity"].substr(0, 6);
            });
        }
    },

    init: ()=>{
        ConfigManager.read_json("PMs", config => {
            NetworkAdapter.init(() => {
                NetworkAdapter.send({
                    "action": "get_report",
                    "report": "PMs"
                }, (response) => {
                    console.log(response);
                    let data = response["data"];
                    PMs.calculate_attributes(data, config);
                    Utils.build_tabs(document.getElementById("pms_navigator"),
                        [
                            {
                                "name": "Filter PMs",
                                "cont": ()=>{ FilterPMs.draw(data) }
                            },
                            {
                                "name": "Pump PMs",
                                "cont": ()=>{ PumpPMs.draw(data) }
                            },
                            {
                                "name": "Clean PMs",
                                "cont": ()=>{ CleanPMs.draw(data) }
                            },
                            {
                                "name": "Super Clean PMs",
                                "cont": ()=>{ SuperCleanPMs.draw(data) }
                            }
                        ],
                        document.getElementById("pm_summary"))

                });
            }, PMs.error);
        });
    }
};