
let ChartBuilder = {


    format_data: (data)=>{
        let categories =  data.map((c_v)=>c_v["category"]);
        let series_data = data.map((c_v)=> {
            return {"name": c_v["category"], "y":c_v["value"], "color": c_v["color"]}
        });
        return {categories: categories, data: series_data}
    },

    bar_chart_builder: ()=>{
        let builder =  (parent_id, title, y_axis_title, limit, series_name, data)=>{
            let formatted_data = ChartBuilder.format_data(data);

            Highcharts.chart(parent_id, {
                chart: {
                    type: 'column',
                },
                credits:{
                    enabled:false
                },
                title: {
                    text: title
                },
                xAxis: {
                    categories: formatted_data.categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: y_axis_title
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series:  [
                    {
                        "name": series_name,
                        data: formatted_data.data
                    },
                    {
                        type: 'spline',
                        name: 'Limit',
                        data: limit
                    }
                ]
            });
        }

        return {
            builder: builder,
            make_bar: (category, value, color)=>{ return {"category": category, "value": value, "color": color} },
        }

    },

    time_series_chart_builder: ()=>{
        let builder =  (parent_id, title, y_axis_title, series)=>{
            Highcharts.chart(parent_id, {
                chart: {
                    type: 'spline',
                },
                credits:{
                    enabled:false
                },
                title: {
                    text: title
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: y_axis_title
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series:  series.map(serie => {
                   return {
                       "name": serie.name,
                       "data": serie.serie
                   }
                })
            });
        }

        return {
            builder: builder,
            make_serie: (name, serie)=>{ return {"name": name, "serie": serie} },
            make_point: (date, value)=> [date, value]
        }

    },

    stacked_bar_chart_builder: ()=>{
        let builder = (parent_id, title, y_axis_title, categories, data)=>{
            Highcharts.chart(parent_id, {

                chart: {
                    type: 'column'
                },

                title: {
                    text: title
                },
                credits:{
                    enabled:false
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: y_axis_title
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: data
            });
        };

        return {
            builder: builder,
            make_bar: (name, data, stack)=>{ return {"name": name, "data": data, "stack": stack} }
        }
    },

    pie_chart_builder: ()=>{

        let builder = (parent_id, title, data)=>{
            let formatted_data = ChartBuilder.format_data(data);
            Highcharts.chart(parent_id, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                credits:{
                    enabled:false
                },
                title: {
                    text: title
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    name: title,
                    colorByPoint: true,
                    data: formatted_data.data
                }]
            });
        };

        return {
            builder: builder,
            make_pie: (category, value)=>{ return {"category": category, "value": value} }
        }

    },



    /**
     * from https://www.highcharts.com/docs/chart-and-series-types/organization-chart
     *
     * In Highcharts, the organization chart resembles the sankey chart in the way it is built around nodes and links.
     *
     * The nodes of an org chart are the positions or persons,
     * while the links are the lines showing the relations between them.
     * The data structure of the options defines the links.
     *
     * In the nodes array of the series,
     * each node is identified by an id referring to the id in the link.
     *
     * Additional properties like title,
     * description and image may be set in the individual node options.
     * **/
    organization_chart_builder: ()=>{
        let builder = (parent_id, title, nodes, links, levels)=>{
            Highcharts.chart(parent_id, {
                chart: {
                    height: 600,
                    inverted: true
                },
                title: {
                    text: title
                },
                credits:{
                    enabled:false
                },
                accessibility: {
                    point: {
                        descriptionFormatter: function (point) {
                            let nodeName = point.toNode.name,
                                nodeId = point.toNode.id,
                                nodeDesc = nodeName === nodeId ? nodeName : nodeName + ', ' + nodeId,
                                parentDesc = point.fromNode.id;
                            return point.index + '. ' + nodeDesc + ', reports to ' + parentDesc + '.';
                        }
                    }
                },

                series: [{
                    type: 'organization',
                    name: 'Organization',
                    keys: ['from', 'to'],
                    data: links,
                    levels: levels,
                    nodes: nodes,
                    colorByPoint: false,
                    color: '#007ad0',
                    dataLabels: {
                        color: 'white'
                    },
                    borderColor: 'white',
                    nodeWidth: 65
                }],
                tooltip: {
                    outside: true
                },
                exporting: {
                    allowHTML: true,
                    sourceWidth: 800,
                    sourceHeight: 600
                }

            });
        }
        return {
            builder: builder,
            make_link : (from, to) => { return [from, to] },
            make_node : (id, title, name)=> { return { id: id, title: title, name: name } },
            make_level: (level, color)=> { return { level: level, color: color } }

        }
    }

};