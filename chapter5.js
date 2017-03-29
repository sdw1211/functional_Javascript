const isUndefined = value => value === undefined;
const isNull = value => value === null;
const isFalse = value => value === false;

const not = fn => value => !fn(value);
const and = (...validators) => value => {

	for (const validator of validators) {
		if (not(validator)(value)) {
			return false;
		}
	}

	return true;
};

const existy = value => and(not(isNull), not(isUndefined))(value);
const truthy = value => and(not(isFalse), existy)(value);
const doWhen = (cond, action) => truthy(cond) ? action() : undefined;

const invoker = (name, method) => (target, ...args) => {
	if (!existy(target)) return null;

	const targetMethod = target[name];

	return doWhen((existy(targetMethod) && method === targetMethod), () => targetMethod.apply(target, args));
};

const dispatch = (...funs) => (target, ...args) => {
	let ret = undefined;

	for (const fun of funs) {
		ret = fun.apply(fun, [target, ...args]);

		if (existy(ret)) return ret;
	}

	return ret;
};


const str = dispatch(invoker('toString', Array.prototype.toString), invoker('toString', String.prototype.toString));

str([1,2,3,4,5,6]);
str("121212212");

const isString = value => typeof value === 'string';
const stringReverse = value => {
	if(!isString(value)) return undefined;
	return value.split('').reverse().join('');
};

const rev = dispatch(invoker('reverse', Array.prototype.reverse), stringReverse);



