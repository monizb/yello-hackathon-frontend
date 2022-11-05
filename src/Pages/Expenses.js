import Expense from "../Components/Expense";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Profile from "../Components/Profile";

const Expenses = () => {
  const [expenses, setExpenses] = React.useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/me")
      .then((res) => {
        setMe(res.data);
      })
      .catch((err) => {
        setError(true);
      });

    axios
      .get("http://localhost:3000/api/expenses")
      .then((res) => {
        setExpenses(res.data.expenses);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="expenses">
      <Profile me={me} />
      {error ? (
        <h1>Something went wrong</h1>
      ) : (
        <div>
          {!loading && expenses &&
            expenses.map((expense) => (
              <Expense
                expense={expense}
                id={expense.id}
                title={expense.description}
                date={expense.created_at}
                image={expense.created_by.picture.medium}
                me={me}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;
