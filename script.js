// tooltip for interaction
const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "white")
  .style("border", "1px solid black")
  .style("padding", "6px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("visibility", "hidden");

// update the chart
function updateChart(step) {

  const data = window.dataset;
  if (!data) return;

  const container = d3.select("#mainChart");

  // fade out the current chart
  container
    .transition()
    .duration(300)
    .style("opacity", 0)
    .on("end", () => {

      // clear chart after the fade out
      container.selectAll("*").remove();

      // implement the appropriate chart and/or animation 
      if (step == 0) introAnimation();
      if (step == 1) scatterPlot(data);
      if (step == 2) lineChart(data);
      if (step == 3) heatmap(data);
      if (step == 4) lollipopChart(data);
      if (step == 5) groupedBarChart(data);

      // keep images for end sections
      if (step == 6) funFactsVisual();
      if (step == 7) funFactsVisual();
      if (step == 8) funFactsVisual();
      
      // fade in next chart
      container
        .style("opacity", 0)
        .style("transform", "translateY(20px)")
        .transition()
        .duration(500)
        .style("opacity", 1)
        .style("transform", "translateY(0)");
    });
}

// load data from .csv file
d3.csv("data/sleep.csv").then(data => {

  data.forEach(d => {
    d.daily_screen_time_hours = +d.daily_screen_time_hours;
    d.sleep_quality_score = +d.sleep_quality_score;
    d.stress_level = +d.stress_level;
  });

  window.dataset = data;

  // time out if chart does not load
  setTimeout(() => updateChart(0), 100);

});

// scroll observer
// make sure the intro stays on longer
let currentStep = null;

window.addEventListener("load", () => {

  const steps = document.querySelectorAll(".step");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

      if (entry.isIntersecting) {

        const step = +entry.target.dataset.step;

        // makes sure intro stays
        if (currentStep === null && step !== 0) return;

        // update the visual if scrolling
        if (step !== currentStep) {
          currentStep = step;
          updateChart(step);
        }

      }

    });
    
  }, { threshold: 0.6 });

  steps.forEach(step => observer.observe(step));
});

// scatter plot 
function scatterPlot(data) {

  const width = 800;
  const height = 400;

  // margins leave extra space for the legend
  const margin = { top: 20, right: 150, bottom: 50, left: 60 };

  const svg = d3.select("#mainChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // x scale for daily screen time
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.daily_screen_time_hours))
    .range([margin.left, width - margin.right]);

  // y scale for stress level
  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.stress_level))
    .range([height - margin.bottom, margin.top]);

  // color scale based on screen time group category
  const color = d3.scaleOrdinal()
    .domain(["Low", "Medium", "High"])
    .range(["#4CAF50", "#FFC107", "#F44336"]);

  // draw x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  // draw y-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  // axis labels
  svg.append("text")
    .attr("x", (width - margin.right) / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text("Daily Screen Time (Hours)");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("Stress Level");

  // plot data points
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.daily_screen_time_hours))
    .attr("cy", d => y(d.stress_level))
    .attr("r", 4)
    .attr("fill", d => color(d.screen_time_group))
    .attr("opacity", 0.7)

    // tooltip interactions
    .on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
        .html(`Screen: ${d.daily_screen_time_hours}<br>Stress: ${d.stress_level}`);

      d3.select(event.currentTarget)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("r", 6);
    })

    .on("mousemove", (event) => {
      tooltip.style("top", (event.pageY + 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })

    .on("mouseout", (event) => {
      tooltip.style("visibility", "hidden");

      d3.select(event.currentTarget)
        .attr("stroke", "none")
        .attr("r", 4);
    });

  // legend for color coding
  const legendGroup = svg.append("g")
    .attr("transform", `translate(${width - margin.right + 20}, 60)`);

  // legend title
  legendGroup.append("text")
    .attr("x", 0)
    .attr("y", -15)
    .attr("text-anchor", "start")
    .text("Screen Time Level")
    .style("font-weight", "bold")
    .style("font-size", "14px");

  // legend items
  const legendItems = legendGroup.selectAll(".legend")
    .data(["Low", "Medium", "High"])
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(0, ${i * 22})`)
    .style("font-size", "11px");

  // color boxes
  legendItems.append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", d => color(d));

  // labels
  legendItems.append("text")
    .attr("x", 18)
    .attr("y", 10)
    .text(d => d);
}

// line chart
function lineChart(data) {

  // group data by screen time group, compute average sleep quality
  const grouped = d3.rollup(
    data,
    v => d3.mean(v, d => d.sleep_quality_score),
    d => d.screen_time_group
  );

  // convert grouped data into array 
  const result = Array.from(grouped, ([k, v]) => ({ group: k, sleep: v }));

  // define ordering of categories
  const order = ["Low", "Medium", "High"];
  result.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));

  const width = 700;
  const height = 400;
  const margin = { top: 20, right: 100, bottom: 50, left: 60 };

  const svg = d3.select("#mainChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // x scale for categorical groups
  const x = d3.scalePoint()
    .domain(order)
    .range([margin.left, width - margin.right]);

  // y scale for average sleep values
  const y = d3.scaleLinear()
    .domain([0, d3.max(result, d => d.sleep)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // draw axes
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  // area generator fills space under the curve
  const area = d3.area()
    .x(d => x(d.group))
    .y0(height - margin.bottom)
    .y1(d => y(d.sleep))
    .curve(d3.curveMonotoneX);

  // line generator draws the main trend line
  const line = d3.line()
    .x(d => x(d.group))
    .y(d => y(d.sleep))
    .curve(d3.curveMonotoneX);

  // draw area
  svg.append("path")
    .datum(result)
    .attr("fill", "#ccc9f5")
    .attr("d", area);

  // draw line
  const path = svg.append("path")
    .datum(result)
    .attr("fill", "none")
    .attr("stroke", "#1201ff")
    .attr("stroke-width", 3)
    .attr("d", line);

  // animate line
  if (path.node()) {
    const length = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", length)
      .attr("stroke-dashoffset", length)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);
  }

  // add data points for interaction
  svg.selectAll("circle")
    .data(result)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.group))
    .attr("cy", d => y(d.sleep))
    .attr("r", 6)
    .attr("fill", "#0c057a")

    // tooltip interactions
    .on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
        .html(`Group: ${d.group}<br>Sleep: ${d.sleep.toFixed(2)}`);

      d3.select(event.currentTarget).attr("r", 9);
    })

    .on("mousemove", (event) => {
      tooltip.style("top", (event.pageY + 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })

    .on("mouseout", (event) => {
      tooltip.style("visibility", "hidden");
      d3.select(event.currentTarget).attr("r", 6);
    });

  // axis labels
  svg.append("text")
    .attr("x", (width - margin.right) / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text("Screen Time Group");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("Average Sleep Quality");
}

// heatmap 
function heatmap(data) {

  // group data by screen time and sleep group, then compute average stress level 
  const grouped = d3.rollups(
    data,
    v => d3.mean(v, d => d.stress_level),
    d => d.screen_time_group,
    d => d.sleep_group
  );

  // flatten nested grouped structure into simple array
  const flat = [];
  grouped.forEach(([screen, values]) => {
    values.forEach(([sleep, stress]) => {
      flat.push({ screen, sleep, stress });
    });
  });

  const width = 600, height = 400, margin = 80;

  const svg = d3.select("#mainChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // x scale for screen time categories
  const x = d3.scaleBand()
    .domain(["Low","Medium","High"])
    .range([margin, width - margin])
    .padding(0.1);

  // y scale for sleep quality categories
  const y = d3.scaleBand()
    .domain(["Low","Medium","High"])
    .range([height - margin, margin])
    .padding(0.1);

  // determine range of stress values for color mapping
  const maxStress = d3.max(flat, d => d.stress);
  const minStress = d3.min(flat, d => d.stress);

  // color scale (darker shade = higher stress)
  const color = d3.scaleSequential(d3.interpolateReds)
    .domain([0, maxStress * 1.2]);

  // draw axes
  svg.append("g")
    .attr("transform", `translate(0,${height - margin})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin},0)`)
    .call(d3.axisLeft(y));

  // draw heatmap cells
  svg.selectAll("rect")
    .data(flat)
    .enter()
    .append("rect")
    .attr("x", d => x(d.screen))
    .attr("y", d => y(d.sleep))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("fill", d => color(d.stress))
    .attr("stroke", "white")
    .attr("stroke-width", 2)

    // tooltip interactions
    .on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
        .html(`Screen: ${d.screen}<br>Sleep: ${d.sleep}<br>Stress: ${d.stress.toFixed(2)}`);

      d3.select(event.currentTarget)
        .attr("stroke", "black")
        .attr("stroke-width", 3);
    })

    .on("mousemove", (event) => {
      tooltip.style("top", (event.pageY + 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })

    .on("mouseout", (event) => {
      tooltip.style("visibility", "hidden");
      d3.select(event.currentTarget)
        .attr("stroke", "white")
        .attr("stroke-width", 2);
    });

  // numeric values in each cell for clarity
  svg.selectAll("text.cell")
    .data(flat)
    .enter()
    .append("text")
    .attr("x", d => x(d.screen) + x.bandwidth()/2)
    .attr("y", d => y(d.sleep) + y.bandwidth()/2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .text(d => d.stress.toFixed(1));

  // axis labels
  svg.append("text")
    .attr("x", width/2)
    .attr("y", height - 20)
    .attr("text-anchor", "middle")
    .text("Screen Time Group");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text("Sleep Quality Group");
}

// lollipop chart
function lollipopChart(data){

  // group data by occupation, then calculate stress level 
  const grouped = d3.rollup(
    data,
    v => d3.mean(v, d => d.stress_level),
    d => d.occupation
  );

  // convert grouped data into array format
  const result = Array.from(grouped, ([k, v]) => ({
    occupation: k,
    stress: v
  }));

  const width = 700, height = 400;

  // make the margin bigger to fit occupation labels 
  const margin = { top: 20, right: 50, bottom: 50, left: 150 };

  const svg = d3.select("#mainChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // x scale for stress values
  const x = d3.scaleLinear()
    .domain([0, d3.max(result, d => d.stress)])
    .range([margin.left, width - margin.right]);

  // y scale for occupations 
  const y = d3.scaleBand()
    .domain(result.map(d => d.occupation))
    .range([margin.top, height - margin.bottom])
    .padding(0.5);

  // axes
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  // create the horizontal lines 
  const lines = svg.selectAll(".line")
    .data(result)
    .enter()
    .append("line")
    .attr("class", "line")
    .attr("x1", margin.left)
    .attr("x2", margin.left)
    .attr("y1", d => y(d.occupation) + y.bandwidth() / 2)
    .attr("y2", d => y(d.occupation) + y.bandwidth() / 2)
    .attr("stroke", "black")
    .attr("stroke-width", 3);

  // animate lines so that they extend to their actual value, where the circle is
  lines.transition()
    .duration(1000)
    .attr("x2", d => x(d.stress));

  // create circles
  const circles = svg.selectAll(".dot")
    .data(result)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", margin.left) // start at axis
    .attr("cy", d => y(d.occupation) + y.bandwidth() / 2)
    .attr("r", 6)
    .attr("fill", "#ff4d00");

  // animate circles moving to their final positions
  circles.transition()
    .duration(1000)
    .attr("cx", d => x(d.stress));

  // tooltip interactions
  circles
    .on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
        .html(`${d.occupation}<br>Stress: ${d.stress.toFixed(2)}`);

      d3.select(event.currentTarget).attr("r", 9);
    })

    .on("mousemove", (event) => {
      tooltip.style("top", (event.pageY + 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })

    .on("mouseout", (event) => {
      tooltip.style("visibility", "hidden");
      d3.select(event.currentTarget).attr("r", 6);
    });

  // x-axis label
  svg.append("text")
    .attr("x", (width - margin.right) / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text("Average Stress Level");
}

// grouped bar chart
function groupedBarChart(data) {

  // group data by occupation, compute averages for screen time and sleep quality 
  const grouped = d3.rollups(
    data,
    v => ({
      sleep: d3.mean(v, d => d.sleep_quality_score),
      screen: d3.mean(v, d => d.daily_screen_time_hours)
    }),
    d => d.occupation
  );

  // convert grouped data into array format
  const result = Array.from(grouped, ([k, v]) => ({
    occupation: k,
    sleep: v.sleep,
    screen: v.screen
  }));

  const width = 700, height = 400;

  // add more space in the margin for occupation labels
  const margin = { top: 40, right: 40, bottom: 80, left: 80 };

  const svg = d3.select("#mainChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // scale for occupations
  const x0 = d3.scaleBand()
    .domain(result.map(d => d.occupation))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  // scale for grouped bars 
  const x1 = d3.scaleBand()
    .domain(["sleep", "screen"])
    .range([0, x0.bandwidth()])
    .padding(0.1);

  // y scale for values
  const y = d3.scaleLinear()
    .domain([0, d3.max(result, d => Math.max(d.sleep, d.screen))])
    .range([height - margin.bottom, margin.top]);

  // color scale for the two variables
  const color = d3.scaleOrdinal()
    .domain(["sleep", "screen"])
    .range(["#ff00aa", "#15ff00"]);

  // draw x-axis and rotate labels for readability
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .attr("transform", "rotate(-30)")
    .style("text-anchor", "end");

  // draw y-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  // create the grouped bars
  svg.selectAll("g.bar-group")
    .data(result)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${x0(d.occupation)},0)`)
    .selectAll("rect")
    .data(d => [
      { key: "sleep", value: d.sleep },
      { key: "screen", value: d.screen }
    ])
    .enter()
    .append("rect")
    .attr("x", d => x1(d.key))
    .attr("y", d => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", d => height - margin.bottom - y(d.value))
    .attr("fill", d => color(d.key))

    // tooltip interactions
    .on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
        .html(`${d.key}: ${d.value.toFixed(2)}`);

      d3.select(event.currentTarget).attr("opacity", 0.7);
    })

    .on("mousemove", (event) => {
      tooltip.style("top", (event.pageY + 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })

    .on("mouseout", (event) => {
      tooltip.style("visibility", "hidden");
      d3.select(event.currentTarget).attr("opacity", 1);
    });
}

// intro animation, will display a cycle of three images total; one for each of the main factors
function introAnimation() {

  // select the container and clear existing content
  const container = d3.select("#mainChart");
  container.selectAll("*").remove();

  // establish dimensions
  const width = 500;
  const height = 400;

  // create a wrapper to center the content 
  const wrapper = container.append("div")
    .style("width", "100%")
    .style("height", "100%")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center")
    .style("justify-content", "center");

  // define images for animation
  const visuals = [
    { src: "images/sleep.png" },
    { src: "images/screen.png" },
    { src: "images/stress.png" }
  ];

  // track image that is being displayed
  let index = 0;

  // create image element
  const image = wrapper.append("img")
    .attr("src", visuals[index].src)
    .style("width", "200px")
    .style("height", "200px")
    .style("opacity", 1)
    .style("transition", "opacity 0.5s");

  // create label for image
  const text = wrapper.append("div")
    .style("margin-top", "20px")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text(visuals[index].label);


  // function to cycle through the images
  function cycle() {

    // fade out image
    image.style("opacity", 0);
    text.style("opacity", 0);

    setTimeout(() => {

      // cycle to next image, repeat process when all images are cycled through
      index = (index + 1) % visuals.length;

      // update image
      image.attr("src", visuals[index].src);
      text.text(visuals[index].label);

      // fade in
      image.style("opacity", 1);
      text.style("opacity", 1);

    }, 500);

    // repeat cycle every 2 seconds
    setTimeout(cycle, 2000);
  }

  // start animation cycle
  cycle();
}

// fun facts section, displays information that is important but did not fit with any of the charts
function funFactsVisual() {

  // select a container and clear the previous content
  const container = d3.select("#mainChart");
  container.selectAll("*").remove();

  // create flex container for pictures 
  const wrapper = container.append("div")
    .style("display", "flex")
    .style("flex-direction", "row")
    .style("align-items", "center")
    .style("justify-content", "center")
    .style("gap", "40px");

  // define images 
  const images = [
    { src: "images/sleep.png", },
    { src: "images/screen.png", },
    { src: "images/stress.png", }
  ];

  // bind data and create a container for each item 
  const items = wrapper.selectAll(".item")
    .data(images)
    .enter()
    .append("div")
    .style("text-align", "center");

  // add images to the fun fact section, so that there is a visual next to the text 
  items.append("img")
    .attr("src", d => d.src)
    .style("width", "120px")
    .style("height", "120px")
    .style("opacity", 0)
    .transition()
    .duration(800)
    .style("opacity", 1);
    }