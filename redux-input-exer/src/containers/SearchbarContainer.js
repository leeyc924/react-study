import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Searchbar from "../components/Searchbar";
import { changeInput } from "../modules/searchbar";

const SearchbarContainer = () => {
  const { value } = useSelector((state) => state);
  const dispatch = useDispatch();
  const handleChange = (value) => {
    dispatch(changeInput(value));
  };
  return <Searchbar value={value} handleChange={handleChange} />;
};

export default SearchbarContainer;
