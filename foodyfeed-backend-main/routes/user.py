from flask_restful import  Resource, request
import csv


def convert_to_list(string_data):
    urls_list = string_data.replace('c(', '').replace(')', '').replace('"', '').split(', ')
    return urls_list

# RecipeId,Name,AuthorId,AuthorName,CookTime,PrepTime,TotalTime,DatePublished,Description,Images,RecipeCategory,Keywords,RecipeIngredientQuantities,RecipeIngredientParts,AggregatedRating,ReviewCount,Calories,FatContent,SaturatedFatContent,CholesterolContent,SodiumContent,CarbohydrateContent,FiberContent,SugarContent,ProteinContent,RecipeServings,RecipeYield,RecipeInstructions

# UID,RUID,UUID,RName,Keywords,Description,ImageURL
class JSONResponseBookmark(Resource):

  # column UID,RUID,UUID,RName,Keywords,Description,ImageURL

  # get all bookmark by user id 
  def get(self):
  
    accessToken = request.headers.get('Authorization')
    # print("allte",accessToken)
    if (accessToken is None):
      return {
        "status" : "error",
        "results": {
          "message": "Token is required"
        },
      }
    uid = accessToken.split('-').pop()
    # print("A",uid)

    if (uid is None):
      return {
        "status" : "error",
        "results": {
          "message": "User ID is required"
        },
      }
    else:
      uid = uid

    
    
    
    with open('data/bookmark.csv', 'r') as file:
      # reader = csv.DictReader(file)
      # print(reader)
      reader = file.readlines()
      # bookmarked_recipes = [row for row in reader if row['UUID'] == uuid]
      # bookmarked_recipes = [row for row in reader if row.split(',')[2] == uuid]
      bookmarked_recipes = []
      for each_row in reader:
        row = each_row.split(',')
        # print(row)
        # print(1,uid)
        # print(2,row[2])
        if len(row) < 3:
          continue
        # UID,RUID,UUID,RName,Description,ImageURL
        if row[2] == uid:
          bookmarked_recipes.append({
            "uid": row[0],
            "ruid": row[1],
            "uuid": row[2],
            "name": row[3],
            "description": row[4],
            "imageURL": convert_to_list(row[5]),
          })
      # print(bookmarked_recipes)
    return {
        "status" : "success",
        "results": bookmarked_recipes,
    }
    

  
  # RecipeId,Name,AuthorId,AuthorName,CookTime,PrepTime,TotalTime,DatePublished,Description,Images,RecipeCategory,Keywords,RecipeIngredientQuantities,RecipeIngredientParts,AggregatedRating,ReviewCount,Calories,FatContent,SaturatedFatContent,CholesterolContent,SodiumContent,CarbohydrateContent,FiberContent,SugarContent,ProteinContent,RecipeServings,RecipeYield,RecipeInstructions

  # UID,RUID,UUID,RName,Keywords,Description,ImageURL
    
  # add a bookmark
  def post(self):
    data_body = request.get_json()

    accessToken = request.headers.get('Authorization')
    # print("allte",accessToken)
    if (accessToken is None):
      return {
        "status" : "error",
        "results": {
          "message": "Token is required"
        },
      }
    uid = accessToken.split('-').pop()
    

    if (uid is None):
      return {
        "status" : "error",
        "results": {
          "message": "User ID is required"
        },
      }

    
    # uid, uuid = data_body['uid'], data_body['uuid']
    ruid = data_body['ruid'] # from RecipeId
    # uuid = data_body['uuid'] # from User ID
    uuid = accessToken.split('-').pop()

    print("added",ruid, uuid)

    count_bookmark = 0

    data = {}
    with open('data/recipes_cleaned.csv', 'r') as file:
      reader = csv.DictReader(file)
      recipe = [row for row in reader if row['RecipeId'] == ruid]
      if len(recipe) == 0:
        return {
          "status" : "error",
          "results": {
            "message": "Recipe does not exist"
          },
        }
      data = {
        "name": recipe[0]['Name'],
        "description": recipe[0]['Description'],
        "imageURL": recipe[0]['Images']
      }

    
    with open('data/bookmark.csv', 'r') as file:
      # reader = csv.reader(file)
      reader = file.readlines()
      count_bookmark = len(reader)
      # print("die",reader)

      for each_row in reader:
        row = each_row.split(',')
        print(row)
        if len(row) < 3:
          continue
        if ruid == row[1] and uuid == row[2]:
          return {
            "status" : "error",
            "results": {
              "message": "Bookmark already exists"
            },
          }
    with open('data/bookmark.csv', 'a') as file:
      # UID,RUID,UUID,RName,Keywords,Description,ImageURL
      writer = csv.writer(file)
      writer.writerow([f"{count_bookmark:05}",ruid, uuid, data['name'], data['description'], data['imageURL']])
    return {
      "status" : "success",
      "results": {
        "message": "Bookmark added",
        "data": data
      },
    }
  
  # remove a bookmark
  def delete(self):
    data_body = request.get_json()
    
    uid = data_body['uid']

    accessToken = request.headers.get('Authorization')

    uuid = accessToken.split('-').pop()


    with open('data/bookmark.csv', 'r') as file:
      # reader = csv.reader(file)
      reader = file.readlines()
      for each_row in reader:
        # print(each_row)
        # print(uid, each_row[0], uuid, each_row[2])
        if uid == each_row[0] and uuid == each_row[2]:
          return {
            "status" : "error",
            "results": {
              "message": "Bookmark does not exist A"
            },
          }
    with open('data/bookmark.csv', 'r') as file:
      # reader = csv.reader(file)
      reader = file.readlines()
      bookmarked_recipes = [row for row in reader if row[1] == uid and row[2] == uuid]
      if len(bookmarked_recipes) == 0:
        return {
          "status" : "error",
          "results": {
            "message": "Bookmark does not exist B"
          },
        }
      with open('data/bookmark.csv', 'w') as file:
        writer = csv.writer(file)
        for row in reader:
          if row[1] != uid and row[2] != uuid:
            writer.writerow(row)
      return {
        "status" : "success",
        "results": {
          "message": "Bookmark removed"
        },
      }



class JSONResponseMe(Resource):

  def get(self):
    # data_params = request.args
    accessToken = request.headers.get('Authorization')
    # print(accessToken)
    if (accessToken is None):
      return {
        "status" : "error",
        "results": {
          "message": "Token is required"
        },
      }
    uid = accessToken.split('-').pop()
    # print(uid)
    # print(uid)

    if (uid is None):
      return {
        "status" : "error",
        "results": {
          "message": "User ID is required"
        },
      }
    with open('data/user.csv', 'r') as file:
      reader = csv.DictReader(file)
      user = [row for row in reader if row['UID'] == uid]
      if len(user) == 0:
        return {
          "status" : "error",
          "results": {
            "message": "User does not exist"
          },
        }
      return {
        "status" : "success",
        "results": {
          "message": "User found",
          "data": user[0],
        },
      }
    