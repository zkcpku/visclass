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

    var svg = d3.select(tag_id)
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

    var svg = d3.select(tag_id)
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

    return [svg_x,svg_y,svg,svg_tooltip];

}
function set_splitbar(bar_svgs, xbar, y_max, first_data, second_data, second_xbar, margin, svg_hw, tip_shift, tag_id, color) {
    var svgs = bar_svgs;
    var svg = svgs[2];
    var svg_tooltip = svgs[3];

    // 直接在原图上修改
    svgs[2].selectAll(".split_data") // 这个类名是下面设置的，目的是在更新图表时将原先的split rect给删除掉
        .remove()
    svgs[2].selectAll("rect")
        .data(first_data)
        .transition()
        .attr("x", (d, i) => svgs[0](xbar[i]))
        .attr("y", d => svgs[1](d))
        .attr("fill", (d, i) => color(xbar[i]))
        .attr("height", d => svgs[1](0) - svgs[1](d))
        .attr("width", svgs[0].bandwidth())
        .attr("opacity",1);
    svgs[2].selectAll("rect")
        .on("mouseover", function () {
            svgs[3].style('display', null);}) // 修复bug，在先点击成小块，再修改first_data变成大块的时候未恢复tooltip

    svg.selectAll("rect")
        .on("click", function (d, i) {

            // 设置所有原要素为透明
            var origin_bar = d3.select(this)
                .attr("opacity",0) // 设置透明
                .on("mouseover", function () {
                tooltip.style('display', "none");})

            var split_data = second_data[i];
            console.log(split_data);
            var new_xbar = second_xbar[i];
            console.log(new_xbar);

            var left_bound = parseFloat(d3.select(this).attr("x"));
            var right_bound = parseFloat(d3.select(this).attr("width")) + left_bound;
            // 定义新的x轴分割方法
            var new_x = d3.scaleBand()
                .domain(new_xbar)
                .range([left_bound, right_bound])
                .padding(0.1)
            // console.log(d3.mouse(this));

           var new_xAxis = g => g
                .attr("transform", `translate(0,${svg_hw.height - margin.bottom * 2})`) // 这里可以调整二级xbar的位置
                .call(d3.axisBottom(new_x).tickSizeOuter(0))
                .call(g => g.selectAll(".domain").remove())


            var new_g = svg.append("g")
                        .attr("transform","translate(0,0)")
                        .attr("class","split_data"); //设置一个class名，方便进行批量操作（比如批量删除）

            // 希望增加一个分裂成小块的动画效果，因此在这里进行修改
            // 基本逻辑：先产生多个和原高相同的小块，再进行transition，因此只要造一个fake_split_data就行了
            var fake_split_data = [];
            for (var i = 0; i < split_data.length; i++) {
                fake_split_data.push(d); // 和原方块的高 相同
            }
            new_g.selectAll("rect")
                .data(fake_split_data)
                .join("rect")
                // .transition()
                .attr("x",(d, i) => new_x(new_xbar[i]))
                .attr("y", d => svgs[1](d))
                .attr("fill", (d, i) => origin_bar.attr('fill'))
                .attr("height", d => svgs[1](0) - svgs[1](d))
                .attr("width", new_x.bandwidth())
                .attr("opacity",0) //fake块做成透明的，这样有渐变的感觉,还不容易卡bug被看到


            new_g.selectAll("rect")
                .data(split_data)
                .join("rect")
                .transition()
                .attr("x",(d, i) => new_x(new_xbar[i]))
                .attr("y", d => svgs[1](d))
                .attr("fill", (d, i) => origin_bar.attr('fill'))
                .attr("height", d => svgs[1](0) - svgs[1](d))
                .attr("width", new_x.bandwidth())
                .attr("opacity",1)
                // .attr("class",String(d3.select(this).attr("x")));
            new_g.append("g")
                .call(new_xAxis);

            var tooltip = svg.append("g")
                .style("display", "none")
            tooltip.append("text")
                .attr("x", 15)
                .attr("dy", "1.2em")
                .style("text-anchor", "middle")
                .attr("font-size", "30px")
                .attr("font-weight", "bold");

            var new_rects = new_g.selectAll("rect")
                            .on("mouseover", function () {
                            tooltip.style('display', null);})
                            .on("mouseout", function () {
                            tooltip.style('display', "none")})
                            .on("mousemove", function (d, i) {
                                var xPosition = d3.mouse(this)[0] - tip_shift.right;
                                var yPosition = d3.mouse(this)[1] - tip_shift.top;
                                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                                tooltip.select("text").text(new_xbar[i] + " : " + String(d));
                            })
                            .on("click", function(d, i)
                            {
                                origin_bar.transition()
                                .attr("opacity",1);
                                origin_bar
                                .on("mouseover", function () {
                                    svgs[3].style('display', null);})

                                tooltip.remove()
                                new_g.remove();
                            })

        })


    return svgs 

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
    var svg3_y_max = d3.max(data, d => d3.max(d3.values(d).slice(1,-1)));
    var svg2_xy = draw_bar(svg2_xbar, svg2_y_max, each_data, margin, svg2_hw, tip_shift, "#bar-2", color);
    var svg3_xy = draw_bar(svg2_xbar, svg3_y_max, each_data, margin, svg2_hw, tip_shift, "#bar-3", color);

    

    // 绑定第一个图标的按键
    d3.select("#bar-1")
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
                            .attr("width", svg2_xy[0].bandwidth())
                            .attr("opacity",1);

                        //初始化一个测试用的data
                        var all_xbar = "abcdefghijklmnopqrstuvwxyz";
                        var second_data = [];
                        var second_xbar = [];
                        for (var ii = 0; ii < new_each_data.length; ii++) {
                            var this_data = [];
                            var this_xbar = [];
                            for (var jj = 0; jj < ii + 2; jj++) {
                                this_data.push(new_each_data[ii] / (jj + 2));
                                this_xbar.push(all_xbar[jj]);
                            }
                            second_data.push(this_data);
                            second_xbar.push(this_xbar);
                        }

                         svg3_xy = set_splitbar(svg3_xy, svg2_xbar, svg3_y_max, new_each_data, second_data, second_xbar,margin, svg2_hw, tip_shift, "#bar-3", color);

                        
                        }
                    }
                })


    });
var tmp;