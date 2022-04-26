let Counters = {

    color: (value, limit) => {
        if (value >= limit){
            return 'red';
        }else {
            return '#1BA5D1';
        }
    },

    frequency: (machine, checklist, data) => {
        let units = {
            1: 1/(24*60), // minutes
            2: 1/24, // hours
            3: 1, // days
            4: 7, // week
        };
        let unit = data["frequencies"][machine][checklist]["unit"];
        let value = data["frequencies"][machine][checklist]["value"];
        return units[unit] * value;
    },

    counter: (machine, checklist, data) => {
        let last_pm = data["PMs"][machine][checklist];
        let diff = Number((Utils.str_date_diff(last_pm, new Date()) / (60 * 24)).toFixed(2));
        return diff;
    },

    draw_checklist: (parent, checklist, data)=>{
        let checklist_machines = Object.keys(data["frequencies"]).sort();
        checklist_machines = checklist_machines.filter(machine => checklist in data["frequencies"][machine] && checklist in data["PMs"][machine]);

        let bar_chart_builder = ChartBuilder.bar_chart_builder();

        let graph_holder = document.createElement("div");
        graph_holder.className = "graph_holder";
        graph_holder.id = checklist + "_holder";
        parent.appendChild(graph_holder);

        let counters = checklist_machines.map(
            (machine, index) =>
                bar_chart_builder.make_bar(
                    machine,
                    Counters.counter(machine, checklist, data),
                    Counters.color(Counters.counter(machine, checklist, data), Counters.frequency(machine, checklist, data))
                )
        );

        let limit = checklist_machines.map(machine => Counters.frequency(machine, checklist, data));
        console.log(counters, limit)

        bar_chart_builder.builder(graph_holder.id,
            checklist,
            "Days",
            limit,
            "Time Since Last PM",
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