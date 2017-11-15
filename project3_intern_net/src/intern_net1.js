var linkpath = ("project3_intern_net/data/edges.csv");
var nodepath = ("project3_intern_net/data/nodes.csv");

var width = 1000,
    height = 600;

var color = d3.scale.category20();


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


//Want to have different labels
// SETTING UP THE FORCE LAYOUT
  var force = d3.layout.force()
  //using width/height from above, but size is mainly det'd by linkDistance and charge
    .size([width, height])
    // how far between nodes
    .linkDistance(260)
    // changes how close nodes will get to each other. Neg is farther apart.
    .charge(-100);


d3.csv(nodepath, function(nodes) {

  var nodelookup = {};
  var nodecollector = {};

   count = 0;
// we want to create a lookup table that will relate the links file and the nodes file
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
  linkcollector[count] = {source: nodelookup[link.source], target: nodelookup[link.target], type: link.type };
  count++
});

//console.log(linkcollector)
var nodes = d3.values(nodecollector);
var links = d3.values(linkcollector);

//console.log(nodes)
//console.log(links)

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
    .call(force.drag);

//add the words
 node.append("text")
      .attr("dx", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

//get it going!
 force
      .nodes(nodes)
      .links(links)
      .start();

  force.on("tick", function() {


    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

//I think that translate changes all of the x and ys at once instead of one by one?
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  })


  });
  });
