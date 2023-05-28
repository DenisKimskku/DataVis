d3.csv("https://raw.githubusercontent.com/DenisKimskku/DataVis/main/fastfood.csv").then(function(data) {
    var margin = {
        top: 20,
        right: 20,
        bottom: 80, // increase bottom margin
        left: 60 // increase left margin
      };
      var width = 1200 - margin.left - margin.right;
      var height = 1200 - margin.top - margin.bottom;
      var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.x; }))
        .range([0, width])
        .padding(0.1);
       
  var yScale = d3.scaleLinear()
    .range([550, 50]);
  var colorScale = d3.scaleOrdinal()
    .range(["#0072C6", "#ED1C24", "#FF7F27", "#FFF200", "#22B14C", "#00A2EB", "#3F48CC", "#A349A4"]);
    function drawChart(nutrient) {
        var filteredData = data.filter(function(d) {
        return d[nutrient];
        });
        var groups = d3.group(filteredData, function(d) {
        return d.restaurant;
        });
        xScale.domain(groups.keys());
        yScale.domain(d3.extent(filteredData, function(d) {
        return parseFloat(d[nutrient]);
        }));
        svg.selectAll("circle")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
        return xScale(d.restaurant);
        })
        .attr("cy", function(d) {
        return yScale(parseFloat(d[nutrient]));
        })
        .attr("r", 5)
        .attr("fill", function(d) {
        return colorScale(d.restaurant);
        });
        // Add x-axis label
        var width = xScale.bandwidth();
        var height = yScale.domain()[1] - yScale.domain()[0];
        var margin = {
        top: 20,
        right: 20,
        bottom: 70,
        left: 40
        };
        svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .text("Brand");
       
        // Add y-axis label
        svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("transform", "rotate(-90)")
        .text("Amount of Nutrient");
       
        // Add x-axis
        svg.append("g")
        .attr("transform", `translate(${0}, ${margin.bottom + height+200})`)
        .call(d3.axisBottom(xScale));

        // Add y-axis
        svg.append("g")
        .call(d3.axisLeft(yScale));
    }
       
       
        d3.select("#nutrient")
        .on("change", function() {
          var nutrient = d3.select(this).property("value");
          svg.selectAll("circle").remove(); // remove existing circles
          svg.selectAll("text").remove(); // remove existing text
          svg.selectAll("g").remove(); // remove existing text
          
          drawChart(nutrient); // redraw chart with new nutrient
        });
});