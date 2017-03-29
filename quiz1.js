const sum = (value1, value2) => value1 + value2;
const multi = (value1, value2) => value1 * value2;

const sumWithArr = array => array.reduce(sum);
const multiWithArr = array => array.reduce(multi);

const sumWithArgs = (...args) => sumWithArr(args);
const calculateSafely = (checker, calculate) => (pre, next) => checker(next) ? calculate(pre, next) : pre;
const getInteger = value => Number.isInteger(value) ? value : 0;
const zero = getInteger(0);
const one = getInteger(1);

const calculator  = (calculate, args, init = zero)  => {
    if (!Array.isArray(args)) {
        return zero;
    }

    return args.reduce(calculate, init);
};

const safeSum = args => calculator(calculateSafely(Number.isFinite, sum), args);
const safeMultiply = args => calculator(calculateSafely(Number.isFinite, multi), args, one);

const isNull = obj => obj === null;
const isNotNull = obj => !isNull(obj);
const isNotArray = obj => !Array.isArray(obj);

const checkType = type => obj => typeof obj === type;

const and = (...validators) => obj => {
    validators.forEach(validator => {
        if (!validator(obj)) {
            return false;
        }
    });

    return true;
};

const checker = (...validators) => obj => {
    return validators.reduce((errs, check) => {
        if (check(obj)) return errs;
        else return [...errs, check.message];
    }, []);
};
const validator = (message, fun) => {
    const f = (...args) => fun.apply(fun, args);

    f['message'] = message;
    return f;
}

const isObj = value => and(isNotNull, checkType('object'), isNotArray);
const existsProperty = name => obj => and(isObj, obj =>  obj[name] !== undefined);
const existPropertyAndCheckNum = name => obj =>  and(existsProperty(name), obj => Number.isFinite(obj[name]));

const checkObj = checker(validator('오브젝트가 아닙니다.', isObj)
    , validator('특정 프로퍼티가 존재하지 않습니다.', existsProperty('name'))
    , validator('특정 프로퍼티 값이 숫자가 아닙니다.', existPropertyAndCheckNum('aaaa')));

console.log(sumWithArgs(1,2,34,5,6));
console.log(sumWithArr([1,2,3,4,5,6]));
console.log(safeSum([1,null,2,3,4,5]));
console.log(safeMultiply([1,null,2,3,4,5]));
console.log(checkObj({"name": 1234, "aaaa": 1234}));
