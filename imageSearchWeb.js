(function() {

/* the global options */
var options = {
	"imageSearchWeb": {
		"urlSelector": "#rg_s .rg_di .rg_l",
		"targetUrlPattern": "imgurl=(.+?)&",
		"displayType": "console"
	},
	"uiText_controller": {
		"key": 16
	}
}


/*
	imageSearchWeb object
	the main action object, to capture the origin urls in the google image search page
*/ 
var imageSearchWeb = {
	options: options.imageSearchWeb,

	getImageUrls: function() {
		var nodes = document.querySelectorAll(this.options.urlSelector)
		
		var len = nodes.length,
			urls = [],
			url
		for (var i = 0; i < len; i++) {
			url = this.extractImageUrl(nodes[i])
			urls.push(url)
		}
		return urls
	},
	extractImageUrl: function(node) {
		var url
		if (node.hasAttribute("href")) {
			url = node.getAttribute("href")
		}
		url = url.match(this.options.targetUrlPattern)
		url = url[1] ? url[1] : ""
		return decodeURIComponent(url)
	},
	execute: function() {
		var urls = this.getImageUrls()
		return urls
	}
}



/*
	uiText object
	this is an UI object, for showing the contents 
*/
var uiText = {
	template: '<div class="imageSearchWebWrapper"><div class="inner"><div class="close"></div><textarea name="textEditor" id="" cols="30" rows="10" class="textEditor"></textarea></div></div>',
	uis: {
		"textEditor": ".textEditor",
		"close": ".close"
	},
	parent: "body",
	parentNode: null,
	wrapper: "div",
	wrapperNode: null,
	style: ".imageSearchWebWrapper {position: fixed;z-index: 90000;padding: 10px;top:50px;left:50px;border: 1px solid #777;background: #555;}.imageSearchWebWrapper .inner {position: relative;}.imageSearchWebWrapper .textEditor {position: relative;width: 500px;height: 300px;padding: 5px 10px;line-height: 1.4;color: #5a5a5a;background-color: #fbfbfb;overflow-x: scroll;white-space: pre;word-wrap: normal;}",
	status: false,

	init: function() {
		this.initNodes()
		this.initEvents()
		this.initStyle()

		return this
	},
	initNodes: function() {
		this.parentNode = document.querySelector(this.parent)
		this.wrapperNode = document.createElement(this.wrapper)
		this.create()

		var node
		for (var k in this.uis) {
			if (!this.uis.hasOwnProperty(k)) continue
			node = this.wrapperNode.querySelectorAll(this.uis[k])
			this.uis[k] = node.length === 1 ? node[0] : node
		}
	},
	initEvents: function() {
		this.uis.close.addEventListener("click", this.hide.bind(this), false)
	},
	initStyle: function() {
		var styleNode = document.createElement("style")
		styleNode.innerText = this.style
		this.wrapperNode.appendChild(styleNode)
	},
	create: function() {
		this.wrapperNode.innerHTML = this.template
		this.parentNode.appendChild(this.wrapperNode)
	},
	destory: function() {
		if (this.wrapperNode) {
			this.wrapperNode.parentNode.removeChild(this.wrapperNode)
		}
	},
	show: function() {
		this.wrapperNode.style.visibility = "visible"
		this.setStatus(true)
	},
	hide: function() {
		this.wrapperNode.style.visibility = "hidden"
		this.setStatus(false)
	},
	setStyle: function(ui, style) {
		// noop
	},
	setContent: function(content) {
		this.uis.textEditor.innerHTML = ""
		this.uis.textEditor.innerHTML = content
	},
	select: function() {
		this.uis.textEditor.select()
	},
	focus: function() {
		this.uis.textEditor.focus()
	},
	getStatus: function() {
		return this.status
	},
	setStatus: function(flag) {
		this.status = !!flag
	}
}

/*
	uiText_controller object
	this is the controller of the uiText object
*/
var uiText_controller = {
	options: options.uiText_controller,

	init: function(options) {
		this.ui = options.ui
		this.action = options.action

		if (options.key) {
			this.options.key = options.key
		}

		this.initEvents()
		return this
	},
	initEvents: function() {
		window.addEventListener("keyup", this.keyEscPressed.bind(this), false)
	},
	keyEscPressed: function(evt) {
		if (evt.which === this.options.key) {
			if (this.ui.getStatus()) {
				this.close()
			} else {
				this.show()
			}
		}
	},

	/**/

	// set content, and make it ready for copy action
	setContentReady: function(content) {
		this.setContent(content)
		this.focus()
		this.select()
	},
	setContent: function(content) {
		if (toString.call(content).indexOf("Array") > 7) {
			content = content.join("\n")
		}
		this.ui.setContent(content)
	},
	select: function() {
		this.ui.select()
	},
	focus: function() {
		this.ui.focus()
	},
	show: function() {
		var urls = this.action.execute()
		this.ui.show()
		this.setContentReady(urls)
	},
	close: function() {
		this.ui.hide()
	}
}


/*
	main object
	to wire the action object and the UI object
*/
var main = {
	init: function() {
		this.imageSerachWeb = imageSearchWeb
		this.uiText = uiText.init()
		this.uiController = uiText_controller.init({
			"ui": uiText,
			"action": imageSearchWeb
		})
	},
	showUi: function() {
		this.uiController.show()
	},
	start: function() {
		this.showUi()
	}
}

function updateOptions() {
	if (!window.isw_options) { return }
	var key = window.isw_options.key
	if (key) {
		options.uiText_controller.key = key
	}
}

updateOptions()
main.init()
main.start()

})()