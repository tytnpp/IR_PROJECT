from flask_restful import  Resource, request
import csv


def convert_to_list(string_data):
    urls_list = string_data.replace('c(', '').replace(')', '').replace('"', '').split(', ')
    return urls_list

def search_and_filter_recipes(keywords, page=1, limit=100, filters=None,query_column="Keywords"):
    page = int(page)
    limit = int(limit)
    # print(keywords)
    # if (keywords == []):
    #     keywords = [""]
    with open('data/recipes_cleaned.csv', 'r') as infile:
        reader = csv.DictReader(infile)

        # Filter rows based on keywords (case-insensitive)
        filtered_data = [row for row in reader if any(keyword.lower() in row[query_column].lower() for keyword in keywords)]

        # Handle pagination (adjust indexes based on page and limit)
        start_index = (page - 1) * limit
        end_index = min(page * limit, len(filtered_data))  # Ensure end_index doesn't exceed data

        prepare_data = []

        key_selection = [
            "Images",
            "Keywords",
            "RecipeIngredientParts",
            "RecipeIngredientQuantities",
            "RecipeInstructions"
        ]

        for row in filtered_data:
            for key in key_selection:
                row[key] = convert_to_list(row[key])
            prepare_data.append(row)


        
        
        return {
            "data": prepare_data[start_index:end_index],
            "total_count": len(filtered_data),
            "page": page,
            "limit": limit
        }


class JSONResponseSearch(Resource):
    def get(self):

        data_params = request.args
        
        # print(data_params)

        q = data_params.get('q') if data_params.get('q') else None
        page = data_params.get('page') if data_params.get('page') else 1
        limit = data_params.get('limit') if data_params.get('limit') else 100
        filters = data_params.get('filters') if data_params.get('filters') else None

        if (q is None or q == ""):
            q = [""]
        else:
            q = q.lower().split(" ")
        
        if (page is None):
            page = 1
        
        if (limit is None):
            limit = 100
        
        if (filters is None):
            filters = None

        data = search_and_filter_recipes(q, page, limit, filters)
    
        return {
            "status" : "success",
            "results": data,
        }
    
    # def post(self):

    #     body = request.get_json()

    #     # q = request.get_json().get('q')
    #     # page = request.get_json().get('page')
    #     # limit = request.get_json().get('limit')
    #     # filters = request.get_json().get('filters')
        
    #     # q = q.lower().split(" ")

    #     # if (q is None):
    #     #     q = ["chicken"]

    #     # if (page is None):
    #     #     page = 1

    #     # if (limit is None):
    #     #     limit = 100
        
    #     # if (filters is None):
    #     #     filters = None

    #     # data = search_and_filter_recipes(q, page, limit, filters)

       
    #     return {
    #         "status" : "success",
    #         "results": data,
    #     }
        

        


        
        