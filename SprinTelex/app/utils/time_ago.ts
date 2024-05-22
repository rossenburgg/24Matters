export function timeAgo(date: string):string {
    const now = new Date();
    const diffINMs = now.getTime() - new Date(date).getTime();
    const diffInSecs = diffINMs/1000;
    const diffInMins = diffInSecs/60;
    const diffInHours = diffInMins/60;
    const diffInDays = diffInHours/24;
    if (diffInSecs < 60) {
        return Math.floor(diffInSecs) + ' s';
    } else if (diffInMins < 60) {
        return Math.floor(diffInMins) + ' min';
    }else if (diffInHours < 24) {
            return Math.floor(diffInHours) + ' h';
    }else if (diffInDays === 1) {
                return "Yesterday";
    }else {
        return Math.floor(diffInDays) + " days";
    }
}