function initilizeGroupAnnotation() {
  mainChartMarks = Object.keys(markInfo).filter(
    (m) => markInfo[m].Role === "Main Chart Mark"
  );
  console.log(mainChartMarks);
  allSVGElementID.forEach((id) => {
    d3.select("#" + id).style(
      "opacity",
      mainChartMarks.includes(id) ? "1" : "0.1"
    );
  });
}
