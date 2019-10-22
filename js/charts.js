var svg_height = 1200;
var svg_width = 1200;
var svg2_height = 600;
var svg2_width = 1200;
var margin = ({top: 10, right: 10, bottom: 20, left: 40});
var tip_shift = ({top:50, right: 50});
var OPACITY_SUM = 1 + 0.2;

var state_age_data = d3.csv("data/us-population-state-age.csv", (d, i, columns) => (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d))
    .then(function(data)
    {
        console.log(data);
        series = d3.stack().keys(data.columns.slice(1))(data) //选择从1到结尾的columns,并按年龄堆叠起来
        console.log(series)

        var x = d3.scaleBand() // 创建一个序数比例尺
            .domain(data.map(d => d.name))
            .range([margin.left, svg_width - margin.right])
            .padding(0.1)


        var y = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
            .rangeRound([svg_height - margin.bottom, margin.top])


        var color = d3.scaleOrdinal()
            .domain(series.map(d => d.key))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), series.length).reverse())
            .unknown("#ccc")


        var xAxis = g => g
            .attr("transform", `translate(0,${svg_height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove())

        var yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove())

        const svg = d3.select("#bar-1")
            .append("svg")
            .attr("viewBox", [0, 0, svg_width, svg_height]);

        
        svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
              .attr("fill", d => color(d.key)) // 设置不同的g，来修改不同的颜色，因为注意到series中的key是颜色标识
            .selectAll("rect") // 长方形
            .data(d => d)
            .join("rect")
              .attr("x", (d, i) => x(d.data.name))
              .attr("y", d => y(d[1]))
              .attr("height", d => y(d[0]) - y(d[1]))
              .attr("width", x.bandwidth())
              .attr("class", d => String(d.data.name)) // 每一列，按x的值设定一个class 
              .attr("opacity", 1);
        svg.append("g")
              .call(xAxis);

        svg.append("g")
              .call(yAxis);

        var tooltip = svg.append("g")
            .attr("class", "d3-tip")
            .style("display", "none");

        // tooltip.append("rect")
        //     .attr("width", 30)
        //     .attr("height", 20)
        //     .attr("fill", "white")
        //     .style("opacity", 0.5);

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "30px")
            .attr("font-weight", "bold");

        var rects = svg
            // .select('svg')
            .selectAll('rect')
            .on("mouseover", function () {
                tooltip.style('display', null);})
            .on("mouseout", function () {
                tooltip.style('display', "none")})
            .on("mousemove", function (d) {
                var xPosition = d3.mouse(this)[0] - tip_shift.right;
                var yPosition = d3.mouse(this)[1] - tip_shift.top;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                // console.log(d);
                tooltip.select("text").text(d[1] - d[0]);
            })
            .on("click", function (d, i) {
                // console.log(d.data['name']);
                console.log(d3.mouse(this));
                console.log(this);
                var old_opacity = d3.selectAll("."+d3.select(this).attr('class'))
                        .attr("opacity");
                console.log(old_opacity);
                var column_e = d3.selectAll("."+d3.select(this).attr('class'))
                        .attr("opacity",OPACITY_SUM - old_opacity);
                // d3.select(this).attr('class');
                console.log(d3.select(this).attr('opacity') == OPACITY_SUM - 1);
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['name'] == d.data['name']) {
                        // console.log(data[i]);
                        new_each_state_data = data[i];
                        new_each_state_data = d3.values(new_each_state_data).slice(1,-1);
                        
                        // each_state_data = new_each_state_data;
                        if (d3.select(this).attr('opacity') == OPACITY_SUM - 1) {
                            for (var j = 0; j < new_each_state_data.length; j++) {
                                each_state_data[j] += new_each_state_data[j];
                            }
                            sum_state_name += [' '+d.data['name']];
                        }
                        else{
                            for (var j = 0; j < new_each_state_data.length; j++) {
                                each_state_data[j] -= new_each_state_data[j];
                            }
                            sum_state_name = sum_state_name.replace(' '+d.data['name'],'');
                        }

                        svg2_text = d3.select("#bar-2-text")
                                        .transition()
                                        .text(sum_state_name);





                        svg2.selectAll("rect") // 长方形
                            // .transition()
                            .data(each_state_data)
                            .transition()
                            .attr("x", (d, i) => svg2_x(svg2_xbar[i]))
                            .attr("y", d => svg2_y(d))
                            .attr("fill", (d, i) => color(svg2_xbar[i]))
                            .attr("height", d => svg2_y(0) - svg2_y(d))
                            .attr("width", svg2_x.bandwidth());

                        console.log("svg2_data:",svg2.selectAll("rect").data());
                    }
                }
            })



        console.log(rects);
        // console.log(data);
        




        // tmp_data = data;
        // tmp = data[0];
        const svg2_xbar = d3.keys(data[0]).slice(1, -1);
        // ["<10", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "≥80"]
        var sum_state_name = "states : ";
        var svg2_text = d3.select("#bar-2-text").text(sum_state_name);
        var each_state_data = data[0];

        each_state_data = d3.values(each_state_data).slice(1,-1);
        for (var i = 0; i < each_state_data.length; i++) {
            each_state_data[i] = 0;
        }
        // each_state_data;
        var svg2_x = d3.scaleBand()
                .domain(svg2_xbar)
                .range([margin.left, svg2_width - margin.right])
                .padding(0.1)
        var svg2_y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d3.max(d3.values(d).slice(1)))])
                .rangeRound([svg2_height - margin.bottom, margin.top])

        console.log(d3.max(data, d => d3.max(d3.values(d).slice(1,-1))))
        const svg2 = d3.select("#bar-2")
            .append("svg")
            .attr("viewBox", [0, 0, svg2_width, svg2_height]);
        svg2.selectAll("rect") // 长方形
            .data(each_state_data)
            .join("rect")
                .attr("x", (d, i) => svg2_x(svg2_xbar[i]))
                .attr("y", d => svg2_y(d))
                .attr("fill", (d, i) => color(svg2_xbar[i]))
                .attr("height", d => svg2_y(0) - svg2_y(d))
                .attr("width", svg2_x.bandwidth());

        var svg2_tooltip = svg2.append("g")
            .attr("class", "d3-tip")
            .style("display", "none");
        // svg2_tooltip.append("rect")
        //     .attr("width", 30)
        //     .attr("height", 20)
        //     .attr("fill", "white")
        //     .style("opacity", 0.5);
        svg2_tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "30px")
            .attr("font-weight", "bold");

        var svg2_rects = svg2.selectAll("rect")
                            .on("mouseover", function () {
                                svg2_tooltip.style('display', null);})
                            .on("mouseout", function () {
                                svg2_tooltip.style('display', "none")})
                            .on("mousemove", function (d) {
                                var xPosition = d3.mouse(this)[0] - tip_shift.right;
                                var yPosition = d3.mouse(this)[1] - tip_shift.top;
                                svg2_tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                                console.log(d);
                                svg2_tooltip.select("text").text(d);
                            })
                            .on("click", function (d, i) {
                                console.log(d3.mouse(this));
                            })


        var xAxis = g => g
            .attr("transform", `translate(0,${svg2_height - margin.bottom})`)
            .call(d3.axisBottom(svg2_x).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove())
        var yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(svg2_y).ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove())
        svg2.append("g")
            .call(xAxis);
        svg2.append("g")
            .call(yAxis);


    });

var tmp;
var tmp_data;