(function preAngularFor365Token(){
	
		function handleTokenResponse(hash) {
			// clear tokens
			sessionStorage.removeItem('accessToken');
			sessionStorage.removeItem('idToken');
		
			var tokenresponse = parseHashParams(hash);
		
			// Check that state is what we sent in sign in request
			if (tokenresponse.state != sessionStorage.authState) {
				sessionStorage.removeItem('authState');
				sessionStorage.removeItem('authNonce');
				// Report error
				window.location.hash = '#error=Invalid+state&error_description=The+state+in+the+authorization+response+did+not+match+the+expected+value.+Please+try+signing+in+again.';
				return;
			}
		
			sessionStorage.authState = '';
			sessionStorage.accessToken = tokenresponse.access_token;
		
			// Get the number of seconds the token is valid for,
			// Subract 5 minutes (300 sec) to account for differences in clock settings
			// Convert to milliseconds
			var expiresin = (parseInt(tokenresponse.expires_in) - 300) * 1000;
			var now = new Date();
			var expireDate = new Date(now.getTime() + expiresin);
			sessionStorage.tokenExpires = expireDate.getTime();
		
			sessionStorage.idToken = tokenresponse.id_token;
		
			// Redirect to home page
			window.location.hash = '#';   
		}//end handleTokenResponse
		
		function parseHashParams(hash) {
			/*
				the params returning here are
				access_token=eyJ0eXA.....
				token_type=Bearer
				expires_in=3599
				scope=Mail.Read+User.Read
				id_token=eyJ0eXAiOiJK.....
				state=2032ebd2-3b7d-daf7-8967-1f02517cb2c2
				session_state=5b45edb0-7b1e-48d2-b509-cea369456e8c
			*/
			var params = hash.slice(1).split('&');
		
			var paramarray = {};
			params.forEach(function(param) {
			param = param.split('=');
			paramarray[param[0]] = param[1];
			});
		
			return paramarray;
		}
	
		console.log('preAngularFor365Token function, has hash:' + (window.location.hash.length > 0));
	
		if (window.location.hash.startsWith('#access_token')){
			console.log('hash is #access_token')
			handleTokenResponse(window.location.hash);
		}
	})();
	
	