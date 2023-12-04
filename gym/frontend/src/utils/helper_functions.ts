class Helper_functions{
     find_dash_index(string:string) {
        for (let i = 0; i < string.length; i++) {
            if(string[i] == "-"){
                return i;
            }
        }
    }

     format_json(data) {
    const new_data = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            let index_of_dash = this.find_dash_index(key);
            let new_key = key.slice(0, index_of_dash);
            // Initialize new_data[new_key] as an array if not already defined
            new_data[new_key] = new_data[new_key] || [];
            new_data[new_key].push(data[key]);
        }
    }
    return new_data;
}

}
export {
    Helper_functions
 }