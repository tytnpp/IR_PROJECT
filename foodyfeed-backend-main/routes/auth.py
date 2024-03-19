from flask_restful import  Resource, request
import csv




class JSONResponseAuthLogin(Resource):
  def post(self):
    data_params = request.get_json()

    email, password = data_params['email'], data_params['password']
    with open('data/user.csv', 'r') as file:
      reader = csv.reader(file)
      for row in reader:
        if email == row[2] and password == row[3]:
          return {
            "status" : "success",
            "results": {
              "message": "Login successful",
              "data": {
                "email": row[2],
                "role": row[6],
                "status": row[7],
                "token": f"buhqw4optub3o4tb4t923t0-150-1359-b013iec-{row[0]}"
              }
            },
          }
      return {
        "status" : "error",
        "results": {
          "message": "Invalid email or password"
        },
      }


class JSONResponseAuthRegister(Resource):
    def post(self):
      data_params = request.get_json()
      email, password = data_params['email'], data_params['password']
      user_count = 0
      with open('data/user.csv', 'r') as file_read:
        reader = file_read.readlines()
        user_count = len(list(reader))
        for row in reader:
          each_row = row.split(',')
          if email == each_row[2]:
            return {
              "status" : "error",
              "results": {
                "message": "Email already exists"
              },
            }
        
          
      with open('data/user.csv', 'a') as file_write:
        writer = csv.writer(file_write)
        # UID,Name,Email,Password,Phone,Address,Role,Status,DateCreated,DateModified,DateDeleted
        writer.writerow([f"{user_count:05}",f"{str(email).split('@')[0]}",email, password, "","","User","Active","","",""])
      return {
          "status" : "success",
          "results": data_params,
      }

