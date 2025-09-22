/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQuery } from "@tanstack/react-query";
import { AddTimeOff, GetAllTimeOff } from "./services";

export const useData = () => {
  return {
    get: {
      all: {
        timeRequest: () =>
          useQuery({
            queryKey: ["all-time-off-request"],
            queryFn: () => GetAllTimeOff(),
          }),
      },
    },
    set: {
      timeOff: {
        add: useMutation({
          mutationKey: ["add-timeoff"],
          mutationFn: AddTimeOff,
        }),
      },
    },
  };
};
