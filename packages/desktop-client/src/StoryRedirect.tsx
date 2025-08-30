import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "./store/store";
import { fetchDioryInfo } from "./store/diorySlice";
import { useEffect } from "react";

const StoryRedirect = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get("storyId");

  const { focus } = useSelector((state: RootState) => state.diory);

  useEffect(() => {
    if (storyId) {
      dispatch(fetchDioryInfo({ focusId: storyId, storyId: null }));
    }
  }, []);

  useEffect(() => {
    if (focus.focusId === storyId) {
      navigate(`/my-diory/${focus.storyDiories[0].id}/grid?storyId=${storyId}`);
    }
  }, [focus]);
};

export default StoryRedirect;
