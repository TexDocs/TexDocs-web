export const logger = (prefix) => {
    return freactalCxt => Object.assign({}, freactalCxt, {
        effects: Object.keys(freactalCxt.effects).reduce((memo, key) => {
            memo[key] = (...args) => {
                console.log(`Effect [${prefix}]`, key, args);
                return freactalCxt.effects[key](...args);
            };
            return memo;
        }, {})
    });
}