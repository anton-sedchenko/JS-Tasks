'use strict';

// Гентический алгоритм создает заданное количество случайных наборов генов. Производит скрещивание и мутацию в "генах". Затем выбирается наилучшее решение из созданной популяции. 
// На мой взгляд данный метод не является наименее ресурсозатратным, но так или иначе он позволяет найти оптимальное решение.
// В данном алгориитме мы вызываем метод findBestOrder, который в свою очередь вызывает поочередно метод создания самой популяции createGeneration, который для создания каждой единицы популяции вызывает метод createGenerationItem.
// после создания популяции мы отбираем два родителя и производим скрещивание их "генов" в два дочерних объекта. Первому ребенку наследуется сначала половина "генов" первого родителя, затем второго. Для второго ребенка - наоборот. Первая половина "генов" от второго родителя.
// После скрещивания результат передается в метод мутации mutate. Если случайное число от 1 до 100 меньше заданного процента мутаций: this.mutatePercentage, то происходит мутация и два случайных "гена" ребенка меняются местами. При этом проверяется, не будут ли они превышать целевое ускорение. После мутации дочерние объекты возвращаются в популяцию, при этом удаляя столько же последних объектов, сколько их самих.
// Затем в главном методе findBestOrder перебираются все единицы полученной популяции и проверяется разница между каждой ячейкой ускорения объекта популяции и целевого ускорения. Алгоритм возвращает объект с минимальной разницей ускорений относительно "corrections".

let incomingData = {"corrections": [1, 12, 7, 1], "cells": [8, 4, 6, 2, 2]};
incomingData = JSON.stringify(incomingData);

class getCapsulesOrder {
	constructor(incomingData) {
		this.data = incomingData;
		this.mutatePercentage = 10;
		this.generationNum = 1000;
	}

	getRandom(min, max) {

		return Math.floor((Math.random() * (max - min) + min));
	}

	// проверка входных данных на объект, массивы и числа
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

		if (!(Array.isArray(data.corrections)) || !(Array.isArray(data.cells))) {

			console.log('Incoming data is incorrect!');

			return false;
		}

		for (let i = 0; i < data.corrections.length; i++) {
			if (!Number.isInteger(data.corrections[i])) {

				console.log('Incoming data is incorrect!');

				return false;
			}
		}

		for (let i = 0; i < data.cells.length; i++) {
			if (!Number.isInteger(data.cells[i])) {

				console.log('Incoming data is incorrect!');

				return false;
			}
		}

		this.data = data;

		return true;
	}

	createGenerationItem() {
		let correctionsArr = this.data.corrections.concat(); // целевые приращения
		let cellsArr = this.data.cells.concat();
		let currentCellsIncrementsArr = cellsArr.concat();
		let thruster = [];
		let sec_thruster = [];
		let delta_velocity = 0;
		let populationItemSize = currentCellsIncrementsArr.length;
		let thrusterDelta = 0;
		let sec_thrusterDelta = 0;
		let result = {};

		for (let i = 0; i < correctionsArr.length; i++) { // цикл для сравнения с каждым приращением целевого массива.
			let randomIncrementIndex = this.getRandom(0, populationItemSize + 1);
			let thrusterCell = currentCellsIncrementsArr[randomIncrementIndex];
			let sec_thrusterCell = undefined;

			if (thrusterCell <= correctionsArr[i]) {

				thruster.push(thrusterCell);
				currentCellsIncrementsArr.splice(randomIncrementIndex, 1);
				populationItemSize = currentCellsIncrementsArr.length;
			} else {

				thruster.push(0);
			}

			randomIncrementIndex = this.getRandom(0, populationItemSize + 1);
			sec_thrusterCell = currentCellsIncrementsArr[randomIncrementIndex];

			if (thruster[i] + (sec_thrusterCell / 2) <= correctionsArr[i]) {

				sec_thruster.push(sec_thrusterCell);
				currentCellsIncrementsArr.splice(randomIncrementIndex, 1);
				populationItemSize = currentCellsIncrementsArr.length;
			} else {

				sec_thruster.push(0);
			}
		}

		thrusterDelta = thruster.reduce((sum, current) => sum + current);
		sec_thrusterDelta = sec_thruster.reduce((sum, current) => sum + current);
		delta_velocity = thrusterDelta + sec_thrusterDelta;
		result.delta_velocity = delta_velocity;
		result.thruster = thruster;
		result.sec_thruster = sec_thruster;

		return result;
	}

	createGeneration() {
		let generationArr = [];
		let generationNum = this.generationNum;
		
		// генерируем начальную популяцию
		for (let i = 0; i < generationNum; i++) {
			generationArr.push(this.createGenerationItem());

		}

		return generationArr;
	}

	crossing(generation) {
		let currentCellsIncrementsArr = this.data.cells.concat();
		let generationArr = generation.slice(0, generation.length);
		let firstParent = undefined;
		let secondParent = undefined;
		let randomParentIndex = undefined;
		let breakPoint = undefined;
		let result = [];
		let firstChild = {};
		let secondChild = {};
		firstChild.thruster = [];
		firstChild.sec_thruster = [];
		secondChild.thruster = [];
		secondChild.sec_thruster = [];

		// Выбираем случайным образом двух родителей, которые будут участвовать в процессе размножения.
		randomParentIndex = this.getRandom(0, generationArr.length);
		firstParent = generationArr[randomParentIndex];
		randomParentIndex = this.getRandom(0, generationArr.length);
		secondParent = generationArr[randomParentIndex];
		breakPoint = Math.floor(firstParent.thruster.length / 2);

		// осуществляем скрещивание от первого родителя ребенку до точки разрыва
		for (let i = 0; i < breakPoint; i++) {
			let copiedElementPos = undefined;

			firstChild.thruster.push(firstParent.thruster[i]);

			if (firstParent.thruster[i] !== 0) {

				copiedElementPos = currentCellsIncrementsArr.indexOf(firstParent.thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1); // удаляем замененный элемент из списка для следующих сравнений с этим списком
			}

			firstChild.sec_thruster.push(firstParent.sec_thruster[i]);

			if (firstParent.thruster[i] !== 0) {

				copiedElementPos = currentCellsIncrementsArr.indexOf(firstParent.sec_thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1);
			}
		}

		// осуществляем скрещивание от второго родителя ребенку после точки разрыва
		for (let i = breakPoint; i < secondParent.thruster.length; i++) { // копируем остальное со второго родителя
			let copiedElementPos = undefined;

			// проверка доступно ли еще такое ускорение, тогда добавляем его ребенку
			// 1. если первое число есть в массиве ускорений, и второе тоже, начиная с индекса первого.
			if (currentCellsIncrementsArr.includes(secondParent.thruster[i]) && currentCellsIncrementsArr.includes(secondParent.sec_thruster[i], i)) {

				firstChild.thruster.push(secondParent.thruster[i]);
				copiedElementPos = currentCellsIncrementsArr.indexOf(secondParent.thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1);
				firstChild.sec_thruster.push(secondParent.sec_thruster[i]);
				copiedElementPos = currentCellsIncrementsArr.indexOf(secondParent.sec_thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1);

				continue;
			}

			// 2. если первое число равно нулю и второе есть в массиве ускорений
			if ((secondParent.thruster[i] === 0) && currentCellsIncrementsArr.includes(secondParent.sec_thruster[i])) {

				firstChild.thruster.push(0);
				firstChild.sec_thruster.push(secondParent.sec_thruster[i]);
				copiedElementPos = currentCellsIncrementsArr.indexOf(secondParent.sec_thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1);

				continue;
			}

			// 3. если первое число есть в массиве ускорений, а второе равно нулю
			if (currentCellsIncrementsArr.includes(secondParent.thruster[i]) && (secondParent.sec_thruster[i] === 0)) {
			
				firstChild.thruster.push(secondParent.thruster[i]);
				copiedElementPos = currentCellsIncrementsArr.indexOf(secondParent.thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1);
				firstChild.sec_thruster.push(0);

				continue;
			}

			// 4. Если оба равны нулю
			if ((secondParent.thruster[i] === 0) && (secondParent.sec_thruster[i] === 0)) {
			
				firstChild.thruster.push(0);
				firstChild.sec_thruster.push(0);

				continue;
			}

			// Если проверки не прошли, то просто пушим родительские "гены".
			firstChild.thruster.push(secondParent.thruster[i]);
			firstChild.sec_thruster.push(secondParent.sec_thruster[i]);
		}

		// повторяем скрещивание для второго ребенка, только первый и второй родитель меняем местами относительно точки разрыва
		// осуществляем скрещивание от второго родителя второму ребенку до точки разрыва
		for (let i = 0; i < breakPoint; i++) {
			let copiedElementPos = undefined;

			secondChild.thruster.push(secondParent.thruster[i]);

			if (secondParent.thruster[i] !== 0) {

				copiedElementPos = currentCellsIncrementsArr.indexOf(secondParent.thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1); // удаляем замененный элемент из списка для следующих сравнений с этим списком
			}

			secondChild.sec_thruster.push(secondParent.sec_thruster[i]);

			if (secondParent.thruster[i] !== 0) {

				copiedElementPos = currentCellsIncrementsArr.indexOf(secondParent.sec_thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1);
			}
		}

		// осуществляем скрещивание от первого родителя второму ребенку после точки разрыва
		for (let i = breakPoint; i < firstParent.thruster.length; i++) { // копируем остальное со второго родителя
			let copiedElementPos = undefined;

			// проверка доступно ли еще такое ускорение, тогда добавляем его ребенку
			// 1. если первое число есть в массиве ускорений, и второе тоже, начиная с индекса первого.
			if (currentCellsIncrementsArr.includes(firstParent.thruster[i]) && currentCellsIncrementsArr.includes(firstParent.sec_thruster[i], i)) {

				secondChild.thruster.push(firstParent.thruster[i]);
				copiedElementPos = currentCellsIncrementsArr.indexOf(firstParent.thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1);
				secondChild.sec_thruster.push(firstParent.sec_thruster[i]);
				copiedElementPos = currentCellsIncrementsArr.indexOf(firstParent.sec_thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1);

				continue;
			}

			// 2. если первое число равно нулю и второе есть в массиве ускорений
			if ((firstParent.thruster[i] === 0) && currentCellsIncrementsArr.includes(firstParent.sec_thruster[i])) {

				secondChild.thruster.push(0);
				secondChild.sec_thruster.push(firstParent.sec_thruster[i]);
				copiedElementPos = currentCellsIncrementsArr.indexOf(firstParent.sec_thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1);

				continue;
			}

			// 3. если первое число есть в массиве ускорений, а второе равно нулю
			if (currentCellsIncrementsArr.includes(firstParent.thruster[i]) && (firstParent.sec_thruster[i] === 0)) {
			
				secondChild.thruster.push(firstParent.thruster[i]);
				copiedElementPos = currentCellsIncrementsArr.indexOf(firstParent.thruster[i]);
				currentCellsIncrementsArr.splice(copiedElementPos, 1);
				secondChild.sec_thruster.push(0);

				continue;
			}

			// 4. Если оба равны нулю
			if ((firstParent.thruster[i] === 0) && (firstParent.sec_thruster[i] === 0)) {
			
				secondChild.thruster.push(0);
				secondChild.sec_thruster.push(0);

				continue;
			}

			secondChild.thruster.push(firstParent.thruster[i]);
			secondChild.sec_thruster.push(firstParent.sec_thruster[i]);
		}

		result.push(firstChild);
		result.push(secondChild);

		return result;
	}

	mutate(crossedChildren) {
		let correctionsArr = this.data.corrections.concat();
		let crossedChildrenArr = crossedChildren.slice(0, crossedChildren.length);
		let result = [];

		for (let i = 0; i < crossedChildrenArr.length; i++) {
			if (this.mutatePercentage > this.getRandom(0, 101)) { // если случайное число меньше процента мутаций, то производим мутацию. Выбираем два случайных гена и меяем их местами.
				let firstGeneIndex = this.getRandom(0, crossedChildrenArr[0].thruster.length);
				let secondGeneIndex = this.getRandom(0, crossedChildrenArr[0].thruster.length);
				// определяем первую пару главный и второй двигатели (первый ген)
				let firstGeneThruster = crossedChildrenArr[i].thruster[firstGeneIndex];
				let firstGeneSec_thruster = crossedChildrenArr[i].sec_thruster[firstGeneIndex];
				// определяем вторую пару главный и второй двигатели (второй ген)
				let secondGeneThruster = crossedChildrenArr[i].thruster[secondGeneIndex];
				let secondGeneSec_thruster = crossedChildrenArr[i].sec_thruster[secondGeneIndex];
				let resultItem = {};
				resultItem.thruster = [];
				resultItem.sec_thruster = [];
				// Сразу проверяем возможность мутации, согласно условию. Если нет, то просто копируем все капсулы.
				if ((firstGeneThruster + firstGeneSec_thruster) <= correctionsArr[secondGeneIndex] && 
					(secondGeneThruster + secondGeneSec_thruster) <= correctionsArr[firstGeneIndex]) {

					// Если увловие выполняется, то пушим все ускорения в результат, а при встрече нужного индекса меняем их местами.
					for (let j = 0; j < crossedChildrenArr[i].thruster.length; j++) {
						if (j === firstGeneIndex) {

							resultItem.thruster.push(crossedChildrenArr[i].thruster[secondGeneIndex]);
							resultItem.sec_thruster.push(crossedChildrenArr[i].sec_thruster[secondGeneIndex]);

							continue;
						}

						if (j === secondGeneIndex) {

							resultItem.thruster.push(crossedChildrenArr[i].thruster[firstGeneIndex]);
							resultItem.sec_thruster.push(crossedChildrenArr[i].sec_thruster[firstGeneIndex]);

							continue;
						}

						resultItem.thruster.push(crossedChildrenArr[i].thruster[j]);
						resultItem.sec_thruster.push(crossedChildrenArr[i].sec_thruster[j]);
					}

					result.push(resultItem);

					continue;
				}
				// Если проверка условия задачи для мутации не прошла, то просто копируем все в результат.
				for (let j = 0; j < crossedChildrenArr[i].thruster.length; j++) {

					resultItem.thruster.push(crossedChildrenArr[i].thruster[j]);
					resultItem.sec_thruster.push(crossedChildrenArr[i].sec_thruster[j]);
				}

				result.push(resultItem);
			}
		}

		return result;
	}

	addMutateAtGeneration(generation, mutatedChildren) {
		let generationArr = generation.concat();
		let mutatedChildrenArr = mutatedChildren.concat();
		let lengthDiff = generationArr.length - mutatedChildrenArr.length;
		let mutatedArrLength = mutatedChildrenArr.length;

		// Считаем среднюю скорость для скрещенных-мутировавших потомков и добавляем их назад в популяцию, удалив при этом столько же последних объектов в списке.
		for (let i = 0; i < mutatedArrLength; i++) {
			let thrusterDelta = 0;
			let sec_thrusterDelta = 0;
			let delta_velocity = 0;

			thrusterDelta = mutatedChildrenArr[i].thruster.reduce((sum, current) => sum + current);
			sec_thrusterDelta = mutatedChildrenArr[i].sec_thruster.reduce((sum, current) => sum + current);
			delta_velocity = thrusterDelta + sec_thrusterDelta;
			mutatedChildrenArr[i].delta_velocity = delta_velocity;

			generationArr.splice(lengthDiff, 1, mutatedChildrenArr[i]);
		}

		return generationArr;
	}

	findBestOrder() {
		if (!this.exceptionsChecking(this.data)) {

			return;
		}
		
		let generation = this.createGeneration();
		let crossedChildren = this.crossing(generation);
		let mutatedChildren = this.mutate(crossedChildren);
		let mutatedGeneration = this.addMutateAtGeneration(generation, mutatedChildren).concat();
		let targetVelocityArr = this.data.corrections;
		let bestOrder = {};
		let bestDiffNum = Infinity;
		let capsulesOrder = {};

		// у какого элемента итогового набора минимальная разница с целевыми приращениями - тот и точнее.
		mutatedGeneration.forEach((item, i) => {
			let itemManeuverVelocitySum = 0;
			let diff = 0;
			let itemDiffArr = []; // создаем для каждого объекта массив разницы скоростей с целевым. И его сравниваем. Если его сумма элементов меньше, то перезаписываем им массив для сравнения.

			for (let j = 0; j < targetVelocityArr.length; j++) {

				itemManeuverVelocitySum = item.thruster[j] + item.sec_thruster[j] / 2;
				diff = targetVelocityArr[j] - itemManeuverVelocitySum;
				itemDiffArr.push(diff);

				// если массив разниц объекта составлен, сравниваем его с лучшим
				if (j === targetVelocityArr.length - 1) {
					let itemDiffSum = itemDiffArr.reduce((sum, current) => sum + current);

					if (itemDiffSum < bestDiffNum) {

						bestDiffNum = itemDiffSum;
						bestOrder = item;
					}
				}
			}

			// Если в переборе мы дошли до последнего элемента популяции, то готовим лучший объект ускорений к выводу.
			if (i === mutatedGeneration.length - 1) {
				capsulesOrder.main_thruster = bestOrder.thruster;
				capsulesOrder.sec_thruster = bestOrder.sec_thruster;
				capsulesOrder.delta_velocity = bestOrder.delta_velocity;
				capsulesOrder = JSON.stringify(capsulesOrder);
			}
		});

		return capsulesOrder;
	}
}

console.log(new getCapsulesOrder(incomingData).findBestOrder());
