var Api = require('../lib/api').Api;

require('./custom-matchers.js');

describe('url translation', function() {
	var schema = {
		"host": "api.example.com",
		"version": "1.0",
		"resources":
			{
				"Test": {
					"resource": "testresource",
					"actions":
					[
						"byDate",
						{ "apiCall": "test", "methodName": "expectedName" },
						{ "apiCall": "", "methodName": "get" }
					]
				}
			}
		}, api, testApi;

	beforeEach(function() {
		api = Api.build({
			schema: schema,
			format: 'json',
			logger: require('../lib/logger')
		}),
		testApi = new api.Test();
	});

	it('should return an empty string when no action is found', function() {
		var methodName = api.getActionMethodName('Test',
												'nonexistentactionslug');
		expect(methodName).toEqual('');
	});

	it('should default to getXxx when no methodName is specified in the ' +
		'schema', function() {
		var methodName = api.getActionMethodName('Test', 'byDate');
		expect(methodName).toEqual('getByDate');
	});

	it('should default to getXxx when no methodName is specified in the ' +
		'schema even with the wrong case', function() {
		var methodName = api.getActionMethodName('Test', 'BYDATE');
		expect(methodName).toEqual('getByDate');
	});

	it('should return specified methodName when in the schema', function() {
		var methodName = api.getActionMethodName('Test', 'test');
		expect(methodName).toEqual('expectedName');
	});

	it('should specified methodName when in the schema even with the wrong ' +
		'case', function() {
		var methodName = api.getActionMethodName('Test', 'TEST');
		expect(methodName).toEqual('expectedName');
	});

	it('should return specified methodName when action is empty string',
		function() {
		var methodName = api.getActionMethodName('Test',
												'');
		expect(methodName).toEqual('get');
	});
});
