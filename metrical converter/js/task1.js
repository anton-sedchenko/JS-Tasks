'use strict';

let initialConverterData = {
	distance: {
		value: 800,
		unit: 'cm'
	},
	convert_to: 'in',
	units: ["km", "m", "cm", "mm", "in", "ft", "yd"],
    unitConstants: [1000, 1, 0.01, 0.001, 39.37, 3.281, 1.094]
};

initialConverterData = JSON.stringify(initialConverterData);

class DistanceUnitsConverter {
	constructor(initialConverterData) {
		this.data = initialConverterData;
	}

    // проверка входных данных на объект, массивы, числа и строки
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

        if (!(Array.isArray(data.units)) || !(Array.isArray(data.unitConstants))) {

            console.log('Incoming data is incorrect!');

            return false;
        }

        for (let i = 0; i < data.unitConstants.length; i++) {
            if (isNaN(data.unitConstants[i])) {

                console.log('Incoming data is incorrect!');

                return false;
            }
        }

        for (let i = 0; i < data.units.length; i++) {
            if (typeof(data.units[i]) !== 'string') {

                console.log('Incoming data is incorrect!');

                return false;
            }
        }

        this.data = data;

        return true;
    }

	getFromUnit(data) {
		return data.distance.unit;
	}

	getToUnit(data) {
		return data.convert_to;
	}

	getValue(data) {
		return data.distance.value;
	}

	convert() {
        if (!this.exceptionsChecking(this.data)) {

            return;
        }

        let fromUnit = this.getFromUnit(this.data);
        let toUnit = this.getToUnit(this.data);
        let value = this.getValue(this.data);
        let fromIndex = 0;
        let toIndex = 0;
        let result = {
        	unit: '',
        	value: 0
        };
        let regexp = /^\s*$|\s|\D/;

        if (regexp.test(this.data.distance.value)) {
			console.log('Please, enter a valid number into the distance value');

			return;
        }

        if (!this.data.units.includes(fromUnit)) {
        	console.log('Please, enter an initial measure in a correct way: "km", "m", "cm", "mm", "in", "ft", "yd"');

        	return;
        }

        if (!this.data.units.includes(toUnit)) {
            console.log('Please, enter a measure covert to in a correct way: "km", "m", "cm", "mm", "in", "ft", "yd"');

            return;
        }

        for (let i = 0; i < this.data.units.length; i++) {
            if (this.data.units[i] === fromUnit) {
                fromIndex = i;
            }

            if (this.data.units[i] === toUnit) {
                toIndex = i;

            }
        }

        result.value = Number((value * this.data.unitConstants[fromIndex] * this.data.unitConstants[toIndex]).toFixed(2));
        result.unit = toUnit;

        return JSON.stringify(result);
    }

}
	
console.log(new DistanceUnitsConverter(initialConverterData).convert());
