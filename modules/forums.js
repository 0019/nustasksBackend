var exports;

exports.post = function(req, res) {
	var entry = {'ParentID': req.query.parentid, 'Contents': req.query.contents, 'Addressing': req.query.addressing};
	req.db.collection('forums').save(entry, function(err, result) {
		if (err) console.log(err);
		// Addressing should be an array of '@' people.
		res.send();
	});
};

exports.updatePost = function(req, res) {
	var entry = {'ParentID': req.query.parentid, 'Contents': req.query.contents, 'Addressing': req.query.addressing};
	req.db.collection('forums').update({'_id': req.query.id}, entry)).toArray(function(err, result) {
		if (err) console.log(err);
		// Addressing should be an array of '@' people.
		res.send();
	});
};

module.exports = exports;
