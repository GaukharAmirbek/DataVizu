let currentBarYear = 2001

async function drawGroupedBar() {
    let menData = await d3.csv('men.csv')
    let womenData = await d3.csv('women.csv')

    var container = d3.select('#pie'),
        width = window.innerWidth * 0.95,
        height = window.innerWidth * 0.4,
        margin = { top: 30, right: 20, bottom: 30, left: 50 },
        barPadding = .2,
        axisTicks = { qty: 12, outerSize: 0, dateFormat: '%m-%d' };

    var svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let update = () => {
        let models = []
        let maxValue = 0

        Object.entries(menData[currentBarYear - 2001]).forEach((element, index) => {
            if (index !== 0) {
                let womenEntries = Object.entries(womenData[currentBarYear - 2001])
                maxValue = Math.max(element[1], womenEntries[index][1]) > maxValue ? Math.max(element[1], womenEntries[index][1]) : maxValue
                models.push({
                    "model_name": element[0],
                    "field1": element[1],
                    "field2": womenEntries[index][1],
                })
            }
        });

        models = models.map(i => {
            i.model_name = i.model_name;
            return i;
        });

        var xScale0 = d3.scaleBand().range(
            [0, width - margin.left - margin.right]
        ).padding(barPadding);
        var xScale1 = d3.scaleBand()
        var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

        var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
        var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

        xScale0.domain(models.map(d => d.model_name));
        xScale1.domain(['field1', 'field2']).range([0, xScale0.bandwidth()]);
        yScale.domain([0, maxValue]);

        svg.selectAll('.model_name').remove();
        var model_name = svg.selectAll(".model_name")
            .data(models)
            .enter().append("g")
            .attr("class", "model_name")
            .attr("transform", d => `translate(${xScale0(d.model_name)},0)`);

        /* Add field1 bars */
        svg.selectAll('.bar.field1').remove();
        model_name.selectAll(".bar.field1")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar field1")
            .style("fill", "blue")
            .attr("x", d => xScale1('field1'))
            .attr("y", d => yScale(d.field1))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return height - margin.top - margin.bottom - yScale(d.field1)
            });

        /* Add field2 bars */
        svg.selectAll('.bar.field2').remove();
        model_name.selectAll(".bar.field2")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar field2")
            .style("fill", "red")
            .attr("x", d => xScale1('field2'))
            .attr("y", d => yScale(d.field2))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return height - margin.top - margin.bottom - yScale(d.field2)
            });

        // Add the X Axis
        svg.selectAll('.x-axis').remove();
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(xAxis);

        // Add the Y Axis
        svg.selectAll('.y-axis').remove();
        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        console.log(currentBarYear)
        d3.select("#year-label-pie").text(`Уровень безработицы населения за ${currentBarYear}`)
    }
    update()

    d3.select("#pie").append("div")
        .attr("id", "color-legend")
        .style("width", "100%")
        .style("margin-top", "10px")
        .style("margin-bottom", "10px")
        .style("padding", "0px")
        .style("background-color", "white")
        .style("border", "0px")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("color", "black")
        .style("text-align", "center")
        .style("border-radius", "5px")
        .style("outline", "none")
        .style("box-shadow", "0px 0px 0px 0px")
        .style("-webkit-appearance", "none")
        .style("-moz-appearance", "none")
        .style("appearance", "none")
        .selectAll("div")
        .data(["blue", "red"])
        .enter()
        .append("div")
        .style("width", "100px")
        .style("height", "20px")
        .style("background-color", d => d)
        .style("margin", "5px")
        .style("padding", "5px")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("border-radius", "5px")
        .text(d => d === "blue" ? "Мужчины" : "Женщины")

    d3.select("#pie").append("div")
        .attr("id", "year-label-pie")
        .style("margin-top", "10px")
        .style("margin-bottom", "10px")
        .style("padding", "0px")
        .style("background-color", "white")
        .style("border", "0px")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("color", "black")
        .style("text-align", "center")
        .style("border-radius", "5px")
        .style("outline", "none")
        .style("box-shadow", "0px 0px 0px 0px")
        .style("-webkit-appearance", "none")
        .style("-moz-appearance", "none")
        .style("appearance", "none")
        .text(`Уровень безработицы населения за ${currentBarYear}`)

    d3.select("#pie").append("div")
        .style("text-align", "center")
        .style("width", "100%")
        .selectAll("button")
        .data(d3.range(2001, 2021))
        .enter()
        .append("button")
        .attr("class", "year-button")
        .attr("id", d => d)
        .text(d => d)
        .on("click", function (e, d) {
            currentBarYear = d
            update()
        }
        )
        .style("border", d => {
            return "1px solid black"
        })
        .style("background-color", "white")
        .style("margin", "5px")
        .style("padding", "5px")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("border-radius", "5px")




}

drawGroupedBar()
