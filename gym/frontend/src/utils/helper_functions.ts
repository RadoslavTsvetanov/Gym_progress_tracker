class Helper_functions {
  find_dash_index(string: string): number {
    for (let i = 0; i < string.length; i++) {
      if (string[i] === "-") {
        return i;
      }
    }
    return -1; // Return -1 if dash is not found
  }

  convert_to_arr(data: Record<string, string>): { name: string; sets: string; que: string }[] {
    function find_space(data: string): boolean {
      for (let i = 0; i < data.length; i++) {
        if (data[i] === " ") {
          return true;
        }
      }
      return false;
    }

    function check_if_que(data: string): boolean {
      return find_space(data);
    }

    const arr: { name: string; sets: string; que: string }[] = [];
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (!check_if_que(key)) {
          arr.push({
            name: key,
            sets: data[key],
            que: data[`${key} que`],
          });
        }
      }
    }
    return arr;
  }

  format_json(data: Record<string, string>): { name: string; sets: string; que: string }[] {
    const new_data: Record<string, string[]> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const index_of_dash = this.find_dash_index(key);
        const new_key = key.slice(0, index_of_dash);
        new_data[new_key] = new_data[new_key] || [];
        new_data[new_key].push(data[key]);
      }
    }
    return this.convert_to_arr(new_data);
  }
}

export { Helper_functions };
