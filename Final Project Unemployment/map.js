var currentYear = 2001
var currentGender = 'men'
function genderLabel() {
    if (currentGender === 'men') return 'Мужчин'
    return 'Женщин'
}

let dimensions = {
    width: window.innerWidth * 0.9,
    height: 550,
    margin: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60
    }
}

//draw chart
let svg = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
    .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")"
    )

//draw x axis
const bounds = svg.append("g")
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)

bounds.append("g")
    .attr("class", "map-path")

bounds.append("g")
    .attr("class", "map-circles")

bounds.append("g")
    .attr("class", "map-legend")

async function drawUnemploymentMap() {
    let data = await d3.json("KAZ.geo.json")

    let width = dimensions.width
    let height = dimensions.height

    // Map and projection
    let projection = d3.geoMercator()
        .center([70, 48])                // GPS of location to zoom on
        .scale(1350) // This is like the zoom
        .translate([width / 2, height / 2])

    async function updateMap() {
        // Create data for circles:
        let circleData = await d3.csv(`${currentGender}_map.csv`)
        let markers = getMarkers(circleData)
        console.log(markers)
        // Add a scale for bubble size
        var size = d3.scaleLinear()
            .domain(d3.extent(markers, d => d.size))  // What's in the data
            .range([4, 30])  // Size in pixel

        // Create a color scale
        var color = d3.scaleOrdinal()
            .domain(circleData.columns)
            .range(d3.schemeSet2);

        // Draw the map
        // bounds.select(".map-path").selectAll("path").remove()
        bounds.select(".map-path")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("fill", "#b8b8b8")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "black")
            .style("opacity", .3)

        // Add circles:
        // clear all myCircles
        bounds.select(".map-circles").selectAll("circle").remove()
        bounds.select(".map-circles")
            .selectAll("circle")
            .data(markers)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return projection([d.long, d.lat])[0] })
            .attr("cy", function (d) { return projection([d.long, d.lat])[1] })
            .attr("r", function (d) { return size(d.size) })
            .style("fill", function (d) { return color(d.region) })
            .attr("stroke", function (d) { return color(d.region) })
            .attr("stroke-width", 3)
            .attr("fill-opacity", .4)
            .style("display", function (d) {
                return d.size <= 0.0 ? "none" : "block"
            })

        bounds.select(".map-legend").selectAll("text").remove()
        bounds.select(".map-legend")
            .selectAll("text")
            .data(markers)
            .enter()
            .append("text")
            .attr("x", function (d) { return projection([d.long, d.lat])[0] })
            .attr("y", function (d) { return projection([d.long, d.lat])[1] })
            .text(function (d) { return `${d.region} ${d.size}%` })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("opacity", .7)
            .style("display", function (d) {
                return d.size <= 0.0 ? "none" : "block"
            })

        d3.select("#year").property("value", currentYear)
        d3.select("#year-label").text(`Уровень безработицы населения за ${currentYear} год`)
    }

    // Add map title on bottom of the svg
    d3.select("#wrapper-buttons").append("div")
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
            currentYear = d
            updateMap()
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

    d3.select("#wrapper").append("div")
        .attr("id", "year-label")
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

    updateMap()
}

drawUnemploymentMap();

const COORDINATES = [
    { region: 'г.Алматы', lat: 43.2220, long: 76.8512 },
    { region: 'г.Нур-Султан', lat: 51.1605, long: 71.4704 },
    { region: 'Павлодарская', lat: 52.2873, long: 76.9674 },
    { region: 'Акмолинская', lat: 51.9165, long: 69.4110 },
    { region: 'Актюбинская', lat: 48.7797, long: 57.9974 },
    { region: 'Алматинская', lat: 45.0119, long: 78.4229 },
    { region: 'Атырауская', lat: 47.1076, long: 51.9141 },
    { region: 'Западно-Казахстанская', lat: 49.5680, long: 50.8067 },
    { region: 'Жамбылская', lat: 44.2220, long: 72.3658 },
    { region: 'Карагандинская', lat: 49.8047, long: 73.1094 },
    { region: 'Костанайская', lat: 53.2198, long: 63.6354 },
    { region: 'Кызылординская', lat: 44.6923, long: 62.6572 },
    { region: 'Мангыстауская', lat: 44.5908, long: 53.8500 },
    { region: 'Южно-Казахстанская', lat: 41.0263, long: 67.1431 },
    { region: 'Северо-Казахстанская', lat: 54.1622, long: 69.9387 },
    { region: 'Туркестанская', lat: 43.3051, long: 68.2347 },
    { region: 'Восточно-Казахстанская', lat: 48.7063, long: 80.7923 },
    { region: 'г.Шымкент', lat: 42.3417, long: 69.5901 },
];

function getMarkers(data) {
    const currentYearData = data[currentYear - 2001]
    return Object.entries(currentYearData).map(d => {
        return {
            ...COORDINATES.find(e => e.region === d[0]),
            size: d[1]
        }
    })
}
