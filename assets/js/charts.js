
// function used for updating x-scale let upon click on axis label
function xScale(stateData, chosenXAxis) {
    // create scales
    let scale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return scale;
}

// function used for updating y-scale let upon click on axis label
function yScale(stateData, chosenYAxis) {
  // create scales
  let scale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.6,
      d3.max(stateData, d => d[chosenYAxis]) * 1.2 ])
    .range([height, 0]);  

  return scale;
}

// function used for updating xAxis let upon click on axis label
function renderXAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

// function used for updating yAxis let upon click on axis label
function renderYAxes(newYScale, yAxis) {
  let leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, textGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

  
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]))
    .attr("cx", d => newXScale(d[chosenXAxis]))
  
  textGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]))
    .attr("dy", d => newYScale(d[chosenYAxis])*1.03);

  return circlesGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYaxis, circlesGroup) {

  let article = d3.select(".article")
    .html(function(d) {
      return(`Population ${getXLabel(chosenXAxis)} versus the population that ${getYLabel(chosenYAxis)}`)
    })

  const toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${getXLabel(chosenXAxis)} ${d[chosenXAxis]}<br>${getYLabel(chosenYAxis)} ${d[chosenYAxis]}`);
      });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
  })
  // onmouseout event
  .on("mouseout", function(data, index) {
      toolTip.hide(data, this);
  });

return circlesGroup;
}

function getIndex(labels, value){
  for (let i=0; i<labels.length;i++){ 
      if (labels[i] === value){
        return i;
      }

  }
}

function getXLabel(value){
  return xkeyLabels[getIndex(xLabels, value)]
}

function getYLabel(value){
  return ykeyLabels[getIndex(yLabels, value)]
}
