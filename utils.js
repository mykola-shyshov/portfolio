/**
 * Author: Nick Shishov
 * License: Apache 2
 * Helpful functions. Also present model level of developed project.
 */

/**
 * provides way string creating, like in C# language
 * Example: formatString("<b>{0} - {1}</b>", Name, Surname)
 * @return {String} [description]
 */
formatString = function() {
	var s = arguments[0];
	for (var i = 0; i < arguments.length - 1; i++) {       
	var reg = new RegExp("\\{" + i + "\\}", "gm");             
	s = s.replace(reg, arguments[i + 1]);
	}
	return s;
}

/**
 * Add useful functions: 
 * 		keys : return list of Objects keys
 */
$.extend({
    keys: function(obj){
        var a = [];
        $.each(obj, function(k,v){ a.push(k) });
        return a;
    }
})

/**
 * Object that contain and provide access to information about projects
 */
var ProjectContainer = new function () {
	var self = this;

	$.ajax({
		//url : "http://portfolio.copia.org.ua/images/projects/descriptor.json",
		url : "http://localhost:8080/images/projects/descriptor.json",
		async : false,
		dataType: "JSON",
		type: "GET",
		success: function(data, textStatus) {
			self._projectList = data;
		}
	});
	// this._projectList = {};
	this._projectNames = $.keys(this._projectList);
	this._image2ProjectIndexes = makeImage2ProjectIndexes();
	this._images = makeImagesList();
	
	/**
	 * @return {number} amount of projects
	 */
	this.count = function() {
		return self._projectNames.length;
	}
	/**
	 * @return {Array} images urls
	 */
	this.getImages = function () {
		return self._images;
	};
	/**
	 * @return {Object} list of projects
	 */
	this.getProjects = function () {
		return self._projectList;
	};
	/**
	 * @return {Array}
	 */
	this.getProjectNames = function () {
		return self._projectNames;
	};
	/**
	 * @param  {Object} opt: 
	 *         for getting by image index use - {imageIndex:yourIndex}
	 *         for getting by project index use - {projectIndex:yourIndex}
	 * @return {String} 
	 */
	this.getProjectName = function(opt) {
		if ("imageIndex" in opt) {
			return self._projectNames[
				self._image2ProjectIndexes[opt.imageIndex]];
		}
		if ("projectIndex" in opt) {
			return self._projectNames[opt.projectIndex];	
		}
	};
	/**
	 * @param  {number} imageIndex
	 * @return {number}
	 */
	this.getProjectIndex = function(arg) {
		if ($.type(arg) == "number") {
			return self._image2ProjectIndexes[arg];	
		} 
		if ($.type(arg) == "string") {
			for (var i=0; i < self._projectNames.length; i++)
				if (arg == self._projectNames[i]) return i;
		}
	};
	/**
	 * @param  {String} projectName - project name
	 * @return {Object}
	 */
	this.getProject = function(projectName) {
		return self._projectList[projectName]
	};
	/**
	 * Return first image index that belong project
	 * @param  {String} projectName 
	 * @return {number} 
	 */
	this.getImageIndex = function(projectName) {
		var id = self.getProjectIndex(projectName);
		var imageIndex;
		$.each(self._image2ProjectIndexes, function(imId, prId) {
		 	if (id == prId) {
		 		imageIndex = imId;
		 		return false;
		 	}
		});
		return imageIndex;
	};


	/**
	 * Parse object-container for projects and make list of image urls
	 * @return {Array} 
	 */
	function makeImagesList() {
		var images = [];
		var imagesCount = 0;
		for (var i=0; i < self._projectNames.length; i++) {
			if (self._projectList[self._projectNames[i]].images.length) {
				imagesCount += $.merge(images, 
					self._projectList[self._projectNames[i]].images);
			}
		}
		return images;
	}
	/**
	 * @return {Array} index of array is a image index, 
	 *                       value is project index that accord image key-index
	 */
	function makeImage2ProjectIndexes() {	
		imageProjectIndexes = [];
		for (var i=0; i<self._projectNames.length; i++) {
			imagesCount = self._projectList[self._projectNames[i]].images.length;
			if (imagesCount) {
				var len = imageProjectIndexes.length;
				for (var j = len; j < len + imagesCount; j++) {
					imageProjectIndexes[j] = i;	
				};
			}
		}
		return imageProjectIndexes;
	};
};

/**
 * 
 * @return {[type]} [description]
 */
var ImagesCache = new function() {
	var cached = {};
	this.add = function (url) {
		if (!(url in cached)) {
			var img = document.createElement("img");
			img.src = url;	
			cached[url] = true;
		}
	}
}