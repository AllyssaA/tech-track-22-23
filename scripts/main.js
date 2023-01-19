// Our bundler automatically creates styling when imported in the main JS file!
import "../styles/style.css";

// We can use node_modules directely in the browser!
import * as d3 from "d3";
import count from "./count.js";

console.log("Hello, world!");

// let data = count(5, 5);

// const url = "https://www.rijksmuseum.nl/api/nl/collection?key=0tlmzj3f&involvedMaker=Rembrandt+van+Rijn"

// console.log(data);
const API_KEY = "0tlmzj3f";
const API_URL = `https://www.rijksmuseum.nl/api/nl/collection?key=${API_KEY}&involvedMaker=Rembrandt+van+Rijn&ps=5`;

const margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width =
    // document.querySelector('#graph').clientWidth
    1000 - margin.left - margin.right,
  height =
    // document.querySelector('#graph').clientWidth
    1000 - margin.top - margin.bottom;

const svg = d3
  .select("#graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const mouseover = function (e, d) {
  d3.select("#tooltip")
    .transition()
    .duration(175)
    .style("opacity", 1)
    .text(`${d.key}: ${d.value}`);
  console.log(d);
};

const mousemove = function (e) {
  d3.select("#tooltip")
    .style("left", e.pageX + 15 + "px")
    .style("top", e.pageY + 15 + "px");
};

const mouseleave = function (e, d) {
  d3.select("#tooltip").style("opacity", 0);
};

d3.json(API_URL)
  .then((data) => {
    console.log(data?.facets[4].facets);
    return data?.facets[4].facets;
  })
  .then((data) => {
    const result = data.filter((element) => element.key != "papier");
    return result;
  })
  .then((data) => {
    console.log(data);
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.key))
      .padding(0.5);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-60)")
      .style("text-anchor", "end")
      .style("font-size", "16px");

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data.map((d) => d.value)))
      .domain([0, d3.max(data.map((d) => d.value))])
      .range([height, 0])
      .nice();
    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.key))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", "#0678A0")

      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseleave);
  });

d3.select("body").on("touchend", (e) =>
  d3.select("#tooltip").style("opacity", 0)
);
