
let ChartBuilder = {


    format_data: (data)=>{
        let categories =  data.map((c_v)=>c_v["category"]);
        let series_data = data.map((c_v)=> {
            return {"name": c_v["category"], "y":c_v["value"], "color": c_v["color"]}
        });
        return {categories: categories, data: series_data}
    },

    bar_chart_builder: ()=>{
        let builder =  (parent_id, title, y_axis_title, series_name, data)=>{
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
                    }
                ]
            });
        }

        return {
            builder: builder,
            make_bar: (category, value, color)=>{ return {"category": category, "value": value, "color": color} }
        }

    },

    stacked_bar_chart_builder: ()=>{
        let builder = (parent_id, title, y_axis_title, categories, data)=>{
            console.log(data)
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

    organization_chart_builder: ()=>{

    }

};