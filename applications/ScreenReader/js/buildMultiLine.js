currentNode = "root";

function initilizeMultiLineChart() {
  chartName = "LineGraph17";
  currentNode = "root";
  // Fetch the corresponding annotation tool JSON file
  var jsonXhr = new XMLHttpRequest();
  jsonXhr.onreadystatechange = function () {
    if (jsonXhr.readyState === 4 && jsonXhr.status === 200) {
      var annotationData = JSON.parse(jsonXhr.responseText);
      // Process the annotation data as needed
      console.log(annotationData);
      builtTree_multiLine(annotationData.annotations);
    }
  };
  jsonXhr.open(
    "GET",
    "targeted SVGs with Annotations/" + chartName + ".json",
    true
  );
  jsonXhr.send();
}

function builtTree_multiLine(annotation) {
  markInfo = annotation["markInfo"];
  allElements = annotation["allGraphicsElement"];
  referenceElements = annotation["referenceElement"];
  mainChartMarks = Object.keys(markInfo)
    .filter((key) => markInfo[key]["Role"] === "Main Chart Mark")
    .map((id) => allElements[id]);
  console.log(mainChartMarks);
  var treeRepresentation = {
    root: {
      level: 0,
      name: "A stacked bar chart showing sale values on three products in quarters of 2011 and 2022.",
      marks: mainChartMarks,
      children: ["xAxis", "yAxis", "legend"],
      parent: null,
    },
  };
}
