import React from "react";
import Counter from "../components/Counter";
import { store } from "../modules";
import counter from "../modules/counter";

const counterContainer = () => {
  return (
    <Counter
      number
      onIncrease={store.dispatch(counter.actions.increase())}
      onDecrease={store.dispatch(counter.actions.decrease())}
    />
  );
};

export default React.memo(counterContainer);
