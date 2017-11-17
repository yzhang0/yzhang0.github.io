var linkpath = ("project3_intern_net/data/edges.csv");
var nodepath = ("project3_intern_net/data/nodes.csv");

var width = 900,
    height = 600;

var color = d3.scale.category20();

var svg = d3.select("#force_chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .size([width, height])
    .linkDistance(350)
    .charge(-200);


d3.csv(nodepath, function(nodes) {
    var nodelookup = {};
    var nodecollector = {};
    count = 0;
    nodes.forEach(function(row) {
      nodelookup[row.node] = count;
      nodecollector[row.node] = {name: row.node, freq: row.freq, group: row.group};
      count++;
     });

//Get all the links out of of the csv in a way that will match up with the nodes

    d3.csv(linkpath, function(linkchecker) {
      var linkcollector = {};
      indexsource = 0;
      indextarget = 0;
      count= 0;
      linkchecker.forEach(function(link) {
      linkcollector[count] = {source: nodelookup[link.source], target: nodelookup[link.target], value: link.value, type: link.type };
      count++
    });

    var nodes = d3.values(nodecollector);
    var links = d3.values(linkcollector);

  // Create the link lines.
    var link = svg.selectAll(".link")
          .data(links)
          .enter().append("line")
          .attr("class", function(d) { return "link " + d.type; })

      // Create the node circles.
      var node = svg.selectAll(".node")
          .data(nodes)
        .enter().append("g")
          .attr("class", "node")
        .call(force.drag);

     //put in little circles to drag
      node.append("circle")
          .attr("r", function(d) { return (5-parseInt(d.group.replace ( /[^\d.]/g, '' )))*3;})
          .attr("class", function(d) { return "node " + d.group; })
          .call(force.drag)
          .on("click", function(d) {
            node.selectAll("circle").style("fill", "black");
            d3.select("#force_table").selectAll("*").remove();
            d3.select("#force_table")
              .append("text")
              .text(d.name + ": " + d.freq + " interns")
              .attr("style", "font-family: Courier");

            data_table = [];
            dict_node = {};
            list_node = [];
            for (var i = 0; i < d3.values(linkcollector).length; i++) {
              if(d3.values(linkcollector)[i].target.name == d.name) {
                data_table.push({'company': d3.values(linkcollector)[i].source.name, 'rate': d3.values(linkcollector)[i].value});
                dict_node[d3.values(linkcollector)[i].source.name] = d3.values(linkcollector)[i].type;
                list_node.push(d3.values(linkcollector)[i].source.name);
              }
            }
            changeColor(d.name, dict_node, list_node);
            d3.select(this).style("fill", "#f3f427");
            tabulate(d.name, data_table, ["company", "rate"])
              .selectAll("tbody tr")
              .selectAll("thead th")
              .text(function(column) {
                return column.charAt(0).toUpperCase()+column.substr(1);
                });
          });

    //add the words
     node.append("text")
          .attr("dx", 3)
          .attr("dy", ".35em")
          .text(function(d) { return d.name });

    //get it going!
     force
          .nodes(nodes)
          .links(links)
          .on("tick", tick)
          .start();

      function tick() {
          node.attr("cx", function(d) {
              radius = (5-parseInt(d.group.replace ( /[^\d.]/g, '' )))*3;
              radius = radius <= 3 ? 6 : radius;
              return d.x = Math.max(radius, Math.min(width - radius - d.name.length*8.5, d.x)); })
            .attr("cy", function(d) {
              radius = (5-parseInt(d.group.replace ( /[^\d.]/g, '' )))*3;
              radius = radius <= 3 ? 6 : radius;
              return d.y = Math.max(radius, Math.min(height - radius, d.y)); })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });
      }

      function changeColor(company, data, los){
          node
            .selectAll("circle")
            .filter(function(d) { return los.indexOf(d.name) >= 0; })
            .style("fill", function(d) {
              console.log(data)
              return getColor(data[d.name]); });
      }

      function getColor(type) {
            if (type == "type5") {
              return '#33910e';
            } else if (type == "type4") {
              return '#3ca910';
            } else if (type == "type4") {
              return '#44c113';
            } else if (type == "type3") {
              return '#4dd915';
            } else if (type == "type2") {
              return '#56f218';
            } else if (type == "type1") {
              return '#00ff00';
            } else if (type == "type0") {
              return '#3dece7';
            } else if (type == "type1s") {
              return '#e500b9';
            } else if (type == "type2s") {
              return '#ce00a6';
            } else if (type == "type3s") {
              return '#b70094';
            } else if (type == "type4s") {
              return '#a00081';
            } else if (type == "type5s") {
              return '#89006f';
            }
      }

    });
  });


function tabulate(company, data, columns) {
    var n = data.length;
    data.sort(function(first, second) { return second.rate - first.rate; })
        .splice(5, n - 10);
    var table = d3.select("#force_table")
            .append("table")
            .style("cellpadding", "20px")
            .style("width", "400px")
            .style("border-collapse", "collapse")// <= Add this line in
            .style("border", "1px black solid"), // <= Add this line in
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier") // sets the font style
        .html(function(d) { return d.value; });

    return table;
}
