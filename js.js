$(document).ready(function () {
	let todos = [];

	axios.get('http://localhost:3000/todo').then((res) => {
		todos = [...res.data];
		id = res.data.length;
		toCount();
		render(todos);
	});
	const $textBox = $('#text-box');
	const $viewsForTodo = $('#container-for-elements');
	const $buttonForAdd = $('#button-for-add');
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
		let bool;
		if (todos.every(item => item.status)) {
			$listCheckbox.prop('checked', false);
			todos.forEach(item => item.status = false);
			bool = false
		} else if ((todos.every(item => item.status)) === false) {
			$listCheckbox.prop('checked', true);
			todos.forEach(item => item.status = true);
			bool = true;
		}
		axios.put('http://localhost:3000/todo', {data:bool})
			.then(res => console.log(res))
			.catch(e => console.log(e));
		toCount();
		render(todos);
	};

	const changeStateCheckbox = function () {
		let attributeElement = this.getAttribute('data-todo');
		todos.forEach((item,i) => {
			if (item._id === attributeElement) {
				item.status = !item.status;
				axios.put(`http://localhost:3000/todo/${item._id}`, todos[i])
					.then(res => res.status)
					.catch(e => console.log(e));
			}
		});
		toCount();
		arraySorting(modelTabs);
	};

	const render = function (array) {
		$listOfItems.empty();
		let stringForAppend = '';
		$.each(array, (index, value) => {
			stringForAppend += `<li class="elementTodo" id="${value._id}">
            <input data-todo=${value._id} class='checkbox_for_todo' 
            type='checkbox' ${value.status === true ? 'checked' : ''}>            
            <span class='throughText'>${_.escape(value.value)}</span>
           <input type="text" id=${value._id} class='edit' value='${_.escape(value.value)}'>
            <button type='button' data-rm=${value._id} class='close button_delete' aria-label='Close'>
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
		const $inputForEdit = $todoEdit.children('.edit');
		const editValue = ($.trim($inputForEdit.prop('value')));
		if (editValue === '' && $.trim(editValue) === '') {
			$textBox.val('');
		} else {
			todos.forEach((item,i) => {
				if(idForEditTodo === item._id){
					todos[i].value = editValue;
					axios.put(`http://localhost:3000/todo/${idForEditTodo}`, todos[i])
						.then(res => res.status)
						.catch(e => console.log(e));
				}
			});
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
		let attributeElement = this.getAttribute('data-rm');
		todos.forEach((item, i) => {
			if (item._id === attributeElement) {
				console.log(item);
				axios.delete(`http://localhost:3000/todo/${item._id}`, {data:todos[i]})
					.then(res => console.log(res))
					.catch( e => console.log(e));
				todos.splice(i, 1);
				toCount();
				render(todos);
			}
		});
	};

	const buttonDeleteAll = function () {
		todos = todos.filter(item => item.status === false);
		axios.delete('http://localhost:3000/todo', {data:todos})
			.then(res => console.log(res))
			.catch( e => console.log(e));
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
				_id:`${id++}`,
				value: element
			};
			todos.push(obj);
			axios.post('http://localhost:3000/todo', {
				value: obj.value,
			}).then(res => res.status)
				.catch(e => console.log(e));
			console.log(todos);
			$textBox.val("");
			toCount();
			arraySorting(modelTabs);
		}
	};

	const pushEnter = function (e) {
		if (enterCode === e.which) {
			addElementInArray();
		}
	};

	$buttonForAdd.on('click', addElementInArray);
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
