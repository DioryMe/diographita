import React, { useEffect } from "react";
import { fetchDioryInfo } from "./store/diorySlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import { useNavigate } from "react-router-dom";
import MyDioryHome from "./MyDioryHome";

const MyDiory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchDioryInfo({ focusId: "/" }));
  }, [dispatch]);

  return <MyDioryHome />;
};

export default MyDiory;
