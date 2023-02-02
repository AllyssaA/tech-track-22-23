// Our bundler automatically creates styling when imported in the main JS file!
import "../styles/style.css";

// We can use node_modules directely in the browser!
import * as d3 from "d3";

const API_KEY = "0tlmzj3f";
let api_url;
// const API_URL = `https://www.rijksmuseum.nl/api/nl/collection?key=${API_KEY}&involvedMaker=Rembrandt+van+Rijn&ps=5`;

const margin = { top: 30, right: 30, bottom: 70, left: 60 };
const chartWidth = 600 - margin.left - margin.right;
const chartHeight = 600 - margin.top - margin.bottom;

const svg = d3
  .select("#graph")
  .attr("width", chartWidth + margin.left + margin.right)
  .attr("height", chartHeight + margin.top + margin.bottom)
  .append("g")
  .attr("class", "groupContainers")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const color = d3.scaleLinear().domain([0, 100]).range(["white", "lightblue"]);

const y = d3.scaleLinear().range([chartHeight, 0]);
const yAs = svg.append("g").attr("class", "as_y");

const x = d3.scaleBand().range([0, chartWidth]);
const xAs = svg
  .append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .attr("class", "as_x");

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

async function drawChart(dataset) {
  // Aantal elementen minder maken.
  dataset = dataset.slice(0, 10);
  x.domain(dataset.map((d) => d.key));
  xAs
    .transition()
    .duration(500)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0) rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "13px");

  y.domain([0, d3.max(dataset.map((d) => d.value + 10))]);
  yAs.transition().duration(500).call(d3.axisLeft(y));

  let content = svg.selectAll("rect").data(dataset);
  content
    .join(
      (enter) => {
        return enter
          .append("rect")
          .transition()
          .duration(500)
          .attr("fill", (d) => color(d.value));
      },
      (update) => {
        return update.transition().duration(500);
      },
      (exit) => {
        return exit.style("opacity", 0).remove();
      }
    )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseleave)
    .transition()
    .duration(500)
    .attr("x", (d) => x(d.key))
    .attr("y", (d) => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => chartHeight - y(d.value));
}

async function fetchData(url) {
  const response = await fetch(url);
  var data = await response.json();

  return data; // return statement is important for this kind of function otherwise it won't return data
}

function onChange() {
  let e = document.getElementById("artists");
  let value = e.value;
  var artist;
  if (value === "rembrandt") {
    artist = "Rembrandt+van+Rijn";
  } else if (value === "vincent") {
    artist = "Vincent+van+Gogh";
  } else if (value === "jacob") {
    artist = "Jacob+Isaacksz+van+Ruisdael";
  } else if (value === "johannes") {
    artist = "Johannes+Vermeer";
  }
  e.onchange = onChange;

  api_url = `https://www.rijksmuseum.nl/api/nl/collection?key=${API_KEY}&involvedMaker=${artist}&ps=5`;
  console.log(api_url + " regel 122");
  return api_url;
}

console.log(api_url + " regel 126");

// Main function to load in the first artist
async function main() {
  onChange();
  const d = await fetchData(api_url);
  console.log(d);
  let xy = d.facets[4].facets;
  const result = xy.filter((element) => element.key != "papier");
  drawChart(result); // Draw the chart.
}

// Redraw chart when artist get selected
d3.select("#artists").on("change", async () => {
  onChange();
  const d = await fetchData(api_url);
  console.log(d);
  let xy = d.facets[4].facets;
  const result = xy.filter((element) => element.key != "papier");
  drawChart(result); // Draw the chart.
});

// Run the main function.
main();

// Change data
d3.select("#optionsRadioButtons").on("change", async (e) => {
  console.log(`change dataset: ${e.target.value}`);
  // console.log(onChange() + " regel 145");
  // onChange();
  let data = await fetchData(api_url);
  let dataset = await data?.facets[e.target.value]?.facets;
  let result;
  if (e.target.value == 4) {
    result = dataset.filter((element) => element.key != "papier" || "");
  }
  if (e.target.value == 5) {
    result = dataset.filter((element) => element.key != "etsen" || "");
  }
  console.log(result);
  drawChart(await result);
});
