const SHARED_DIR = "http://isshweb.intel.com/isAnalysis$/1274_MAODATA/Config/DryEtch/LEAD/XCL/XCL_Dots_Data/Reports/AnalysisWorkFlow/FrontEnd/RCL/Config/";
const LOCAL_DIR = "http://localhost:63342/TGRFrontEnd/Reports/Config/JSON/";

let ConfigManager = {

    config_dir: LOCAL_DIR,

    read_json: (config, cont)=>{
        $.getJSON(ConfigManager.config_dir + config + ".json?"+(new Date()).getTime(), cont);
    }

};