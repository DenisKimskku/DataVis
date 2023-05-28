// Load the CSV file
d3.csv("https://raw.githubusercontent.com/DenisKimskku/DataVis/main/fastfood.csv").then(function(data) {
    // Get the unique restaurant names
    var restaurants = d3.map(data, function(d) { return d.restaurant; }).keys();

    // Populate the restaurant dropdown menus
    d3.select("#restaurant1-select")
        .selectAll("option")
        .data(restaurants)
        .enter()
        .append("option")
        .attr("value", function(d) { return d; })
        .text(function(d) { return d; });

    d3.select("#restaurant2-select")
        .selectAll("option")
        .data(restaurants)
        .enter()
        .append("option")
        .attr("value", function(d) { return d; })
        .text(function(d) { return d; });

    // Populate the item dropdown menus based on the selected restaurant
    d3.select("#restaurant1-select").on("change", function() {
        var selectedRestaurant = d3.select(this).property("value");
        var items = data.filter(function(d) { return d.restaurant == selectedRestaurant; })
                        .map(function(d) { return d.item; });
        console.log(items);

        d3.select("#restaurant1-item-select")
        .style("display", "block")
        .select("select")
        .selectAll("option")
        .remove()
        .data(items)
        .enter()
        .append("option")
        .attr("value", function(d) { return d; })
        .text(function(d) { return d; })
        .on("change", function() {
            var selectedValue = d3.select(this).property("value");
            console.log(selectedValue);
        });
    });

    d3.select("#restaurant2-select").on("change", function() {
        var selectedRestaurant = d3.select(this).property("value");
        var items = data.filter(function(d) { return d.restaurant == selectedRestaurant; })
                        .map(function(d) { return d.item; });

        d3.select("#restaurant2-item-select")
            .style("display", "block")
            .select("select")
            .selectAll("option")
            .remove()
            .data(items)
            .enter()
            .append("option")
            .attr("value", function(d) { return d; })
            .text(function(d) { return d; });
    });

    // Display the nutrient information for the selected items
    d3.select("#submit-button").on("click", function() {
        var restaurant1 = d3.select("#restaurant1-select").property("value");
        var restaurant2 = d3.select("#restaurant2-select").property("value");
        var item1 = d3.select("#restaurant1-item-select option:checked").text();
        var item2 = d3.select("#restaurant2-item-select option:checked").text();
        if (restaurant1 == "" || restaurant2 == "" || item1 == "" || item2 == "") {
            alert("Please select two restaurants and two items to compare.");
            return;
        }
        var nutrientNames = ["calories", "cal_fat", "total_fat", "sat_fat", "trans_fat", "cholesterol", "sodium", "total_carb", "fiber", "sugar", "protein", "vit_a", "vit_c", "calcium"];
        var nutrientData = [];

        // Get the nutrient information for the first item
        console.log(restaurant1, item1)
        var item1Data = data.filter(function(d) { return d.restaurant == restaurant1 && d.item == item1; })[0];
        nutrientNames.forEach(function(nutrient) {
            nutrientData.push({
                restaurant: restaurant1,
                item: item1,
                nutrient: nutrient,
                value: +item1Data[nutrient]
                
            });
        });

        // Get the nutrient information for the second item
        var item2Data = data.filter(function(d) { return d.restaurant == restaurant2 && d.item == item2; })[0];
        nutrientNames.forEach(function(nutrient) {
            nutrientData.push({
                restaurant: restaurant2,
                item: item2,
                nutrient: nutrient,
                value: +item2Data[nutrient]
            });
        });
        console.log(item1Data, item2Data, nutrientData)

        // Set up the chart
        var margin = { top: 20, right: 20, bottom: 70, left: 40 };
        var width = 1200 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        var x0 = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.1);

        var x1 = d3.scaleBand()
            .padding(0.05);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x0);

        var yAxis = d3.axisLeft(y)
            .ticks(10);
        
        var color = d3.scaleLinear()
            .domain([0, 1])
            .range(["#1f77b4", "#ff7f0e"]);

        var svg = d3.select("#chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Set the domain of the axes
        // Define the x and y domains
        x0.domain(nutrientNames);
        x1.domain(restaurants).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(nutrientData, function(d) { return d.value; })]);
        

        // Add the x axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0).tickSizeOuter(0));
        // Add the y axis
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y).ticks(10, "s"))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Amount");

        // Add the x axis labels
        svg.select(".x.axis")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .attr("dx", "-.8em")
            .attr("dy", ".25em")
            .style("text-anchor", "end");
        // Add the bars
        // Define the color scale
        var color = d3.scaleOrdinal()
            .domain(restaurants)
            .range(["orange", "brown", "green", "blue", "purple", "red", "yellow", "turquoise"]);

        // Add the bars
        svg.selectAll(".bar")
            .data(nutrientData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x0(d.nutrient) + x1(d.restaurant); })
            .attr("y", function(d) { return y(d.value)})
            .attr("width", x1.bandwidth())
            .attr("height", function(d) { var value = y(d.value); if (value != NaN) return height - value; else return height; })
            .attr("fill", function(d) { return color(d.restaurant); });

        // Add the legend
        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (width - 100) + ", 0)");

        legend.selectAll("rect")
            .data(restaurants)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", function(d, i) { return i * 20; })
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d) { return color(d); });

        legend.selectAll("text")
            .data(restaurants)
            .enter()
            .append("text")
            .attr("x", 15)
            .attr("y", function(d, i) { return i * 20 + 9; })
            .text(function(d) { return d; });
    });
});
