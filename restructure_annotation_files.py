import os
import json

script_dir = os.path.dirname(os.path.realpath(__file__))
annotations_folder = os.path.join(script_dir, "annotations")

# Create restructured_annotations directory if it doesn't exist
restructured_dir = os.path.join(script_dir, "restructured_annotations")
os.makedirs(restructured_dir, exist_ok=True)

# then, for each file, load the json data
for file in os.listdir(annotations_folder):
    if file.endswith(".json"):
        # get file name without extension
        file_name = os.path.splitext(file)[0]
        print("restructuring", file_name)
        with open(os.path.join(annotations_folder, file), "r") as f:
            data = json.load(f)["annotations"]
            # restruct the data
            # remove the textObjectLinking  and groupedGraphicsElement keys if it exists
            if "textObjectLinking" in data:
                data.pop("textObjectLinking")
            if "groupedGraphicsElement" in data:
                data.pop("groupedGraphicsElement")
            # rename allGraphicsElement into allElements
            if "allGraphicsElement" in data:
                data["allElements"] = data.pop("allGraphicsElement")
            # merge the layoutInfo into the nestedGrouping
            # if groupInfo is just an array of length 1, then restructure to nested format
            if len(data["groupInfo"]) == 1:
                data["grouping"] = {
                    "g0": {
                        "layout": data["layoutInfo"].get(str(0), None),
                        "children": data["groupInfo"][0]
                    }
                }
            else:
                # here we need to merge the layoutInfo into the groupInfo recursively
                current_index = len(data["groupInfo"]) - 1  # Start from last group
                
                def parse_nested_groups(group_array, index):
                    global current_index
                    current_index += 1
                    result = {}
                    group_key = f"g{current_index}"
                    result["layout"] = data["layoutInfo"].get(str(current_index), None)
                    result["children"] = []
                    for element in group_array:
                        if isinstance(element, list):
                            result["children"].append(parse_nested_groups(element, current_index))
                        else:
                            result["children"].append({
                                "g"+str(element): {
                                    "layout": data["layoutInfo"].get(str(element), None),
                                    "children": data["groupInfo"][element]
                                }
                            })
                    return {group_key: result}
                
                data["grouping"] = parse_nested_groups(data["nestedGrouping"][0], current_index)

            # save the data to a new file in the ./annotations/restructured folder
            with open(os.path.join(restructured_dir, file_name + ".json"), "w") as f:
                json.dump(data, f)