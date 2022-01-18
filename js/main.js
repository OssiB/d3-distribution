const margin = { top: 45, right: 30, bottom: 50, left: 80 };
const width = 600; // Total width of the SVG parent
const height = 600; // Total height of the SVG parent
const padding = 1; // Vertical space between the bars of the histogram
const barsColor = 'steelblue';
var bins;
d3.csv('./data/pay_by_gender_tennis.csv').then(data => {
    var earnings = [];
    console.table(data);
    data.forEach(datum => {
        const earning = + datum.earnings_USD_2019;
        earnings.push(earning);
    });
    createHistogram(earnings)
});
// Create Histogram
const createHistogram = (earnings) => {
    bins = d3.bin().thresholds(17)(earnings);

    const svg = d3.select("#viz")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([0, width - margin.left - margin.right])
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yScale = d3.scaleLinear()
        .domain([0, bins[bins.length - 1].x1])
        .range([height - margin.bottom, margin.top])
    const yAxis = d3.axisLeft(yScale)
        .ticks(15)
        .tickFormat(d3.format('~s'))
        .tickSizeOuter(10);
    svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .call(xAxis);
    svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis);
    svg.selectAll('rect')
        .data(bins)
        .join('rect')
        .attr('x', margin.left)
        .attr('y', d => yScale(d.x1) + 1)
        .attr('width', d => xScale(d.length))
        .attr('height', d => yScale(d.x0) - yScale(d.x1) - 1)
        .attr('fill', 'steelblue');
    bins.unshift(0);
    bins.push(0);
    const myGenerator = d3.area()
        .x0(margin.left)
        .x1((d, i) => (i == 0 || i == 18) ? margin.left : xScale(d.length) + margin.left)
        .y((d, i) => {
            if (i == 0) {
                return height - margin.bottom
            }
            else if (i == 18) {
                return margin.top;
            }
            else return yScale(d.x0) + (yScale(d.x1) - yScale(d.x0) - padding) / 2
        })
        .curve(d3.curveCatmullRom);;  // The y value of the accessor function corresponds to the half height of each bar 
    svg
        .append('path')
        .attr("fill", "yellow")
        .attr("fill-opacity", 0.5)
        .attr('stroke', 'magenta')
        .attr('stroke-width', '2')
        .attr('d', myGenerator(bins));
    

};

// Create Split Violin Plot
const createViolin = () => {

};