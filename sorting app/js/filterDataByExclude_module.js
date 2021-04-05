class FilterDataByExclude extends Sort {
    filterData() {
        let conditionObjArr = this.usersData.condition.exclude;
        let filteredUsersArray = excludeFilteringFunction(conditionObjArr, this.usersData);

        return filteredUsersArray;
    }
}
