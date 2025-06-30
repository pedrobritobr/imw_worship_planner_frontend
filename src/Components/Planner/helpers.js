import { formatMinutes } from '@/helpers';

const getMinutesBetweenActivities = (activityHourMajor, activityHourMinor) => {
  const [prevHour, prevMinute] = activityHourMajor.split(':').map(Number);
  const [actualHour, actualMinute] = activityHourMinor.split(':').map(Number);

  const lastActivityTotalMinutes = prevHour * 60 + prevMinute;
  const penultimateActivityTotalMinutes = actualHour * 60 + actualMinute;

  return lastActivityTotalMinutes - penultimateActivityTotalMinutes;
};

const calculateNewHour = (startHour = '00:00', duration = 0) => {
  const [hours, minutes] = startHour.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + Number(duration);
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;

  const nextHour = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  return nextHour;
};

const calculateDurationRemain = (updatedActivities, isPenultimateActivity) => {
  const lastActivityIndex = updatedActivities.findIndex((ac) => ac.id === 'lastActivity');
  if (lastActivityIndex <= 0) return 0;

  const penulActivity = updatedActivities[lastActivityIndex - 1];
  let minutesRemain = getMinutesBetweenActivities(
    updatedActivities[lastActivityIndex].hour,
    penulActivity.hour,
  );

  if (isPenultimateActivity) {
    minutesRemain -= Number(penulActivity.duration);
  }

  return formatMinutes(minutesRemain);
};

const updateHourFromActivity = (updatedActivity, originalArray, index) => {
  const updatedActivities = [...originalArray];
  updatedActivities[index] = updatedActivity;

  for (let i = index + 1; i < updatedActivities.length - 1; i += 1) {
    const prevActivity = updatedActivities[i - 1];
    const nextHour = calculateNewHour(prevActivity.hour, prevActivity.duration);

    updatedActivities[i] = {
      ...updatedActivities[i],
      hour: nextHour,
    };
  }

  const penultimateIndex = updatedActivities.length - 2;
  if (!(index === penultimateIndex)) {
    updatedActivities[penultimateIndex].duration = calculateDurationRemain(updatedActivities);
  }
  return updatedActivities;
};

export {
  updateHourFromActivity,
  getMinutesBetweenActivities,
  calculateDurationRemain,
  calculateNewHour,
};
