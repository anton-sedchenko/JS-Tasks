class Sort {
    constructor(usersData) {
    	this.usersData = usersData;
    	this.conditionSortBy = [];
        this.conditionObjArr = [];
    }

    // Метод для проверки входящих данных на объект и массив
    exceptionsChecking(incomingData) {
        if (!incomingData) {

            console.log('Incoming data is incorrect!');

            return false;
        }

        let data = JSON.parse(incomingData);

        if (Object.prototype.toString.call(data) !== '[object Object]') {

            console.log('Incoming data is incorrect!');

            return false;
        }

        if (!(Array.isArray(data.data))) {

            console.log('Incoming data is incorrect!');

            return false;
        }

        this.usersData = data;

        return true;
    }

    init() {
        if (!this.exceptionsChecking(this.usersData)) {

            return;
        }

    	this.conditionSortBy = this.usersData.condition.sort_by;

		if (this.usersData.condition.include) {

		    return new FilterDataByInclude(this.usersData).sortItems();
		}

		if (this.usersData.condition.exclude) {

		    return new FilterDataByExclude(this.usersData).sortItems();
		}

        console.log('There is no proper conditions found. Please, enter a valid conditions to sort data properly.');
    }

    sortItems() {
        let filteredUsersObjectArr = this.filterData();
        let toSortBy = this.conditionSortBy[0];
        let result = {};

        function sort(arr, sortByVar) {
            arr.sort((a, b) => {

                return a[sortByVar] > b[sortByVar] ? 1 : -1;
            });
        }

        sort(filteredUsersObjectArr, toSortBy);
        result.result = filteredUsersObjectArr;
        result = JSON.stringify(result);

        return result;
    }
}
