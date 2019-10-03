import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import classes from './Chart.css'

const drawChart = (props) => {
    const axisData = Object.entries(props[Object.keys(props)]).slice(0, 1)

    const eachData = Object.entries(props[Object.keys(props)])
      .slice(1)
      .map(([key, value]) => ({
        [axisData[0][0]]: key,
        ...axisData[0][1].reduce((acc, cur, idx) => ({...acc, [cur]: value[idx] }), {})
      }));
    
    const keys = Object.keys(eachData[0]).slice(0, -1)
    const tip = d3Tip().html(d => {
      let content = `<div>Năm: ${d.key}</div>`;
      content += `<div>Giá trị: ${d.value}</div>`;

      return content
    }).attr('class', classes.n);

    const margin = {
        top: 50,
        right: 10,
        bottom: 60,
        left: 200
      },
      width = 1000,
      height = 600,
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom,
      svg = d3
        .select('.chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height),
      g = svg
        .append('g')
        .attr('transform', `translate(${margin.top}, ${margin.right})`);

    svg.call(tip);

    
    const mouseOver = (d, i, n) => {
      d3.select(n[i])
        .transition()
        .duration(300)
        .attr('fill', '#fafafa');
    };

    const mouseOut = (d, i, n) => {
      d3.select(n[i])
        .transition()
        .duration(300)
        .attr('fill', color(d.key));
    };

    const x0 = d3
      .scaleBand()
      .rangeRound([0, innerWidth])
      .paddingInner(0.1);

    const x1 = d3.scaleBand().padding(0.05);

    const y = d3.scaleLinear().rangeRound([innerHeight, 0]);

    const color = d3
      .scaleOrdinal()
      .range(['#1f77b4','#aec7e8','#ff7f0e','#ffbb78','#2ca02c','#98df8a','#d62728','#ff9896','#9467bd','#c5b0d5','#8c564b','#c49c94','#e377c2','#f7b6d2','#7f7f7f','#c7c7c7','#bcbd22','#dbdb8d','#17becf','#9edae5'
      ]);

    x0.domain(eachData.map(d => d[Object.keys(d)[Object.keys(d).length - 1]]));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([
      0,
      d3.max(eachData, d =>
        d3.max(keys, key => parseFloat(d[key].replace(/(,|\.)/g, '')))
      )
    ]).nice();

    const rects = g.append('g')
      .selectAll('g')
      .data(eachData)
      .enter()
      .append('g')
      .attr(
        'transform',
        d => `translate(${x0(d[Object.keys(d)[Object.keys(d).length - 1]])}, 0)`
      )
      .selectAll('rect')
      .data(d =>
        keys.map(key => {
          return { key: key, value: d[key] };
        })
      )
      .enter()
      .append('rect')
      .attr('x', d => x1(d.key))
      .attr('width', x1.bandwidth)
      .attr('height', 0)
      .attr('y', innerHeight)
      .attr('fill', d => color(d.key))


      rects.transition().duration(500)
      .attr('y', d => y(d.value.replace(/(,|\.)/g, '')))
      .attr('height', d => innerHeight - y(d.value.replace(/(,|\.)/g, '')))

      rects
        .on('mouseover', (d, i, n) => {
          tip.show(d, n[i]);
          mouseOver(d, i, n);
        })
        .on('mouseout', (d, i, n) => {
          tip.hide();
          mouseOut(d, i, n);
        });

      g.append('g')
        .attr('class', 'axis-bottom')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x0));

      if(eachData.length > 5){
        g.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end');
      }
        
      g.append('g')
        .attr('class', 'axis-left')
        .call(d3.axisLeft(y).ticks(null, 's'))
        .append('text')
        .attr('x', 10)
        .attr('y', y(y.ticks().pop()) + 10)
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('transform', 'translate(40, -5)')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .text(Object.keys(eachData[0]).slice(-1)[0]);

    const legend = g
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(100, 0)')
      .selectAll('g')
      .data(keys.slice().reverse())
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legend
      .append('rect')
      .attr('x', innerWidth - 19)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', color);

    legend
      .append('text')
      .attr('x', innerWidth - 32)
      .attr('y', 6)
      .attr('dy', '0.32em')
      .text(d => d);
}

export default drawChart;

