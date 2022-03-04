from deta import Deta
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
deta = Deta()  # configure your Deta project
loginCredentials_db = deta.Base("loginCredentials")
question_database = deta.Base("questions")
tests_database = deta.Base("tests")


@app.route('/users', methods=["POST"])
def create_user():
    user = loginCredentials_db.put({
        "password": request.args["password"],
        "role": request.args["role"],
        "tests": []
    }, request.args["username"])

    return jsonify(user, 201)


@app.route("/users/<key>")
def get_user(key):
    user = loginCredentials_db.get(key)
    return user if user else jsonify({"error": "Not found"}, 404)


@app.route("/users", methods=["GET"])
def get_users():
    users = loginCredentials_db.fetch().items
    return jsonify(users, 201)

# @app.route("/users/username", methods=["Get"])
# def get_user_info():
#     username = request.args["username"]
#     users = loginCredentials_db.fetch({"username?contains":username})
#     user = users.items
#     return jsonify(user, 201)


@app.route('/question', methods=["POST"])
def create_question():
    question = question_database.put({
        "questionData": {
            "question": request.json["questionData"]["question"],
            "function_name": request.json["questionData"]["function_name"],
            "types_input": request.json["questionData"]["types_input"],
            "types_output": request.json["questionData"]["types_output"],
            "testcases": request.json["questionData"]["testcases"],
            "difficulty": request.json["questionData"]["difficulty"],
            "categories": request.json["questionData"]["categories"],
            "testcaseCount": len(request.json["questionData"]["testcases"])
        }
    })
    return jsonify(question, 201)


@app.route("/question", methods=["GET"])
def get_questions():
    questions = question_database.fetch().items
    return jsonify(questions, 201)


@app.route("/question/<key>")
def get_question(key):
    question = question_database.get(key)
    return question if question else jsonify({"error": "Not found"}, 404)


@app.route('/test', methods=["POST"])
def create_test():
    keys = request.json["questionKeys"]
    questions = []
    for key in keys:
        questions.append(question_database.get(key["questionKey"]) | {
                         "testcase_weight": key["testcase_weight"], "function_name_weight": key["function_name_weight"]})

    test = tests_database.put({
        "testData": questions,
        "gradesReleased": False
    })
    return test["key"]


@app.route("/test", methods=["GET"])
def get_tests():
    tests = tests_database.fetch().items
    return jsonify(tests, 201)


@app.route("/test/<key>")
def get_test(key):
    test = tests_database.get(key)
    return test if test else jsonify({"error": "Not found"}, 404)


@app.route('/autograder', methods=["POST"])
def grade_test():
    keys = request.json["testkey"]
    gradeTest()
    return test["key"]


@app.get("/")
async def root():
    return "Hello World!"
