function cssGetId(id) {
	return document.getElementById(id);
}
function cssSetId(id, property, value) {
	let element = cssGetId(id);
	element.style.setProperty(property, value);
}
function cssGetClass(className) {
	return document.getElementsByClassName(className);
}
function cssSetClass(className, property, value) {
	let elements = cssGetClass(className);
	for (let i = 0; i < elements.length; i++) {
		elements[i].style.setProperty(property, value);
	}
}

let currentTab = 0;
let tabIdMap = ['about', 'projects', 'music', 'resources','resume'];
function goToTab(tabId) {
	currentTab = tabId;
	
	let sectionActive = cssGetClass('section_active')[0];
	let tabActive = cssGetClass('tab_active')[0];
	sectionActive.classList.remove('section_active');
	tabActive.classList.remove('tab_active');
		
	sectionActive = cssGetId(tabIdMap[tabId]);
	tabActive = cssGetId('tab_' + tabIdMap[tabId]);
	sectionActive.classList.add('section_active');
	tabActive.classList.add('tab_active');
}