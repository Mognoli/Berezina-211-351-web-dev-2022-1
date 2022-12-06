// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.
// ----------------------------------------------------------------------------
// The "priority" function allows you to 
// get the priority of an operator. 
// Possible operators: +, -, *, /.

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Проверка, является ли строка str числом.
// ----------------------------------------------------------------------------
// Checking if the string "str" contains a number.

function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
// ----------------------------------------------------------------------------
// Checking if the string "str" contains a digit.

function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
// ----------------------------------------------------------------------------
// Checking if the string "str" contains an operator.

function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.
// ----------------------------------------------------------------------------
// The "tokenize" function takes one argument, a string 
// with an arithmetic expression, and divides it into 
// tokens (numbers, operators, brackets).The return value 
// is an array of tokens.

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).
// ----------------------------------------------------------------------------
// The compile function takes one argument, a string with an arithmetic 
// expression written in infix notation, and converts this expression to 
// reverse Polish notation(RPN).The return value is the result of the 
// conversion as a string with operators and operands separated by 
// spaces.The expression can include real numbers, +, -, *, / operators, 
// and brackets. All operators are binary and left associative. 
// The function implements the Shunting yard algorithm
// (https://en.wikipedia.org/wiki/Shunting_yard_algorithm).

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 &&
                isOperation(stack[stack.length - 1]) &&
                priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).
// ----------------------------------------------------------------------------
// The evaluate function takes one argument, a string 
// containing an arithmetic expression written in reverse 
// Polish notation.The return value is the result of 
// evaluating the expression.The expression can include 
// real numbers and the operators +, -, *, /. 
// You need to implement this function
// (https://en.wikipedia.org/wiki/Reverse_Polish_notation).

function evaluate(str) {
    let expr = str.split(" ");
    let stack = [];
    if (expr === '') {
        return 0;
    }
    for (let i = 0; i < expr.length; i++) {
        if (!isNaN(expr[i]) && isFinite(expr[i])) {
            stack.push(expr[i]);
        } else {
            let a = stack.pop();
            let b = stack.pop();
            if (expr[i] === "+") {
                stack.push(parseInt(a) + parseInt(b));
            } else if (expr[i] === "-") {
                stack.push(parseInt(b) - parseInt(a));
            } else if (expr[i] === "*") {
                stack.push(parseInt(a) * parseInt(b));
            } else if (expr[i] === "/") {
                stack.push(parseInt(b) / parseInt(a));
            } else if (expr[i] === "^") {
                stack.push(Math.pow(parseInt(b), parseInt(a)));
            }
        }
    }
    if (stack.length > 1) {
        return "ERROR";
    } else {
        return stack[0];
    }
}

// Назначьте нужные обработчики событий.
// ----------------------------------------------------------------------------
// Set event handlers.

var elem = document.getElementById('div_but');

elem.onclick = function (event) {
    if (event.target.nodeName == "BUTTON") {
        let elem2 = document.getElementById('span1');
        //elem2.style.background = 'red';
        let inner2 = elem2.innerHTML;
        if (event.target.innerHTML == '=') {
            inner2 = compile(inner2);
            inner2 = evaluate(inner2);
            elem2.innerHTML = inner2;
        }
        else if (event.target.innerHTML == 'C') {
            elem2.innerHTML = "";
        }
        else {
            elem2.innerHTML = inner2 + event.target.innerHTML;
        }
    }
};
