// הגדרה על ה-window כדי שקבצים אחרים יראו את זה
window.HEBREW_MONTHS_MAP = {
    "ינואר": 1, "פברואר": 2, "מרץ": 3, "אפריל": 4, "מאי": 5, "יוני": 6,
    "יולי": 7, "אוגוסט": 8, "ספטמבר": 9, "אוקטובר": 10, "נובמבר": 11, "דצמבר": 12
};

window.getAbsoluteDays = function(d, m, y) {
    let year = y, month = m;
    if (month <= 2) { year--; month += 12; }
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + d - 1524.5;
};

window.isLeapYear = function(tetraYear) {
    const gY = tetraYear - 10000;
    return (gY % 4 === 0 && gY % 100 !== 0) || (gY % 400 === 0);
};

window.calculateTetraDisplay = function(d, m, y, originalMatch) {
    const epoch = { gD: 1, gM: 1, gY: 0, tY: 10000 };
    const targetAbs = window.getAbsoluteDays(d, m, y);
    const syncAbs = window.getAbsoluteDays(epoch.gD, epoch.gM, epoch.gY);
    let diff = targetAbs - syncAbs;
    
    const TETRA_DAYS = ["שני", "שלישי", "רביעי", "חמישי", "שישי", "שביעי", "ראשון"];
    const dayOfWeekIndex = Math.abs(Math.floor(targetAbs + 0.5)) % 7; 
    const tetraDayName = TETRA_DAYS[dayOfWeekIndex];

    let ty = epoch.tY;
    if (diff >= 0) {
        while (true) {
            let days = window.isLeapYear(ty) ? 366 : 365;
            if (diff >= days) { diff -= days; ty++; } else break;
        }
    } else {
        while (diff < 0) { ty--; diff += (window.isLeapYear(ty) ? 366 : 365); }
    }

    let tetraDatePart = "";
    if (diff < 360) {
        const months = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שביעי", "שמיני", "תשיעי", "עשירי", "אחד-עשר", "שנים-עשר"];
        tetraDatePart = `${(diff % 30) + 1} ב${months[Math.floor(diff / 30)]}, ${ty}`;
    } else {
        const extras = ["אלפא", "בטא", "גמא", "דלתא", "אפסילון", "טלאד"];
        tetraDatePart = `יום ${extras[diff - 360] || 'אחרית'}, ${ty}`;
    }

    return `יום ${tetraDayName}, ${tetraDatePart} (${originalMatch})`;
};
