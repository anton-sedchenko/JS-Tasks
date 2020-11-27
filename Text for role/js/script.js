'use strict';

function newScript(roles, textLines) {
    let string = textLines;
    let result = '';
    let stringsInArr = string.split('\n');

    for (let i = 0; i < roles.length; i++) {
      let regEx = new RegExp(roles[i] + '.+$', 'gm');
      let roleName = roles[i] + ':';
      let roleText = [];
      let strNumber = [];

      if (i > 0 && i < roles.length) {
        result += '\n';
      }

      for (let k = 0; k < stringsInArr.length; k++) {
        if (regEx.test(stringsInArr[k])) {
            strNumber.push(k + 1);
        }
      }
      
      result += `${roles[i]}:\n`
      roleText = string.match(regEx);

      roleText.forEach(function(item, i) {
        item = item.replace(roleName, strNumber[i] + ')');
        result += item + '\n';
      });
  }

  return result;
}

// let str = 'Городничий: Я пригласил вас, господа, с тем, чтобы сообщить вам пренеприятное известие: к нам едет ревизор.\nАммос Федорович: Как ревизор?\n    Артемий Филиппович: Как ревизор?\nГородничий: Ревизор из Петербурга, инкогнито. И еще с секретным предписаньем.\nАммос Федорович: Вот те на!\nАртемий Филиппович: Вот не было заботы, так подай!\nЛука Лукич: Господи боже! еще и с секретным предписаньем!';

// console.log(newScript(['Городничий', 'Аммос Федорович', 'Артемий Филиппович', 'Лука Лукич'], str));
