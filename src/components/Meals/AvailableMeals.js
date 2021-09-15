import { useState, useEffect, useCallback } from "react";

import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const convertJsonToArray = (json) => {
    const jsonArray = [];

    for (let key in json) {
      jsonArray.push({
        id: key,
        name: json[key].name,
        description: json[key].description,
        price: json[key].price,
      });
    }

    return jsonArray;
  };

  const fetchMeals = useCallback(async () => {
    try {
      const response = await fetch(
        "https://meals-e3d88-default-rtdb.firebaseio.com/meals.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      let json = await response.json();

      json = await convertJsonToArray(json);

      setMeals(json);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals();

    // fetchMeals().catch((error) => {
    //   setIsLoading(false)
    //   setError(error.message)
    // })
  }, [fetchMeals]);

  if (isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>...loading</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={classes.MealsError}>
        <p>{error}</p>
      </section>
    );
  }

  const mealsList =
    meals &&
    meals.map((meal) => (
      <MealItem
        key={meal.id}
        id={meal.id}
        name={meal.name}
        description={meal.description}
        price={meal.price}
      />
    ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
