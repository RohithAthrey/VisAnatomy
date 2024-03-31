currentNode = "root";

function initilizeSimpleBarChart() {
  chartName = "BarChart4";
  currentNode = "root";
  // Fetch the corresponding annotation tool JSON file
  var jsonXhr = new XMLHttpRequest();
  jsonXhr.onreadystatechange = function () {
    if (jsonXhr.readyState === 4 && jsonXhr.status === 200) {
      var annotationData = JSON.parse(jsonXhr.responseText);
      // Process the annotation data as needed
      builtTree_simpleBar(annotationData.annotations);
    }
  };
  jsonXhr.open(
    "GET",
    "targeted SVGs with Annotations/" + chartName + ".json",
    true
  );
  jsonXhr.send();
}

function builtTree_simpleBar(annotation) {
  markInfo = annotation["markInfo"];
  allElements = annotation["allGraphicsElement"];
  referenceElements = annotation["referenceElement"];
  mainChartMarks = Object.keys(markInfo)
    .filter((key) => markInfo[key]["Role"] === "Main Chart Mark")
    .map((id) => allElements[id]);

  annotationCorrespondace = {
    annotation1: {
      marks: [
        "line4",
        "rect1",
        ...[47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61].map(
          (num) => "path" + num
        ),
      ],
      description: "And One For My Dame.",
    },
    annotation2: {
      marks: [
        "line11",
        "rect5",
        ...[
          212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225,
          226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239,
          240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253,
          254, 255, 256, 257, 258, 259, 260, 261, 262, 263,
        ].map((num) => "path" + num),
      ],
      description:
        "Flee On Your Donkey, the most negative poem of this colleciton.",
    },
    annotation3: {
      marks: [
        "line2",
        "rect27",
        ...[
          20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
        ].map((num) => "path" + num),
      ],
      description: "Three Green Windows.",
    },
    annotation4: {
      marks: [
        "line12",
        "rect7",
        ...[
          264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277,
          278, 279, 280, 281, 282, 283,
        ].map((num) => "path" + num),
      ],
      description: "Imitation of Drowning.",
    },
    annotation5: {
      marks: [
        "line3",
        "rect13",
        ...[37, 38, 39, 40, 41, 42, 43, 44, 45, 46].map((num) => "path" + num),
      ],
      description: "Man and Wife.",
    },
    annotation6: {
      marks: [
        "line9",
        "rect21",
        ...[
          144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157,
          158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
          172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185,
          186, 187, 188, 189, 190, 191, 192, 193, 194, 195,
        ].map((num) => "path" + num),
      ],
      description:
        "Sylvia's Death, Sylvia Plath committed suicide Feb. 11, 1963.",
    },
    annotation7: {
      marks: [
        "line6",
        "rect14",
        ...[
          66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
          83, 84,
        ].map((num) => "path" + num),
      ],
      description: "Menstruation At Forty.",
    },
    annotation8: {
      marks: [
        "line7",
        "line8",
        "line15",
        "rect31",
        "rect18",
        ...[
          85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101,
          102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
          116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129,
          130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143,
        ].map((num) => "path" + num),
      ],
      description:
        "Self In 1958 and Wanting To Die are the most positive poems in this collection.",
    },
    annotation9: {
      marks: [
        "line14",
        "rect10",
        ...[
          308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321,
          322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335,
          336, 337, 338, 339, 340, 341, 342, 343, 344,
        ].map((num) => "path" + num),
      ],
      description: "Little Girl, My String Bean, My Lovely Woman.",
    },
    annotation10: {
      marks: [
        "line13",
        "rect0",
        ...[
          284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297,
          298, 299, 300, 301, 302, 303, 304, 305, 306, 307,
        ].map((num) => "path" + num),
      ],
      description: "A Little Uncomplicated Hymn.",
    },
    annotation11: {
      marks: [
        "line10",
        "rect16",
        ...[
          196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209,
          210, 211,
        ].map((num) => "path" + num),
      ],
      description: "Pain For A Daughter.",
    },
    annotation12: {
      marks: [
        "line5",
        "rect11",
        ...[62, 63, 64, 65].map((num) => "path" + num),
      ],
      description: "live.",
    },
  };
  var treeRepresentation = {
    root: {
      level: 0,
      name: "Live or Die is the most negative collection of poems of Anne Sexton’s career.",
      marks: mainChartMarks,
      children: ["mainChart", "annotations"],
      parent: null,
    },
  };

  // add main Chart
  treeRepresentation["mainChart"] = {
    level: 1,
    name: "Roots of the main bar chart area",
    marks: mainChartMarks,
    children: mainChartMarks
      .sort((a, b) => a.left - b.left)
      .map((mark) => mark.id),
    parent: "root",
  };

  // add main chart marks
  mainChartMarks.forEach((mark) => {
    treeRepresentation[mark.id] = {
      level: 2,
      name: "Main chart mark: " + mark.id,
      marks: [mark],
      children: null,
      parent: "mainChart",
    };
  });

  // add annotations
  treeRepresentation["annotations"] = {
    level: 1,
    name: "Roots of the Annotations",
    marks: mainChartMarks,
    children: Object.keys(annotationCorrespondace),
    parent: "root",
  };

  Object.keys(annotationCorrespondace).forEach((annotation, index) => {
    thisMarkSet = annotationCorrespondace[annotation].marks.map(
      (id) => allElements[id]
    );
    treeRepresentation[annotation] = {
      level: 2,
      name: annotationCorrespondace[annotation].description,
      marks: thisMarkSet,
      children: null,
      parent: "annotations",
    };
  });

  console.log(treeRepresentation);
  document.getElementById("navigation").innerHTML =
    treeRepresentation["root"].name;
  addKeyBoardNavigation_simpleBar(treeRepresentation, allElements);
}

function addKeyBoardNavigation_simpleBar(treeRepresentation, allMarks) {
  var lastKeyPressedDiv = document.getElementById("last-key-pressed");
  // Listen to the keyboard event
  document.onkeydown = function (event) {
    switch (event.key) {
      case "ArrowUp":
        navigateUp_simpleBar(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowUp";
        break;
      case "ArrowRight":
        navigateRight_simpleBar(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowRight";
        break;
      case "ArrowDown":
        navigateDown_simpleBar(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowDown";
        break;
      case "ArrowLeft":
        navigateLeft_simpleBar(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowLeft";
        break;
      default:
        break;
    }
    treeRepresentation[currentNode].marks.forEach((mark) => {
      document.getElementById(mark.id).style.opacity = 1;
    });
    Object.values(allMarks).forEach((mark) => {
      if (!treeRepresentation[currentNode].marks.includes(mark)) {
        document.getElementById(mark.id).style.opacity = 0.3;
      }
    });
  };
}

function navigateUp_simpleBar(treeRepresentation) {
  // Navigate to the parent node
  if (treeRepresentation[currentNode].parent !== null) {
    currentNode = treeRepresentation[currentNode].parent;
    document.getElementById("navigation").innerHTML =
      "Navigated to:" + treeRepresentation[currentNode].name;
  }
}

function navigateRight_simpleBar(treeRepresentation) {
  // Navigate to the next sibling node
  var siblings =
    treeRepresentation[treeRepresentation[currentNode].parent]?.children;
  if (siblings === undefined) return;
  var currentIndex = siblings.indexOf(currentNode);
  if (currentIndex < siblings.length - 1) {
    currentNode = siblings[currentIndex + 1];
    document.getElementById("navigation").innerHTML =
      "Navigated to:" + treeRepresentation[currentNode].name;
  }
}

function navigateDown_simpleBar(treeRepresentation) {
  // Navigate to the first child node
  if (treeRepresentation[currentNode].children !== null) {
    currentNode = treeRepresentation[currentNode].children[0];
    document.getElementById("navigation").innerHTML =
      "Navigated to:" + treeRepresentation[currentNode].name;
  }
}

function navigateLeft_simpleBar(treeRepresentation) {
  // Navigate to the previous sibling node
  var siblings =
    treeRepresentation[treeRepresentation[currentNode].parent]?.children;
  if (siblings === undefined) return;
  var currentIndex = siblings.indexOf(currentNode);
  if (currentIndex > 0) {
    currentNode = siblings[currentIndex - 1];
    document.getElementById("navigation").innerHTML =
      "Navigated to:" + treeRepresentation[currentNode].name;
  }
}
