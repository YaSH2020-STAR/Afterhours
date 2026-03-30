"use server";

/**
 * Meetup (InterestGroup) CRUD + join flows — re-exported for a single import path.
 * Implementations live in `./discovery` alongside venue discovery actions.
 */
export {
  cancelInterestGroup,
  createInterestGroup,
  deleteInterestGroup,
  joinInterestGroup,
  leaveInterestGroup,
  setGroupInterested,
  updateInterestGroup,
} from "./discovery";
