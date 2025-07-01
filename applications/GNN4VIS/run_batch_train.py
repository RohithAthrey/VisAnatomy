import subprocess
import os
from itertools import product
from types import SimpleNamespace as SN

# Define the maximum number of jobs for each account
max_job_nums = [20, 30]
account_combinations = [
    ["cml-scavenger", "cml-scavenger", "cml-scavenger"],
    ["scavenger", "scavenger", "scavenger"],
]
# Define the parameters you want to iterate over
parameters = {
    "algo_name": ["vit_train"],
    "seed": [12345, 215, 114514, 520, 630],
}

param_names = list(parameters.keys())
param_values = [v for v in parameters.values()]
combinations = list(product(*param_values))

root_dir = ""
# Iterate over parameter combinations
jobs_num = 0
for combo in combinations:
    param_dict = {key: value for key, value in zip(param_names, combo)}
    param = SN(**param_dict)
    job_name = f"{param.algo_name}__{param.map_name}__seed_{param.seed}_sr{param.sight_range}_{param.agent_num}_vs_{param.agent_num}"
    python_command = f"python src/main.py --config={param.algo_name} --env-config={param.map_name} with env_args.sight_range_ratio={param.sight_range} env_args.capability_config.n_units={param.agent_num} env_args.capability_config.n_enemies={param.agent_num} use_wandb=True use_tensorboard=True save_model=True t_max=10050000 seed={param.seed}"
    print("----------")
    print(job_name)
    # print(python_command)
    # get qos info
    remainder = jobs_num % sum(max_job_nums)
    for j, val in enumerate(max_job_nums):
        if remainder < sum(max_job_nums[:j+1]):
            account, partition, qos = account_combinations[j]
            print(f"job num: {jobs_num}, account: {account}, partition: {partition}, qos: {qos}")
            break
    jobs_num += 1
    # Create a unique job script for each combination
    # note: change time accordingly
    job_script_content = f'''#!/bin/bash
#SBATCH --job-name={job_name}
#SBATCH --output={root_dir}/slurm_logs/%x.%j.out
#SBATCH --time=24:00:00
#SBATCH --account={account}
#SBATCH --partition={partition}
#SBATCH --qos={qos}
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=64gb
#SBATCH --gres=gpu:1
# Load any necessary modules
# For example, if you need Python, you might load a Python module
CONDA_BASE=$(conda info --base)
source $CONDA_BASE/etc/profile.d/conda.sh
conda activate marl
export SC2PATH={smac_dir}
# Your Python script with parameters
srun bash -c "{python_command}"
'''
    # Write the job script to a file
    job_script_path = f'{root_dir}/slurm_scripts/submit_job__{job_name}.sh'
    with open(job_script_path, 'w') as job_script_file:
        job_script_file.write(job_script_content)
    # Submit the job using sbatch
    subprocess.run(['sbatch', job_script_path])
    # Print the job submission info
    result = ", ".join([f"{name}: {value}" for name, value in zip(param_names, combo)])
    print(f'Job submitted for parameters: {result}')