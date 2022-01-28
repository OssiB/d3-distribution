const margin = { top: 45, right: 30, bottom: 50, left: 80 };
const width = 600; // Total width of the SVG parent
const height = 600; // Total height of the SVG parent
const padding = 1; // Vertical space between the bars of the histogram
const barsColor = 'steelblue';
var bins;
d3.csv('./data/pay_by_gender_tennis.csv').then(data => {
    var earnings = [];
    data.forEach(datum => {
        const earning = + datum.earnings_USD_2019;
        earnings.push(earning);
    });
    //createHistogram(earnings)
    createViolin(data);
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
        .range([margin.left, width - margin.right])
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
const createViolin = (data) => {
    var womenEarnings = [];
    var menEarnings = [];
    data.filter(d => d.gender == 'men').forEach(datum => {
        const earning = + datum.earnings_USD_2019;
        menEarnings.push(earning);
    });

    data.filter(d => d.gender == 'women').forEach(datum => {
        const earning = + datum.earnings_USD_2019;
        womenEarnings.push(earning);
    }
    );
    const million = 1000000
    console.log(Math.ceil(d3.max((menEarnings)) / million));

    var menBins = d3.bin().thresholds(Math.ceil(d3.max((menEarnings)) / million))(menEarnings);
    var womenBins = d3.bin().thresholds(Math.ceil(d3.max((womenEarnings)) / million))(womenEarnings);
    var widthMax = Math.max(d3.max(menBins, d => d.length), d3.max(womenBins, d => d.length));


    const xScale = d3.scaleLinear()
        .domain([-widthMax, widthMax])
        .range([margin.left, width - margin.right]);

    var heigthMax = Math.max(menBins[menBins.length - 1].x1, menBins[menBins.length - 1].x1);

    const yScale = d3.scaleLinear()
        .domain([0, heigthMax])
        .range([height - margin.bottom, margin.top]);

    const svg = d3.select("#viz")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const xAxis = d3.axisBottom(xScale).tickFormat(Math.abs);

    svg
        .append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis);


    const yAxis = d3.axisLeft(yScale)
        .ticks(15)
        .tickFormat(d3.format('~s'))
        .tickSizeOuter(10);
    svg
        .append('g')
        .attr('transform', `translate(${margin.left} , 0)`)
        .call(yAxis);

    menBins.unshift(0);
    menBins.push(0);
    const menGenerator = d3.area()
        .x0(xScale(0))
        .x1((d, i) => (i == 0 || i == 18) ? xScale(0) : xScale(d.length))
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
        .attr("fill", "#F2C53D")
        .attr("fill-opacity", 0.8)
        .attr('stroke', 'none')
        .attr('d', menGenerator(menBins));

    womenBins.unshift(0);
    womenBins.push(0);
    console.log(womenBins);
    const womenGenerator = d3.area()
        .x0(xScale(0))
        .x1((d, i) => (i == 0 || i == 12) ? xScale(0) : xScale(-d.length))
        .y((d, i) => {
            if (i == 0) {
                return height - margin.bottom
            }
            else if (i == 12) {
                return margin.top;
            }
            else return yScale(d.x0) + (yScale(d.x1) - yScale(d.x0) - padding) / 2
        })
        .curve(d3.curveCatmullRom);;  // The y value of the accessor function corresponds to the half height of each bar 
    svg
        .append('path')
        .attr("fill", "#A6BF4B")
        .attr("fill-opacity", 0.8)
        .attr('stroke', 'none')
        .attr('d', womenGenerator(womenBins));
    svg.append('text')
        .text("Earnings of the top tennis players in 2019 (USD)")
        .attr('font-size', '16px')
        .attr('font-weight', 700)
        .attr('x', margin.left)
        .attr('y', 20);

    const circlesRadius = 2.5;
    const circlesPadding = 0.7;
    const simulation = d3.forceSimulation(data)
        .force('forceX', d3.forceX(xScale(0))
            .strength(0.1))
        .force('forceY', d3.forceY(d => yScale(d.earnings_USD_2019))
            .strength(10))
        .force('collide', d3.forceCollide(circlesRadius + circlesPadding))
        .force('axis', () => {

            // Loop through each data point
            data.forEach(d => {

                // If man and the circle's x position is on the left side of the violin
                if (d.gender === 'men' && d.x < xScale(0) + circlesRadius) {
                    // Increase velocity toward the right
                    d.vx += 0.004 * d.x;
                }

                // If woman and the circle's x position is on the right side of the violin
                if (d.gender === 'women' && d.x > xScale(0)- circlesRadius) {
                    // Increase velocity toward the left
                    d.vx -= 0.004 * d.x;
                }
            })
        })
        .stop()
        .tick(300);
    console.log(data);
    svg.append('g')
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', circlesRadius)
        .attr('fill', d => d.gender == 'women' ? '#718233' : '#BF9B30')
        .attr('stroke', d => d.gender == 'women' ? '#718233' : '#BF9B30')
        .attr('fill-opacity', 0.6);
};