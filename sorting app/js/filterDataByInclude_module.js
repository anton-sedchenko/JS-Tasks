class FilterDataByInclude extends Sort {
    filterData() {
        let conditionObjArr = this.usersData.condition.include;
        let filteredUsersArray = includeFilteringFunction(conditionObjArr, this.usersData);

        return filteredUsersArray;
    }
}
