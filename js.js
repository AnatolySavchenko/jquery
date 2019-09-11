$(document).ready(function () {
	let todos = [];
	const $textBox = $('#text-box');
	const $viewsForTodo = $('#container-for-elements');
	const $buttonForAdd = $('#button-for-add');
	const $buttonForCheckArray = $('#button-for-check-array');
	const $listOfItems = $('#list-of-items');
	const $counterElements = $('#counter-elements');
	const $buttonAllDelete = $('#button-for-delete-all-elements');
	const $buttonCheckAll = $('#button-for-check-all-array');
	const $listCheckbox = $('#list_todo input:checkbox');
	const $allElements = $('#all-elements');
	const $activeElements = $('#active-elements');
	const $completedElements = $('#completed-elements');
	let id = 0;
	const enterCode = 13;
	let modelTabs = 'All';
	const {_} = window;

	const toCount = function () {
		let countArray = todos.filter(item => !item.status);
		$counterElements.text(countArray.length + ' items left');
	};

	const changeAllCheckbox = function () {
		if (todos.every(item => item.status)) {
			$listCheckbox.prop('checked', false);
			todos.forEach(item => item.status = false);
		} else if ((todos.every(item => item.status)) === false) {
			$listCheckbox.prop('checked', true);
			todos.forEach(item => item.status = true);
		}
		toCount();
		render(todos);
	};

	const changeStateCheckbox = function () {
		let attributeElement = Number(this.getAttribute('data-todo'));
		todos.forEach(item => {
			if (item.id === attributeElement) {
				item.status = !item.status;
			}
		});
		toCount();
		arraySorting(modelTabs);
	};

	const render = function (array) {
		$listOfItems.empty();
		let stringForAppend = '';
		$.each(array, (index, value) => {
			stringForAppend += `<li class="elementTodo" id="${value.id}">
            <input data-todo=${value.id} class='checkbox_for_todo' 
            type='checkbox' ${value.status === true ? 'checked' : ''}>            
            <span class='throughText'>${_.escape(value.value)}</span>
           <input type="text" id=${value.id} class='edit' value='${_.escape(value.value)}'>
            <button type='button' data-rm=${value.id} class='close button_delete' aria-label='Close'>
            <span aria-hidden='true'>&times;</span></button>
           </li>`;
		});
		$listOfItems.append(stringForAppend);
	};

	const sortByTabs = function () {
		modelTabs = $(this).data('description');
		arraySorting(modelTabs);
	};

	const arraySorting = function (tab) {
		let editArray = [];
		switch (tab) {
			case 'All':
				$allElements.addClass('active-tab');
				$activeElements.removeClass('active-tab');
				$completedElements.removeClass('active-tab');
				editArray = todos;
				break;
			case 'Active':
				$allElements.removeClass('active-tab');
				$activeElements.addClass('active-tab');
				$completedElements.removeClass('active-tab');
				editArray = todos.filter(item => item.status === false);
				break;
			case 'Completed':
				$allElements.removeClass('active-tab');
				$activeElements.removeClass('active-tab');
				$completedElements.addClass('active-tab');
				editArray = todos.filter(item => item.status === true);
				break;
		}
		render(editArray);
	};

	const getIndexOnId = function (numberId) {
		const findIndexOnId = function (item) {
			return Number(item.id) === Number(numberId);
		};

		return todos.findIndex(findIndexOnId);
	};

	const endEditWithEnter = function(e) {
			if(e.which === enterCode){
					endEdit();
			}
	};

	const endEdit = function () {
		const $todoEdit = $('.edited');
		const idForEditTodo = $todoEdit.attr('id');
		const itemIndex = getIndexOnId(idForEditTodo);
		const $inputForEdit = $todoEdit.children('.edit');
		const editValue = ($.trim($inputForEdit.prop('value')));
		if (editValue === '' && $.trim(editValue) === '') {
			$textBox.val('');
		} else {
			todos[itemIndex].value = editValue;
			$todoEdit.removeClass('edited');
			$(document).off('click.edit');
		}
		arraySorting(modelTabs);
	};


	const editDoubleClick = function () {
		const variableElement = $(this.parentNode);
		variableElement.addClass('edited');
		variableElement.children('.edit').focus();
		$(document).on('focusout.edit', variableElement.children('.edit'), endEdit);
	};


	const deleteEvens = function () {
		let attributeElement = Number(this.getAttribute('data-rm'));
		todos.forEach((item, i) => {
			if (item.id === attributeElement) {
				todos.splice(i, 1);
				toCount();
				render(todos);
			}
		});
	};

	const buttonDeleteAll = function () {
		todos = todos.filter(item => item.status === false);
		toCount();
		render(todos);
	};

	const addElementInArray = function () {
		let srting = $textBox.val();
		let element = $.trim(srting);
		if (element === '') {
			alert('Enter text!');
		} else {
			let obj = {
				id: id++,
				value: element,
				status: false
			};
			todos.push(obj);
			$textBox.val("");
			toCount();
			arraySorting(modelTabs);
		}
	};

	const checkArray = function () {
		console.log(todos);
	};

	const pushEnter = function (e) {
		if (enterCode === e.which) {
			addElementInArray();
		}
	};

	$buttonForAdd.on('click', addElementInArray);
	$buttonForCheckArray.on('click', checkArray);
	$textBox.on('keypress', pushEnter);
	$viewsForTodo.on('click', '.checkbox_for_todo', changeStateCheckbox);
	$viewsForTodo.on('click', '.button_delete', deleteEvens);
	$buttonAllDelete.on('click', buttonDeleteAll);
	$buttonCheckAll.on('click', changeAllCheckbox);
	$allElements.on('click', sortByTabs);
	$activeElements.on('click', sortByTabs);
	$completedElements.on('click', sortByTabs);
	$viewsForTodo.on('dblclick', '.throughText', editDoubleClick);
	$(document).on('keydown', '.edit', endEditWithEnter);
});
