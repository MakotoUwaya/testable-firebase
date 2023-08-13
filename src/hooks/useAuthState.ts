import { getAuth } from "firebase/auth";
import { useAuthState as _useAuthState } from "react-firebase-hooks/auth";

export const useAuthState = () => _useAuthState(getAuth());
