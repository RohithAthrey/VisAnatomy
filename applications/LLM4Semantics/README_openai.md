# SVG Semantic Analysis with OpenAI

This script uses OpenAI's GPT-4o model with Batch API to analyze SVG files and identify semantic elements like chart marks, legends, axis labels, and titles.

## Features

- **Cost-effective**: Uses OpenAI's Batch API which offers 50% lower pricing
- **Efficient**: Processes multiple SVG files in a single batch job
- **Same output format**: Produces identical results to the DeepSeek version
- **Progress tracking**: Monitors batch processing progress
- **Error handling**: Robust error handling and progress reporting

## Installation

1. Install required dependencies:

```bash
pip install -r requirements_openai.txt
```

## Usage

1. Make sure you have SVG files in the `../../charts_svg` directory
2. Run the script:

```bash
python infer_openai.py
```

The script will:

1. Create a batch input file from all SVG files
2. Upload the batch to OpenAI
3. Wait for batch completion (can take up to 24 hours)
4. Download and process results
5. Save individual JSON annotation files in `results_openai/` directory

## Output Structure

Each SVG file produces a corresponding `*_llm_annotation.json` file with this structure:

```json
{
  "main_chart_marks": ["element_id1", "element_id2", ...],
  "legend": {
    "title": ["element_id1", "element_id2", ...],
    "marks": ["element_id1", "element_id2", ...],
    "labels": ["element_id1", "element_id2", ...]
  },
  "axis_labels": ["element_id1", "element_id2", ...],
  "axis_titles": ["element_id1", "element_id2", ...]
}
```

## Configuration

You can modify the following in the `main()` function:

- `CHARTS_SVG_DIR`: Path to SVG files directory
- `RESULTS_DIR`: Output directory for results
- Model parameters in the batch request (temperature, max_tokens, etc.)

## Batch Processing Details

- **Model**: GPT-4o
- **Completion window**: 24 hours
- **Max tokens**: 4096 per request
- **Temperature**: 0.1 (for consistent results)
- **Response format**: JSON object

## Progress Tracking

The script creates a `progress.json` file that tracks:

- Total files processed
- Success/failure counts
- Individual file results
- Processing timestamps

## Cost Savings

Using Batch API provides:

- 50% lower cost compared to synchronous API calls
- Efficient processing of large numbers of files
- Better resource utilization
