var margin = ({top: 10, right: 10, bottom: 20, left: 40});
var tip_shift = ({top:50, right: 50});
var OPACITY_SUM = 1 + 0.2;
svg_hw = {height: 1200, width : 1200};
svg2_hw = {height: 600, width : 1200};

function draw_stackbar(data, margin, svg_hw, tip_shift, tag_id){
    console.log(data);
    var series = d3.stack().keys(data.columns.slice(1))(data) //选择从1到结尾的columns,并按年龄堆叠起来
    console.log(series)

    var color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), series.length).reverse())
    .unknown("#ccc")

    var x = d3.scaleBand() // 创建一个序数比例尺
    .domain(data.map(d => d.name))
    .range([margin.left, svg_hw.height - margin.right])
    .padding(0.1)


    var y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .rangeRound([svg_hw.height - margin.bottom, margin.top])




    var xAxis = g => g
    .attr("transform", `translate(0,${svg_hw.height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())

    var yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.selectAll(".domain").remove())

    const svg = d3.select(tag_id)
    .append("svg")
    .attr("viewBox", [0, 0, svg_hw.width, svg_hw.height]);


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
        // .attr("class", "d3-tip")
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


    return color;

}
function draw_bar(xbar,y_max,only_data, margin, svg_hw, tip_shift, tag_id ,color){
    // xbar: ["<10", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "≥80"]
    // 
    var svg_x = d3.scaleBand()
        .domain(xbar)
        .range([margin.left, svg_hw.width - margin.right])
        .padding(0.1)
    var svg_y = d3.scaleLinear()
        .domain([0, y_max])
        .rangeRound([svg_hw.height - margin.bottom, margin.top])

    const svg = d3.select(tag_id)
        .append("svg")
        .attr("viewBox", [0, 0, svg_hw.width, svg_hw.height]);
    svg.selectAll("rect") // 长方形
    .data(only_data)
    .join("rect")
    .attr("x", (d, i) => svg_x(xbar[i]))
    .attr("y", d => svg_y(d))
    .attr("fill", (d, i) => color(xbar[i]))
    .attr("height", d => svg_y(0) - svg_y(d))
    .attr("width", svg_x.bandwidth());

    var svg_tooltip = svg.append("g")
    // .attr("class", "d3-tip")
        .style("display", "none");
    // svg2_tooltip.append("rect")
    //     .attr("width", 30)
    //     .attr("height", 20)
    //     .attr("fill", "white")
    //     .style("opacity", 0.5);
    svg_tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("font-weight", "bold");

    var svg_rects = svg.selectAll("rect")
        .on("mouseover", function () {
            svg_tooltip.style('display', null);})
        .on("mouseout", function () {
            svg_tooltip.style('display', "none")})
        .on("mousemove", function (d) {
            var xPosition = d3.mouse(this)[0] - tip_shift.right;
            var yPosition = d3.mouse(this)[1] - tip_shift.top;
            svg_tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            svg_tooltip.select("text").text(d);
        })
        .on("click", function (d, i) {
            console.log(d3.mouse(this));
        })


    var xAxis = g => g
        .attr("transform", `translate(0,${svg_hw.height - margin.bottom})`)
        .call(d3.axisBottom(svg_x).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove())
    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(svg_y).ticks(null, "s"))
        .call(g => g.selectAll(".domain").remove())
    svg.append("g")
    .call(xAxis);
    svg.append("g")
    .call(yAxis);

    return [svg_x,svg_y];

}

var state_age_data = d3.csv("data/us-population-state-age.csv", (d, i, columns) => (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d))
    .then(function(data){
    var color = draw_stackbar(data, margin, svg_hw, tip_shift, '#bar-1');
    // svg2各个参数进行初始化
    var each_data = d3.values(data[0]).slice(1,-1);
    var svg2_xbar = d3.keys(data[0]).slice(1, -1);
    for (var i = 0; i < each_data.length; i++) {
        each_data[i] = 0;
    }
    
    var sum_state_name = "states : ";
    d3.select("#bar-2-text")
        .transition()
        .text(sum_state_name);
                        
    var svg2_y_max = d3.max(data, d => d3.max(d3.values(d).slice(1)));
    var svg2_xy = draw_bar(svg2_xbar, svg2_y_max, each_data, margin, svg2_hw, tip_shift, "#bar-2", color);

    // 绑定第一个图标的按键
    var svg_rects = d3.select("#bar-1")
            .selectAll("rect")
            .on("click", function (d, i) {
                var old_opacity = d3.selectAll("."+d3.select(this).attr('class'))
                .attr("opacity");
                var column_e = d3.selectAll("."+d3.select(this).attr('class'))
                .attr("opacity",OPACITY_SUM - old_opacity);
                // d3.select(this).attr('class');
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['name'] == d.data['name']) {
                        // console.log(data[i]);
                        new_each_data = data[i];
                        new_each_data = d3.values(new_each_data).slice(1,-1);
                        
                        // each_state_data = new_each_data;
                        if (d3.select(this).attr('opacity') == OPACITY_SUM - 1) {
                            for (var j = 0; j < new_each_data.length; j++) {
                                each_data[j] += new_each_data[j];
                            }
                            sum_state_name += [' '+d.data['name']];
                        }
                        else{
                            for (var j = 0; j < new_each_data.length; j++) {
                                each_data[j] -= new_each_data[j];
                            }
                            sum_state_name = sum_state_name.replace(' '+d.data['name'],'');
                        }
                        d3.select("#bar-2-text")
                            .transition()
                            .text(sum_state_name);
                        var svg2 = d3.select("#bar-2");
                        svg2.selectAll("rect") // 长方形
                            // .transition()
                            .data(each_data)
                            .transition()
                            .attr("x", (d, i) => svg2_xy[0](svg2_xbar[i]))
                            .attr("y", d => svg2_xy[1](d))
                            .attr("fill", (d, i) => color(svg2_xbar[i]))
                            .attr("height", d => svg2_xy[1](0) - svg2_xy[1](d))
                            .attr("width", svg2_xy[0].bandwidth());
                        }
                    }
                })
    });
