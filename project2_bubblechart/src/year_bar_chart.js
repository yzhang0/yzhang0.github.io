function createYearChart(){
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      w = 940 - margin.left - margin.right,
      h = 600 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand()
            .range([0, w])
            .padding(0.1);
  var y = d3.scaleLinear()
            .range([h, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  // d3.select("#vis").select("svg").remove()
  var svg = d3.select("#bar").append("svg:svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // get the data
  d3.csv("../bubble_chart/data/mangapart4.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
      d.Number_of_Series = +d.Number_of_Series;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.Published_Period; }));
    y.domain([0, d3.max(data, function(d) { return d.Number_of_Series; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", "#F5573B")
        .attr("x", function(d) { return x(d.Published_Period); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.Number_of_Series); })
        .attr("height", function(d) { return h - y(d.Number_of_Series); });

    // add the x Axis
    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x));

    // add the y Axis
    // svg.append("g")
    //     .call(d3.axisLeft(y));

    // add text
    svg.selectAll(".text")
       .data(data)
       .enter()
       .append("text")
       .text(function(d) {
         if (d.Number_of_Series == 0) {
           return null;
         } else {
          return d.Number_of_Series;
         }
       })
       .attr("text-anchor", "middle")
       .attr("x", function(d, i) {
          return x(d.Published_Period) + x.bandwidth() / 2;
       })
       .attr("y", function(d) {
           return  y(d.Number_of_Series) + 14;
         })
       .attr("font-family", "sans-serif")
       .attr("font-size", "14px")
       .attr("fill", "white");

       // add year
       svg.selectAll(".text")
          .data(data)
          .enter()
          .append("text")
          .text(function(d) {
             return d.Published_Period;
          })
          .attr("text-anchor", "middle")
          .attr("x", function(d, i) {
             return x(d.Published_Period) + x.bandwidth() / 2;
          })
          .attr("y", y(-1.5))
          .attr("font-family", "sans-serif")
          .attr("font-size", "16px")
          .attr("fill", "black");

      // sort on click
      var sortOrder = false;

      var sortBars = function(){
        sortOrder = !sortOrder;
        svg.selectAll("rect")
           .sort(function(a, b) {
             if(sortOrder){
               return d3.ascending(a.Number_of_Series, b.Number_of_Series);
             } else {
               return d3.descending(a.Number_of_Series, b.Number_of_Series);
             }
           })
           .transition()
           .duration(1000)
           .attr("x", function(d, i) {
                 console.log("bar", i)
                 return x(1950+i*10);
           });
       svg.selectAll("text")
           .sort(function(a, b) {
             if(sortOrder){
               return d3.ascending(a.Number_of_Series, b.Number_of_Series);
             } else {
               return d3.descending(a.Number_of_Series, b.Number_of_Series);
             }
           })
           .transition()
           .duration(1000)
           .attr("x", function(d, i) {
                 console.log("text", i)
                 var n = parseInt(i/2)
                 return x(1950+n*10) + x.bandwidth()/2;
           });
      }

      //When on bars
      d3.selectAll("rect").on("click", function(d) {
        sortBars();
      })
  });


}
