import { useReducer } from "react";
import { authenticate, User } from "./api/authenticate";
import "./App.css";
import { Header } from "./Header";
import { Main } from "./Main";
import { authorize } from "./api/authorize";

type State = {
  user: undefined | User;
  permissions: undefined | string[];
  loading: boolean;
};

const initialState: State = {
  user: undefined,
  permissions: undefined,
  loading: false,
};

type Action =
  | {
      type: "authenticate";
    }
  | { type: "authenticated"; user: User | undefined }
  | { type: "authorize" }
  | { type: "authorized"; permissions: string[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "authenticate":
      return { ...state, loading: true };
    case "authenticated":
      return { ...state, loading: false, user: action.user };
    case "authorize":
      return { ...state, loading: true };
    case "authorized":
      return { ...state, loading: false, permissions: action.permissions };
    default:
      return state;
  }
}

function App() {
  const [{ user, permissions, loading }, dispath] = useReducer(reducer, initialState);

  async function handleSignInClick() {
    dispath({ type: "authenticate" });

    const authUser = await authenticate();

    dispath({
      type: "authenticated",
      user: authUser,
    });

    if (authUser != undefined) {
      dispath({ type: "authorize" });
    }

    const authorizedPermissions = await authorize(authUser?.id);

    dispath({ type: "authorized", permissions: authorizedPermissions });
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Header user={user} onSignInClick={handleSignInClick} loading={loading} />
      <Main user={user} permissons={permissions} />
    </div>
  );
}

export default App;
