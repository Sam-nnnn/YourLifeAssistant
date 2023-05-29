function validateInput(input) {
    const regex = /^(\d{4}-\d{1,2}-\d{1,2}-\d{1,2}-\d{1,2}-\d{1,2})\/(.*)$/;
    const matches = input.match(regex);

    console.log(input, matches)

    if (matches && matches.length > 3) {
      return {state: true} 
    }

    if (!input.includes("/")) {
        return {state: false, message: "缺少 / 符號,請依照規定格式輸入"}  
    }

    if (matches === null) {
        if (input.includes("/")) {
            return  {state: false, message: "時間格式錯誤,請依照規定格式輸入"}  
        }
        return  {state: false, message: "未知錯誤，請重新輸入"}  
    }
}

module.export = validateInput;