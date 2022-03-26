

let Chemicals = {

    get_group_availability: (group, data)=> data["availability"].filter(row => group["ceid"].indexOf(row["CEID"]) >= 0),
    get_group_current_shift: (group, data)=> data["cs_out"].filter(row => group["ceid"].indexOf(row["CEID"]) >= 0),
    get_group_previous_shift: (group, data)=> data["ps_out"].filter(row => group["ceid"].indexOf(row["CEID"]) >= 0),

    up_cell: ()=>{
        return "<div class='up_cell'>Up</div>";
    },

    down_cell: (reason)=>{
        return "<div class='down_cell'>" + (reason ? reason : "Down") + "</div>";
    },

    draw_group: (group, data)=>{
        let parent = document.getElementById("second_container");
        let tableBuilder = TableBuilder.simple_table_builder();
        let title = group["title"];

        let group_availability = Chemicals.get_group_availability(group, data);
        let group_current_shift = Chemicals.get_group_current_shift(group, data);
        let group_previous_shift = Chemicals.get_group_previous_shift(group, data);

        console.log(group_availability);

        parent.innerHTML = '<H1>$title</H1>'.replace("$title", title);
        let tables_container = document.createElement("div");
        tables_container.className = "tables_container";
        parent.appendChild(tables_container);

        let machines = Utils.distinct(group_availability.map(row => row["ENTITY"].substr(0, 6)));
        let spins = Utils.distinct(group_availability.map(row => row["ENTITY"].split("_")[1]).filter(sp => sp.startsWith("SP")));
        let cabs = Utils.distinct(group_availability.map(row => row["ENTITY"].split("_")[1]).filter(cab => cab.startsWith("CAB")));
        let lps = Utils.distinct(data["availability"].map(row => row["ENTITY"].split("_")[1]).filter(lp => lp.startsWith("LP")));

        let machines_rows = machines.map(machine => { return {"machine": machine} });
        let lp_rows = [], cab_rows = [], spins_rows = [], out_rows = [];
        machines.forEach(machine => {
            let lp_row = {}, cab_row = {}, spin_row = {};

            lps.forEach(lp => {
                let lp_name = machine + "_" + lp;
                let lp_availability = data["availability"].filter(row => row["ENTITY"] === lp_name)[0];
                if (lp_availability){
                    lp_row[lp] = lp_availability["AVAILABILITY"] === 'Up' ? Chemicals.up_cell() : Chemicals.down_cell(lp_availability["STATE"]);
                }else{
                    lp_rows[lp] = "-";
                }
            });

            cabs.forEach(cab => {
                let cab_name = machine + "_" + cab;
                let cab_availability = group_availability.filter(row => row["ENTITY"] === cab_name)[0];
                if (cab_availability) {
                    cab_row[cab] = cab_availability["AVAILABILITY"] === 'Up' ? Chemicals.up_cell() : Chemicals.down_cell(cab_availability["STATE"]);
                }else{
                    cab_row[cab] = "-";
                }
            });

            spins.forEach(spin => {
                let spin_name = machine + "_" + spin;
                let spin_availability = group_availability.filter(row => row["ENTITY"] === spin_name)[0];
                if (spin_availability) {
                    spin_row[spin] = spin_availability["AVAILABILITY"] === 'Up' ? Chemicals.up_cell() : Chemicals.down_cell(spin_availability["STATE"]);
                }else{
                    spin_row[spin] = "-";
                }
            });

            let machine_current_shift_row = group_current_shift.filter(row => row["SUBENTITY"].startsWith(machine));
            let machine_previous_shift_row = group_previous_shift.filter(row => row["SUBENTITY"].startsWith(machine));
            let cs = machine_current_shift_row.reduce((acc, curr)=> acc + curr["WAFER"], 0);
            let ps = machine_previous_shift_row.reduce((acc, curr)=> acc + curr["WAFER"], 0);

            spins_rows.push(spin_row);
            cab_rows.push(cab_row);
            lp_rows.push(lp_row);
            out_rows.push({"cs": cs, "ps": ps});
        });

        console.log(out_rows)
        let machines_table = document.createElement("div");
        tables_container.appendChild(machines_table);

        let lp_table = document.createElement("div");
        tables_container.appendChild(lp_table);

        let cab_table = document.createElement("div");
        tables_container.appendChild(cab_table);

        let spins_table = document.createElement("div");
        tables_container.appendChild(spins_table);

        let outs_table = document.createElement("div");
        tables_container.appendChild(outs_table);

        tableBuilder(machines_table, ["Entity"], ["machine"], machines_rows, "sub_table", (row)=>{});
        tableBuilder(lp_table, lps, lps, lp_rows, "sub_table", (row)=>{});
        tableBuilder(cab_table, cabs, cabs, cab_rows, "sub_table", (row)=>{});
        tableBuilder(spins_table, spins, spins, spins_rows, "sub_table", (row)=>{});
        tableBuilder(outs_table, ["cs", "ps"], ["cs", "ps"], out_rows, "sub_table", (row)=>{});

    },

    draw_groups: (groups, data)=>{
        let parent = document.getElementById("container");
        groups.forEach(group => {
            let group_container = document.createElement("div");
            group_container.className = "group_container report_card";

            let group_availability = Chemicals.get_group_availability(group, data);
            let group_current_shift = Chemicals.get_group_current_shift(group, data);
            let group_previous_shift = Chemicals.get_group_previous_shift(group, data);

            let title = group["title"];
            let IReq = group["IReq"];
            let available = group_availability.filter(row => row["AVAILABILITY"] === "Up" && row["ENTITY"].indexOf("SP") >= 0).length;
            let total = group_availability.filter(row => row["ENTITY"].indexOf("SP") >= 0).length;
            let cs_out = group_current_shift.reduce((acc, curr)=> acc + curr["WAFER"], 0);
            let ps_out = group_previous_shift.reduce((acc, curr)=> acc + curr["WAFER"], 0);
            let valid_ireq = available >= IReq ? "valid_ireq" : "invalid_ireq";

            group_container.innerHTML = `
            <span><b>$title</b></span>
            <div class="group_info">
                <span class="$valid_ireq"><b>$available / $total</b></span><br/>
                <span><b>IReq : $IReq</b></span><br/>
                <span><b>CS Out : $cs_out</b></span><br/>
                <span><b>PS Out : $ps_out</b></span>
            </div>
            `.replace("$title", title)
                .replace("$available", available.toString())
                .replace("$total", total.toString())
                .replace("$IReq", IReq)
                .replace("$cs_out", cs_out.toString())
                .replace("$ps_out", ps_out.toString())
                .replace("$valid_ireq", valid_ireq);

            group_container.onclick = ()=>{
                Chemicals.draw_group(group, data);
            };

            parent.appendChild(group_container);
        });
    },

    error: (e)=>{
        console.log(e);
    },

    init: ()=>{
        ConfigManager.read_json("chemicals", (config)=>{
            NetworkAdapter.init(() => {
                NetworkAdapter.send({
                    "action": "get_report",
                    "report": "chemicals"
                }, (response) => {
                    Chemicals.draw_groups(config["groups"], response["data"]);
                    console.log(response);
                });
            }, Chemicals.error);
        });
    }

};