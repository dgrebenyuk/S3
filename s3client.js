Handlebars.registerHelper('S3', function (options) {
	var uploadOptions = options.hash;
	var template = options.fn;
	var callback = uploadOptions.callback;

    if (!template) return;

	var html;
	html = Spark.isolate(function(){
		return template();
	});

	html = Spark.attachEvents({
		'change input[type=file]': function (e) {
			var files = e.currentTarget.files;
			_.each(files,function(file){
				var reader = new FileReader;
				var fileData = {
					name:file.name,
					size:file.size,
					type:file.type
				};

				reader.onload = function () {
					fileData.data = new Uint8Array(reader.result);
					Meteor.call("S3upload",fileData,callback);
				};

				reader.readAsArrayBuffer(file);

			});
		}
	},html);

	return html;
});
