var margin = ({top: 10, right: 10, bottom: 20, left: 40});
var tip_shift = ({top:20, right: 20});
var OPACITY_SUM = 1 + 0.2;
svg_hw = {height: 300, width : 1200};
svg2_hw = {height: 300, width : 600};
tooltip_size = {font_size: '10px',x:15,dy:'1.2em'};


var write_bar_1_text = function (jin_e, include){
    var bar_1_text = '表1:';
    if (include == '') {
        bar_1_text = '表1';
    }
    else{
        bar_1_text  = bar_1_text + '<b>' + include + '</b>'+ '项目按申请与资助情况统计' + '(' + jin_e + ')';
    }


    d3.select('#bar-1-text').html(bar_1_text);
}

var write_bar_2_text = function (jin_e, include){
    var bar_2_text = '表2:';

    bar_2_text  = bar_2_text + '<b>面上、地区、重点</b>三类基金总统计' + '(' + jin_e + ')';


    d3.select('#bar-2-text').html(bar_2_text);
}

var write_bar_3_text = function (jin_e, include){
    var bar_3_text = '表3:';
    if (include == '') {
        bar_3_text = '表3';
    }
    else{
        bar_3_text  = bar_3_text + '<b>' + include + '</b>' + '基金申请者年龄统计';
    }


    d3.select('#bar-3-text').html(bar_3_text);
}


var bar_1_include = '';
var bar_2_include = '';
var bar_3_include = '';


function draw_stackbar(data, margin, svg_hw, tip_shift, tag_id){
    // console.log(data);
    var series = d3.stack().keys(data.columns.slice(1))(data) //选择从1到结尾的columns,并按年龄堆叠起来
    // console.log(series)

    var color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), series.length).reverse())
    .unknown("#ccc")

    var x = d3.scaleBand() // 创建一个序数比例尺
    .domain(data.map(d => d.name))
    .range([margin.left, svg_hw.width - margin.right])
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
    .attr('class','yAxis')
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
        .attr("class", d => String(d.key))
        .selectAll("rect") // 长方形
        .data(d => d)

    .join("rect")
        .attr("x", function(d,i) {return x(d.data.name);})
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
        .attr("x", tooltip_size.x)
        .attr("dy", tooltip_size.dy)
        .style("text-anchor", "middle")
        .attr("font-size", tooltip_size.font_size)
        .attr("font-weight", "bold");

    var rects = svg
            // .select('svg')
        .selectAll('rect')
        .on("mouseover", function () {
                tooltip.style('display', null);})
        .on("mouseout", function () {
                tooltip.style('display', "none")})
        .on("mousemove", function (d,i) {
            var xPosition = d3.mouse(this)[0] - tip_shift.right;
            var yPosition = d3.mouse(this)[1] - tip_shift.top;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            // console.log();
            // console.log(i);
            tooltip.select("text").text(d.data.name +' ' + String(d3.select(this.parentNode).attr("class")) + ' : '+ String(d[1] - d[0]));
        })


    return {'x':x,'y':y,'svg':svg,'tooltip':tooltip,'color':color};

}

// 用于绘制两个图案，控制颜色
function draw_stackbar2(data, margin, svg_hw, tip_shift, tag_id){
    // console.log(data);
    var series = d3.stack().keys(data.columns.slice(1))(data) //选择从1到结尾的columns,并按年龄堆叠起来
    // console.log(series)

    var color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), series.length).reverse())
    .unknown("#ccc")


    var color = function (name) {
        if (name.slice(0,2) == '批准') {
            return 'rgb(160, 218, 215)';
        }
        else {
            return 'rgb(115, 175, 212)';
        }
        // 受理申请项数
        // 批准资助项数

    }

    var x = d3.scaleBand() // 创建一个序数比例尺
    .domain(data.map(d => d.name))
    .range([margin.left, svg_hw.width - margin.right])
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
    .attr('class','yAxis')
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.selectAll(".domain").remove())

    var svg = d3.select(tag_id)
    .append("svg")
    .attr("viewBox", [0, 0, svg_hw.width, svg_hw.height]);


    svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
        .attr("fill", function(d) {return color(d.key);}) // 设置不同的g，来修改不同的颜色，因为注意到series中的key是颜色标识
        .attr("class", d => String(d.key))
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
        .attr("x", tooltip_size.x)
        .attr("dy", tooltip_size.dy)
        .style("text-anchor", "middle")
        .attr("font-size", tooltip_size.font_size)
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
            tooltip.select("text").text(d.data.name +' ' + String(d3.select(this.parentNode).attr("class")) + ' : '+ String(d[1] - d[0]));
        })


    return {'x':x,'y':y,'svg':svg,'tooltip':tooltip,'color':color};

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
        .attr("x", tooltip_size.x)
        .attr("dy", tooltip_size.dy)
        .style("text-anchor", "middle")
        .attr("font-size", tooltip_size.font_size)
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
                .attr("x", tooltip_size.x)
                .attr("dy", tooltip_size.dy)
                .style("text-anchor", "middle")
                .attr("font-size", tooltip_size.font_size)
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
                                // tooltip.select("text").text(new_xbar[i] + " : " + String(d));
                                tooltip.select("text").html("<tspan x='0' dy='1.2em'>" + new_xbar[i] + " : </tspan><tspan x='0' dy='1.2em'>" + String(d) + "</tspan>");
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


    return svgs;

}

function change_split_stackbar(bar_svgs, first_data, margin,svg_hw,tip_shift){
    first_data = d3.stack().keys(first_data.columns.slice(1))(first_data);
    var svgs = bar_svgs;
    var svg = svgs['svg'];

    var svg_tooltip = svgs['tooltip'];

    // 直接在原图上修改
    // console.log(first_data);
    // console.log(d3.max(first_data, d => d3.max(d, d => d[1])));
    var y = d3.scaleLinear()
    .domain([0, d3.max(first_data, d => d3.max(d, d => d[1]))])
    .rangeRound([svg_hw.height - margin.bottom, margin.top])

    svgs['y'] = y;

    svg.selectAll(".split_data") // 这个类名是下面设置的，目的是在更新图表时将原先的split rect给删除掉
        .remove()



    svg.select('g')
        .selectAll('g')
        .data(first_data)
        // .transition()
        //     .attr("fill",d => svgs['color'](d.key))
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .transition()
            .attr("x", (d, i) => svgs['x'](d.data.name))
            .attr("y", (d) => svgs['y'](d[1]))
            .attr("height", function(d) {return svgs['y'](d[0]) - svgs['y'](d[1]);})
            .attr("width", svgs['x'].bandwidth())
            .attr("class", d => String(d.data.name))
            .attr("opacity", 1);


    var yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .attr("class",'yAxis')
            .call(d3.axisLeft(svgs['y']).ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove())


    if (d3.max(first_data, d => d3.max(d, d => d[1])) > 0) {
        svg.selectAll(".yAxis")
        // .transition()
        .remove()

         svg.append("g")
        .transition()
        .call(yAxis);
    }

    return svgs;
}
function set_split_stackbar(bar_svgs, first_data, second_data, margin, svg_hw, tip_shift){
    // first_data对应的是stackbar中的series
    // second_data使用字典形式，key为first_data中的类名
    first_data = d3.stack().keys(first_data.columns.slice(1))(first_data);
    var svgs = bar_svgs;
    var svg = svgs['svg'];

    var svg_tooltip = svgs['tooltip'];

    // 直接在原图上修改
    // console.log(first_data);
    // console.log(d3.max(first_data, d => d3.max(d, d => d[1])));
    var y = d3.scaleLinear()
    .domain([0, d3.max(first_data, d => d3.max(d, d => d[1]))])
    .rangeRound([svg_hw.height - margin.bottom, margin.top])

    svgs['y'] = y;

    svg.selectAll(".split_data") // 这个类名是下面设置的，目的是在更新图表时将原先的split rect给删除掉
        .remove()



    svg.select('g')
        .selectAll('g')
        .data(first_data)
        // .transition()
        //     .attr("fill",d => svgs['color'](d.key))
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .transition()
            .attr("x", (d, i) => svgs['x'](d.data.name))
            .attr("y", (d) => svgs['y'](d[1]))
            .attr("height", function(d) {return svgs['y'](d[0]) - svgs['y'](d[1]);})
            .attr("width", svgs['x'].bandwidth())
            .attr("class", d => String(d.data.name))
            .attr("opacity", 1);


    var yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .attr("class",'yAxis')
            .call(d3.axisLeft(svgs['y']).ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove())


    if (d3.max(first_data, d => d3.max(d, d => d[1])) > 0) {
        svg.selectAll(".yAxis")
        // .transition()
        .remove()

         svg.append("g")
        .transition()
        .call(yAxis);
    }
   


    svg.selectAll("rect")
        .on("mouseover", function () {
            svgs['tooltip'].style('display', null);}) // 修复bug，在先点击成小块，再修改first_data变成大块的时候未恢复tooltip

    svg.selectAll("rect")
        .on("click", function (d, i) {
            // 设置原列为透明
            var column_e = svg.selectAll("."+d3.select(this).attr('class'))
                .attr("opacity",0)
                .on("mouseover", function() {
                    tooltip.style('display',"none");
                })

            var split_data = second_data[d3.select(this).attr('class')];
            var split_series = d3.stack().keys(split_data.columns.slice(1))(split_data);
            // console.log(split_data);
            // console.log(new_xbar);

            var left_bound = parseFloat(d3.select(this).attr("x"));
            var right_bound = parseFloat(d3.select(this).attr("width")) + left_bound;
            // 定义新的x轴分割方法
            var new_x = d3.scaleBand()
                .domain(split_data.map(d => d.name))
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
            // var fake_split_data = [];
            // for (var i = 0; i < split_data.length; i++) {
            //     fake_split_data.push(d); // 和原方块的高 相同
            // }
            new_g.append('g')
                .selectAll("g")
                .data(split_series)
                .join("g")
                    .attr("fill", d=>svgs['color'](d.key))
                    .attr("class", d=>String(d.key))
                    .selectAll("rect")
                    .data(d => d)
                .join("rect")
                    .attr("x", (d, i) => new_x(d.data.name))
                    .attr("y", d => svgs['y'](d[1]))
                    .attr("height", d=> svgs['y'](d[0]) - svgs['y'](d[1]))
                    .attr('width', new_x.bandwidth())
                    .attr("class", d=> String(d.data.name))
                    .attr("opacity",1);

                // .attr("class",String(d3.select(this).attr("x")));
            // new_g.append("g")
            //     // .transition()
            //     .call(new_xAxis);


            var tooltip = svg.append("g")
                .style("display", "none")
            tooltip.append("text")
                .attr("x", tooltip_size.x)
                .attr("dy", tooltip_size.dy)
                .style("text-anchor", "middle")
                .attr("font-size", tooltip_size.font_size)
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
                                // tooltip.select("text").text(new_xbar[i] + " : " + String(d));
                                // console.log(d);
                                tooltip.select("text").text(d.data.name +' ' + String(d3.select(this.parentNode).attr("class")) + ' : '+ String(d[1] - d[0]));
                            })
                            .on("click", function(d, i)
                            {
                                column_e.transition()
                                .attr("opacity",1);
                                column_e
                                .on("mouseover", function () {
                                    svgs['tooltip'].style('display', null);})

                                tooltip.remove()
                                new_g.remove();
                            })
        })


    return svgs;
}

var draw_one_pic = function (name){
    var another_name;
    // ["name", "受理申请项数", "受理申请金额", "批准资助项数", "批准资助金额"]

    var this_columns;
    if (name == '金额') {
        another_name = '项数';
        this_columns = ["name","受理申请金额", "批准资助金额"];
    }
    else{
        another_name = '金额';
        this_columns = ["name", "受理申请项数", "批准资助项数"];
    }




    d3.csv("data/mianshang_age.csv", (d ,i ,columns)=> (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d))
    .then(function(mianshang_age_data){

    d3.csv("data/diqu_age.csv", (d ,i ,columns)=> (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d))
    .then(function(diqu_age_data){

    d3.csv("data/zhongdian_age.csv", (d ,i ,columns)=> (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d))
    .then(function(zhongdian_age_data){

    d3.csv("data/mianshang.csv", (d ,i ,columns)=> (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d))
        .then(function(mianshang_data){
            // console.log(mianshang_data);
            for (var mianshang_i in mianshang_data) {
                // console.log(mian_i);
                if (mianshang_i == 'columns') {continue;}
                for (var mianshang_j in mianshang_data[mianshang_i]) {
                    // console.log(mianshang_j.slice(-2) == another_name);
                    if (mianshang_j.slice(-2) == another_name) {delete mianshang_data[mianshang_i][mianshang_j];}
                }
            }
            mianshang_data['columns'] = this_columns;
            // console.log(mianshang_data);

    d3.csv("data/diqu.csv", (d ,i ,columns)=> (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d))
        .then(function(diqu_data){
            for (var diqu_i in diqu_data) {
                // console.log(mian_i);
                if (diqu_i == 'columns') {continue;}
                for (var diqu_j in diqu_data[diqu_i]) {
                    // console.log(diqu_j.slice(-2) == another_name);
                    if (diqu_j.slice(-2) == another_name) {delete diqu_data[diqu_i][diqu_j];}
                }
            }
            diqu_data['columns'] = this_columns;

    d3.csv("data/zhongdian.csv", (d ,i ,columns)=> (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d))
        .then(function(zhongdian_data){
            for (var zhongdian_i in zhongdian_data) {
                // console.log(mian_i);
                if (zhongdian_i == 'columns') {continue;}
                for (var zhongdian_j in zhongdian_data[zhongdian_i]) {
                    // console.log(zhongdian_j.slice(-2) == another_name);
                    if (zhongdian_j.slice(-2) == another_name) {delete zhongdian_data[zhongdian_i][zhongdian_j];}
                }
            }
            zhongdian_data['columns'] = this_columns;

    d3.csv("data/total.csv", (d ,i ,columns)=> (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d))
        .then(function(total_data){

            for (var total_i in total_data) {
                // console.log(mian_i);
                if (total_i == 'columns') {continue;}
                for (var total_j in total_data[total_i]) {
                    // console.log(total_j.slice(-2) == another_name);
                    if (total_j.slice(-2) == another_name) {delete total_data[total_i][total_j];}
                }
            }
            total_data['columns'] = this_columns;
            // console.log(total_data);


            // console.log(mianshang_data,diqu_data,zhongdian_data,total_data);
            write_bar_2_text(name,'');
            write_bar_1_text(name,bar_1_include);
            write_bar_3_text(name,bar_3_include);
            var svg1_s = draw_stackbar2(total_data, margin, svg2_hw, tip_shift, '#bar-2');

            var generateEachTotal = function(all_data,total_data_column = ["name", "受理申请项数", "受理申请金额", "批准资助项数", "批准资助金额"],each_total_index = [0,6,16,25,34,44,49,54]){
                var rst = [];
                for (var each_index = 0; each_index < each_total_index.length; each_index++) {
                    if (rst.length == 0) {
                        rst = all_data.slice(each_total_index[each_index],each_total_index[each_index] + 1);
                    }
                    else{
                        rst = rst.concat(all_data.slice(each_total_index[each_index],each_total_index[each_index] + 1));
                    }
                }
                rst['columns'] = total_data_column;
                return rst;
            }

            var generateSecond = function(all_data,total_data_column = ["name", "受理申请项数", "受理申请金额", "批准资助项数", "批准资助金额"],each_total_index = [0,6,16,25,34,44,49,54]){
                var rst = [];
                for (var each_index = 0; each_index < each_total_index.length; each_index++) {
                    var now_index = each_total_index[each_index];
                    var next_index;
                    if (each_index != each_total_index.length - 1) {
                        next_index = each_total_index[each_index + 1];
                    }
                    else{
                        next_index = all_data.length;
                    }

                    if (rst.length == 0) {
                        rst = {};
                    }
                        rst[all_data[now_index].name] = all_data.slice(now_index + 1, next_index);
                        rst[all_data[now_index].name]['columns'] = total_data_column;
                        
                }
                return rst;
            }

            var deepClone = function (obj) {
                  var _obj = JSON.stringify(obj),
                    objClone = JSON.parse(_obj);
                  return objClone;
                }

            var add_total_data = function (total_data, add, sub=false){
                for(var i in add){
                    if (i == 'columns') {continue;}
                    for(var k in total_data[i]){
                        if (k == 'name') {continue;}
                        if (sub) {
                            total_data[i][k] -= add[i][k];
                        }
                        else{
                            total_data[i][k] += add[i][k];
                        }
                        total_data[i][k] = Math.round(total_data[i][k]*1000)/1000;
                        
                    }
                }
                return total_data;
            }

            var add_second_data = function(total_data, add, sub = false)
            {
                for(var i in add){
                    for(var k in add[i]){
                        if (k == 'columns') {continue;}
                        for (var j in total_data[i][k]) {
                            if (j == 'name') {continue;}
                            if (sub) {
                                total_data[i][k][j] -= add[i][k][j];
                            }
                            else{
                                total_data[i][k][j] += add[i][k][j];
                            }
                            total_data[i][k][j] = Math.round(total_data[i][k][j]*1000)/1000;
                        }
                    }
                }
                return total_data;
            }

            var generateAge = function(origin_data)
            {
                return origin_data;
            }

            
            total_datas = {'面上':generateEachTotal(mianshang_data),
                        '地区':generateEachTotal(diqu_data),
                        '重点':generateEachTotal(zhongdian_data)};
            second_datas = {'面上':generateSecond(mianshang_data),
                        '地区':generateSecond(diqu_data),
                        '重点':generateSecond(zhongdian_data)};

            age_datas = {'面上':generateAge(mianshang_age_data),
                        '地区':generateAge(diqu_age_data),
                        '重点':generateAge(zhongdian_age_data)};
            // console.log(second_datas);
            // console.log(total_datas);

            var total_data_now = deepClone(generateEachTotal(mianshang_data));
            for(var _ in total_data_now){
                for(var k in total_data_now[_]){
                    if (k == 'name') {continue;}
                    total_data_now[_][k] = 0;
                }
            }
            total_data_now['columns'] = this_columns;
            

            var second_data_now = deepClone(generateSecond(zhongdian_data));
            for (var _ in second_data_now) {
                // console.log(_);
                for (var k in second_data_now[_]) {
                    for (var j in second_data_now[_][k]) {
                        if (j == 'name') {continue;}
                        second_data_now[_][k][j] = 0;
                    }
                }

                second_data_now[_]['columns'] = this_columns;
            }
            // console.log(second_data_now);

            var age_data_now = deepClone(generateAge(zhongdian_age_data));
            for (var _ in age_data_now) {
                // console.log(_);
                for(var k in age_data_now[_]){
                    if (k == 'name') {continue;}
                    age_data_now[_][k] = 0;
                }
            }
            age_data_now['columns'] = ["name", "<=25", "26-30", "31-35", "36-40", "41-45", "46-50", "51-55", "56-60", "61-65", "66-70", "71-200"];
            // console.log(diqu_age_data['columns']);
            // console.log(age_datas,age_data_now);


            /*
            {
                total_data_now = add_total_data(total_data_now, generateEachTotal(mianshang_data));
                total_data_now = add_total_data(total_data_now, generateEachTotal(diqu_data));
                total_data_now = add_total_data(total_data_now, generateEachTotal(zhongdian_data));
                console.log(total_data_now);
                console.log(d3.max(total_data_now, d => d3.max(d3.values(d).slice(1))));  
            }
            //2619051.7299999995}
            */
            // var svg2_y_max = 2620000;
            var svg2_s = draw_stackbar2(total_data_now,margin,svg_hw,tip_shift,"#bar-1",svg1_s['color']);
            var svg3_s = draw_stackbar(age_data_now,margin,svg2_hw,tip_shift,"#bar-3",svg1_s['color']);
            d3.select("#bar-2")
                .selectAll("rect")
                .on("click", function(d,i){
                    var old_opacity = d3.selectAll("."+d3.select(this).attr('class'))
                    .attr("opacity");
                    var column_e = d3.selectAll("."+d3.select(this).attr('class'))
                    .attr("opacity",OPACITY_SUM - old_opacity);
                    // console.log(d3.select(this).attr('class'));
                    // console.log(total_datas[d3.select(this).attr('class')]);
                    if (d3.select(this).attr('opacity') == OPACITY_SUM - 1) {
                        bar_1_include = bar_1_include + d3.select(this).attr('class') + ' ';
                        write_bar_1_text(name,bar_1_include);
                        total_data_now = add_total_data(total_data_now, total_datas[d3.select(this).attr('class')]);
                        second_data_now = add_second_data(second_data_now, second_datas[d3.select(this).attr('class')]);
                        // sum_state_name += [' '+d.data['name']];
                    }
                    else{
                        bar_1_include = bar_1_include.replace(d3.select(this).attr('class') + ' ','');
                        write_bar_1_text(name,bar_1_include);
                        second_data_now = add_second_data(second_data_now, second_datas[d3.select(this).attr('class')],sub=true);
                        total_data_now = add_total_data(total_data_now, total_datas[d3.select(this).attr('class')],sub=true);
                        // sum_state_name = sum_state_name.replace(' '+d.data['name'],'');
                    }
                    // console.log(total_data_now);
                    // console.log(total_datas[d3.select(this).attr('class')]);
                    // svg2_s['svg'].remove();
                    // svg2_s = draw_stackbar(total_data_now,margin,svg2_hw,tip_shift,"#bar-2",svg1_s['color']);
                    svg2_s = set_split_stackbar(svg2_s, total_data_now, second_data_now, margin, svg_hw, tip_shift);
                    console.log(second_data_now);
                    write_bar_3_text(name,d3.select(this).attr('class'));
                    svg3_s = change_split_stackbar(svg3_s, age_datas[d3.select(this).attr('class')], margin, svg2_hw, tip_shift);
                    // svg2_s = set_split_stackbar(svg2_s, total_datas[d3.select(this).attr('class')], second_datas[d3.select(this).attr('class')], margin, svg_hw, tip_shift);

                })



    })
    })
    })
    })
    })
    })
    })

}


function bar_chart_change(name){
    console.log(name);
    
    d3.select("#bar-1").select("svg").remove()
    d3.select("#bar-2").select("svg").remove()
    d3.select("#bar-3").select("svg").remove()
    draw_one_pic(name);
    // draw_bar_chart_1(bulid_series_for_category(selected_cities, name),name);
}

draw_one_pic('项数');