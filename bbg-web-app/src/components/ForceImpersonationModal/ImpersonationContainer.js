import React, { useContext } from 'react';

import ForceImpersonationModal from '.';
import { AuthContext } from '../../contexts/auth';

function ImpersonationContainer() {
	const { 
		forcingImpersonation
	} = useContext(AuthContext);

	if(!forcingImpersonation || !forcingImpersonation.length) {
		return null;
	}

	return (
		<>
			<ForceImpersonationModal 
				permittedUserTypes={forcingImpersonation}
			/>
		</>
	);
}

export default ImpersonationContainer;