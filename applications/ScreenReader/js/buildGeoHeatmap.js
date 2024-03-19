currentNode = "root";

var provinces = [
  "Guangdong",
  "Jilin",
  "Xinjiang",
  "Zhejiang",
  "Chongqing",
  "Qinghai",
  "Jiangxi",
  "Guangxi",
  "Ningxia",
  "Heilongjiang",
  "Anhui",
  "Xizang",
  "Hunan",
  "Yunnan",
  "Sichuan",
  "Gansu",
  "Tianjin",
  "Guizhou",
  "Shanxi",
  "Hebei",
  "Neimenggu",
  "Fujian",
  "Shanghai",
  "Hubei",
  "Shaanxi",
  "Shandong",
  "Henan",
  "Jiangsu",
  "Hainan",
  "Beijing",
  "Liaoning",
];
var ProvinceCityMap = {
  Beijing: ["Beijing"],
  Tianjin: ["Tianjin"],
  Hebei: [
    "Tangshan",
    "Xingtai",
    "Langfang",
    "Shijiazhuang",
    "Zhangjiakou",
    "Cangzhou",
    "Hengshui",
    "Chengde",
    "Baoding",
    "Qinhuangdao",
    "Handan",
  ],
  Shanxi: [
    "Taiyuan",
    "Linfen",
    "Shuozhou",
    "Xinzhou",
    "Jinzhong",
    "Lvliangdiqu",
    "Yangquan",
    "Datong",
    "Jincheng",
    "Changzhi",
    "Yuncheng",
  ],
  Neimenggu: [
    "Xingan",
    "Yikezhao",
    "Baotou",
    "Hulunbeier",
    "Xilinguole",
    "Wulanchabu",
    "Huhehaote",
    "Bayannaoer",
    "Alashan",
    "Wuhai",
    "Chifeng",
    "Tongliao",
  ],
  Liaoning: [
    "Fushun",
    "Panjin",
    "Tieling",
    "Anshan",
    "Shenyang",
    "Benxi",
    "Fuxin",
    "Dandong",
    "Liaoyang",
    "Dalian",
    "Yingkou",
    "Chaoyang",
    "Huludao",
    "Jinzhou",
  ],
  Jilin: [
    "Jilin",
    "Baishan",
    "Songyuan",
    "Baicheng",
    "Changchun",
    "Siping",
    "Tonghua",
    "Liaoyuan",
    "Yanbianchaoxianzu",
  ],
  Heilongjiang: [
    "Jiamusi",
    "Daxinganlingdiqu",
    "Hegang",
    "Jixi",
    "Daqing",
    "Qiqihaer",
    "Suihua",
    "Mudanjiang",
    "Yichun",
    "Qitaihe",
    "Heihe",
    "Haerbin",
    "Shuangyashan",
  ],
  Shanghai: ["Shanghai"],
  Jiangsu: [
    "Huaiyin",
    "Yangzhou",
    "Wuxi",
    "Suzhou",
    "Xuzhou",
    "Nanjing",
    "Lianyungang",
    "Zhenjiang",
    "Suqian",
    "Taizhou",
    "Changzhou",
    "Yancheng",
    "Nantong",
  ],
  Zhejiang: [
    "Lishui",
    "Jiaxing",
    "Jinhua",
    "Hangzhou",
    "Ningbo",
    "Taizhou",
    "Zhoushan",
    "Shaoxing",
    "Quzhou",
    "Wenzhou",
    "Huzhou",
  ],
  Anhui: [
    "Xuancheng",
    "Huangshan",
    "Maanshan",
    "Chuzhou",
    "Anqing",
    "Suzhou",
    "Bozhou",
    "Huainan",
    "Huaibei",
    "Liuan",
    "Hefei",
    "Tongling",
    "Fuyang",
    "Chizhou",
    "Bengbu",
    "Wuhu",
    "Chaohu",
  ],
  Fujian: [
    "Ningde",
    "Xiamen",
    "Quanzhou",
    "Sanming",
    "Putian",
    "Fuzhou",
    "Nanping",
    "Longyan",
    "Zhangzhou",
  ],
  Jiangxi: [
    "Jiujiang",
    "Xinyu",
    "Shangrao",
    "Fuzhou",
    "Ganzhou",
    "Yichun",
    "Yingtan",
    "Jingdezhen",
    "Nanchang",
    "Jian",
    "Pingxiang",
  ],
  Shandong: [
    "Linyi",
    "Heze",
    "Rizhao",
    "Laiwu",
    "Dongying",
    "Liaocheng",
    "Binzhou",
    "Yantai",
    "Weifang",
    "Weihai",
    "Jining",
    "Zaozhuang",
    "Taian",
    "Dezhou",
    "Qingdao",
    "Jinan",
    "Zibo",
  ],
  Henan: [
    "Zhoukou",
    "Sanmenxia",
    "Xinyang",
    "Xinxiang",
    "Shangqiu",
    "Anyang",
    "Jiaozuo",
    "Luohe",
    "Luoyang",
    "Nanyang",
    "Kaifeng",
    "Puyang",
    "Pingdingshan",
    "Xuchang",
    "Zhumadian",
    "Hebi",
    "Zhengzhou",
  ],
  Hubei: [
    "Yichang",
    "Xiaogan",
    "Xiangfan",
    "Huanggang",
    "Ezhou",
    "Enshitujiazumiaozu",
    "Jingzhou",
    "Shiyan",
    "Hubei (Direct Units)",
    "Suizhou",
    "Huangshi",
    "Xianning",
    "Jingmen",
    "Wuhan",
  ],
  Hunan: [
    "Xiangxitujiazumiaozu",
    "Zhangjiajie",
    "Yueyang",
    "Hengyang",
    "Zhuzhou",
    "Chenzhou",
    "Huaihua",
    "Loudi",
    "Shaoyang",
    "Changde",
    "Yiyang",
    "Changsha",
    "Yongzhou",
    "Xiangtan",
  ],
  Guangdong: [
    "Zhuhai",
    "Meizhou",
    "Heyuan",
    "Zhanjiang",
    "Yangjiang",
    "Zhaoqing",
    "Maoming",
    "Jieyang",
    "Jiangmen",
    "Guangzhou",
    "Shaoguan",
    "Dongguan",
    "Shantou",
    "Foshan",
    "Shenzhen",
    "Shanwei",
    "Qingyuan",
    "Chaozhou",
    "Yunfu",
    "Zhongshan",
    "Huizhou",
  ],
  Guangxi: [
    "Yulin",
    "Wuzhou",
    "Hechidiqu",
    "Qinzhou",
    "Fangchenggang",
    "Nanningdiqu",
    "Guigang",
    "Liuzhou",
    "Nanning",
    "Liuzhoudiqu",
    "Baisediqu",
    "Beihai",
    "Hezhoudiqu",
    "Guilin",
  ],
  Hainan: ["Munidiqu", "Sanya", "Haikou"],
  Chongqing: ["Chongqing"],
  Sichuan: [
    "Meishan",
    "Guangyuan",
    "Ganzicangzu",
    "Liangshanyizu",
    "Mianyang",
    "Nanchong",
    "Ziyang",
    "Yibin",
    "Guangan",
    "Zigong",
    "Suining",
    "Deyang",
    "Dazhou",
    "Yaan",
    "Chengdu",
    "Luzhou",
    "Abacangzuqiangzu",
    "Leshan",
    "Neijiang",
    "Bazhong",
    "Panzhihua",
  ],
  Guizhou: [
    "Qiannanbuyizumiaozu",
    "Qiandongnanmiaozudongzu",
    "Liupanshui",
    "Tongrendiqu",
    "Anshun",
    "Bijiediqu",
    "Qianxinanbuyizumiaozu",
    "Zunyi",
    "Guiyang",
  ],
  Yunnan: [
    "Lincangdiqu",
    "Xishuangbannadaizu",
    "Qujing",
    "Yuxi",
    "Wenshanzhuangzumiaozu",
    "Chuxiongyizu",
    "Diqingcangzu",
    "Dehongdaizujingpozu",
    "Simaodiqu",
    "Lijiangdiqu",
    "Zhaotongdiqu",
    "Dalibaizu",
    "Baoshandiqu",
    "Honghehanizuyizu",
    "Nujianglisuzu",
    "Kunming",
  ],
  Xizang: [
    "Lasa",
    "Changdudiqu",
    "Linzhidiqu",
    "Naqudiqu",
    "Shannandiqu",
    "Rikazediqu",
    "Alidiqu",
  ],
  Shaanxi: [
    "Yulin",
    "Tongchuan",
    "Shangluodiqu",
    "Baoji",
    "Hanzhong",
    "Ankang",
    "Weinan",
    "Xianyang",
    "Yanan",
    "Xian",
  ],
  Gansu: [
    "Gannancangzu",
    "Longnandiqu",
    "Baiyin",
    "Tianshui",
    "Jinchang",
    "Wuweidiqu",
    "Lanzhou",
    "Jiuquandiqu",
    "Qingyangdiqu",
    "Pingliangdiqu",
    "Linxiahuizu",
    "Dingxidiqu",
    "Zhangyediqu",
    "Jiayuguan",
  ],
  Qinghai: [
    "Yushucangzu",
    "Haiximengguzucangzu",
    "Hainancangzu",
    "Haidongdiqu",
    "Huangnancangzu",
    "Xining",
    "Guoluocangzu",
    "Haibeicangzu",
  ],
  Ningxia: ["Yinchuan", "Guyuandiqu", "Wuzhong", "Shizuishan"],
  Xinjiang: [
    "Bayinguolengmenggu",
    "Changjihuizu",
    "Kelamayi",
    "Yilihasake",
    "Aletaidi",
    "Hetiandiqu",
    "Akesudiqu",
    "Hamidiqu",
    "Kashendiqu",
    "Wulumuqi",
    "Tachengdi",
    "Boertalamenggu",
    "Kezilesukeerkezi",
    "Tulufandiqu",
    "Xinjiang (Direct Units)",
  ],
};

var provinceMarks = {};
var cityMarks = {};
var cityCases = {};

function initilizeGeoHeatmap() {
  chartName = "GeoHeatmap9";
  currentNode = "root";
  // Fetch the corresponding annotation tool JSON file
  var jsonXhr = new XMLHttpRequest();
  jsonXhr.onreadystatechange = function () {
    if (jsonXhr.readyState === 4 && jsonXhr.status === 200) {
      var annotationData = JSON.parse(jsonXhr.responseText);
      // Process the annotation data as needed
      builtTree_geoHeatmap(annotationData.annotations);
    }
  };
  jsonXhr.open(
    "GET",
    "targeted SVGs with Annotations/" + chartName + ".json",
    true
  );
  jsonXhr.send();
}

function builtTree_geoHeatmap(annotation) {
  markInfo = annotation["markInfo"];
  allElements = annotation["allGraphicsElement"];
  referenceElements = annotation["referenceElement"];
  mainChartMarks = Object.keys(markInfo)
    .filter((key) => markInfo[key]["Role"] === "Main Chart Mark")
    .map((id) => allElements[id]);
  console.log(mainChartMarks);

  // data processing
  mainChartMarks.forEach((mark) => {
    let text = mark.content.split(">")[1].split("<")[0];
    let city = text.split("-")[0].trim();
    let cases = text.split("-")[1].trim();
    cityCases[city] = cases;
    cityMarks[city] = [mark];
  });

  provinces.forEach((province) => {
    provinceMarks[province] = [];
    ProvinceCityMap[province].forEach((city) => {
      provinceMarks[province].push(...cityMarks[city]);
    });
  });

  var treeRepresentation = {
    root: {
      level: 0,
      name: 'Choropleth Map of the Covid-19 Cases in China; Source: China Data Lab, 2020, "China COVID-19 Daily Cases with Basemap", https://doi.org/10.7910/DVN/MR5IJN, Harvard Dataverse, V26, UNF:6:oXusV6Q9osEUFphOlz5oiQ==',
      marks: mainChartMarks,
      children: ["Legend", "allProvinces"],
      parent: null,
    },
    allProvinces: {
      level: 1,
      name: "All Provinces in China",
      marks: mainChartMarks,
      children: [...provinces.map((province) => "Province_" + province)],
      parent: "root",
    },
  };

  // add provinces
  provinces.map((province) => {
    treeRepresentation["Province_" + province] = {
      level: 2,
      name: province,
      marks: provinceMarks[province],
      children: ProvinceCityMap[province],
      parent: "allProvinces",
    };

    // add cities
    ProvinceCityMap[province].map((city) => {
      treeRepresentation[city] = {
        level: 3,
        name: city,
        marks: cityMarks[city],
        children: null,
        parent: "Province_" + province,
      };
    });
  });

  // add legend
  caseIntervals = {
    interval1: [0, 10],
    interval2: [11, 100],
    interval3: [101, 1000],
    interval4: [1001, 10000],
    interval5: [10001, 10000000],
  };
  treeRepresentation["Legend"] = {
    level: 1,
    name: "Legend",
    marks: mainChartMarks,
    children: Object.keys(caseIntervals),
    parent: "root",
  };

  Object.keys(caseIntervals).map((interval) => {
    let cityInThisInterval = Object.keys(cityCases)
      .filter(
        (city) =>
          cityCases[city] >= caseIntervals[interval][0] &&
          cityCases[city] <= caseIntervals[interval][1]
      )
      .map((city) => cityMarks[city])
      .flat();
    treeRepresentation[interval] = {
      level: 2,
      name: interval,
      marks: cityInThisInterval,
      children: null,
      parent: "Legend",
    };
  });

  console.log(treeRepresentation);
  addKeyBoardNavigation_geoHeatmap(treeRepresentation, mainChartMarks);
}

function addKeyBoardNavigation_geoHeatmap(treeRepresentation, allMarks) {
  var lastKeyPressedDiv = document.getElementById("last-key-pressed");
  // Listen to the keyboard event
  document.onkeydown = function (event) {
    switch (event.key) {
      case "ArrowUp":
        navigateUp_geoHeatmap(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowUp";
        break;
      case "ArrowRight":
        navigateRight_geoHeatmap(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowRight";
        break;
      case "ArrowDown":
        navigateDown_geoHeatmap(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowDown";
        break;
      case "ArrowLeft":
        navigateLeft_geoHeatmap(treeRepresentation);
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
  };
}

function navigateUp_geoHeatmap(treeRepresentation) {
  // Navigate to the parent node
  if (treeRepresentation[currentNode].parent !== null) {
    currentNode = treeRepresentation[currentNode].parent;
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}

function navigateRight_geoHeatmap(treeRepresentation) {
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

function navigateDown_geoHeatmap(treeRepresentation) {
  // Navigate to the first child node
  if (treeRepresentation[currentNode].children !== null) {
    currentNode = treeRepresentation[currentNode].children[0];
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}

function navigateLeft_geoHeatmap(treeRepresentation) {
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
