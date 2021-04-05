'use strict';

// Данное решение пробует все возможные подмножества половинного размера. Если образуется одно подмножество половинного размера, остальные элементы образуют другое подмножество. Мы инициализируем текущий набор как пустой, создавая массив и присваивая false каждому элементу. Затем поочередно строим его. Для каждого элемента есть две возможности: либо он является частью текущего набора (помечаем как true в массиве), либо он является частью остальных элементов (другое подмножество). Мы рассматриваем обе возможности для каждого элемента. Когда размер текущего набора становится равным n / 2, мы проверяем, лучше ли это решение, чем лучшее, доступное на данный момент. Если да, то обновляем лучшее решение.

// let incomingData = {"set": [1, 10, 4, 6, 8, 2] }
let incomingData = {"set": [100, 10, 20, 30, 40] };
incomingData = JSON.stringify(incomingData);

function getSubSets(incomingData) {
	let data = undefined;

	if (!exceptionsChecking(incomingData)) {

		return;
	}

	let arr = data.set.concat();
    let n = arr.length;  
    let currentElements = []; // включающий\исключающий массив в текущем наборе.
    let solution = []; // включающий\исключающий массив для финального решения
	let minDiff = 0; 
    let sum = 0;
    let noOfSelectedElements = 0; // кол-во выбранных элементов
    let currentPosition = 0;
    let currentSum = 0;

    // функция для проверки входящих данных на объект, массив и числа
    function exceptionsChecking(incomingData) {
		if (!incomingData) {

			console.log('Incoming data is incorrect!');

			return false;
		}

		let recievedData = JSON.parse(incomingData);

		if (Object.prototype.toString.call(recievedData) !== '[object Object]') {

			console.log('Incoming data is incorrect!');

			return false;
		}

		if (!(Array.isArray(recievedData.set))) {

			console.log('Incoming data is incorrect!');

			return false;
		}

		for (let i = 0; i < recievedData.set.length; i++) {
			if (!Number.isInteger(recievedData.set[i])) {

				console.log('Incoming data is incorrect!');

				return false;
			}
		}

		data = recievedData;

		return true;
	}

	function checkAllOptions() { // вспомогательная функция для рекурсивного вызова и поиска решения

		if (currentPosition === n) {

			return;
		}

		if ((Math.floor(n / 2) - noOfSelectedElements) > (n - currentPosition)) {
			
			return;
		}

		currentPosition += 1;
	    checkAllOptions(); //запускаем вариант и обрабатываем условие если текущий элемент отсутствует т.е. просто накручиваем curr_position ничего не меняя
	    currentPosition -= 1;

		noOfSelectedElements += 1; // обрабатываем вариант если элемент включен в решение, добавляем текущий элемент в решение, увелич кол. элементов в группе на 1

	    currentSum += arr[currentPosition]; // добавляем его к сумме
	    currentElements[currentPosition] = true; // в массиве обозначаем его как true т.е. взятый в решение

	    if (noOfSelectedElements === Math.floor(n / 2)) { // проверяем вдруг мы набрали уже по количеству элементы в группу, тогда надо проверить сумму

		    if (Math.abs(sum / 2 - currentSum) < minDiff) { // считаем сумму текущего набора и сравниваем с лучшей на текущий момент разницей между половиной суммы и текущей суммой.

	            minDiff = Math.abs(sum / 2 - currentSum); // если оказалось меньше то присваиваем переменной min_diff - это теперь лучший результат на текущий момент.

	            for (let i = 0; i < n; i++) {

	                solution[i] = currentElements[i];
	            } 
	        }
	    } else { // если количество элементов еще не набрали, запускаем дальше рекурсию но уже с включением текущего элемента в решение

				currentPosition += 1;
	            checkAllOptions();
	        }
	    // при возврате из функции меняем значение текущего элемента на false т.к. возможно решение пойдет по другому пути
	    currentElements[currentPosition] = false; 
	}

    for (let i = 0; i < n; i++) { // находим сумму всех чисел
        sum += arr[i];
    	currentElements[i] = false;
    	solution[i] = false;
    }

    minDiff = sum;

    checkAllOptions(); // находим решение, используя рекурсивную функцию

    console.log('The first subset is: ');

    for (let i = 0; i < n; i++) { 
        if (solution[i] === true) {

            console.log(arr[i]); 
        }
    }

    console.log('The second subset is: ');

    for (let i = 0; i < n; i++) { 
        if (solution[i] === false) {

            console.log(arr[i]); 
        }
    } 
}

getSubSets(incomingData);
