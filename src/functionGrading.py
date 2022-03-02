import ast, subprocess, sys

class AnalyzeFunctions(ast.NodeVisitor):
    def __init__(self):
        self.name = ""
        self.funcs = {}
    
    def visit_FunctionDef(self, node):
        self.name = node.name
        self.funcs[node.name] = []
        for argObj in node.args.args:
            self.funcs[node.name].append(argObj.arg)
        self.generic_visit(node)
    
    def report(self):
        print(self.funcs)


source = open("studentAns.py", "r")

try:
    tree = ast.parse(source.read())
    ana = AnalyzeFunctions()
    ana.visit(tree)
    print(ast.dump(tree))
    ana.report()
finally:
    source.close()


importTests = {
    "types":["str", "List[str]"],
    "test_1":{"input":["1","a,b,c"], "output":"a1b1c1"},
    "test_2":{"input":["Odd","alpha,beta,gamma"], "output":"alphaOddbetaOddgammaOdd"}
}

runner = [] # builder for command that will be run
argPosType = [] # positions and type of where test case values must be placed in runner

source = open("studentAns.py", "r")
runner.extend([source.read(), "\n"])
source.close()
runner.extend(["\nprint(", ana.name, "("])


def fixInputTypes(type, builder, pos):
    def insert():
        pos.append( ( len(builder), type ) )
        builder.append(type)
    
    if type == "int":
        insert()
    elif type == "str":
        builder.append("\"")
        insert()
        builder.append("\"")
    else:
        builder.append("[")
        insert()
        builder.append("]")

for i in range(len(ana.funcs[ana.name])):
    paraType = importTests["types"][i]
    fixInputTypes(paraType, runner, argPosType)
    if i != len(ana.funcs[ana.name])-1: runner.append(",")

runner.append("))\n")

print("".join(runner))

def applyQuotes(word):
    return f"\"{word}\""

for i in range(1, len(importTests)):
    currTest = f"test_{i}"
    comBuild = [sys.executable, "-c"]
    for j,v in enumerate(importTests[currTest]["input"]):
        if argPosType[j][1] == "List[str]":
            runner[argPosType[j][0]] = ",".join(list(map(applyQuotes, v.split(","))))
            continue
        runner[argPosType[j][0]] = str(v)

    print("".join(runner))

    comBuild.append("".join(runner))

    result = subprocess.run(comBuild, capture_output=True, text=True)
    print(f"stdout:{result.stdout}")
    print(f"stderr:{result.stderr}", end="\n\n")