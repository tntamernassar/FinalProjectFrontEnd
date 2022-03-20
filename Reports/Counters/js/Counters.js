let Counters = {

    color: (row) => {
        let pm_status = row["PM_STATUS"];
        if (pm_status === "Due") {
            return 'red';
        } else {
            return '#1BA5D1';
        }
    },

    frequency: (row) => {
        let units = {
            1: 60, // minutes
            2: 60 * 60, // hours
            3: 60 * 60 * 24, // days
            4: 60 * 60 * 24 * 7, // week
        };
        let unit = row["CYCLE_UNIT"];
        let value = row["CYCLE_VALUE"];
        return units[unit] * value;
    },

    counter: (row) => {
        let time_until_pm = Utils.str_date_diff(new Date(), row["OVERDUE_DATE"]) * 60;
        let freq = Counters.frequency(row) ;
        console.log(row["ENTITY"], row["OVERDUE_DATE"], time_until_pm, freq);

        return (freq - time_until_pm) / (60 * 60 * 24).toFixed(2); // in days
    },

    draw_checklist: (parent, checklist, data)=>{
        let checklist_data = data.filter(row => row["CHECKLIST_NAME"] == checklist);
        let bar_chart_builder = ChartBuilder.bar_chart_builder();

        let graph_holder = document.createElement("div");
        graph_holder.id = checklist + "_holder";
        parent.appendChild(graph_holder);

        let counters = checklist_data.map(
            (row) =>
                bar_chart_builder.make_bar(
                    row["ENTITY"],
                    Counters.counter(row),
                    Counters.color(row)
                )
        );
        console.log(counters)

        bar_chart_builder.builder(graph_holder.id,
            checklist,
            "Days",
            "UTP Time",
            counters
        );

    },

    draw_group: (parent, group, data) => {
        let name = group["name"];
        let checklists = group["checklists"];

        parent.innerHTML = "<H2>" + name + "</H2>";
        checklists.forEach((checklist)=>{
            Counters.draw_checklist(parent, checklist, data);
        });
    },

    draw: (config, data) => {
        let container = document.getElementById("container");
        let groups = config["groups"];
        groups.forEach((group) => {
            let div = document.createElement("div");
            div.className = "counter_div report_card";
            container.appendChild(div);
            Counters.draw_group(div, group, data);
        });
    },

    errors: (es) => {
        es.filter((e) => e).forEach(console.error);
    },

    init: (config) => {
        NetworkAdapter.init(() => {
            NetworkAdapter.send({
                "action": "get_report",
                "report": "counters"
            }, (response) => {
                Counters.draw(config, response["data"]["Counters"]);
            });
        }, (e) => Counters.errors([e]));
    }

};