
let TableBuilder = {

    simple_table_builder: ()=>{
        /**
         * parent - DOM element to build the table on
         * headers - header names
         * keys - key name for each header
         * rows - list of maps containing keys
         * **/
        return (parent, headers, keys, rows, classname, on_row_click)=>{
            let table = document.createElement("table");
            table.className = "simple_table " + classname;
            table.innerHTML = "<tr>" + headers.reduce((acc, curr)=> acc + "<th>" + curr + "</th>", "") + "</tr>";
            rows.forEach((record)=>{
                let tr = document.createElement("tr");
                keys.forEach((attribute)=>{
                    let td = document.createElement("td");
                    td.innerHTML = record[attribute];
                    tr.appendChild(td);
                });
                tr.onclick = ()=>{
                    on_row_click(record);
                };
                table.appendChild(tr);
            });

            parent.appendChild(table);
        };
    }

};