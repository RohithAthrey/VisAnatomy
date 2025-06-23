#!/usr/bin/env python3
import os
import json
import time
import subprocess
from datetime import datetime

def check_inference_complete():
    """Check if LLM inference is complete by monitoring progress.json"""
    progress_file = "results/progress.json"
    
    if not os.path.exists(progress_file):
        return False, "Progress file not found"
    
    try:
        with open(progress_file, 'r') as f:
            progress = json.load(f)
        
        total = progress.get("total_files", 0)
        completed = progress.get("completed", 0)
        
        if total > 0 and completed >= total:
            return True, f"Complete: {completed}/{total} files processed"
        else:
            return False, f"In progress: {completed}/{total} files processed"
            
    except Exception as e:
        return False, f"Error reading progress: {e}"

def monitor_and_evaluate():
    """Monitor inference progress and run evaluation when complete"""
    print("🔍 Monitoring LLM inference progress...")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    check_interval = 300  # Check every 5 minutes
    
    while True:
        is_complete, status = check_inference_complete()
        timestamp = datetime.now().strftime('%H:%M:%S')
        
        if is_complete:
            print(f"[{timestamp}] ✅ {status}")
            print("\n🎉 LLM inference completed! Starting evaluation...")
            
            # Generate final comprehensive report
            try:
                result = subprocess.run(['python3', 'generate_final_report.py'], 
                                      capture_output=True, text=True)
                
                if result.returncode == 0:
                    print("✅ Final report generated successfully!")
                    print("\n📊 Final Report:")
                    print(result.stdout)
                else:
                    print("❌ Final report generation failed!")
                    print("Error:", result.stderr)
                    
            except Exception as e:
                print(f"❌ Failed to generate final report: {e}")
            
            break
            
        else:
            print(f"[{timestamp}] ⏳ {status}")
            
        time.sleep(check_interval)

if __name__ == "__main__":
    monitor_and_evaluate() 