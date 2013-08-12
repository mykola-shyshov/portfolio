/**
 * Aurthor: Nick Shishov
 * License: Apache 2
 * Site widgets
 */

/**
 * 
 * @param {jquery} elem
 */
function ProjectNavigator(elem) {
	var self = this;
	var projectSelector = elem.find(".projects-navigator-selector");
	var nextButton = elem.find(".projects-navigator-next");
	var prevButton = elem.find(".projects-navigator-prev");
	var projectIndex;

	nextButton.on("click", onNextClick);
	prevButton.on("click", onPrevClick);
	$(document).on("image-changed", onImageChanged);

	(function init(){
		setTimeout(function(){
			changeProject(0);
		}, 0);
		imagesCount = 0;
	})();

	function onNextClick() {
		changeProject(projectIndex + 1);
		return false;
	}
	function onPrevClick() {
		changeProject(projectIndex - 1);
		return false;
	}
	function onImageChanged(event, imageIndex) {
		checkAccordingImageAndProject(imageIndex);
	}

	function checkAccordingImageAndProject(imageIndex) {
		var newProjectIndex = ProjectContainer.getProjectIndex(imageIndex);
		if (newProjectIndex != projectIndex) { /* not accord */
			changeProject(newProjectIndex);
		}
	}

	function changeProject(index) {
		if (index < 0) index = ProjectContainer.count() - 1;
		if (index > ProjectContainer.count() - 1) index = 0;
		projectIndex = index;
		var projectName = ProjectContainer.getProjectName({projectIndex:index})
		projectSelector.text(projectName);
		$(document).triggerHandler("project-changed", projectName);
	}
}

/**
 * 
 * @param {jquery} elem
 */
function ProjectDescription(elem) {
	var selectedProject;

	$(document).on("project-changed", onProjectChanged);

	function onProjectChanged(event, projectName) {
		selectedProject = ProjectContainer.getProject(projectName);
		changeProgect();
	}

	function changeProgect() {
		elem.find(".about").text("");
		elem.find(".state").text("");
		elem.find(".links").text("");

		if (selectedProject.description.about.length) {
			elem.find(".about").text("About project: " + selectedProject.description.about + ".");	
		}
		if (selectedProject.description.state.length){
			elem.find(".state").text("Projects state: " + 
				selectedProject.description.state + ".");	
		}

		var links = selectedProject.description.links
		if (links.length) {
			var linksElem = elem.find(".links");
			linksElem.text("Links: ");
			for (var i = 0; i < links.length; i++) {
				var linkHTML = formatString("<a href=\"{0}\">{1}</a>", links[i].url, links[i].text);
				linksElem.append(linkHTML);
			}	
		}
	}
}

/**
 * 
 * @param {jquery} elem
 */
function ImageSlider(elem) {

	var nextButton = $(".image-slider-next");
	var prevButton = $(".image-slider-prev");
	var imageIndex, images, imageElem;
	var projectName;

	$(document).on("project-changed", onProjectChanged);
	nextButton.on("click", onNextClick);
	prevButton.on("click", onPrevClick);

	(function init() {
		imageElem = $("<img src=\"\" />").appendTo(elem);
		images = ProjectContainer.getImages();
	})();

	function onProjectChanged(event, pr) {
		changeProgect(pr);
	}

	function onNextClick(event) {
		changeImage(imageIndex + 1);
		return false;
	}

	function onPrevClick(event) {
		changeImage(imageIndex - 1);
		return false;
	}

	function changeImage(index) {
		if (index < 0) index = images.length - 1;
		if (index > images.length - 1) index = 0;
		imageIndex = index;
		imageElem.attr("src", images[imageIndex]);
		projectName = ProjectContainer.getProjectName({imageIndex:imageIndex});
		$(document).triggerHandler("image-changed", imageIndex);
	}

	function changeProgect(pr) {
		if (pr == projectName) return;
		projectName = pr;
		changeImage(ProjectContainer.getImageId(projectName));
	}
}