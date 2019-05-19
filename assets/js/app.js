
// id,state,abbr,
// poverty,povertyMoe,age,ageMoe,income,incomeMoe,
// healthcare,healthcareLow,healthcareHigh,
// obesity,obesityLow,obesityHigh,
// smokes,smokesLow,smokesHigh

const xLabels = ['poverty', 'age', 'income']
const yLabels = ['obesity', 'smokes', 'healthcare']
const xkeyLabels = [`in poverty (%) `, `age (median) `, `household income (median) `]
const ykeyLabels = [ `is obese (%)`, `Smokes (%)`, `lacks healthCare (%)`];


// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "obesity";

// Retrieve data from the CSV file and execute everything below
(async function(){
    const stateData = await d3.csv("assets/data/data.csv");

    // parse data into ints
    stateData.forEach(function(data) {
        for ( key in data ){
            if (!isNaN(Number(data[key]))){
                data[key] = +data[key];
            }
            else if(key==='state'){
                data[key] = data[key].toUpperCase()
            }
        }
    });

    let xLinearScale = xScale(stateData, chosenXAxis);
    let yLinearScale = yScale(stateData, chosenYAxis);

    // Create initial axis functions
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    let article = d3.select(".article").
    append("text").html(`Population ${getXLabel(chosenXAxis)} versus the population that ${getYLabel(chosenYAxis)}`);

    let svg = d3
        .select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

// Append an SVG group
    let chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // append x axis
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    let yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles
    let theCircles = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()

    let circlesGroup = theCircles.append("circle")
        .classed("state-circles", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        
        
    let textGroup = theCircles.append("text")
        .text(d => d.abbr)
        .classed("state-abbr", true)
        .attr("dx", d => xLinearScale(d[chosenXAxis]))
        .attr("dy", d => yLinearScale(d[chosenYAxis])*1.03);

     // Create separate groups for x and y axis labels
    let xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    let ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(0, ${height + 20})`);

    const xAxisLabels = [], yAxisLabels = [];
 
    for (let i=0,  y = 20; i<xLabels.length;i++, y+=20){    
        xAxisLabels.push(xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", y )
        .attr("value", xLabels[i]) // value to grab for event listener
        .classed("axis-text", true)
        .classed("inactive", true)
        .text(xkeyLabels[i]));
    }
    for (let i=0,  y=20 ; i<yLabels.length;i++, y+=20){    
        yAxisLabels.push(ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 + (height / 2))
        .attr("y", y - margin.left)
        .attr("value", yLabels[i]) // value to grab for event listener
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text(ykeyLabels[i]));
    }

    xAxisLabels[getIndex(xLabels,chosenXAxis)].classed("active", true).classed("inactive", false);
    yAxisLabels[getIndex(yLabels,chosenYAxis)].classed("active", true).classed("inactive", false);

    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);

    // x and y axis labels event listener
    xlabelsGroup.selectAll("text").on("click", function(){
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
          // deactivate current chosenXAxis
          xAxisLabels[getIndex(xLabels, chosenXAxis)].classed("active", false).classed("inactive", true);
    
          // replaces chosenXAxis with value
          chosenXAxis = value;
          
          // updates x scale for new data
          xLinearScale = xScale(stateData, chosenXAxis);
          yLinearScale = yScale(stateData, chosenYAxis);

          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);
          yAxis = renderYAxes(yLinearScale, yAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
    
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
          // Activate new chosenXAxis
          xAxisLabels[getIndex(xLabels, chosenXAxis)].classed("active", true).classed("inactive", false);
      }
    });

    ylabelsGroup.selectAll("text").on("click", function(){
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
            // deactivate current chosenYAxis label
          yAxisLabels[getIndex(yLabels,chosenYAxis)].classed("active", false).classed("inactive", true);
          
          // replaces chosenYAxis with value
          chosenYAxis = value;
      
         // updates x scale for new data
         xLinearScale = xScale(stateData, chosenXAxis);
         yLinearScale = yScale(stateData, chosenYAxis);
         // updates x axis with transition
         xAxis = renderXAxes(xLinearScale, xAxis);
         yAxis = renderYAxes(yLinearScale, yAxis);
      
          // updates circles with new y values
          circlesGroup = renderCircles(circlesGroup, textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
      
          // Activate new chosenYAxis label
          yAxisLabels[getIndex(yLabels,chosenYAxis)].classed("active", true).classed("inactive", false);
      }
    });
})()