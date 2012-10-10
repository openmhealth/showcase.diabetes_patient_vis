/**
 * <p>This class is the Open mHealth API interface for JavaScript.</p>
 * 
 * <p>This library is completely stateless. A URI endpoint and authentication
 * credentials must be sent with every function.</p>
 * 
 * <p>Note: This library requires jQuery.</p>
 * 
 * @author John Jenkins
 */

/**
 * Creates a new OmH object that points to the parameterized server.
 * 
 * @param uri The URI to the root of the Open mHealth APIs, e.g.
 *            "https://localhost:8080/app/omh/v1.0/".
 * 
 * @param requester The requester that is required 
 */
function OmH() {
	'use strict';

	(function (omh) {
		// The JavaScript types.
		var JS_TYPE_BOOLEAN = "[object Boolean]"
		  , JS_TYPE_NUMBER = "[object Number]"
		  , JS_TYPE_STRING = "[object String]"
		  , JS_TYPE_OBJECT = "[object Object]"
		  , JS_TYPE_ARRAY = "[object Array]"
		  , JS_TYPE_DATE = "[object Date]"
		  , JS_TYPE_NULL = "[object Null]"
		  , JS_TYPE_UNDEFINED = "[object Undefined]";
		
		/**
		 * Sanitizes the given root URI. This should be used internally when
		 * generating the specific URI endpoints.
		 * 
		 * @param rootUri The root URI for the server.
		 * 
		 * @returns The sanitize root URI.
		 */
		function sanitizeUri(rootUri) {
			// Validate the URI.
			var uriType = Object.prototype.toString.call(rootUri);
			if(uriType === JS_TYPE_UNDEFINED) {
				throw "The URI for the /omh/v1.0 endpoint must be given.";
			}
			else if(uriType !== JS_TYPE_STRING) {
				throw "The URI must be a string.";
			}
			
			// Build all of the URIs.
			var uri;
			if(rootUri[rootUri.length - 1] !== '/') {
				uri = rootUri + '/';
			}
			else {
				uri = rootUri;
			}
			
			return uri;
		}
		
		/**
		 * Creates the authentication URI from the root URI, which should end
		 * with "/omh/v1.0/".
		 * 
		 * @param rootUri The root URI for the server ending in "/omh/v1.0/".
		 * 
		 * @returns The authentication URI string from the root URI.
		 */
		function getAuthenticateUri(rootUri) {
			return sanitizeUri(rootUri) + "authenticate";
		}
		
		/**
		 * Creates the read URI from the root URI, which should end with 
		 * "/omh/v1.0/".
		 * 
		 * @param rootUri The root URI for the server ending in "/omh/v1.0/".
		 * 
		 * @returns The read URI string from the root URI.
		 */
		function getReadUri(rootUri) {
			return sanitizeUri(rootUri) + "read";
		}
		
		/**
		 * Authenticates a user with the given username and password. If
		 * successful, the credentials will be stored in the session's storage.
		 * 
		 * @param username The user's username.
		 * 
		 * @param password The user's password.
		 * 
		 * @param callback The function to be called once the authentication
		 * 				   call has completed. It should be an object with two
		 * 				   fields, "success" and "failure", which should be
		 * 				   functions. The "success" function will get one 
		 * 				   parameter, which is the JSON returned by the server;
		 * 				   the "failure" function will get one parameter, which
		 * 				   is a jQuery jqXHR object representing the response.
		 */
		function authenticate(uri, username, password, requester, callback) {
			// Validate the username.
			var usernameType = Object.prototype.toString.call(username);
			if(	(usernameType === JS_TYPE_UNDEFINED) ||
				(usernameType === JS_TYPE_NULL)) {
				
				throw "A username must be given.";
			}
			
			// Validate the password.
			var passwordType = Object.prototype.toString.call(password);
			if(	(passwordType === JS_TYPE_UNDEFINED) ||
				(passwordType === JS_TYPE_NULL)) {
				
				throw "A password must be given.";
			}
			
			// Create the parameters.
			var parameters = {};
			parameters.user = username;
			parameters.password = password;
			parameters.requester = requester;

			// Make the request.
			$.post(
				uri,
				parameters,
				function(data) {
					// If the user supplied a "success" function, call it.
					if(callback && callback.success) {
						callback.success(data);
					}
				},
				"json")
			.error(function(data) {
				// If the user supplied a "failure" function, call it.
				if(callback && callback.failure) {
					callback.failure(data);
				}
			});
		}
		
		/**
		 * Calls the read API and sends the data exactly as it is returned from
		 * the request as the only parameter to the callback's success 
		 * function. If the callback is null or it doesn't have a field named
		 * "success" that is a function, then this call will be relatively 
		 * useless. It will still make the call, but the results will be lost.
		 * 
		 * @param payloadId Required. A string value representing the payload
		 * 					ID that dictates what data should be returned.
		 * 
		 * @param payloadVersion Required. A number representing the version of
		 * 						 the payload to read.
		 * 
		 * @param callback Optional but suggested. This object should have at
		 * 				   least one field, "success", that is a function that
		 * 				   takes one parameter. This function will be called
		 * 				   when the data is returned. Optionally, there can 
		 * 				   also be a no-argument function called "failure" that
		 * 				   will be called if the request fails. Optionally,
		 * 				   there can be a no-argument function called 
		 * 				   "authFailure" that will be called if there is no
		 * 				   acceptable authentication token.
		 * 
		 * @param owner Optional. A string value username of the user about 
		 * 				whom the data should apply.
		 * 
		 * @param tStart Optional. A JavaScript Date object or a string 
		 * 				 representing the earliest time at which data should be
		 * 				 retrieved for a user.
		 * 
		 * @param tEnd Optional. A JavaScript Date object or a string 
		 * 			   representing the latest time at which data should be 
		 * 			   retrieved for a user.
		 * 
		 * @param columnList Optional. A string of comma-separated column 
		 * 					 names.
		 * 
		 * @param numToSkip Optional. A number representing the number of  
		 * 					results to skip.
		 * 
		 * @param numToReturn Optional. A number representing the number of
		 * 					  results to return after skipping.
		 */ 
		function read(
			uri,
			authToken,
			requester,
			payloadId,
			payloadVersion,
			callback,
			owner, 
			tStart, 
			tEnd, 
			columnList, 
			summarize, 
			numToSkip, 
			numToReturn) {
			
			// Create the object that will store all of the parameters.
			var parameters = {};

			// Add the authentication token.
			var authTokenType = Object.prototype.toString.call(authToken);
			if(authTokenType === JS_TYPE_UNDEFINED) {
				throw "An authentication token must be given.";
			}
			else if(authTokenType === JS_TYPE_NULL) {
				throw "The authentication token cannot be null.";
			}
			else {
				parameters.auth_token = authToken;
			}
			
			// Add the requester value.
			var requesterType = Object.prototype.toString.call(requester);
			if(requesterType === JS_TYPE_UNDEFINED) {
				throw "A requester value must be given.";
			}
			else if(requesterType === JS_TYPE_NULL) {
				throw "The requester value cannot be null.";
			}
			else {
				parameters.requester = requester;
			}
			
			// Add the payload ID.
			var payloadIdType = Object.prototype.toString.call(payloadId);
			if(payloadIdType === JS_TYPE_UNDEFINED) {
				throw "A payload ID must be given.";
			}
			else if(payloadIdType === JS_TYPE_NULL) {
				throw "The payload ID cannot be null.";
			}
			else {
				parameters.payload_id = payloadId;
			}
			
			// Add the payload version.
			var payloadVersionType = 
				Object.prototype.toString.call(payloadVersion);
			if(payloadVersionType === JS_TYPE_UNDEFINED) {
				throw "A payload version must be given.";
			}
			else if(payloadVersionType === JS_TYPE_NULL) {
				throw "The payload version cannot be null.";
			}
			else {
				parameters.payload_version = payloadVersion;
			}
			
			// If the owner parameter is given, add it to the request.
			if(owner !== null) {
				parameters.owner = owner;
			}

			// If the start date parameter is given, add it to the request.
			if(tStart !== null) {
				parameters.t_start = tStart;
			}

			// If the end date parameter is given, add it to the request.
			if(tEnd !== null) {
				parameters.t_end = tEnd;
			}

			// If the column list parameter is given, add it to the request.
			if(columnList !== null) {
				parameters.column_list = columnList;
			}

			// If the summarize parameter is given, add it to the request.
			if(summarize !== null) {
				parameters.summarize = summarize;
			}

			// If the number of responses to skip parameter is given, add it to
			// the request.
			if(numToSkip !== null) {
				parameters.num_to_skip = numToSkip;
			}

			// If the number of responses to return parameter is given, add it
			// to the request.
			if(numToReturn !== null) {
				parameters.num_to_return = numToReturn;
			}
			
			// Make the request.
			$.post(
				uri,
				parameters,
				function(data) {
					// Call the callback's success function with the data.
					if(callback && callback.success) {
						callback.success(data);
					}
				},
				"json")
			.error(function(response) {
				// If the user supplied a "failure" function, call it.
				if(callback && callback.failure) {
					callback.failure(response);
				}
			});
		}
		
		// Assign the functions to the object.
		omh.getAuthenticateUri = getAuthenticateUri;
		omh.getReadUri = getReadUri;
		omh.authenticate = authenticate;
		omh.read = read;
		
	}(this));
}