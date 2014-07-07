
(function() {
window.isw_options = {
	"key": 16
};

function s() {
	var script = [
		{"name": "imageSearchWeb",
			"url": "https://github.com/ddelphi/google-image-origin-url-fetcher/raw/master/imageSearchWeb.js"}
	];

	var dataId = "imageSearchWeb_184906750432";
	var fragment = document.createDocumentFragment();
	for (var i = 0; i < script.length; i++) {
		if (document.querySelector("script[data-id=%s]".replace("%s", dataId))) {
			break;
		}
		var scriptNode = document.createElement("script");
		scriptNode.setAttribute("data-id", dataId);
		scriptNode.src = script[i].url;
		fragment.appendChild(scriptNode);
	}
	document.head.appendChild(fragment);
}

function main() {
	s();
}
main();

})()