import { Diograph } from "@diograph/diograph";
import {
  IDiographObject,
  IDioryDateGeoSearchProps,
} from "@diograph/diograph/types";

const emptyFilter: IDioryDateGeoSearchProps = {
  dateStart: undefined,
  dateEnd: undefined,
  latlngStart: undefined,
  latlngEnd: undefined,
};

const defaultFilter: IDioryDateGeoSearchProps = {
  ...emptyFilter,
  dateStart: "2021-06-20",
  dateEnd: "2021-06-30",
};

export const filterAndSortDiograph = (
  diograph: Diograph,
  filter: IDioryDateGeoSearchProps = defaultFilter
) => {
  const filteredDiograph = diograph.queryDiographByDateAndGeo({
    latlngStart: filter.latlngStart,
    latlngEnd: filter.latlngEnd,
    dateStart: filter.dateStart,
    dateEnd: filter.dateEnd,
  });

  const filteredAndSortedByDateDiograph = Object.values(filteredDiograph).sort(
    (dioryA, dioryB) => {
      if (dioryA.date && dioryB.date) {
        const dioryADate = new Date(dioryA.date);
        const dioryBDate = new Date(dioryB.date);
        return dioryADate > dioryBDate ? 1 : -1;
      }
      return 0;
    }
  );

  return filteredAndSortedByDateDiograph;
};
