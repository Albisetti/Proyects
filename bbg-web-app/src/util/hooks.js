import {
    useContext,
    useEffect,
    useState
} from 'react';
import { AuthContext } from '../contexts/auth';

/*
 * The `useMandatoryImpersonation` hook will allow you to force the app into an
 * impersonation flow from within any other component.
 */
export const useMandatoryImpersonation = ({ 
    allowedUserTypes = [], /* What user types may access this route? */
}) => {
    const {
		impersonator,
        type,
        setForcingImpersonation,
    } = useContext(AuthContext);

    useEffect(() => {
        if(!allowedUserTypes.includes(type)) {
            setForcingImpersonation(allowedUserTypes);
        }

        return () => {
            setForcingImpersonation([]);
        };

        // eslint-disable-next-line
    }, []);

    return {
        allowed: allowedUserTypes.includes(type),
		impersonator
    };
};

export const useDebounce = function (value, delay, type='') {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {

    if(type === "text") {
        if(value?.length > 2) {
          setDebouncedValue(value);
        }
      }

      else{
      const handler = setTimeout(() => {
          setDebouncedValue(value);
      }, delay);

      return () => {
          clearTimeout(handler);
      };
    }
       // eslint-disable-next-line
  }, [value]);

  return debouncedValue;
}


export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    callback();
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
