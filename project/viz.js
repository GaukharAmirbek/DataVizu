async function makeViz(gender) {
    let margin = { top: 10, right: 100, bottom: 30, left: 30 },
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    let data = await d3.csv(`${gender}.csv`);
    // List of groups (here I have one group per column)
    let allGroup = data.columns.slice(1);

    // Reformat the data: we need an array of arrays of {x, y} tuples
    let dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
        return {
            name: grpName,
            values: data.map(function (d) {
                return { time: d.time, value: +d[grpName] };
            })
        };
    });

    let myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    let x = d3.scaleLinear()
        .domain([2001, 2020])
        .range([0, width]);
    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, 28])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the lines
    let line = d3.line()
        .x(function (d) { return x(+d.time) })
        .y(function (d) { return y(+d.value) })
    svg.selectAll("myLines")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("d", function (d) { return line(d.values) })
        .attr("stroke", function (d) { return myColor(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none")

    // Add the points
    svg
        .selectAll("myDots")
        .data(dataReady)
        .enter()
        .append('g')
        .style("fill", function (d) { return myColor(d.name) })
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(function (d) { return d.values })
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.time) })
        .attr("cy", function (d) { return y(d.value) })
        .attr("r", 5)
        .attr("stroke", "white")

    // create labels with colors in end of svg
    let legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(dataReady)
        .enter().append("g")
        .attr("transform", function (d, i) { return `translate(${width}, ${i * 20})`; })
        .append("text")
        .text(function (d) { return d.name; })
        .style("fill", function (d) { return myColor(d.name) })
        .on('click', function (event, datum) {
            console.log(datum);
        })

    // set title of svg 
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 100 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(gender);

}


makeViz('women')
makeViz('men')
