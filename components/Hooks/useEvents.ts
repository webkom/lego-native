import { useQuery } from "@tanstack/react-query";
import { Event } from "../../lib/types";

function useEvents() {
  const time = new Date();
  const formatetTime = time.toLocaleDateString().split(".").reverse();
  if (formatetTime[1].length < 2) formatetTime[1] = `0${formatetTime[1]}`;
  if (formatetTime[2].length < 2) formatetTime[2] = `0${formatetTime[2]}`;

  const result = useQuery<Event[]>(["events"], () =>
    fetch(
      `https://lego.abakus.no/api/v1/events/?date_after=${formatetTime.join(
        "-"
      )}`
    )
      .then((res) => res.json())
      .then((res) => res.results)
  );

  return result;
}

export default useEvents;
