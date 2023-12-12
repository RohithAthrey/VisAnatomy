var groupSelection = false,
  isDragging = false;
var theGroup = [];

function initilizeGroupAnnotation() {
  mainChartMarks = Object.keys(markInfo).filter(
    (m) => markInfo[m].Role === "Main Chart Mark"
  ); // main chart marks

  allSVGElementID.forEach((id) => {
    d3.select("#" + id).style(
      "opacity",
      theGroup.length === 0
        ? mainChartMarks.includes(id)
          ? "1"
          : "0.3"
        : theGroup.map((e) => e.id).includes(id)
        ? "1"
        : "0.3"
    );
  });

  groupSelection = true;
  enableAreaSelection4GroupAnnotation();
}

function checkIntersection(element, rect) {
  // TBD: can store the bounding box and reuse it if the element's position never changes
  // Get the CTM (Current Transformation Matrix) of the SVG element
  let ctm = element.getCTM();

  // Get the bounding box of the element
  let bbox = element.getBBox();

  // Calculate the position within the SVG
  let x = bbox.x * ctm.a + ctm.e;
  let y = bbox.y * ctm.d + ctm.f;

  // Calculate the right and bottom positions
  var width = bbox.width * ctm.a;
  var height = bbox.height * ctm.d;

  return isOverlap({ x, y, width, height }, rect);
}

function updateSelection(bbox4Selection) {
  mainChartMarks.forEach((elementID) => {
    let element = document.getElementById(elementID);
    if (checkIntersection(element, bbox4Selection)) {
      element.classList.add("selected4Group");
      element.classList.remove("unselected4Group");
      if (!theGroup.includes(element)) {
        theGroup.push(element);
      }
      d3.select("#" + elementID).style("opacity", "1");
    } else {
      element.classList.add("unselected4Group");
      element.classList.remove("selected4Group");
      theGroup = theGroup.filter((item) => item !== element);
      d3.select("#" + elementID).style("opacity", "0.3");
    }
  });
  showSelectedMarks();
}

function enableAreaSelection4GroupAnnotation() {
  let clickHold = false,
    layerX,
    layerY,
    clientX,
    clientY;
  d3.select("#vis")
    .on("mousedown", function (e) {
      e.preventDefault();
      isDragging = false;
      allSVGElementID.forEach((id) => {
        d3.select("#" + id).style("opacity", "0.3");
      }); // set opacity
      clickHold = true;
      clientX = e.clientX;
      clientY = e.clientY;
      layerX = e.layerX;
      layerY = e.layerY;
    })
    .on("mousemove", function (e) {
      e.preventDefault();
      if (!clickHold || !groupSelection) return;
      let x = e.layerX,
        y = e.layerY;
      if (x !== layerX || y !== layerY) isDragging = true;
      let left = Math.min(x, layerX),
        top = Math.min(y, layerY),
        wd = Math.abs(layerX - x),
        ht = Math.abs(layerY - y);
      d3.select("#overlaySelection")
        .attr("width", wd)
        .attr("height", ht)
        .attr("x", left)
        .attr("y", top)
        .style("visibility", "visible");
      updateSelection({ x: left, y: top, width: wd, height: ht });
    })
    .on("mouseup", function (e) {
      e.preventDefault();
      clickHold = false;
      if (isDragging) {
        d3.select("#overlaySelection").style("visibility", "hidden");
      } else {
        // find which SVG element within mainChartMarks is clicked on
        let x = e.layerX,
          y = e.layerY;
        let clickedElement = mainChartMarks.find((elementID) => {
            let element = document.getElementById(elementID);
            return checkIntersection(element, { x, y, width: 1, height: 1 });
          }), // clicked element
          element = document.getElementById(clickedElement);
        if (theGroup.includes(element)) {
          element.classList.add("unselected4Group");
          element.classList.remove("selected4Group");
          theGroup = theGroup.filter((item) => item !== element);
        } else {
          element.classList.add("selected4Group");
          element.classList.remove("unselected4Group");
          theGroup.push(element);
        }
        mainChartMarks.forEach((id) => {
          d3.select("#" + id).style(
            "opacity",
            theGroup.includes(document.getElementById(id)) ? "1" : "0.3"
          );
        }); // set opacity
        showSelectedMarks();
      }
    });
}

function showSelectedMarks() {
  document.getElementById("selectedGroup").innerHTML = "";
  theGroup.forEach((element) => {
    // for each selected mark, append a button whose text is the mark's ID in the selectedGroup div
    let markID = element.id;
    let button = document.createElement("button");
    button.setAttribute("class", "btn btn-outline-secondary");
    button.setAttribute("type", "button");
    button.setAttribute("data-toggle", "tooltip");
    button.setAttribute("data-placement", "top");
    button.innerHTML = markID;
    document.getElementById("selectedGroup").appendChild(button);
  });
}
