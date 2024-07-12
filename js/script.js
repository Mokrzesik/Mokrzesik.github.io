const data = await d3.csv("cars2017.csv");
const svg = d3.select("svg").append("g").attr("transform", "translate(50,50)");

const xScale = d3.scaleLog().domain([10,150]).range([0,200]);
const yScale = d3.scaleLog().domain([10,150]).range([200,0]);

svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
    return (xScale(parseInt(d.AverageCityMPG)))
    })
    .attr("cy", function(d) {
    return (yScale(parseInt(d.AverageHighwayMPG)))
    })
    .attr("r", function(d) {
    return (2 + parseInt(d.EngineCylinders))
    });

var xAxis = d3.axisBottom(xScale).tickValues([10,20,50,100]).tickFormat(d3.format("~s"));
var yAxis = d3.axisLeft(yScale).tickValues([10,20,50,100]).tickFormat(d3.format("~s"));

d3.select("svg").append("g").attr("transform", "translate(50,50)").call(yAxis);
d3.select("svg").append("g").attr("transform", "translate(50,250)").call(xAxis);

//test0.0.7