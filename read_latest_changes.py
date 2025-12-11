import pandas as pd
import json

file_path = 'latest-client-change.xlsx'
output_path = 'changes.json'
try:
    xls = pd.ExcelFile(file_path)
    all_data = {}
    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet_name)
        df = df.where(pd.notnull(df), None)
        all_data[sheet_name] = df.to_dict(orient='records')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, indent=2, default=str)
    print(f"Successfully wrote to {output_path}")
except Exception as e:
    print(f"Error: {e}")
