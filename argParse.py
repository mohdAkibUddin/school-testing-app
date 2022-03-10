from enum import Enum
States = Enum("States", "Start Single InList Inner")
 
#ONLY WOULD USE ALPHANUM FOR NOW
def digit_check(ch):
    return ch.isdigit()

def alphnum(ch):
    return ch.isalnum() or ch == "-"

def parseArgs(rawStr, typeCheck):
    dest = []
    state = States.Start.value
    varHold = []
    listHold = []

    for ch in rawStr:
        typeBool = typeCheck(ch)
        if state == States.Start.value:
            if ch == "[":
                state = States.InList.value
            elif typeBool:
                varHold.append(ch)
                state = States.Single.value
        elif state == States.Single.value:
            if typeBool:
                varHold.append(ch)
            else:
                dest.append("".join(varHold))
                varHold = []
                state = States.Start.value
        elif state == States.InList.value:
            if ch == "]":
                dest.append(",".join(listHold))
                listHold = []
                state = States.Start.value
            elif typeBool:
                varHold.append(ch)
                state = States.Inner.value
        else:
            if ch == "]":
                listHold.append("".join(varHold))
                varHold = []
                dest.append(",".join(listHold))
                listHold = []
                state = States.Start.value
            elif typeBool:
                varHold.append(ch)
            else:
                listHold.append("".join(varHold))
                varHold = []
                state = States.InList.value
        
    if state == States.Single.value:
        dest.append("".join(varHold))
        
    return dest

def parseInput(testInput):
    return parseArgs(testInput, alphnum)