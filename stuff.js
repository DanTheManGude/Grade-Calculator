function ready(){
	console.log("Ready");
}

function calculate(){
	console.log("Calculating Grades");
}

function addGrade() {
	var grade = document.createElement('grade');
	grade.setAttribute('class', 'agrade');
	grade.setAttribute('name', 'NewGrade');
	grade.setAttribute('type', 'sing');
	grade.setAttribute('wk', 'same');
	grade.setAttribute('kind', 'num');
	grade.setAttribute('status', 'mp');
	grade.setAttribute('score', 0);
	grade.setAttribute('outof', 100);
	grade.setAttribute('grd', 0);
	grade.setAttribute('weight', 100);
	event.srcElement.parentElement.appendChild(grade);
	var name = document.createElement('label');
	name.setAttribute('class', 'name');
	name.innerHTML = grade.getAttribute('name');
	grade.appendChild(name);
	var edit =  document.createElement('button');
	edit.setAttribute('class', 'ed');
	edit.setAttribute('onclick', 'editGrade()');
	edit.setAttribute('type', 'button');
	edit.innerHTML = 'Edit';
	grade.appendChild(edit);
	var add =  document.createElement('button');
	add.setAttribute('class', 'ag');
	add.setAttribute('onclick', 'addGrade()');
	add.setAttribute('type', 'button');
	add.innerHTML = 'Add Grade';
	grade.appendChild(add);
}

function editGrade() {
	console.log("editing Grade");
}
