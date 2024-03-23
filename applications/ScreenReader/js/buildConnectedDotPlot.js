currentNode = "root";

function initilizeConnectedDotPlot() {
  chartName = "ConnectedDotPlot9";
  currentNode = "root";
  // Fetch the corresponding annotation tool JSON file
  var jsonXhr = new XMLHttpRequest();
  jsonXhr.onreadystatechange = function () {
    if (jsonXhr.readyState === 4 && jsonXhr.status === 200) {
      var annotationData = JSON.parse(jsonXhr.responseText);
      // Process the annotation data as needed
      builtTree_connectedDotPlot(annotationData.annotations);
    }
  };
  jsonXhr.open(
    "GET",
    "targeted SVGs with Annotations/" + chartName + ".json",
    true
  );
  jsonXhr.send();
}

function builtTree_connectedDotPlot(annotation) {
  markInfo = annotation["markInfo"];
  allElements = annotation["allGraphicsElement"];
  referenceElements = annotation["referenceElement"];
  groupInfo = annotation["groupInfo"];
  nestedGrouping = annotation["nestedGrouping"];
  mainChartMarks = Object.keys(markInfo)
    .filter((key) => markInfo[key]["Role"] === "Main Chart Mark")
    .map((id) => allElements[id]);
  var treeRepresentation = {
    root: {
      level: 0,
      name: "Topics Mentioned Comparison between the Republicans and the Democrats on the orlando shooting tragedy.",
      marks: mainChartMarks,
      children: ["Republicans", "Democrats"],
      parent: null,
    },
  };

  mentionedMoreByRepublicans = [
    "Thoughts & Prayers",
    "Condemned terrorism",
    "Used phrases similar to radical Islam",
    "Praised first responders",
    "Criticized Obama administration",
    "Stated support for gun rights",
  ];
  mentionedMoreByDemocrats = [
    "Addressed LGBT community",
    "Mentioned hate",
    "Advanced gun control",
  ];

  // add Republicans
  treeRepresentation["Republicans"] = {
    level: 1,
    name: "topics mentioned more by Republicans",
    marks: nestedGrouping[0][0]
      .map((id) => groupInfo[id])
      .flat(Infinity)
      .map((id) => allElements[id]),
    children: mentionedMoreByRepublicans,
    parent: "root",
  };

  mentionedMoreByRepublicans.forEach((topic, index) => {
    thisMarkSet = groupInfo[nestedGrouping[0][0][index]].map(
      (id) => allElements[id]
    );
    treeRepresentation[topic] = {
      level: 2,
      name: mentionedMoreByRepublicans[index],
      marks: thisMarkSet,
      children: thisMarkSet
        .filter((m) => m.tagName === "circle")
        .map((m) => m.id),
      parent: "Republicans",
    };

    thisMarkSet.forEach((mark, index) => {
      treeRepresentation[mark.id] = {
        level: 3,
        name: mark.id,
        marks: [mark],
        children: null,
        parent: topic,
      };
    });
  });

  // add Democrats
  treeRepresentation["Democrats"] = {
    level: 1,
    name: "topics mentioned more by Democrats",
    marks: nestedGrouping[0][1]
      .map((id) => groupInfo[id])
      .flat(Infinity)
      .map((id) => allElements[id]),
    children: mentionedMoreByDemocrats,
    parent: "root",
  };

  mentionedMoreByDemocrats.forEach((topic, index) => {
    thisMarkSet = groupInfo[nestedGrouping[0][1][index]].map(
      (id) => allElements[id]
    );
    treeRepresentation[topic] = {
      level: 2,
      name: mentionedMoreByDemocrats[index],
      marks: thisMarkSet,
      children: thisMarkSet
        .filter((m) => m.tagName === "circle")
        .map((m) => m.id),
      parent: "Democrats",
    };

    thisMarkSet.forEach((mark, index) => {
      treeRepresentation[mark.id] = {
        level: 3,
        name: mark.id,
        marks: [mark],
        children: null,
        parent: topic,
      };
    });
  });

  console.log(annotation);
  console.log(treeRepresentation);
  addKeyBoardNavigation_connectedDotPlot(treeRepresentation, mainChartMarks);
}

function addKeyBoardNavigation_connectedDotPlot(treeRepresentation, allMarks) {
  var lastKeyPressedDiv = document.getElementById("last-key-pressed");
  // Listen to the keyboard event
  document.onkeydown = function (event) {
    switch (event.key) {
      case "ArrowUp":
        navigateUp_connectedDotPlot(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowUp";
        break;
      case "ArrowRight":
        if (event.shiftKey) {
          if (treeRepresentation[currentNode].level === 2) {
            if (treeRepresentation[currentNode].parent === "Democrats") {
              let thisIndex = mentionedMoreByDemocrats.indexOf(currentNode);
              currentNode =
                mentionedMoreByRepublicans[
                  thisIndex > mentionedMoreByRepublicans.length - 1
                    ? mentionedMoreByRepublicans.length - 1
                    : thisIndex
                ];
            } else {
              let thisIndex = mentionedMoreByRepublicans.indexOf(currentNode);
              currentNode =
                mentionedMoreByDemocrats[
                  thisIndex > mentionedMoreByDemocrats.length - 1
                    ? mentionedMoreByDemocrats.length - 1
                    : thisIndex
                ];
            }
          }
          lastKeyPressedDiv.textContent =
            "Last key pressed: ArrowRight + Shift";
        } else {
          navigateRight_connectedDotPlot(treeRepresentation);
          lastKeyPressedDiv.textContent = "Last key pressed: ArrowRight";
        }
        break;
      case "ArrowDown":
        navigateDown_connectedDotPlot(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowDown";
        break;
      case "ArrowLeft":
        if (event.shiftKey) {
          if (treeRepresentation[currentNode].level === 2) {
            if (treeRepresentation[currentNode].parent === "Democrats") {
              let thisIndex = mentionedMoreByDemocrats.indexOf(currentNode);
              currentNode =
                mentionedMoreByRepublicans[
                  thisIndex > mentionedMoreByRepublicans.length - 1
                    ? mentionedMoreByRepublicans.length - 1
                    : thisIndex
                ];
            } else {
              let thisIndex = mentionedMoreByRepublicans.indexOf(currentNode);
              currentNode =
                mentionedMoreByDemocrats[
                  thisIndex > mentionedMoreByDemocrats.length - 1
                    ? mentionedMoreByDemocrats.length - 1
                    : thisIndex
                ];
            }
          }
          lastKeyPressedDiv.textContent = "Last key pressed: ArrowLeft + Shift";
        } else {
          navigateLeft_connectedDotPlot(treeRepresentation);
          lastKeyPressedDiv.textContent = "Last key pressed: ArrowLeft";
        }
        break;
      default:
        break;
    }
    treeRepresentation[currentNode].marks.forEach((mark) => {
      document.getElementById(mark.id).style.opacity = 1;
    });
    allMarks.forEach((mark) => {
      if (!treeRepresentation[currentNode].marks.includes(mark)) {
        document.getElementById(mark.id).style.opacity = 0.3;
      }
    });
  };
}

function navigateUp_connectedDotPlot(treeRepresentation) {
  // Navigate to the parent node
  if (treeRepresentation[currentNode].parent !== null) {
    currentNode = treeRepresentation[currentNode].parent;
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}

function navigateRight_connectedDotPlot(treeRepresentation) {
  // Navigate to the next sibling node
  var siblings =
    treeRepresentation[treeRepresentation[currentNode].parent]?.children;
  if (siblings === undefined) return;
  var currentIndex = siblings.indexOf(currentNode);
  if (currentIndex < siblings.length - 1) {
    currentNode = siblings[currentIndex + 1];
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}

function navigateDown_connectedDotPlot(treeRepresentation) {
  // Navigate to the first child node
  if (treeRepresentation[currentNode].children !== null) {
    currentNode = treeRepresentation[currentNode].children[0];
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}

function navigateLeft_connectedDotPlot(treeRepresentation) {
  // Navigate to the previous sibling node
  var siblings =
    treeRepresentation[treeRepresentation[currentNode].parent]?.children;
  if (siblings === undefined) return;
  var currentIndex = siblings.indexOf(currentNode);
  if (currentIndex > 0) {
    currentNode = siblings[currentIndex - 1];
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}
