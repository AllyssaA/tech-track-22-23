import './style.css';
// import javascriptLogo from './javascript.svg';
// import { setupCounter } from './counter.js';
import * as d3 from 'd3';

const API_KEY = 'E7ucAHbF';
const N = 15; //Amount of results per page (max 10000)
const API_URL = `https://www.rijksmuseum.nl/api/nl/collection?key=${API_KEY}&ps=${N}`;

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="/vite.svg" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `;

// setupCounter(document.querySelector('#counter'));

// d3.json(API_URL)
//   .then((data) => {
//     return data;
//   })
//   .then((d) => {
//     return d.artObjects?.map((de) => {
//       // console.log(de)
//       return de?.objectNumber;
//     });
//   })
//   .then((data) => {
//     return data.map((artPiece) => {
//       return d3.json(
//         `https://www.rijksmuseum.nl/api/nl/collection/${artPiece}?key=${API_KEY}`
//       );
//     });
//   })
//   .then((data) => {
//     return Promise.all(data).then((d) => {
//       return d;
//     });
//   })
//   .then((data) => {
//     return data.map((d) => {
//       console.log(d.artObject);
//       return d.artObject;
//     });
//   });

const margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width =
    document.querySelector('#graph').clientWidth - margin.left - margin.right,
  height =
    document.querySelector('#graph').clientWidth - margin.top - margin.bottom;

const svg = d3
  .select('#graph')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

d3.json(
  'https://www.rijksmuseum.nl/api/nl/collection?key=0tlmzj3f&involvedMaker=Rembrandt+van+Rijn&ps=5'
)
  .then((data) => {
    // hint de dropdown zal werken met de 4 in deze return en de update vervolgens uitvoeren
    // console.log(data?.facets[4].facets)
    return data?.facets[4].facets;
  })
  .then((data) => {
    // console.log(data)
    const result = data.filter((element) => element.key != 'papier');
    return result;
  })
  // .then((d) => {
  //   // console.log(d)
  //   return d.sort((b, a) => {
  //     return a.value - b.value;
  //   });
  //   return d;
  // })
  .then((data) => {
    console.log(data);
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.key))
      .padding(0.5);
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '16px');

    const y = d3
      .scaleLinear()
      // Geef de Y as een minimale en een maximale waarde met extent
      .domain(d3.extent(data.map((d) => d.value)))
      // geef de y as een array met bv. twee elementen waarvan de kleinste en de grootste waarde
      .domain([0, d3.max(data.map((d) => d.value))])
      .range([height, 0]);
    svg.append('g').call(d3.axisLeft(y));

    svg
      .selectAll('bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.key))
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.value))
      .attr('fill', "#ffcc00");
      // .attr('fill', (d)=> {return d.key }); //voor kleur
  });


  // Voor interactiveit heb je een dropdown die de facet veranderd, dus ipv materiaal laat het technieken zien
  // 

  // https://gist.github.com/rpruim/fd50d23933c63f3113a2bb8576b5b34a