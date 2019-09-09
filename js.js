$(document).ready(function () {
	let array = [];
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
	const { _ } = window;

	const toCount = function () {
      $counterElements.text(array.length + ' items left');
  };

	const changeStateCheckbox = function () {
      let attributeElement = Number(this.getAttribute('data-todo'));
      array.forEach((item, i) => {
          if (item.id === attributeElement) {
             item.status = !item.status;
          }
      });
  };

	const changeAllCheckbox = function () {
     if((array.every(item => item.status)) === true){
         $listCheckbox.prop('checked', false);
         array.forEach(item => item.status = false);
     }else if((array.every(item => item.status)) === false){
         $listCheckbox.prop('checked', true);
        array.forEach(item => item.status = true);
     }
  };

	const render = function () {
      $listOfItems.empty();
      let stringForAppend = '';
      $.each(array, (index, value) => {
         stringForAppend += `<li class="elementTodo" id="${value.id}">
            <input data-todo=${value.id} class='checkbox_for_todo' 
            type='checkbox' ${value.status === true ? 'checked' : ''} >
            <span class='throughText'>${_.escape(value.value)}</span>
            <button type='button' data-rm=${value.id} class='close button_delete' aria-label='Close'>
            <span aria-hidden='true'>&times;</span></button>
           </li>`;
      });

      $listOfItems.append(stringForAppend);
	};

	const deleteEvens = function () {
        let attributeElement = Number(this.getAttribute('data-rm'));
      array.forEach((item, i) => {
          if (item.id === attributeElement) {
              array.splice(i, 1);
              toCount();
              render();
          }
      });
  };

	const buttonDeleteAll = function () {
    array = array.filter(item => item.status === false);
      toCount();
      render();
  };



	const addElementInArray = function () {
		let srting = $textBox.val();
		let element = $.trim(srting);
		if (element === "") {
			alert('Enter text!');
		} else {
			let obj = {
				id: id++,
				value: element,
				status: false
			};
			array.push(obj);
			$textBox.val("");
			toCount();
			render();
		}
	};

	const checkArray = function () {
		console.log(array);
	};

	const pushEnter = function (e) {
		if (enterCode === e.which) {
			addElementInArray();
		}
	};

	$buttonForAdd.on('click', addElementInArray);
	$buttonForCheckArray.on('click', checkArray);
	$textBox.on('keypress', pushEnter);
	$viewsForTodo.on('click','.checkbox_for_todo',changeStateCheckbox);
	$viewsForTodo.on('click','.button_delete',deleteEvens);
	$buttonAllDelete.on('click',buttonDeleteAll);
	$buttonCheckAll.on('click',changeAllCheckbox);

});


