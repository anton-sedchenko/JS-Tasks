'use strict';

function excludeFilteringFunction(conditionObjArr, data) {
    let conditionsArr = conditionObjArr.map(item => Object.entries(item)[0]);

    let filteredUsersArray = data.data.filter(function(userObject) {
        let userKeyValueArr = Object.entries(userObject);
        let matchesCount = 0;

        for (let i = 0; i < conditionsArr.length; i++) {
            for (let j = 0; j < userKeyValueArr.length; j++) {
                for (let k = 0; k < userKeyValueArr[j].length; k++) {
                	
                    if (userKeyValueArr[j][k] === conditionsArr[i][k]) {

                        matchesCount += 1;
                    }
                }
            }
        }

        if (matchesCount < conditionsArr.length * 2) {

            return userObject;
        }
    });

    return filteredUsersArray;
}
