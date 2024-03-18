currentNode = "root";

function initilizeStackedBarChart() {
  chartName = "StackedBarChart11";
  currentNode = "root";
  // Fetch the corresponding annotation tool JSON file
  var jsonXhr = new XMLHttpRequest();
  jsonXhr.onreadystatechange = function () {
    if (jsonXhr.readyState === 4 && jsonXhr.status === 200) {
      var annotationData = JSON.parse(jsonXhr.responseText);
      // Process the annotation data as needed
      builtTree_stackedBar(annotationData.annotations);
    }
  };
  jsonXhr.open(
    "GET",
    "targeted SVGs with Annotations/" + chartName + ".json",
    true
  );
  jsonXhr.send();
}

function builtTree_stackedBar(annotation) {
  markInfo = annotation["markInfo"];
  allElements = annotation["allGraphicsElement"];
  referenceElements = annotation["referenceElement"];
  mainChartMarks = Object.keys(markInfo)
    .filter((key) => markInfo[key]["Role"] === "Main Chart Mark")
    .map((id) => allElements[id]);
  var treeRepresentation = {
    root: {
      level: 0,
      name: "A stacked bar chart showing sale values on three products in quarters of 2011 and 2022.",
      marks: mainChartMarks,
      children: ["xAxis", "yAxis", "legend"],
      parent: null,
    },
  };

  // add legend
  treeRepresentation["legend"] = {
    level: 1,
    name: "Legend is showing the three products, A, B and C.",
    marks: mainChartMarks,
    children: referenceElements.legend.labels.map((label) => label.id),
    parent: "root",
  };

  // add legend label level
  referenceElements.legend.labels.map((label) => {
    thisColor = referenceElements.legend.mapping[label.content];
    marksOflabel = mainChartMarks.filter((mark) => mark.fill === thisColor);
    treeRepresentation[label.id] = {
      level: 2,
      name: label.content,
      marks: marksOflabel,
      children: marksOflabel.map((mark) => mark.id + "_legend"),
      parent: "legend",
    };

    marksOflabel.map((mark) => {
      treeRepresentation[mark.id + "_legend"] = {
        level: 3,
        name: mark.id,
        marks: [mark],
        children: null,
        parent: label.id,
      };
    });
  });

  // add y axis
  treeRepresentation["yAxis"] = {
    level: 1,
    name: "Y Axis is the sale values of three products, ranging from 0 to 100.",
    marks: mainChartMarks,
    children: null,
    parent: "root",
  };

  // add x axis
  treeRepresentation["xAxis"] = {
    level: 1,
    name: "X Axis is quarter of the years 2021 and 2022",
    marks: mainChartMarks,
    children: referenceElements.axes[1].labels.map((label) => label.id),
    parent: "root",
  };

  // add x axis label level
  referenceElements.axes[1].labels.map((label) => {
    labelCenter = label.left + label.width / 2;
    marksOflabel = mainChartMarks.filter(
      (mark) =>
        parseFloat(mark.left) <= labelCenter &&
        parseFloat(mark.right) >= labelCenter
    );
    treeRepresentation[label.id] = {
      level: 2,
      name: label.content,
      marks: marksOflabel,
      children: marksOflabel
        .sort((a, b) => a.top - b.top)
        .map((mark) => mark.id + "_xAxis"),
      parent: "xAxis",
    };

    marksOflabel.map((mark) => {
      treeRepresentation[mark.id + "_xAxis"] = {
        level: 3,
        name: mark.id,
        marks: [mark],
        children: null,
        parent: label.id,
      };
    });
  });

  addKeyBoardNavigation_stackedBar(treeRepresentation, mainChartMarks);
}

function addKeyBoardNavigation_stackedBar(treeRepresentation, allMarks) {
  var lastKeyPressedDiv = document.getElementById("last-key-pressed");
  // Listen to the keyboard event
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowUp":
        navigateUp_stackedBar(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowUp";
        break;
      case "ArrowRight":
        navigateRight_stackedBar(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowRight";
        break;
      case "ArrowDown":
        navigateDown_stackedBar(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowDown";
        break;
      case "ArrowLeft":
        navigateLeft_stackedBar(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowLeft";
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
  });
}

function navigateUp_stackedBar(treeRepresentation) {
  // Navigate to the parent node
  if (treeRepresentation[currentNode].parent !== null) {
    currentNode = treeRepresentation[currentNode].parent;
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}

function navigateRight_stackedBar(treeRepresentation) {
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

function navigateDown_stackedBar(treeRepresentation) {
  // Navigate to the first child node
  if (treeRepresentation[currentNode].children !== null) {
    currentNode = treeRepresentation[currentNode].children[0];
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}

function navigateLeft_stackedBar(treeRepresentation) {
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
