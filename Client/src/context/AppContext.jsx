import { createContext, useContext, useState } from "react";

const Context = createContext();

export const AppProvider = (props) => {
  const [user, setUser] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [plans, setPlans] = useState([]);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        investors,
        setInvestors,
        plans,
        setPlans,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export const useApp = () => useContext(Context);
