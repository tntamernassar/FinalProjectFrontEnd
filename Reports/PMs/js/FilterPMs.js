
let FilterPMs = {


    summarize_pm_type: (parent, pm_type, pms)=>{
        let relevant_pms = pms.filter(pm => pm["checklist_title"] == pm_type);
        parent.innerHTML = '';

        PMs.build_shift_distribution_pie_chart(parent, pm_type, relevant_pms);
        PMs.build_shift_g2g_average_bar_chart(parent, pm_type, relevant_pms);
        PMs.build_shift_g2g_median_bar_chart(parent, pm_type, relevant_pms);
        PMs.draw_summary_table(parent, relevant_pms);
    },

    build_pm_types_tabs: (parent, pms)=> {
        let pms_types_menu = document.createElement("div");
        let pms_types_content = document.createElement("div");
        parent.append(pms_types_menu, pms_types_content);

        let pm_types = Utils.distinct( pms.map(pm => pm["checklist_title"]) );
        let tabs = pm_types.map(type => {
            return {
                "name": type,
                "cont": (content_div)=>{
                    FilterPMs.summarize_pm_type(content_div, type, pms);
                },
                "content_classname": "pm_types_content"
            }
        });
        Utils.build_tabs(pms_types_menu, tabs, pms_types_content);
    },

    draw: (pms)=>{
        let parent = document.getElementById("Filter PMs");
        let filter_pms = pms["filter_pms"];
        /** reset content **/
        parent.innerHTML = '';

        /** draw types menu **/
        FilterPMs.build_pm_types_tabs(parent, filter_pms);
    }
};