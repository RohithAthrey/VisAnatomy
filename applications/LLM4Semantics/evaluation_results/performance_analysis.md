# Performance Analysis: Chart Types with Poor Performance

## 🔴 Executive Summary

Analysis of **11 chart types** with F1 scores below 0.8 reveals systematic challenges in **axis label identification** and **legend element detection**. The LLM struggles most with **complex/specialized chart types** and **radial/non-traditional layouts**.

## 📊 Critical Problem Areas

### 🚨 **Axis Labels** (Most Critical - 7 chart types affected)

**Worst performers:**

- **GroupedBarChart**: 0.454 F1 - Fails to distinguish grouped vs individual bar labels
- **BoxAndWhisker**: 0.512 F1 - Struggles with statistical measure labels
- **Calendar**: 0.623 F1 - Difficulty with date/time axis labels
- **BarChartInRadialLayout**: 0.655 F1 - Radial layout confuses label identification

**Root Cause:** LLM has difficulty identifying axis tick labels in:

- Charts with multiple data series (GroupedBarChart)
- Non-traditional layouts (radial, calendar)
- Statistical charts with specialized notation

### 🔺 **Legend Elements** (Secondary issue)

**Legend Titles** (3 chart types):

- **BulletChart**: 0.450 F1
- **BarChartInRadialLayout**: 0.571 F1
- **ConnectedDotPlot**: 0.650 F1

**Legend Marks** (3 chart types):

- **RadialBarChart**: 0.556 F1
- **ConnectedDotPlot**: 0.583 F1
- **RadarChart**: 0.696 F1

**Root Cause:** Complex visual legends with non-standard symbols or positioning

## 🎯 Chart Type Complexity Analysis

### 🔴 **Specialized/Complex Charts** (Poor Performance: 0.697-0.759 F1)

1. **BulletChart**: 0.697 F1

   - **Problems**: Legend titles (0.450), Axis titles (0.633)
   - **Why**: Unfamiliar chart type, multiple reference lines

2. **BarChartInRadialLayout**: 0.720 F1

   - **Problems**: Legend titles (0.571), Axis labels (0.655)
   - **Why**: Radial layout disrupts traditional element positioning

3. **RadialBarChart**: 0.756 F1

   - **Problems**: Legend marks (0.556), Legend labels (0.667)
   - **Why**: Circular arrangement, non-standard legend placement

4. **ConnectedDotPlot**: 0.759 F1
   - **Problems**: Legend marks (0.583), Legend titles (0.650)
   - **Why**: Mixed chart elements (dots + lines), complex legends

### 🟢 **Simple/Common Charts** (Good Performance: 0.816-0.887 F1)

- **BarChart**: 0.887 F1 ✅
- **LineGraph**: 0.880 F1 ✅
- **AreaChart**: 0.876 F1 ✅
- **PieChart**: 0.816 F1 ✅

## 📈 Category-Specific Performance Patterns

| Category             | Avg F1 Score | Main Issues                                           |
| -------------------- | ------------ | ----------------------------------------------------- |
| **Main Chart Marks** | 0.85+        | ✅ Generally good - LLM identifies data elements well |
| **Axis Titles**      | 0.75-0.80    | 🟡 Moderate - Some confusion with descriptive labels  |
| **Axis Labels**      | 0.60-0.75    | 🔴 **Critical** - Major identification failures       |
| **Legend Labels**    | 0.70-0.85    | 🟠 Variable - Depends on chart complexity             |
| **Legend Marks**     | 0.65-0.80    | 🟠 Challenging - Visual symbol recognition issues     |
| **Legend Titles**    | 0.65-0.85    | 🟠 Inconsistent - Layout-dependent                    |

## 🔍 Root Cause Analysis

### **1. Layout Complexity**

- **Radial/Circular layouts** confuse traditional element identification
- **Non-standard positioning** breaks LLM's spatial understanding
- **Multiple data series** create ambiguity in element grouping

### **2. Visual Complexity**

- **Specialized symbols** in legends are harder to identify
- **Statistical notation** (box plots, bullet charts) is unfamiliar
- **Mixed chart types** (connected dots) create confusion

### **3. Training Data Bias**

- LLM performs well on **common chart types** (bar, line, area)
- Struggles with **specialized charts** less common in training data
- **Radial layouts** likely underrepresented in training

## 💡 Recommendations

### **Immediate Improvements**

1. **Enhanced Prompts** for axis label identification
2. **Specialized handling** for radial/circular layouts
3. **Context clues** for statistical chart notation

### **Training Enhancements**

1. **Increase specialized chart examples** in training data
2. **Focus on radial layout patterns**
3. **Improve legend symbol recognition**

### **Chart-Specific Strategies**

- **BulletChart**: Add bullet chart explanation in prompt
- **RadialBarChart**: Include radial layout guidance
- **ConnectedDotPlot**: Clarify hybrid chart element identification
- **BoxAndWhisker**: Add statistical notation context

## 📊 Success Metrics

**Target Improvements:**

- **Axis Labels**: From 0.60-0.75 → **0.80+** F1
- **Legend Elements**: From 0.65-0.80 → **0.85+** F1
- **Specialized Charts**: From 0.70-0.76 → **0.85+** F1

**Priority Order:**

1. 🚨 **Axis Labels** (affects 7 chart types)
2. 🔺 **Legend Elements** (affects 6 chart types)
3. 🎯 **Specialized Charts** (affects 4 chart types)

---

_Analysis generated from 772 evaluated charts with 42 different chart types_
