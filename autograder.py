import ast
import subprocess
import sys
from deta import Deta
from argParse import parseInput

deta = Deta()
loginCredentials_db = deta.Base("loginCredentials")
question_db = deta.Base("questions")
tests_db = deta.Base("tests")


class AnalyzeFunctions(ast.NodeVisitor):
    def __init__(self):
        self.name = ""
        self.funcs = {}
        self.valid = True

    def visit_FunctionDef(self, node):
        self.name = node.name
        self.funcs[node.name] = []
        for argObj in node.args.args:
            self.funcs[node.name].append(argObj.arg)
        self.generic_visit(node)

    def report(self):
        print(self.funcs)


def gradeQuestion(rawSol, questionData):

    # needed to read the string as code
    solution = bytes(rawSol, "utf-8").decode("unicode_escape")

    try:
        tree = ast.parse(solution)
    except:
        ana = AnalyzeFunctions()
        ana.valid = False
    else:
        ana = AnalyzeFunctions()
        ana.visit(tree)

    runner = []  # builder for command that will be run
    argPosType = []  # positions and type of where test case values must be placed in runner

    runner.extend([solution, "\n"])
    runner.extend(["\nprint(", ana.name, "("])

    def fixInputTypes(type, builder, pos):
        def insert():
            pos.append((len(builder), type))
            builder.append(type)

        if type == "int":
            insert()
        elif type == "string" or type == "str":
            builder.append("\"")
            insert()
            builder.append("\"")
        else:
            builder.append("[")
            insert()
            builder.append("]")

    for i in range(len(questionData["questionData"]["types_input"])):
        paraType = questionData["questionData"]["types_input"][i]
        fixInputTypes(paraType, runner, argPosType)
        if i != len(questionData["questionData"]["types_input"])-1:
            runner.append(",")

    runner.append("), end="")\n")

    def applyQuotes(word):
        return f"\"{word}\""

    questionGrade = {}
    functionName = {}
    functionName["function_name"] = questionData["questionData"]["function_name"]
    functionName["points"] = questionData["function_name_weight"]

    if ana.valid:
        functionName["student_function_name"] = ana.name
        functionName["points_earned"] = 0 if ana.name != functionName["function_name"] else functionName["points"]
    else:
        functionName["student_function_name"] = "Parsing Error"
        functionName["points_earned"] = 0

    questionGrade["function_name"] = functionName
    questionGrade["testcases"] = []

    for tc in questionData["questionData"]["testcases"]:
        tcBreakdown = {}
        comBuild = [sys.executable, "-c"]

        for j, v in enumerate(parseInput(tc["input"])):
            if argPosType[j][1] == "List[str]" or argPosType[j][1] == "List[string]":
                runner[argPosType[j][0]] = ",".join(
                    list(map(applyQuotes, v.split(","))))
                continue
            runner[argPosType[j][0]] = v

        comBuild.append("".join(runner))

        result = subprocess.run(comBuild, capture_output=True, text=True)

        tcBreakdown["input"] = tc["input"]
        tcBreakdown["expected_output"] = tc["output"]
        tcBreakdown["points"] = questionData["testcase_weight"]

        tcBreakdown["student_output"] = "CODE ERROR" if result.stderr else result.stdout
        tcBreakdown["points_earned"] = tcBreakdown["points"] if result.stdout == tc["output"] else 0

        questionGrade["testcases"].append(tcBreakdown)

    return questionGrade


def gradeStudent(studentProfile, test, grades):
    tKey = test["key"]
    testGrade = {}

    for question in test["testData"]:
        qKey = question["key"]
        questionGrade = gradeQuestion(
            studentProfile["tests"][tKey][qKey], question)
        testGrade[qKey] = questionGrade

    grades[tKey] = testGrade
    loginCredentials_db.update({"grades": grades}, studentProfile["key"])


def autograder(testKey):
    test = tests_db.get(testKey)
    students = loginCredentials_db.fetch(
        {"role": "student", "testTaken?contains": testKey}).items
    for s in students:
        oldGrades = {} if "grades" not in s else s["grades"]
        gradeStudent(s, test, oldGrades)

    return loginCredentials_db.fetch({"role": "student", "testTaken?contains": testKey}).items
