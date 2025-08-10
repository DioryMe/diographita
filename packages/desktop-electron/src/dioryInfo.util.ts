import { Diograph } from "@diograph/diograph";
const diographMaryJson = require("../../desktop-client/mary-json.json");
import { IDataObject, IDiory, IDioryObject } from "@diograph/diograph/types";

export interface DioryInfo {
  focusId: string;
  storyId: string | null;
  story: IDioryObject | null;
  stories: IDioryObject[];
  prev: string | null;
  next: string | null;
  focus: {
    text: string | null;
    image: string | null;
    latlng: string | null;
    date: string | null;
    links: string[];
    linkedDiories: IDioryObject[];
    data: IDataObject | null;
  };
  focusDiory: IDioryObject | null;
}

export const getDioryInfo = (
  focusId: string = "/",
  storyId?: string | null
): DioryInfo => {
  const diograph = new Diograph(diographMaryJson);
  const focusDiory = diograph.getDiory({ id: focusId });
  const { text, image, latlng, date, data } = focusDiory;

  const stories = Object.values(diograph.toObject()).filter((dioryData) =>
    dioryData.links?.some((link) => link.id === focusId)
  );

  const storyDioryId = storyId || (stories[0] && stories[0].id) || null;

  let prev = null;
  let next = null;
  if (storyDioryId) {
    const storyDiory = diograph.getDiory({ id: storyDioryId });

    const focusDioryIndexInStory =
      storyDiory.links?.findIndex((link) => link.id === focusId) ?? -1;

    const prevTargetIndex = focusDioryIndexInStory - 1;
    const nextTargetIndex = focusDioryIndexInStory + 1;

    const prevDisabled =
      !storyDiory.links ||
      prevTargetIndex < 0 ||
      prevTargetIndex >= storyDiory.links.length;

    const nextDisabled =
      !storyDiory.links ||
      nextTargetIndex < 0 ||
      nextTargetIndex >= storyDiory.links.length;

    prev = prevDisabled ? null : storyDiory.links![prevTargetIndex].id;
    next = nextDisabled ? null : storyDiory.links![nextTargetIndex].id;
  }

  return {
    focusId: focusDiory.id,
    storyId: storyDioryId,
    story: storyDioryId
      ? diograph.getDiory({ id: storyDioryId }).toObject()
      : null,
    stories: stories,
    prev,
    next,
    focus: {
      data: (data && data[0]) || null,
      text: text || null,
      image: image || null,
      latlng: latlng || null,
      date: date || null,
      links: focusDiory.links?.map((link) => link.id) || [],
      linkedDiories:
        focusDiory.links?.map((link) =>
          diograph.getDiory({ id: link.id }).toObject()
        ) || [],
    },
    focusDiory: focusDiory.toObject(),
  };
};
