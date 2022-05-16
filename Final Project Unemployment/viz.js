async function makeViz(gender) {
    let margin = { top: 10, right: 100, bottom: 30, left: 30 },
        width = window.innerWidth - margin.left - margin.right,
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

    let selectedGrops = ['15-19', '20-24']

    let myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeCategory10);

    // Add X axis --> it is a date format
    let x = d3.scaleLinear()
        .domain([2001, 2020])
        .range([0, width]);


    let bounds = svg.append("g")
        .attr("class", "bounds")
    ;
    bounds.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(20))

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

    const update = () => {

        let filteredData = dataReady.filter(d => selectedGrops.includes(d.name))
        bounds.selectAll('.myLines').remove();
        bounds.selectAll('.myDots').remove();
        bounds.selectAll("myLines")
            .data(filteredData)
            .enter()
            .append("path")
            .attr("class", "myLines")
            .attr("d", function (d) { return line(d.values) })
            .attr("stroke", function (d) { return myColor(d.name) })
            .style("stroke-width", 4)
            .style("fill", "none")

        bounds
            .selectAll("myDots")
            .data(filteredData)
            .enter()
            .append('g')
            .attr("class", "myDots")
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
            .on("mouseenter", onMouseEnter)
            .on("mouseleave", onMouseLeave)
    }
    update()

    // Add the points
    const tooltip = d3.select("#tooltip")
    function onMouseEnter(e, datum) {
        tooltip.select("#count")
            .text(datum.value)

        const formatHumidity = d3.format(".2f")
        tooltip.select("#range")
            .text(datum.time)

        tooltip.style("display", "block")
            .style("left", `${e.pageX - 38}px`)
            .style("top", `${e.pageY - 75}px`)


        tooltip.style("opacity", 1)
    }

    function onMouseLeave() {
        tooltip.style("opacity", 0)
    }

    // set title of svg 
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 100 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(gender == 'women' ? 'Женщины' : 'Мужчины');

    d3.select("#my_dataviz").append("div")
        .style("text-align", "center")
        .style("width", "100%")
        .selectAll("input")
        .data(allGroup)
        .enter()
        .append("label")
        .style("color", function (d) { return myColor(d) })
        .text(d => d)
        .append("input")
        .attr('type', 'checkbox')
        .attr("id", d => d)
        .attr("value", d => d)
        .property("checked", d => {
            return selectedGrops.includes(d)
        })
        .on("click", function (e, d) {
            let checked = d3.select(this).property("checked");
            if (checked) {
                selectedGrops.push(d);
            } else {
                selectedGrops.splice(selectedGrops.indexOf(d), 1);
            }
            update(selectedGrops);
        }
        )
}


makeViz('women')
setTimeout(() => {
    makeViz('men')
}, 1000)
