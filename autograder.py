import ast, subprocess, sys
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

    solution = bytes(rawSol, "utf-8").decode("unicode_escape") # needed to read the string as code

    try:
        tree = ast.parse(solution)
    except:
        ana = AnalyzeFunctions()
        ana.valid = False
    else:
        ana = AnalyzeFunctions()
        ana.visit(tree)
    
    # importTests = {
    #     "types":["str", "List[str]"],
    #     "test_1":{"input":["1","a,b,c"], "output":"a1b1c1"},
    #     "test_2":{"input":["Odd","alpha,beta,gamma"], "output":"alphaOddbetaOddgammaOdd"}
    # }

    runner = [] # builder for command that will be run
    argPosType = [] # positions and type of where test case values must be placed in runner

    runner.extend([solution, "\n"])
    runner.extend(["\nprint(", ana.name, "("])


    def fixInputTypes(type, builder, pos):
        def insert():
            pos.append( ( len(builder), type ) )
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
        if i != len(questionData["questionData"]["types_input"])-1: runner.append(",")

    runner.append("))\n")

    def applyQuotes(word):
        return f"\"{word}\""

    for tc in questionData["questionData"]["testcases"]:
        comBuild = [sys.executable, "-c"]
        for j,v in enumerate(parseInput(tc["input"])):
            if argPosType[j][1] == "List[str]" or argPosType[j][1] == "List[string]":
                runner[argPosType[j][0]] = ",".join(list(map(applyQuotes, v.split(","))))
                continue
            runner[argPosType[j][0]] = v

        comBuild.append("".join(runner))

        result = subprocess.run(comBuild, capture_output=True, text=True)
        print(f"stdout:{result.stdout}")
        print(f"stderr:{result.stderr}", end="\n\n")

def gradeStudent(studentProfile, test):
    tKey = test["key"]
    for question in test["testData"]:
        qKey = question["key"]
        gradeQuestion(studentProfile["tests"][tKey][qKey], question)

def autograder(testKey):
    test = tests_db.get(testKey)
    students = loginCredentials_db.fetch([{"role":"student", "test?contains":testKey}])
    for s in students:
        gradeStudent(s[testKey], test)
    return loginCredentials_db.fetch([{"role":"student", "test?contains":testKey}])