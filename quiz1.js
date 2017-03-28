const sum = (...args) => args.reduce((pre, cur) => pre + cur);
const sumArr = array => array.reduce((pre, cur) => pre + cur);
const multiArr = array => array.reduce((pre, cur) => pre * cur);

const calculator  = (checker, calculate, args)  => {
    const fixedState = [];

    if (!Array.isArray(args)) {
        return 0;
    }

    args.forEach(value => {
        if(checker(value)) {
            fixedState.push(value);
        }
    });

    return calculate(fixedState);
};


const safeSum = args => calculator(Number.isFinite, sumArr, args);
const safeMultiply = args => calculator(Number.isFinite, multiArr, args);

const checker = (...validators) => obj => {
    //validators = [[], ...validators];

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

const isObj = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const existsProperty = name => obj => isObj(obj) && obj[name] !== undefined;
const existPropertyAndCheckNum = name => obj => existsProperty(name)(obj) && Number.isFinite(obj[name]);

const checkObj = checker(validator('오브젝트가 아닙니다.', isObj)
    , validator('특정 프로퍼티가 존재하지 않습니다.', existsProperty('name'))
    , validator('특정 프로퍼티 값이 숫자가 아닙니다.', existPropertyAndCheckNum('aaaa')));

console.log(sum(1,2,34,5,6));
console.log(sumArr([1,2,3,4,5,6]));
console.log(safeSum([1,null,2,3,4,5]));
console.log(safeMultiply([1,null,2,3,4,5]));
console.log(checkObj({"name": 1234, "aaaa": 1234}));
