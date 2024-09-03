export function formatTime(time: string) {
	const date = new Date(time);
	const cur = new Date();
	const isToday =
		date.getDay() === cur.getDay() &&
		date.getMonth() === cur.getMonth() &&
		date.getFullYear() === cur.getFullYear();
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return isToday
		? `${hours}:${minutes}`
		: date.toLocaleString(undefined, {
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
		  });
}
